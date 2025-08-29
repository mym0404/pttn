import { existsSync } from 'fs';
import { readdir, readFile, stat } from 'fs/promises';
import { homedir } from 'os';
import { join } from 'path';

interface SessionMessage {
  timestamp: string;
  role: 'user' | 'assistant';
  content: string;
  type?: string;
}

interface MessageBlock {
  type: 'text' | 'tool_use' | 'tool_result';
  text?: string;
  name?: string;
  parameters?: Record<string, unknown>;
  content?: string;
}

interface ParsedMessage {
  role: string;
  content: string | MessageBlock[];
  type?: string;
}

interface SessionData {
  timestamp?: string;
  message?: ParsedMessage;
}

export class SessionExtractor {
  private readonly claudeProjectsDir: string;

  constructor() {
    this.claudeProjectsDir = join(homedir(), '.claude', 'projects');
  }

  /**
   * Extract the current Claude Code session
   * @param projectPath Current project path (optional, uses cwd if not provided)
   * @returns Formatted markdown content of the session
   */
  async extractCurrentSession(projectPath?: string): Promise<string> {
    const currentProject = projectPath || process.cwd();

    // Try multiple directory naming patterns that Claude might use
    const candidates = this.generateDirectoryCandidates(currentProject);

    let sessionDir: string | null = null;
    let foundCandidate: string | null = null;

    // Try each candidate until we find an existing directory
    for (const candidate of candidates) {
      const candidateDir = join(this.claudeProjectsDir, candidate);
      if (existsSync(candidateDir)) {
        sessionDir = candidateDir;
        foundCandidate = candidate;
        break;
      }
    }

    if (!sessionDir) {
      throw new Error(
        `No Claude session found for project: ${currentProject}\n` +
          `Tried the following directory patterns:\n` +
          candidates
            .map((c) => `  - ${join(this.claudeProjectsDir, c)}`)
            .join('\n')
      );
    }

    console.log(`Found session directory: ${foundCandidate}`);

    // Find the most recent .jsonl session file
    const sessionFile = await this.findLatestSessionFile(sessionDir);

    if (!sessionFile) {
      throw new Error(`No session files found in: ${sessionDir}`);
    }

    // Parse and format the session
    const messages = await this.parseSessionFile(join(sessionDir, sessionFile));
    return this.formatSessionAsMarkdown(messages, currentProject);
  }

  /**
   * Generate multiple possible directory name patterns
   * Claude might use different naming conventions across versions
   */
  private generateDirectoryCandidates(projectPath: string): string[] {
    const candidates: string[] = [];

    // Remove drive letters for Windows compatibility
    const pathWithoutDrive = projectPath.replace(/^[A-Z]:/i, '');

    // Pattern 1: Leading dash + preserve case (current Claude behavior)
    candidates.push(
      '-' + pathWithoutDrive.replace(/^\//, '').replace(/[/\\]/g, '-')
    );

    // Pattern 2: No leading dash + preserve case
    candidates.push(pathWithoutDrive.replace(/^\//, '').replace(/[/\\]/g, '-'));

    // Pattern 3: Leading dash + lowercase
    candidates.push(
      '-' +
        pathWithoutDrive.replace(/^\//, '').replace(/[/\\]/g, '-').toLowerCase()
    );

    // Pattern 4: No leading dash + lowercase (old behavior)
    candidates.push(
      pathWithoutDrive.replace(/^\//, '').replace(/[/\\]/g, '-').toLowerCase()
    );

    // Pattern 5: URL encoded style (replace special chars)
    candidates.push(
      pathWithoutDrive
        .replace(/^\//, '')
        .replace(/[/\\:]/g, '-')
        .replace(/\s/g, '_')
    );

    // Pattern 6: Double dash for root (some versions might do this)
    if (projectPath.startsWith('/')) {
      candidates.push(
        '--' + pathWithoutDrive.replace(/^\//, '').replace(/[/\\]/g, '-')
      );
    }

    // Remove duplicates
    return [...new Set(candidates)];
  }

  /**
   * Find the most recent .jsonl file in the session directory
   */
  private async findLatestSessionFile(dir: string): Promise<string | null> {
    const files = await readdir(dir);
    const jsonlFiles = files.filter((f) => f.endsWith('.jsonl'));

    if (jsonlFiles.length === 0) {
      return null;
    }

    // Sort by modification time to get the most recent
    const filesWithStats = await Promise.all(
      jsonlFiles.map(async (file) => {
        const filePath = join(dir, file);
        const stats = await stat(filePath);
        return { file, mtime: stats.mtime };
      })
    );

    filesWithStats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
    return filesWithStats[0].file;
  }

  /**
   * Check if content looks like auto-generated command documentation
   * Uses rough heuristics to detect documentation patterns
   */
  private looksLikeCommandDocumentation(content: string): boolean {
    // Count markdown headers
    const headerCount = (content.match(/^#{1,3}\s/gm) || []).length;

    // Check for documentation-like patterns
    const hasDocPatterns =
      content.includes('## Usage') ||
      content.includes('## Description') ||
      content.includes('## Example') ||
      content.includes('### CLI Command') ||
      content.includes('This command');

    // If it has many headers and code blocks, it's likely documentation
    const isLongDoc = content.length > 2000 && headerCount > 5;

    return (hasDocPatterns && headerCount > 3) || isLongDoc;
  }

  /**
   * Filter out overly long command documentation
   * Keeps the conversation focused on actual interactions
   */
  private filterMessages(messages: SessionMessage[]): SessionMessage[] {
    const filtered: SessionMessage[] = [];

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      const content = message.content;

      // Skip command execution messages entirely
      if (content.includes('<command-') && content.includes('</command-')) {
        // Check if next message is command documentation and skip it too
        if (
          i + 1 < messages.length &&
          messages[i + 1].role === 'user' &&
          this.looksLikeCommandDocumentation(messages[i + 1].content)
        ) {
          i++; // Skip documentation message
        }
        continue; // Skip command execution message
      }

      // Skip local command output messages
      if (
        content.includes('<local-command-stdout>') ||
        content.includes('</local-command-stdout>') ||
        content.includes(
          'Caveat: The messages below were generated by the user'
        )
      ) {
        continue;
      }

      // Skip standalone command documentation
      if (
        message.role === 'user' &&
        this.looksLikeCommandDocumentation(content) &&
        i > 0
      ) {
        continue;
      }

      // Keep regular messages
      filtered.push(message);
    }

    return filtered;
  }

  /**
   * Parse a .jsonl session file
   */
  private async parseSessionFile(filePath: string): Promise<SessionMessage[]> {
    const content = await readFile(filePath, 'utf-8');
    const lines = content.split('\n').filter((line) => line.trim());

    const messages: SessionMessage[] = [];

    for (const line of lines) {
      try {
        const data = JSON.parse(line) as SessionData;

        // Extract message information based on Claude's session format
        if (data.message) {
          const message: SessionMessage = {
            timestamp: data.timestamp || new Date().toISOString(),
            role: data.message.role || 'user',
            content: this.extractMessageContent(data.message),
            type: data.message.type,
          };
          messages.push(message);
        }
      } catch (error) {
        // Skip malformed lines
        console.warn('Failed to parse line:', error);
      }
    }

    // Apply flexible filtering
    return this.filterMessages(messages);
  }

  /**
   * Extract content from a message object
   */
  private extractMessageContent(message: ParsedMessage): string {
    if (typeof message.content === 'string') {
      return message.content;
    }

    if (Array.isArray(message.content)) {
      return message.content
        .map((block: MessageBlock | string) => {
          if (typeof block === 'string') {
            return block;
          }
          if (block.type === 'text') {
            return block.text || '';
          }
          if (block.type === 'tool_use') {
            return `[Tool: ${block.name || 'unknown'}]\n${JSON.stringify(block.parameters || {}, null, 2)}`;
          }
          if (block.type === 'tool_result') {
            return `[Tool Result]\n${block.content || ''}`;
          }
          return JSON.stringify(block);
        })
        .join('\n');
    }

    return JSON.stringify(message.content);
  }

  /**
   * Format session messages as markdown
   */
  private formatSessionAsMarkdown(
    messages: SessionMessage[],
    projectPath: string
  ): string {
    const now = new Date();
    const header = `# Claude Code Session - ${projectPath}

**Extracted**: ${now.toISOString()}
**Total Messages**: ${messages.length}
**Session Start**: ${messages[0]?.timestamp || 'Unknown'}
**Session End**: ${messages[messages.length - 1]?.timestamp || 'Unknown'}

---

## Conversation History

`;

    const conversationBody = messages
      .map((msg, index) => {
        const roleLabel = msg.role === 'user' ? '👤 User' : '🤖 Assistant';

        return `### Message ${index + 1} - ${roleLabel}

${msg.content}

---
`;
      })
      .join('\n');

    const footer = `
## Session Summary

- **Total Messages**: ${messages.length}
- **User Messages**: ${messages.filter((m) => m.role === 'user').length}
- **Assistant Messages**: ${messages.filter((m) => m.role === 'assistant').length}
- **Duration**: ${this.calculateDuration(messages)}
`;

    return header + conversationBody + footer;
  }

  /**
   * Calculate session duration
   */
  private calculateDuration(messages: SessionMessage[]): string {
    if (messages.length < 2) return 'N/A';

    const start = new Date(messages[0].timestamp);
    const end = new Date(messages[messages.length - 1].timestamp);
    const durationMs = end.getTime() - start.getTime();

    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }
}

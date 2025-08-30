import { existsSync } from 'fs';
import { readdir, readFile, stat } from 'fs/promises';
import { homedir } from 'os';
import { join } from 'path';

interface SessionMessage {
  timestamp: string;
  role: 'user' | 'assistant';
  content: string;
  type?: string;
  stripLevel: number; // 0=keep all, 1=minor cleanup, 2=major cleanup, 3=strip code
  originalContent?: string; // Keep original for reference
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

// Strip level definitions and rules
interface StripRule {
  level: number;
  name: string;
  description: string;
  condition: (content: string, role: string) => boolean;
  transform: (content: string) => string;
}

const STRIP_RULES: StripRule[] = [
  {
    level: 1,
    name: 'command_execution',
    description: 'Simplify command execution messages',
    condition: (content) =>
      content.includes('<command-') && content.includes('</command-'),
    transform: (content) => {
      const commandMatch = content.match(/<command-name>(.+?)<\/command-name>/);
      const commandName = commandMatch ? commandMatch[1] : 'command';
      return `[Command: ${commandName}]`;
    },
  },
  {
    level: 1,
    name: 'system_reminders',
    description: 'Simplify system reminder messages',
    condition: (content) => content.includes('<system-reminder>'),
    transform: () => '[System Reminder]',
  },
  {
    level: 1,
    name: 'local_command_output',
    description: 'Simplify local command output',
    condition: (content) => content.includes('<local-command-stdout>'),
    transform: () => '[Local Command Output]',
  },
  {
    level: 1,
    name: 'tool_noise',
    description: 'Remove tool execution noise',
    condition: (content) =>
      (content.includes('node:') && content.includes('command not found')) ||
      (content.includes('pnpm:') && content.includes('command not found')),
    transform: (content) =>
      content
        .replace(/\n?(node|pnpm):\d+:.*?command not found.*?\n?/g, '')
        .trim(),
  },
  {
    level: 2,
    name: 'command_documentation',
    description: 'Simplify command documentation',
    condition: (content, role) =>
      role === 'user' &&
      SessionExtractor.looksLikeCommandDocumentation(content),
    transform: (content) => {
      const titleMatch = content.match(/^#\s+(.+?)$/m);
      const title = titleMatch ? titleMatch[1] : 'Command Documentation';
      return `[Doc: ${title}]`;
    },
  },
  {
    level: 2,
    name: 'file_modifications_long',
    description: 'Simplify long file modification results',
    condition: (content) =>
      content.includes('Applied') &&
      content.includes('edit') &&
      content.length > 800,
    transform: (content) => {
      const fileMatch = content.match(/Applied \d+ edits? to (.+?):/);
      const fileName = fileMatch ? fileMatch[1].split('/').pop() : 'file';
      return `[File Modified: ${fileName}]`;
    },
  },
  {
    level: 2, // Changed from 3 to 2 for shorter code blocks
    name: 'code_blocks_short',
    description: 'Remove code blocks from short messages (< 1000 chars)',
    condition: (content) => content.includes('```') && content.length < 1000,
    transform: (content) =>
      content.replace(/```[\s\S]*?```/g, '[Code Block Removed]'),
  },
  {
    level: 1, // Very aggressive for long code blocks
    name: 'code_blocks_long',
    description: 'Remove code blocks from long messages (>= 1000 chars)',
    condition: (content) => content.includes('```') && content.length >= 1000,
    transform: (content) =>
      content.replace(/```[\s\S]*?```/g, '[Code Block Removed]'),
  },
  {
    level: 3,
    name: 'long_messages',
    description: 'Truncate very long messages',
    condition: (content) => content.length > 2000,
    transform: (content) => {
      const preview = content.substring(0, 300);
      const hasCodeBlocks = content.includes('```');
      const suffix = hasCodeBlocks
        ? ' [Contains code blocks...]'
        : ' [Message truncated...]';
      return preview + suffix;
    },
  },
];

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

    // Try each candidate until we find an existing directory
    for (const candidate of candidates) {
      const candidateDir = join(this.claudeProjectsDir, candidate);
      if (existsSync(candidateDir)) {
        sessionDir = candidateDir;
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
  static looksLikeCommandDocumentation(content: string): boolean {
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
   * Detect semantic duplicates in messages
   */
  private detectSemanticDuplicates(messages: SessionMessage[]): Set<number> {
    const duplicateIndices = new Set<number>();
    const seenContent = new Map<string, number>();

    for (let i = 0; i < messages.length; i++) {
      const content = messages[i].content;

      // Check for exact duplicates
      if (seenContent.has(content)) {
        duplicateIndices.add(i);
        continue;
      }

      // Check for command documentation duplicates (similar structure)
      if (content.includes('## What does this command do')) {
        const commandPattern = content.match(/# (.+?) - .+?\n/)?.[1];
        if (commandPattern) {
          const existing = Array.from(seenContent.entries()).find(
            ([key]) =>
              key.includes('## What does this command do') &&
              key.includes(commandPattern)
          );
          if (existing) {
            duplicateIndices.add(i);
            continue;
          }
        }
      }

      seenContent.set(content, i);
    }

    return duplicateIndices;
  }

  /**
   * Analyze and assign strip levels to messages
   * Preserves conversation flow while enabling adaptive content reduction
   */
  private analyzeStripLevels(messages: SessionMessage[]): SessionMessage[] {
    const duplicates = this.detectSemanticDuplicates(messages);

    return messages.map((message, index) => {
      const content = message.content;
      let stripLevel = 0;

      // Mark duplicates for higher strip level
      if (duplicates.has(index)) {
        stripLevel = 2; // Aggressively strip duplicates
      }

      // Find the highest applicable strip level
      for (const rule of STRIP_RULES) {
        if (rule.condition(content, message.role)) {
          stripLevel = Math.max(stripLevel, rule.level);
        }
      }

      return {
        ...message,
        stripLevel,
        originalContent: content,
      };
    });
  }

  /**
   * Apply strip level transformations to messages
   */
  private applyStripLevel(
    messages: SessionMessage[],
    maxStripLevel: number
  ): SessionMessage[] {
    const duplicates = this.detectSemanticDuplicates(messages);

    return messages.map((message, index) => {
      if (message.stripLevel === 0 || message.stripLevel > maxStripLevel) {
        return message; // Keep original content
      }

      let content = message.originalContent || message.content;

      // Handle semantic duplicates specially
      if (duplicates.has(index) && maxStripLevel >= 2) {
        if (content.includes('## What does this command do')) {
          const titleMatch = content.match(/^#\s+(.+?)$/m);
          const title = titleMatch ? titleMatch[1] : 'Command Documentation';
          content = `[Duplicate Doc: ${title}]`;
        } else {
          content = '[Duplicate Message]';
        }
      } else {
        // Apply regular strip rules
        for (const rule of STRIP_RULES) {
          if (
            rule.level <= maxStripLevel &&
            rule.condition(content, message.role)
          ) {
            content = rule.transform(content);
          }
        }
      }

      return {
        ...message,
        content,
      };
    });
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
        const data = JSON.parse(line);

        // Extract message information based on Claude's session format
        if (data.message) {
          const message: SessionMessage = {
            timestamp: data.timestamp || new Date().toISOString(),
            role: data.message.role || 'user',
            content: this.extractMessageContent(data.message),
            type: data.message.type,
            stripLevel: 0, // Will be analyzed later
          };
          messages.push(message);
        }
      } catch (error) {
        // Skip malformed lines silently
      }
    }

    return messages;
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
            const params = block.parameters || {};

            // Skip empty tool use messages
            if (Object.keys(params).length === 0) {
              return `[Tool: ${block.name || 'unknown'}]`;
            }

            // Summarize common tool uses
            if (block.name === 'TodoWrite') {
              return '[Todo Updated]';
            }

            if (block.name === 'Edit' || block.name === 'MultiEdit') {
              const filePath = params.file_path as string;
              const fileName = filePath ? filePath.split('/').pop() : 'file';
              return `[Tool: ${block.name} - ${fileName}]`;
            }

            return `[Tool: ${block.name || 'unknown'}]\n${JSON.stringify(params, null, 2)}`;
          }
          if (block.type === 'tool_result') {
            const content = block.content || '';

            // Filter repetitive success messages
            if (content.includes('Todos have been modified successfully')) {
              return '[Todo Updated]';
            }

            // Keep file modification results but note if they're short
            if (content.includes('Applied') && content.includes('edit')) {
              return `[Tool Result]\n${content}`;
            }

            // Summarize build output
            if (content.includes('tsdown') && content.includes('build')) {
              const hasError =
                content.includes('FATAL') || content.includes('error');
              return hasError ? '[Build Failed]' : '[Build Successful]';
            }

            // Summarize git operations
            if (
              content.includes('On branch') ||
              content.includes('Changes not staged')
            ) {
              return '[Git Status]';
            }

            if (
              content.includes('files changed') &&
              content.includes('insertions')
            ) {
              return '[Git Commit Successful]';
            }

            // Keep short results as is, truncate long ones
            if (content.length > 500) {
              return `[Tool Result]\n${content.substring(0, 200)}...`;
            }

            return `[Tool Result]\n${content}`;
          }
          return JSON.stringify(block);
        })
        .join('\n');
    }

    return JSON.stringify(message.content);
  }

  /**
   * Format session messages as markdown with adaptive content stripping
   */
  private formatSessionAsMarkdown(
    messages: SessionMessage[],
    projectPath: string
  ): string {
    // Analyze strip levels for all messages
    const analyzedMessages = this.analyzeStripLevels(messages);

    // Calculate total content length
    const totalLength = analyzedMessages.reduce(
      (sum, msg) => sum + msg.content.length,
      0
    );

    // Determine strip level based on total length (conservative thresholds)
    let stripLevel = 0;
    if (totalLength > 80000)
      stripLevel = 3; // Strip code blocks
    else if (totalLength > 40000)
      stripLevel = 2; // Strip docs and long modifications
    else if (totalLength > 15000) stripLevel = 1; // Strip commands and system messages only

    // Apply strip transformations
    const processedMessages = this.applyStripLevel(
      analyzedMessages,
      stripLevel
    );

    const now = new Date();
    const header = `# Claude Code Session - ${projectPath}

**Extracted**: ${now.toISOString()}
**Total Messages**: ${processedMessages.length}
**Session Start**: ${processedMessages[0]?.timestamp || 'Unknown'}
**Session End**: ${processedMessages[processedMessages.length - 1]?.timestamp || 'Unknown'}

---

## Conversation History

`;

    const conversationBody = processedMessages
      .map((msg, index) => {
        const roleLabel = msg.role === 'user' ? '👤 User' : '🤖 Assistant';
        const stripIndicator =
          msg.stripLevel > 0 && stripLevel >= msg.stripLevel
            ? ' (simplified)'
            : '';

        return `### Message ${index + 1} - ${roleLabel}${stripIndicator}

${msg.content}

`;
      })
      .join('\n');

    const footer = `
## Session Summary

- **Total Messages**: ${processedMessages.length}
- **User Messages**: ${processedMessages.filter((m) => m.role === 'user').length}
- **Assistant Messages**: ${processedMessages.filter((m) => m.role === 'assistant').length}
- **Duration**: ${this.calculateDuration(processedMessages)}
- **Content Strip Level**: ${stripLevel} (0=none, 1=commands, 2=docs, 3=code)
- **Original Length**: ${totalLength.toLocaleString()} chars
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

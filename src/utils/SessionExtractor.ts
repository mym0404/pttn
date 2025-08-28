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

    // Convert project path to Claude's directory format
    // Replace / with - for directory naming
    const projectDirName = currentProject
      .replace(/^\//, '')
      .replace(/\//g, '-')
      .toLowerCase();

    const sessionDir = join(this.claudeProjectsDir, projectDirName);

    if (!existsSync(sessionDir)) {
      throw new Error(
        `No Claude session found for project: ${currentProject}\n` +
          `Expected directory: ${sessionDir}`
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
          };
          messages.push(message);
        }
      } catch (error) {
        // Skip malformed lines
        console.warn('Failed to parse line:', error);
      }
    }

    return messages;
  }

  /**
   * Extract content from a message object
   */
  private extractMessageContent(message: any): string {
    if (typeof message.content === 'string') {
      return message.content;
    }

    if (Array.isArray(message.content)) {
      return message.content
        .map((block: any) => {
          if (typeof block === 'string') {
            return block;
          }
          if (block.type === 'text') {
            return block.text;
          }
          if (block.type === 'tool_use') {
            return `[Tool: ${block.name}]\n${JSON.stringify(block.parameters, null, 2)}`;
          }
          if (block.type === 'tool_result') {
            return `[Tool Result]\n${block.content}`;
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
        const timestamp = new Date(msg.timestamp).toLocaleString();

        return `### Message ${index + 1} - ${roleLabel}
*${timestamp}*

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

---

*This session was automatically extracted from Claude Code's local storage.*
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

  /**
   * Create a compact summary of the session
   */
  async createCompactSummary(fullContent: string): Promise<string> {
    // Extract key information for compact summary
    const lines = fullContent.split('\n');
    const messageCount = lines.filter((l) =>
      l.startsWith('### Message')
    ).length;
    const timestamp = new Date().toISOString();

    return `# Session Compact Summary

**Generated**: ${timestamp}
**Total Messages**: ${messageCount}

## Key Points

This is a compact summary of the session. The full history is available in the full session file.

## Quick Reference

- Session extracted from Claude Code local storage
- Contains complete conversation history
- Includes all tool usage and file operations

---

*Use the full session file for detailed conversation history.*
`;
  }
}

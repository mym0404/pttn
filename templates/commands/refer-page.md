# Refer Page - Load Session History Context

Retrieve and load session history from `.claude/pages/` directory by timestamp, keyword, or partial name search.

**Usage**: `/refer-page <timestamp|keyword>`

## Purpose

This command retrieves saved session histories to restore context from previous development sessions. It enables continuity across multiple sessions and helps recover important development context and decisions.

## Implementation

Use the `cc-self-refer` CLI tool to efficiently search and load session pages:

```bash
npx -y cc-self-refer page view <id_or_keyword> --context
npx -y cc-self-refer page search <keyword> --context
npx -y cc-self-refer page list
```

**Note**: The `--context` flag formats output for AI consumption with enhanced metadata and structured content.

### Search Process

The CLI tool handles:

- **Directory Management**: Automatically checks `.claude/pages/` directory
- **Smart Search**: Supports both exact ID matches and keyword searches
- **Content Matching**: Searches in filenames and content
- **Relevance Ranking**: Returns results sorted by relevance score
- **Context Loading**: Displays full page content for reference

### 3. Output Format

**Single Match Found**:

```markdown
# Session Context Loaded: [Session Name]

## File: `.claude/pages/[filename]`

## Session Date: [Extracted from timestamp]

### Quick Summary

[Display compact summary from the session file]

### Key Accomplishments

[Major achievements from that session]

### Important Context

[Critical information for current work]

---

**Full session context loaded and available for reference**
```

**Multiple Matches**:

```markdown
# Multiple Sessions Found for "[search term]"

## Matching Sessions (newest first):

### 1. **[Session 1]** (2025-08-27_14:30:22)

📝 _[Brief summary of what was accomplished]_
📁 Files: [key files modified]

### 2. **[Session 2]** (2025-08-26_09:15:33)

🔧 _[Brief summary of work done]_
📁 Files: [key files modified]

### 3. **[Session 3]** (2025-08-25_16:45:11)

✨ _[Brief summary of features added]_
📁 Files: [key files modified]

**Load Specific**: `/refer-page <timestamp>` to load specific session
**Recent Work**: Most recent relevant session is #1
```

**No Matches**:

```markdown
# No Session History Found

No sessions found for "[search term]".

## Available Sessions:

- **Latest**: [Most recent session] - [brief description]
- **[Date]**: [Session name] - [brief description]
- **[Date]**: [Session name] - [brief description]

**Usage**: `/refer-page <timestamp|keyword>` or try different search terms
**Save Current**: Use `/page` to save current session
```

### 4. Context Integration Features

- **Smart Summary**: Extract and highlight relevant parts for current work
- **File References**: Show what files were modified in that session
- **Decision History**: Surface important decisions and their reasoning
- **Pattern Recognition**: Identify recurring issues or solutions

## Usage Examples

### Load Recent Session

```bash
npx -y cc-self-refer page view 2025-08-27
```

Loads session from August 27, 2025

### Search by Feature Work

```bash
npx -y cc-self-refer page search "authentication"
```

Finds sessions where authentication was worked on

### List All Sessions

```bash
npx -y cc-self-refer page list
```

Shows all available session pages with creation dates

### View Specific Page

```bash
npx -y cc-self-refer page view 1
```

Loads page #1 directly by ID number

## Integration with Development Workflow

### Starting New Work

- Load context from related previous sessions
- Understand what was tried before
- Avoid repeating failed approaches
- Build on previous progress

### Debugging Issues

- Find sessions where similar issues were addressed
- Recover debugging context and solutions
- Understand historical problem patterns

### Feature Development

- Load context from related feature work
- Understand previous implementation decisions
- Maintain consistency with past approaches

### Knowledge Transfer

- Access detailed implementation history
- Understand evolution of project decisions
- Recover lost context between sessions

## Advanced Features

### Context Prioritization

- Emphasize recent and relevant sessions
- Filter by development activity type
- Highlight sessions with significant outcomes

### Smart Loading

- Load only relevant portions for current context
- Summarize long sessions for quick consumption
- Extract actionable items and next steps

## Error Handling

- **Directory Missing**: Suggest running `/init-claude` first
- **No Pages**: Guide user to use `/page` command to save sessions
- **Corrupted Files**: Handle malformed markdown gracefully
- **Large Sessions**: Efficiently handle very long session files

This command provides seamless context continuity across development sessions, making long-term project work with Claude Code much more efficient and coherent.

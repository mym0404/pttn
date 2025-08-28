# Page Save - Session History Dump with Citations and Memory Management

Like OS paging for processes, this command saves the entire conversation state to disk by extracting it from Claude Code's local storage (~/.claude/projects/).

## Usage

```
/page-save [title]
```

## Arguments

- `title` (optional): Title for the saved page. Defaults to "Session-{timestamp}"

## What does this command do

### ⚠️ IMPORTANT: CLI Command Execution Required

**This command MUST execute the following `cc-self-refer` CLI commands. Do NOT implement the functionality directly.**

### CLI Command Used

```bash
# Automatically extracts current session and creates a page
npx -y cc-self-refer page create "<title>"
```

**OR if title is not provided:**

```bash
# Uses auto-generated title "Session-{timestamp}"
npx -y cc-self-refer page create
```

### Command Arguments
- `title`: Page title (optional, defaults to "Session-{timestamp}")
- When no content is provided, automatically extracts current Claude Code session

### Expected Output
- Extracts current Claude Code session from `~/.claude/projects/`
- Creates a new page in `.claude/pages/` with the session content
- Returns page ID and location

## Description

This command implements a memory management strategy similar to OS paging:

1. **Page Out (Save to Disk)**:
   - Saves complete conversation state with full citations
   - Creates indexed source references for quick retrieval
   - Preserves all context before memory compaction

2. **Generated Files**:
   - **Full History File** (`{prefix}-{timestamp}-full.md`):
     - Compact summary at top for quick reference
     - Complete conversation transcript with timestamps
     - All file operations with paths and content
     - Web resources with URLs and excerpts
     - Command executions with outputs
     - Full citation index for all sources
   - **Compact Memory File** (`{prefix}-{timestamp}-compact.md`):
     - Executive summary of session
     - Key decisions and outcomes
     - Important code changes made
     - Quick reference links
     - Optimized for future context loading

3. **Memory Management Workflow**:
   - First: Run `/page-save` to save everything to disk
   - Then: Run `/compact` to free up Claude's context memory
   - Result: Fresh context while preserving full history
   - Essential for long development sessions

**Note**: This prepares for `/compact` by saving everything first. Run `/compact` after this command completes.

## Implementation

Execute the single CLI command to extract and save the session:

```bash
npx -y cc-self-refer page create "<title>"
```

This single command handles everything:
- Automatically finds the current project's Claude storage directory (`~/.claude/projects/`)
- Locates the most recent `.jsonl` session file
- Extracts all messages with proper formatting
- Preserves tool usage information and timestamps
- Creates a new page with the extracted content
- Returns the page ID and location

## After Saving

The CLI command automatically:
- Parses and preserves all source citations
- Maintains full conversation timeline with timestamps
- Includes all tool usage and file operations
- Creates a numbered markdown file in `.claude/pages/`
- Returns the page ID for future reference

**IMPORTANT**: After saving, you may suggest running `/compact` to free up Claude's memory

## Output Format

The command generates a single page file in `.claude/pages/`:

- Format: `{id}-{title-slug}.md` (e.g., `001-session-2025-01-15.md`)
- Contains complete session history with all messages, timestamps, and tool usage
- Properly formatted markdown with citations and structure
- Immediately available for reference via `/page-refer` command

## Example Usage

```bash
# Basic usage - creates session page with default title
/page-save

# Custom title
/page-save "Authentication Implementation Session"

# Results in .claude/pages/:
# - 001-authentication-implementation-session.md (or next available ID)

# After completion, run /compact to free up memory:
/compact
```

This command is essential for maintaining context across long development sessions and creating comprehensive documentation of AI-assisted development workflows.

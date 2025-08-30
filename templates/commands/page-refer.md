# Refer Page - Load Session History Context

Retrieve and use it as knowledge with running `cc-self-refer page {search|list|view}`

**Usage**: `/page-refer <timestamp|keyword>`

## Purpose

This command retrieves saved session histories to restore context from previous development sessions. It enables continuity across multiple sessions and helps recover important development context and decisions.

### ⚠️ IMPORTANT: CLI Command Execution Required

**This command MUST execute the following `cc-self-refer` CLI commands.**

### CLI Commands Used

```bash
npx -y cc-self-refer page search <keyword> # Search pages by keyword
npx -y cc-self-refer page list             # List all pages
npx -y cc-self-refer page view <id>        # View specific page
```

### Command Arguments
- `id`: Page ID number (for view command)
- `keyword`: Search keyword or phrase (for search command)


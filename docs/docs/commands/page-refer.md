---
id: page-refer
title: Refer Page - Load Session History Context
sidebar_label: /page-refer
---

# Refer Page - Load Session History Context

**Usage**: `/page-refer <keyword>`

## Overview

This command retrieves saved session histories to restore context from previous development sessions. It enables continuity across multiple sessions and helps recover important development context and decisions.

## CLI Integration

This Claude Code command integrates with the cc-self-refer CLI tool. Under the hood, it executes the following commands:

```bash
npx -y cc-self-refer page search <keyword> # Search pages by keyword
```

```bash
npx -y cc-self-refer page list             # List all pages
```

```bash
npx -y cc-self-refer page view <id>        # View specific page
```

## How It Works

1. **Command Invocation**: When you type `/page-refer` in Claude Code, the command is triggered
2. **CLI Execution**: The command executes the cc-self-refer CLI with appropriate parameters
3. **Result Processing**: Output is formatted and presented in the Claude Code interface



## Interactive Demo

<CommandDemo command="page-refer" />

## Related Commands

- [/page-save](./page-save)

## Troubleshooting

### Command Not Found

If the command is not recognized:

1. Ensure cc-self-refer is initialized: `cc-self-refer init`
2. Check that command templates are downloaded
3. Verify the .claude/commands directory exists

### CLI Errors

If the underlying CLI command fails:

1. Check that cc-self-refer is installed globally
2. Verify you're in a project with .claude directory
3. Review the specific error message for details

## API Reference

For detailed CLI documentation, see:

```bash
cc-self-refer page --help
```

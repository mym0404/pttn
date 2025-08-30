---
id: page-save
title: Page Save - Session History Dump with Citations and Memory Management
sidebar_label: /page-save
---

# Page Save - Session History Dump with Citations and Memory Management

**Usage**: `/page-save <title>`

## Overview

This command provides functionality for cc-self-refer.

## CLI Integration

This Claude Code command integrates with the cc-self-refer CLI tool. Under the hood, it executes the following commands:

```bash
npx -y cc-self-refer page create "<title>"
```

## How It Works

1. **Command Invocation**: When you type `/page-save` in Claude Code, the command is triggered
2. **CLI Execution**: The command executes the cc-self-refer CLI with appropriate parameters
3. **Result Processing**: Output is formatted and presented in the Claude Code interface



## Interactive Demo

<CommandDemo command="page-save" />

## Related Commands

- [/page-refer](/docs/commands/page-refer)

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

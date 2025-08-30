---
id: pattern-use
title: Use Code Pattern - Apply Predefined Code Patterns
sidebar_label: /pattern-use
---

# Use Code Pattern - Apply Predefined Code Patterns

**Usage**: `/pattern-use <number|keyword>`

## Overview

This command provides functionality for cc-self-refer.

## CLI Integration

This Claude Code command integrates with the cc-self-refer CLI tool. Under the hood, it executes the following commands:

```bash
npx -y cc-self-refer pattern search <keyword>
```

```bash
npx -y cc-self-refer pattern view <id>
```

```bash
npx -y cc-self-refer pattern list
```

## How It Works

1. **Command Invocation**: When you type `/pattern-use` in Claude Code, the command is triggered
2. **CLI Execution**: The command executes the cc-self-refer CLI with appropriate parameters
3. **Result Processing**: Output is formatted and presented in the Claude Code interface



## Interactive Demo

<CommandDemo command="pattern-use" />

## Related Commands

- [/pattern-create](./pattern-create)

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
cc-self-refer pattern --help
```

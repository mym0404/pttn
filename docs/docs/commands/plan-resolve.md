---
id: plan-resolve
title: Plan Resolve - Execute Strategic Plans and Mark Complete
sidebar_label: /plan-resolve
---

# Plan Resolve - Execute Strategic Plans and Mark Complete

**Usage**: `/plan-resolve <id|keyword>`

## Overview

This command facilitates the execution of strategic plans by:
1. Loading the plan for reference
2. Guiding implementation work
3. Optionally deleting the plan after successful completion

## CLI Integration

This Claude Code command integrates with the cc-self-refer CLI tool. Under the hood, it executes the following commands:

```bash
npx -y cc-self-refer plan view <id_or_keyword>
```

## How It Works

1. **Command Invocation**: When you type `/plan-resolve` in Claude Code, the command is triggered
2. **CLI Execution**: The command executes the cc-self-refer CLI with appropriate parameters
3. **Result Processing**: Output is formatted and presented in the Claude Code interface

## Examples

### View by Plan ID

```bash
/plan-resolve 3
```

### Search by Keyword

```bash
/plan-resolve authentication
```

### List All Plans

```bash
/plan-resolve
```

## Interactive Demo

<CommandDemo command="plan-resolve" />

## Related Commands

- [/plan-create](./plan-create)
- [/plan-edit](./plan-edit)

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
cc-self-refer plan --help
```

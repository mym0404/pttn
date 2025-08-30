---
id: plan-edit
title: Plan Edit
sidebar_label: /plan-edit
---

# Plan Edit - Modify Existing Plans

**Usage**: `/plan-edit <id|keyword>`

## Overview

Edit and update existing strategic plans to reflect progress, changes, or new insights.

## CLI Integration

This Claude Code command integrates with the cc-self-refer CLI tool. Under the hood, it executes the following commands:

```bash
cc-self-refer plan edit <id_or_keyword>
```

## How It Works

1. **Command Invocation**: When you type `/plan-edit` in Claude Code, the command is triggered
2. **CLI Execution**: The command executes the cc-self-refer CLI with appropriate parameters
3. **Result Processing**: Opens the plan for editing and saves changes

## Examples

### Edit by ID

```bash
/plan-edit 3
```

### Edit by Keyword

```bash
/plan-edit authentication
```

## Interactive Demo

<CommandDemo command="plan-edit" />

## Related Commands

- [/plan-create](./plan-create)
- [/plan-resolve](./plan-resolve)

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
---
id: pattern-create
title: Code Pattern - Save Reusable Code Patterns
sidebar_label: /pattern-create
---

# Code Pattern - Save Reusable Code Patterns

**Usage**: `/pattern-create <pattern name> <snippet|filename with line number|description>`

## Overview

This command provides functionality for cc-self-refer.

## CLI Integration

This Claude Code command integrates with the cc-self-refer CLI tool. Under the hood, it executes the following commands:

```bash
npx -y cc-self-refer pattern create "<pattern-name>" <<'EOF'
```

```bash
npx -y cc-self-refer pattern create "api-error-handler" <<'EOF'
```

## How It Works

1. **Command Invocation**: When you type `/pattern-create` in Claude Code, the command is triggered
2. **CLI Execution**: The command executes the cc-self-refer CLI with appropriate parameters
3. **Result Processing**: Output is formatted and presented in the Claude Code interface

## Examples

### Save Pattern Examples

When user requests:

```bash
/pattern-create "api-error-handler" "snippet or filename with lines"
```

Claude will:

1. Generate formatted content with the above rules.
2. Execute: 
   ```bash
   npx -y cc-self-refer pattern create "api-error-handler" <<'EOF'
   [formatted content]
   EOF
   ```

## Interactive Demo

<CommandDemo command="pattern-create" />

## Related Commands

- [/pattern-use](./pattern-use)

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

---
id: spec-refer
title: Refer Spec - Access Project Specifications
sidebar_label: /spec-refer
---

# Refer Spec - Access Project Specifications

**Usage**: `/spec-refer <number|keyword>`

## Overview

This command retrieves stored project specifications including business requirements, feature designs, user experience flows, technical architecture, and operational procedures that are essential for understanding the project scope and making informed development decisions.

## CLI Integration

This Claude Code command integrates with the cc-self-refer CLI tool. Under the hood, it executes the following commands:

```bash
npx -y cc-self-refer spec list
```

```bash
npx -y cc-self-refer spec list --category <category>
```

```bash
npx -y cc-self-refer spec search <keyword>
```

```bash
npx -y cc-self-refer spec search <keyword> --category <category>
```

```bash
npx -y cc-self-refer spec view <id_or_keyword>
```

```bash
npx -y cc-self-refer spec list
```

```bash
npx -y cc-self-refer spec search "authentication"
```

```bash
npx -y cc-self-refer spec list --category "payment"
```

```bash
npx -y cc-self-refer spec search "user roles" --category "authorization"
```

## How It Works

1. **Command Invocation**: When you type `/spec-refer` in Claude Code, the command is triggered
2. **CLI Execution**: The command executes the cc-self-refer CLI with appropriate parameters
3. **Result Processing**: Output is formatted and presented in the Claude Code interface

## Examples

### List All Specifications

```bash
npx -y cc-self-refer spec list
```

Shows all available specification entries with categories

### Search System Requirements

```bash
npx -y cc-self-refer spec search "authentication"
```

Finds authentication-related project specifications

### Search by Category

```bash
npx -y cc-self-refer spec list --category "payment"
```

Lists all payment-related specification entries

### Search in Specific Category

```bash
npx -y cc-self-refer spec search "user roles" --category "authorization"
```

Finds user role specifications within authorization category

## Interactive Demo

<CommandDemo command="spec-refer" />

## Related Commands

- [/spec](./spec)

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
cc-self-refer spec --help
```

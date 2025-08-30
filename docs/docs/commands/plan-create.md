---
id: plan-create
title: Plan Create - Create New Implementation Planning Document
sidebar_label: /plan-create
---

# Plan Create - Create New Implementation Planning Document

**Usage**: `/plan-create <plan-name> <description>`

## Overview

This command provides functionality for cc-self-refer.

## CLI Integration

This Claude Code command integrates with the cc-self-refer CLI tool. Under the hood, it executes the following commands:

```bash
npx -y cc-self-refer plan create "<title>" <<'EOF'
```

```bash
npx -y cc-self-refer plan create "implement rate limiting" <<'EOF'
```

## How It Works

1. **Command Invocation**: When you type `/plan-create` in Claude Code, the command is triggered
2. **CLI Execution**: The command executes the cc-self-refer CLI with appropriate parameters
3. **Result Processing**: Output is formatted and presented in the Claude Code interface

## Examples

### Create Plan Examples

When user requests:

```bash
/plan-create "implement rate limiting" "prevent API abuse with Redis-based rate limiting"
```

**Claude's Interactive Response:**

```
I'll help create a comprehensive plan for implementing rate limiting.
Let me gather essential information first:

**Technical Context:**
1. What web framework are you using?
2. Is Redis already in your infrastructure?
3. Are you running multiple server instances?

**Requirements:**
4. What rate limits do you need? (requests/minute)
5. Different limits for different users/endpoints?

Please answer these so I can ask more specific questions.
```

**User provides answers...**

**Claude continues gathering information:**
```
Based on your answers, I need to understand:

6. How do you identify users? (API key, JWT, IP?)
7. What response when limits exceeded? (429 status, custom message?)
8. Any services to whitelist?
9. Monitoring/alerting requirements?
```

**After all information gathered:**

1. Generate comprehensive plan using template with all Q&A information
2. Execute (REQUIRED):
   ```bash
   npx -y cc-self-refer plan create "implement rate limiting" <<'EOF'
   <generated plan content>
   EOF
   ```
3. Confirm: "✅ Plan created: 001-implement-rate-limiting.md"

## Interactive Demo

<CommandDemo command="plan-create" />

## Related Commands

- [/plan-edit](/docs/commands/plan-edit)
- [/plan-resolve](/docs/commands/plan-resolve)

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

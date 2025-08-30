---
id: spec
title: Spec - Adaptive Interactive Project Planning System
sidebar_label: /spec
---

# Spec - Adaptive Interactive Project Planning System

**Usage**: `/spec [initial concept or feature name]`

## Overview

This command provides functionality for cc-self-refer.

## CLI Integration

This Claude Code command integrates with the cc-self-refer CLI tool. Under the hood, it executes the following commands:

```bash
npx -y cc-self-refer spec create "<spec-title-1>" --category <category> <<'EOF'
```

```bash
npx -y cc-self-refer spec create "<spec-title-2>" --category <category> <<'EOF'
```

## How It Works

1. **Command Invocation**: When you type `/spec` in Claude Code, the command is triggered
2. **CLI Execution**: The command executes the cc-self-refer CLI with appropriate parameters
3. **Result Processing**: Output is formatted and presented in the Claude Code interface

## Examples

### Fresh Product Specification
```bash
User: /spec "AI-Powered Task Management Platform"

Claude: 🚀 Starting comprehensive specification planning for your AI-Powered Task Management Platform.

🔍 Project Analysis:
- Codebase: Clean slate, no existing specifications
- Complexity: High (AI integration, multi-user, real-time features)
- Strategy: Complete product specification suite

🧠 AI Planning:
I'll create 12 interconnected specifications covering:
1. Product vision and AI differentiation strategy
2. User personas (individuals, teams, enterprise)
3. AI feature specifications (smart scheduling, task prioritization, insights)
4. Core task management functionality
5. Real-time collaboration features
6. AI model integration architecture
7. Data privacy and AI ethics framework
8. Performance requirements for AI processing
9. Mobile and web UI specifications
10. API design for third-party integrations
11. Deployment and scaling strategy
12. Security framework for AI and user data

Let's start with understanding your vision:
- What specific AI capabilities will differentiate your platform?
- Who are your primary users and what AI-powered workflows do they need?
- What's your approach to AI model integration? (cloud APIs vs. custom models)
```

### Existing System Enhancement
```bash
User: /spec "Real-time Chat Feature"

Claude: 🔄 Analyzing existing project for real-time chat integration...

📊 Current State Analysis:
- Found 8 existing specifications in .claude/specs/
- Current: User management ✓, REST APIs ✓, React frontend ✓
- Architecture: Traditional request/response, no WebSocket support
- Gap: Real-time communication capabilities missing

🎯 Integration Strategy:
I'll create 3 new specifications and update 2 existing ones:

New Specifications:
- 009-real-time-chat-system.md (core chat functionality)
- 010-websocket-architecture.md (real-time communication layer)  
- 011-chat-ui-components.md (chat interface specifications)

Existing Updates:
- 004-api-specifications.md (add chat API endpoints)
- 005-security-framework.md (add real-time security considerations)

Key Questions:
- Should chat be 1-on-1, group-based, or both?
- Do you need message persistence and history?
- What's your approach to real-time scaling? (Redis, separate service?)
- Any compliance requirements for chat data? (encryption, retention)
```

## Interactive Demo

<CommandDemo command="spec" />

## Related Commands

- [/spec-refer](./spec-refer)

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

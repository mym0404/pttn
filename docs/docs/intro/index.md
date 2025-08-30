---
id: index
title: Introduction
sidebar_label: Introduction
slug: /intro
---

# Welcome to cc-self-refer

**cc-self-refer** is a powerful CLI tool that enables intelligent self-reference capabilities for Claude Code projects. It provides organized context management through the `.claude` directory structure, allowing Claude Code to maintain awareness across sessions and build upon previous work.

## What is cc-self-refer?

cc-self-refer is a Node.js CLI tool designed to solve a fundamental challenge in AI-assisted development: **context continuity**. When working with Claude Code, each session typically starts fresh, without knowledge of previous conversations, decisions, or implementations. cc-self-refer changes this by providing a structured way to:

- 📝 **Save and reference session history** - Extract and store important conversations
- 📋 **Create strategic plans** - Document implementation strategies with trackable checklists
- 🎨 **Store reusable patterns** - Build a library of proven code patterns and architectures
- 📚 **Maintain project specifications** - Keep comprehensive project documentation accessible

## Why cc-self-refer?

### The Problem

Traditional AI coding assistants suffer from:
- **Session amnesia** - Each conversation starts from scratch
- **Lost context** - Previous decisions and implementations are forgotten
- **Repeated work** - Same questions answered multiple times
- **Inconsistent approaches** - Different solutions to similar problems

### The Solution

cc-self-refer implements a **Self-Referring Model** where Claude Code can:
- Access its own conversation history
- Reference established patterns and decisions
- Maintain consistency across sessions
- Build upon previous work incrementally

## Key Features

### 🧠 Smart Context Management
Automatically organize project context in the `.claude` directory with intelligent categorization and search capabilities.

### ⚡ Native Claude Code Integration
Seamless integration through slash commands that feel like native Claude Code features.

### ♦️ Self-Referring Architecture
Enable Claude Code to reference its own history and maintain awareness across sessions.

### 📚 Pattern Library
Store successful implementations as reusable patterns for consistent development.

### 📋 Strategic Planning
Create and track implementation plans with built-in progress management.

### 📝 Specification Repository
Maintain searchable project specifications combining business, technical, and operational requirements.

## How It Works

cc-self-refer creates a `.claude` directory in your project root with the following structure:

```
.claude/
├── commands/     # Claude Code slash commands
├── pages/        # Session history and conversations
├── plans/        # Strategic implementation plans
├── patterns/     # Reusable code patterns
└── specs/        # Project specifications
```

Through CLI commands and Claude Code slash commands, you can:
1. **Extract** important conversations and decisions
2. **Store** them in organized, searchable formats
3. **Reference** them in future sessions
4. **Build** upon previous work incrementally

## Getting Started

Ready to enhance your Claude Code workflow? Check out our [Getting Started Guide](/docs/getting-started/installation) to install and set up cc-self-refer in minutes.

## Community and Support

- 🐛 [Report Issues](https://github.com/mym0404/cc-self-refer/issues)
- 💬 [Join Discussions](https://github.com/mym0404/cc-self-refer/discussions)
- ⭐ [Star on GitHub](https://github.com/mym0404/cc-self-refer)
- 📦 [View on npm](https://www.npmjs.com/package/cc-self-refer)
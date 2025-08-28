<div align="center">
  <img src="assets/logo.svg" alt="cc-self-refer" width="400" />
</div>

# cc-self-refer

**Claude Code Self-Reference Helper** - The missing backend for intelligent development workflows with AI assistance.

## What is cc-self-refer?

`cc-self-refer` is a high-performance Node.js CLI that powers Claude Code's self-referential development capabilities. It enables projects to maintain their own context, knowledge base, and development patterns that Claude can reference and build upon across sessions.

## Why do you need this?

### The Problem

- **Context Loss**: AI conversations lose context between sessions
- **Repeated Explanations**: You constantly re-explain project architecture, decisions, and patterns
- **Knowledge Scattered**: Domain knowledge, code patterns, and planning documents are spread across different tools
- **Inefficient Workflows**: No systematic way to build and reference project-specific knowledge

### The Solution

`cc-self-refer` creates a **persistent, searchable knowledge layer** for your projects that Claude Code can intelligently reference:

- 📋 **Strategic Plans**: Document and iterate on high-level project planning
- 📄 **Session History**: Preserve development context across Claude sessions
- 🧩 **Code Patterns**: Build a library of reusable, project-specific code templates
- 🧠 **Domain Knowledge**: Maintain business logic, constraints, and architectural decisions
- 🔍 **Intelligent Search**: Find relevant information instantly with semantic search

## Quick Setup

### 1. Add the Global Command

Create `~/.claude/commands/init-claude.md`:

```markdown
# Init Claude - Initialize Project with Self-Reference Commands

**Usage**: `/init-claude`

## Implementation

First, setup the project structure:
```bash
npx -y cc-self-refer init-setup-project
```

Then get the initialization prompt:
```bash
npx -y cc-self-refer init-get-prompt
```

Follow the instructions from the prompt output to complete the setup.
```

### 2. Initialize Any Project

```bash
cd your-project
/init-claude  # Run in Claude Code
```

The command will:
1. First run `init-setup-project` to create the directory structure and download command templates
2. Then run `init-get-prompt` to get Claude Code-specific instructions
3. Follow the prompt instructions to complete the intelligent self-reference setup

That's it! Your project now has intelligent self-reference capabilities.

## What Gets Created

After running `/init-claude`, your project will have:

```
your-project/
├── CLAUDE.md              # 📜 Project Overview for Claude and command usages (merged if exists)
├── .claude/
│   ├── commands/           # 🎯 Claude Code Commands
│   ├── commands/           # 🎯 Claude Code Commands
│   │   ├── plan-create.md # Create strategic plans
│   │   ├── plan-edit.md   # Edit existing plans
│   │   ├── plan-resolve.md# View and load plans
│   │   ├── page.md        # Session management
│   │   ├── page-refer.md  # Load session context
│   │   ├── knowledge-refer.md # Access domain knowledge
│   │   ├── pattern-use.md # Apply code patterns
│   │   └── pattern-create.md     # Save new patterns
│   │
│   ├── plans/             # 📋 Strategic Plans & Architecture
│   │   └── [numbered plans like: 001-user-authentication.md]
│   │
│   ├── pages/             # 📄 Session History & Context
│   │   └── [numbered sessions like: 001-login-implementation.md]
│   │
│   ├── patterns/     # 🧩 Reusable Code Templates
│   │   └── [numbered patterns like: 001-react-hook.md]
│   │
│   └── knowledges/         # 🧠 Domain Knowledge Base
│       └── [numbered entries like: 001-api-limits.md]
└── [your project files]
```

## How Each Directory Works

### 📋 `.claude/plans/` - Strategic Planning

- **Purpose**: High-level project planning and architecture decisions
- **Usage**:
  - `/plan-create "Feature Name" "Description"` creates comprehensive planning documents
  - `/plan-edit "id|keyword" "modifications"` modifies existing plans
  - `/plan-resolve "id|keyword"` views and loads plans for reference
- **Content**: Implementation phases, success criteria, technical decisions, risk assessment
- **AI Benefit**: Claude references these plans to understand project direction and constraints

### 📄 `.claude/pages/` - Session Context

- **Purpose**: Preserve development context between Claude sessions
- **Usage**: Automatically captures session state; `/page-refer` to load previous context
- **Content**: Code changes, decisions made, problems solved, next steps
- **AI Benefit**: Eliminates need to re-explain project status each session

### 🧩 `.claude/patterns/` - Reusable Templates

- **Purpose**: Project-specific code patterns and templates
- **Usage**: `/pattern-create` to save patterns; `/pattern-use` to apply them
- **Content**: Component templates, utility functions, configuration patterns
- **AI Benefit**: Claude can apply your established patterns instead of generic solutions

### 🧠 `.claude/knowledge/` - Domain Knowledge

- **Purpose**: Business logic, domain rules, and architectural constraints
- **Usage**: `/knowledge-refer` to access; manually curated domain information
- **Content**: Business rules, API limitations, performance requirements, compliance needs
- **AI Benefit**: Claude makes technically sound decisions aligned with your domain

## Why This Works

Each directory serves a specific purpose in building **persistent AI context**:

1. **Plans** provide strategic direction
2. **Pages** maintain session continuity
3. **Patterns** ensure consistency
4. **Knowledge** guides decision-making

The result: Claude becomes increasingly intelligent about your specific project over time.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and contribution guidelines.

## License

MIT © 2025 MJ Studio

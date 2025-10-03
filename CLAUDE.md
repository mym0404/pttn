# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## High-Level Architecture

This is a Node.js CLI tool that helps manage Claude Code's `.claude` directory structure for project context management.

### Core Architecture Components

1. **CLI Entry Point (`src/cli.ts`)**:
   - Commander.js-based CLI with subcommands for pattern management
   - Pattern command group has CRUD operations

2. **Manager Layer (`src/managers/`)**:
   - `PatternManager`: Code pattern templates in `.claude/patterns/`

3. **Content Organization**:
   - All content uses numbered markdown files (001-title.md format)
   - Metadata extraction from frontmatter and content patterns
   - Semantic search using natural.js for content discovery

### Key Design Patterns

- **Factory Pattern**: `create*Manager()` functions for each content type
- **Consistent Interface**: All managers implement similar CRUD methods
- **File-based Storage**: Markdown files with structured naming conventions
- **Semantic Search**: Jaro-Winkler distance + keyword matching for content retrieval

### Directory Structure

#### Project Structure

```

pttn/
├── src/
│   ├── cli.ts              # Main CLI entry point
│   ├── managers/           # Content manager implementations
│   ├── commands/           # CLI command implementations
│   ├── setup/              # Initialization and setup logic
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── formatters.ts       # Output formatting utilities
├── templates/
│   ├── commands/           # Claude Code command templates
│   └── prompts/            # Prompt templates
└── dist/                   # Built output (CommonJS + ESM)
```

#### Generated `.claude` Structure

```
.claude/
├── commands/           # Claude Code command definitions (from templates)
└── patterns/          # Reusable code templates
```

## Project Overview

**pttn** is a Node.js CLI tool that provides intelligent pattern management capabilities for Claude Code projects. It manages the `.claude` directory structure to enable context-aware development sessions through organized pattern management.

### Core Features

- **Code Pattern Templates**: Store and reuse architectural patterns and code snippets

### Technology Stack

- **Runtime**: Node.js ≥18.0.0 with ES2022 features
- **Language**: TypeScript 5.7+ with strict configuration
- **CLI Framework**: Commander.js for command structure
- **Package Manager**: pnpm 10.15.0 for dependency management
- **Build Tool**: tsdown for TypeScript compilation to CommonJS + ESM
- **Search Engine**: natural.js with Jaro-Winkler distance for semantic content discovery
- **File System**: fs-extra for enhanced file operations
- **Process Management**: execa for external command execution

### Key Dependencies

- `@clack/prompts`: Interactive CLI prompts
- `natural`: Text similarity algorithms for search
- `glob` + `minimatch`: File pattern matching and filtering
- `workspace-tools`: Monorepo workspace utilities

## Project-Specific Context

This tool is designed to work with Claude Code's command system. The init process:

1. Creates `.claude/` directory structure
2. Downloads command templates from GitHub
3. Provides slash commands for content management

### ⚠️ CRITICAL: CLI and Command Template Interdependencies

**ALL command templates in `templates/commands/` MUST use the `pttn` CLI tool. They are NOT standalone implementations.**

#### Binding Contract

Each command template is a **thin wrapper** that:
1. **MUST** call `npx pttn` with appropriate arguments
2. **MUST NOT** implement any business logic directly
4. **MUST** include a `## What does this command do` section with exact CLI commands

#### Why This Matters

- **Single Source of Truth**: All logic lives in the CLI tool
- **Consistency**: Ensures uniform behavior across all commands
- **Maintainability**: Changes only need to be made in one place (CLI)
- **Testing**: CLI can be tested independently

#### When Making Changes

1. **CLI changes** → Update ALL affected command templates
2. **Command template changes** → Verify CLI compatibility
3. **New features** → Implement in CLI first, then create command template
4. **High context sharing** means changes in one area often require updates in multiple other areas

#### Command Templates and Their CLI Bindings

- `pttn-create.md` - Pattern creation → `pattern create`
- `pttn-use.md` - Pattern usage → `pattern view`

#### Verification Checklist

- [ ] Command template calls `npx pttn`
- [ ] All arguments are properly mapped
- [ ] Error handling considers CLI exit codes
- [ ] Documentation matches actual CLI behavior

Always verify that changes maintain compatibility across:

- `src/cli.ts` (CLI implementation)
- `src/commands/*.ts` (Command implementations)
- `src/managers/*.ts` (Business logic)
- `templates/commands/*.md` (Claude Code command definitions)
- `README.md` (User documentation)

[PATTERN LIST]

| ID  | Name               | Language | Keywords              | Explanation                                                                           |
|-----|--------------------|----------|-----------------------|---------------------------------------------------------------------------------------|
| 002 | test-pattern       | text     | test, example         |                                                                                       |
| 003 | test-table-pattern | markdown | test, table, markdown | Test pattern to verify the CLAUDE.md table includes language and explanation columns. |

[PATTERN LIST END]

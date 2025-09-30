# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## High-Level Architecture

This is a Node.js CLI tool that helps manage Claude Code's `.claude` directory structure for project context management.

### Core Architecture Components

1. **CLI Entry Point (`src/cli.ts`)**:
   - Commander.js-based CLI with subcommands for different content types
   - Each command group (page, plan, pattern, spec) has CRUD operations

2. **Manager Layer (`src/managers/`)**:
   - `PageManager`: Session history management in `.claude/pages/`
   - `PlanManager`: Strategic planning in `.claude/plans/`
   - `PatternManager`: Code pattern templates in `.claude/patterns/`
   - `SpecManager`: Project specification repository in `.claude/specs/`

3. **Content Organization**:
   - All content uses numbered markdown files (001-title.md format)
   - Metadata extraction from frontmatter and content patterns
   - Semantic search using natural.js for content discovery
   - Spec files contain comprehensive project planning (business + technical + operational)

### Key Design Patterns

- **Factory Pattern**: `create*Manager()` functions for each content type
- **Consistent Interface**: All managers implement similar CRUD methods
- **File-based Storage**: Markdown files with structured naming conventions
- **Semantic Search**: Jaro-Winkler distance + keyword matching for content retrieval

### Directory Structure

#### Project Structure

```
cc-self-refer/
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
├── pages/             # Session history (auto-generated)
├── plans/             # Strategic planning documents
├── patterns/          # Reusable code templates
└── specs/        # Project specification repository
```

## Project Overview

**cc-self-refer** is a Node.js CLI tool that provides intelligent self-reference capabilities for Claude Code projects. It manages the `.claude` directory structure to enable context-aware development sessions through organized content management.

### Core Features

- **Code Pattern Templates**: Store and reuse architectural patterns and code snippets
- **Project Specifications**: Maintain a searchable repository of comprehensive project planning documents

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

**ALL command templates in `templates/commands/` MUST use the `cc-self-refer` CLI tool. They are NOT standalone implementations.**

#### Binding Contract

Each command template is a **thin wrapper** that:
1. **MUST** call `npx cc-self-refer` with appropriate arguments
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

- `page-save.md` - Session extraction → `page extract-session` + `page create`
- `page-refer.md` - Page reference → `page list`, `page search`, `page view`
- `plan-create.md` - Plan creation → `plan create`
- `plan-edit.md` - Plan editing → `plan edit` (full content replacement)
- `plan-resolve.md` - Plan resolution → `plan view` + work + `plan delete`
- `pattern-create.md` - Pattern creation → `pattern create`
- `pattern-use.md` - Pattern usage → `pattern view`
- `spec.md` - Specification planning → multiple `spec create` calls
- `spec-refer.md` - Specification reference → `spec list`, `spec search`, `spec view`

#### Verification Checklist

- [ ] Command template calls `npx cc-self-refer`
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

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development Commands

```bash
# Build the project
pnpm build

# Development build and run
pnpm dev

# Type checking
pnpm typecheck

# Linting and formatting
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check

# Run all checks (lint + format + typecheck)
pnpm t

# Release
pnpm release
```

### CLI Testing

```bash
# Test CLI commands locally after building
pnpm build
node dist/cli.js --help

# Test specific commands
node dist/cli.js page list
node dist/cli.js plan create "Test Plan" "Description"
node dist/cli.js pattern search "keyword"
node dist/cli.js spec list
```

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
   - `SpecManager`: Technical specification repository in `.claude/specs/`
   - Factory functions exported from `src/managers/index.ts`

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
└── specs/        # Technical specification repository
```

### Build System

- **TypeScript**: ES2022 target with ESNext modules
- **Build Tool**: tsdown (simplified TypeScript bundler)
- **Package Manager**: pnpm with lockfile
- **Output**: Both CommonJS and ESM builds in `dist/`

### Development Workflow

1. Make changes to `src/` files
2. Run `pnpm t` for comprehensive validation
3. Use `pnpm dev` for quick testing
4. Build with `pnpm build` before release

## Project Overview

**cc-self-refer** is a Node.js CLI tool that provides intelligent self-reference capabilities for Claude Code projects. It manages the `.claude` directory structure to enable context-aware development sessions through organized content management.

### Core Features

- **Code Pattern Templates**: Store and reuse architectural patterns and code snippets
- **Technical Specifications**: Maintain a searchable repository of technical requirements

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

## cc-self-refer System

This project uses cc-self-refer for intelligent self-reference capabilities.
Claude Code agents should use these CLI commands to access and manage project context automatically:

```bash
# IMPORTANT: Claude Code agents should use these commands proactively
# Search and access existing content before starting tasks
npx cc-self-refer spec search "topic"    # Find technical specifications
npx cc-self-refer pattern search "keyword"    # Find reusable patterns

# List and view specific content
npx cc-self-refer spec list              # List all specifications
npx cc-self-refer spec view <id>         # Load specific specification
npx cc-self-refer pattern list           # List all patterns
npx cc-self-refer pattern view <id>      # Load specific pattern
```

### Usage Workflow

**Agent Task Flow:**

1. Search for relevant context: `npx cc-self-refer <type> search "keyword"`
2. Load existing content: `npx cc-self-refer <type> view <id>`
3. Work with full project context
4. Create new entries: `npx cc-self-refer <type> create "title" "description"`

### ⚠️ CRITICAL: CLI and Command Template Interdependencies

**ALL command templates in `templates/commands/` MUST use the `cc-self-refer` CLI tool. They are NOT standalone implementations.**

#### Binding Contract

Each command template is a **thin wrapper** that:
1. **MUST** call `npx -y cc-self-refer` with appropriate arguments
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

#### Command Template Structure

Every command template MUST include:
```markdown
## What does this command do

### ⚠️ IMPORTANT: CLI Command Execution Required

**This command MUST execute the following `cc-self-refer` CLI command.**

### CLI Command Used
```bash
npx -y cc-self-refer [command] [args]
```
```

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

- [ ] Command template calls `npx -y cc-self-refer`
- [ ] All arguments are properly mapped
- [ ] Error handling considers CLI exit codes
- [ ] Documentation matches actual CLI behavior

Always verify that changes maintain compatibility across:

- `src/cli.ts` (CLI implementation)
- `src/commands/*.ts` (Command implementations)
- `src/managers/*.ts` (Business logic)
- `templates/commands/*.md` (Claude Code command definitions)
- `README.md` (User documentation)

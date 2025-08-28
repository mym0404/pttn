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
   - Supports both console output and AI-context formatted output (`--context` flag)

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

## Project-Specific Context

This tool is designed to work with Claude Code's command system. The init process:

1. Creates `.claude/` directory structure
2. Downloads command templates from GitHub
3. Provides slash commands for content management

The CLI supports both human-readable console output and AI-optimized context output for seamless integration with Claude Code workflows.

### Important: CLI and Command Template Interdependencies

**This project's CLI commands are designed to be invoked from Claude Code's command templates located in `templates/commands/`.** Due to this tight coupling:

- **When CLI interfaces change, all corresponding command templates must be updated** to match the new usage patterns
- **Documentation updates are required** across multiple locations (README.md, command templates, examples)
- **High context sharing** means changes in one area often require updates in multiple other areas

Key interdependencies to consider:

1. CLI argument structure → Command template invocation syntax
2. Output format changes → Command template parsing logic
3. New features → New command templates and documentation
4. Error messages → Command template error handling

#### Command Templates in `templates/commands/`:

- `page-save.md` - Page management commands
- `page-refer.md` - Page reference commands
- `plan-create.md` - Plan creation
- `plan-edit.md` - Plan editing
- `plan-resolve.md` - Plan resolution
- `pattern-create.md` - Pattern creation
- `pattern-use.md` - Pattern usage
- `spec.md` - Interactive specification planning
- `spec-refer.md` - Specification reference

Always verify that changes maintain compatibility across:

- `src/cli.ts` (CLI implementation)
- `templates/commands/*.md` (Claude Code command definitions)
- `README.md` (User documentation)
- Example usage in documentation

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
node dist/cli.js knowledge list
```

## High-Level Architecture

This is a Node.js CLI tool that helps manage Claude Code's `.claude` directory structure for project context management.

### Core Architecture Components

1. **CLI Entry Point (`src/cli.ts`)**: 
   - Commander.js-based CLI with subcommands for different content types
   - Each command group (page, plan, pattern, knowledge) has CRUD operations
   - Supports both console output and AI-context formatted output (`--context` flag)

2. **Manager Interfaces (`src/index.ts`)**:
   - `PageManager`: Session history management in `.claude/pages/`
   - `PlanManager`: Strategic planning in `.claude/plans/` 
   - `PatternManager`: Code pattern templates in `.claude/patterns/`
   - `KnowledgeManager`: Domain knowledge base in `.claude/knowledges/`

3. **Content Organization**:
   - All content uses numbered markdown files (001-title.md format)
   - Metadata extraction from frontmatter and content patterns
   - Semantic search using natural.js for content discovery

### Key Design Patterns

- **Factory Pattern**: `create*Manager()` functions for each content type
- **Consistent Interface**: All managers implement similar CRUD methods
- **File-based Storage**: Markdown files with structured naming conventions
- **Semantic Search**: Jaro-Winkler distance + keyword matching for content retrieval

### Content Structure
```
.claude/
├── commands/           # Claude Code command definitions
├── pages/             # Session history (auto-generated)
├── plans/             # Strategic planning documents
├── patterns/          # Reusable code templates
└── knowledges/        # Domain knowledge base
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
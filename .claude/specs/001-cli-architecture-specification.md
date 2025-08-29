# CLI Architecture Specification

**Category**: architecture

## Overview
This specification defines the architecture and design patterns for the cc-self-refer CLI tool that provides intelligent self-reference capabilities for Claude Code projects.

## Technical Stack
- **Runtime**: Node.js ≥18.0.0 with ES2022 features
- **Language**: TypeScript 5.7+ with strict configuration  
- **CLI Framework**: Commander.js for command structure
- **Build Tool**: tsdown for TypeScript compilation to CommonJS + ESM
- **Package Manager**: pnpm 10.15.0 for dependency management
- **Search Engine**: natural.js with Jaro-Winkler distance for semantic content discovery

## Core Components

### 1. CLI Entry Point (src/cli.ts)
- Commander.js-based CLI with subcommands
- Command groups: page, plan, pattern, spec
- Each group provides CRUD operations (Create, Read, Update, Delete)
- Global options for directory configuration

### 2. Manager Layer (src/managers/)
- **PageManager**: Session history management in `.claude/pages/`
- **PlanManager**: Strategic planning documents in `.claude/plans/`
- **PatternManager**: Code pattern templates in `.claude/patterns/`
- **SpecManager**: Technical specifications in `.claude/specs/`
- Factory pattern implementation with consistent interfaces

### 3. Content Organization System
- Numbered markdown files (001-title.md format)
- Metadata extraction from frontmatter and content patterns
- Semantic search using natural.js Jaro-Winkler algorithms
- Advanced search with relevance scoring and context highlighting

### 4. Command Template Integration
- Templates stored in `templates/commands/`
- Each template calls CLI tool via `npx -y cc-self-refer`
- Templates are thin wrappers without business logic
- Automatic download and setup via init commands

## Design Patterns

### Factory Pattern
- `createPageManager()`, `createPlanManager()`, etc.
- Consistent interface across all content managers
- Dependency injection for content directory configuration

### Consistent Interface
All managers implement similar CRUD methods:
- `list()`: Get all items with metadata
- `search(keyword)`: Semantic search with scoring
- `view(idOrKeyword)`: Get specific item content
- `create(title, content)`: Create new item with auto-incrementing ID

### File-based Storage
- Structured naming conventions with auto-incrementing IDs
- Markdown format for human readability and version control
- Metadata embedded in frontmatter and content patterns

### Semantic Search Architecture
- Multi-dimensional scoring system:
  - Exact matches (highest priority)
  - Jaro-Winkler semantic similarity
  - Keyword relevance with field weights
  - Category filtering and boosting
  - Recency scoring for fresher content
- Advanced highlight generation and context matching

## Integration Points

### Claude Code Command System
- `.claude/commands/` directory contains executable slash commands
- Templates automatically reference CLI tool for execution
- Seamless integration with Claude Code's interactive system

### Project Context Management
- Automatic `.claude` directory structure creation
- Content discovery and referencing capabilities
- Cross-reference management between different content types

---
**Created**: 2024-08-29T04:08:00.000Z
# Initialize Claude Code Project with Self-Reference Capabilities

## Task

Set up this project with intelligent self-reference capabilities by creating project-specific Claude Code configuration and directory structure.

## Implementation Steps

### 1. Create or Update project CLAUDE.md file

**Important**: If `CLAUDE.md` already exists in the project:

- **Merge Strategy**: Improve and integrate existing sections while preserving valuable content
- **New Sections**: Add any missing sections at the end of the file
- **Preserve**: Keep any project-specific customizations and technical specifications

Create or update `CLAUDE.md` file in the project root with the following content, customizing it for this specific project:

====================== BEGIN CLAUDE.md CONTENT ======================

# Project Context for Claude Code

## Project Overview

[Analyze the current project and describe: project type, main purpose, key features]

## Architecture & Tech Stack

- **Language**: [Identify primary language from package.json/files]
- **Framework**: [Detect framework from dependencies] with major version if necessary
- **Key Dependencies**: [List important libraries from package.json] with major version if necessary

## Development Guidelines

- **Code Style**: [Infer from existing code patterns and configs]
- **Testing Strategy**: [Check for test files and testing frameworks]
- **Documentation**: [Observe documentation patterns]

## Project Structure

[Analyze and document the key directories and their purposes]

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
npx cc-self-refer pattern list                # List all patterns
npx cc-self-refer pattern view <id>           # Load specific pattern
```

### Usage Workflow

**Agent Task Flow:**

1. Search for relevant context: `npx cc-self-refer <type> search "keyword"`
2. Load existing content: `npx cc-self-refer <type> view <id>`
3. Work with full project context
4. Create new entries: `npx cc-self-refer <type> create "title" "description"`

====================== END CLAUDE.md CONTENT ======================

### 2. Analyze and Initialize Specification Repository and Patterns

**Important**: Instead of manually adding technical specifications and code patterns to CLAUDE.md, analyze the project and use the CLI commands to populate the spec and pattern directories:

#### Technical Specification Analysis

After analyzing the project's technical requirements and specifications, read `.claude/commands/spec.md` and apply it's usage

#### Code Pattern Analysis

After identifying reusable code patterns and architectural decisions: , read `.claude/commands/pattern-create.md` and apply it's usage

### 3. Ensure .claude directory structure exists

Verify the following directories exist (create if missing):

- `.claude/pages/` - For session history
- `.claude/plans/` - For strategic planning documents
- `.claude/patterns/` - For reusable code patterns
- `.claude/specs/` - For technical specification repository
- `.claude/commands/` - For Claude Code commands

## Quick Reference

After running this initialization, your project will have the `.claude/` directory with all necessary commands and structure for intelligent self-reference capabilities.

## Success Criteria

After completion:

- `CLAUDE.md` exists with project-specific context
- `.claude/` directory structure is ready with all commands
- Self-referential development system ready for intelligent, context-aware sessions
- Team can build and share specifications incrementally across development cycles

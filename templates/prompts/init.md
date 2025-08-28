# Initialize Claude Code Project with Self-Reference Capabilities

## Task

Set up this project with intelligent self-reference capabilities by creating project-specific Claude Code configuration and directory structure.

## Implementation Steps

### 1. Create or Update project CLAUDE.md file

**Important**: If `CLAUDE.md` already exists in the project:

- **Merge Strategy**: Improve and integrate existing sections while preserving valuable content
- **New Sections**: Add any missing sections at the end of the file
- **Preserve**: Keep any project-specific customizations and domain knowledge

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

## Domain Knowledge

[If this is a domain-specific project, document relevant business logic or constraints]

## Code Patterns & Conventions

[Observe and document coding patterns, naming conventions, and architectural decisions used in this project]

## cc-self-refer System

This project uses cc-self-refer for intelligent self-reference capabilities. Claude Code agents should use these CLI commands to access and manage project context automatically:

```bash
# IMPORTANT: Claude Code agents should use these commands proactively
# Search and access existing content before starting tasks
npx cc-self-refer plan search "keyword"       # Find relevant plans
npx cc-self-refer knowledge search "topic"    # Find domain knowledge
npx cc-self-refer pattern search "keyword"    # Find reusable patterns
npx cc-self-refer page search "session"       # Find previous sessions

# List and view specific content
npx cc-self-refer plan list                   # List all plans
npx cc-self-refer plan view <id>              # Load specific plan
npx cc-self-refer knowledge list              # List all knowledge
npx cc-self-refer knowledge view <id>         # Load specific knowledge
npx cc-self-refer pattern list                # List all patterns
npx cc-self-refer pattern view <id>           # Load specific pattern
npx cc-self-refer page list                   # List all sessions
npx cc-self-refer page view <id>              # Load session context

# Create new content when discovering valuable information
npx cc-self-refer plan create "title" "desc"      # Create strategic plans
npx cc-self-refer knowledge create "title" "desc" # Document domain knowledge
npx cc-self-refer pattern create "title" "desc"   # Save reusable patterns
npx cc-self-refer page save "title" "desc"      # Save session context
```

**Agent Guidelines:**

- Search for relevant context before starting tasks
- Use existing knowledge, patterns, and plans for implementation
- Create entries when discovering valuable insights

.claude/
├── pages/ # Session History  
├── plans/ # Strategic Plans
├── patterns/ # Code Templates
└── knowledges/ # Domain Knowledge

### Usage Workflow

**Agent Task Flow:**

1. Search for relevant context: `npx cc-self-refer <type> search "keyword"`
2. Load existing content: `npx cc-self-refer <type> view <id>`
3. Work with full project context
4. Create new entries: `npx cc-self-refer <type> create "title" "description"`

====================== END CLAUDE.md CONTENT ======================

### 2. Analyze and Initialize Knowledge Base and Patterns

**Important**: Instead of manually adding domain knowledge and code patterns to CLAUDE.md, analyze the project and use the CLI commands to populate the knowledge and pattern directories:

#### Domain Knowledge Analysis

After analyzing the project's business logic, or knowledge, read `.claude/commands/knowledge-create.md` and apply it's usage

#### Code Pattern Analysis

After identifying reusable code patterns and architectural decisions: , read `.claude/commands/pattern-create.md` and apply it's usage

### 3. Ensure .claude directory structure exists

Verify the following directories exist (create if missing):

- `.claude/pages/` - For session history
- `.claude/plans/` - For strategic planning documents
- `.claude/patterns/` - For reusable code patterns
- `.claude/knowledges/` - For domain knowledge base
- `.claude/commands/` - For Claude Code commands

## Quick Reference

After running this initialization, your project will have the `.claude/` directory with all necessary commands and structure for intelligent self-reference capabilities.

## Success Criteria

After completion:

- `CLAUDE.md` exists with project-specific context
- `.claude/` directory structure is ready with all commands
- Self-referential development system ready for intelligent, context-aware sessions
- Team can build and share knowledge incrementally across development cycles

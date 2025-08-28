# Init Claude - Initialize Project with Self-Reference Commands

**Usage**: `/init-claude`

## Implementation

Initialize this project with cc-self-refer capabilities and create project-specific Claude Code configuration.

### 1. Run cc-self-refer initialization

```bash
npx -y cc-self-refer init
```

This automatically creates the directory structure and downloads command templates.

### 2. Create/Update project CLAUDE.md

Create or update the project's `CLAUDE.md` file with project-specific instructions:

```markdown
# Project Context for Claude Code

## Project Overview
This is a [describe project type] that [main purpose and key features].

## Architecture & Tech Stack
- **Language**: [Primary language - e.g., TypeScript, Python]
- **Framework**: [Main framework if applicable]
- **Key Dependencies**: [Important libraries/tools used]
- **Build System**: [Build tool - e.g., Vite, pnpm, etc.]

## Development Guidelines
- **Code Style**: [Coding standards and formatting preferences]
- **Testing Strategy**: [Testing approach and tools]
- **Documentation**: [Documentation standards and practices]

## Project Structure
- `src/` - [Describe source code organization]
- `[key-directory]/` - [Purpose of important directories]

## Important Commands
- **Dev**: `[development command]`
- **Build**: `[build command]` 
- **Test**: `[test command]`
- **Lint**: `[linting command]`

## Domain Knowledge
[Any business logic, constraints, or domain-specific information that Claude should understand about this project]

## Code Patterns & Conventions
[Document frequently used patterns, architectural decisions, and coding conventions specific to this project]

## Dependencies & Tools
[List and explain key dependencies, their purposes, and any important configuration details]
```

### 3. Verify setup

Check that all components are properly installed:

```bash
ls -la .claude/
echo "✅ Project initialized with cc-self-refer capabilities"
echo "📋 Available commands: /page, /plan, /refer-page, /refer-knowledge, /use-code-pattern, /code-pattern"
```

## Result

After completion:
- Project has complete `.claude/` directory structure
- All cc-self-refer commands are available
- `CLAUDE.md` provides project-specific context
- Ready for intelligent, context-aware development sessions

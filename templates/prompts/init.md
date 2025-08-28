# Initialize Claude Code Project with Self-Reference Capabilities

## Task

Set up this project with intelligent self-reference capabilities by creating project-specific Claude Code configuration and directory structure.

## Implementation Steps

### 1. Create project CLAUDE.md file

Create a `CLAUDE.md` file in the project root with the following template, customizing it for this specific project:

```markdown
# Project Context for Claude Code

## Project Overview
[Analyze the current project and describe: project type, main purpose, key features]

## Architecture & Tech Stack
- **Language**: [Identify primary language from package.json/files]
- **Framework**: [Detect framework from dependencies]
- **Key Dependencies**: [List important libraries from package.json]
- **Build System**: [Identify build tool - check scripts in package.json]

## Development Guidelines
- **Code Style**: [Infer from existing code patterns and configs]
- **Testing Strategy**: [Check for test files and testing frameworks]
- **Documentation**: [Observe documentation patterns]

## Project Structure
[Analyze and document the key directories and their purposes]

## Important Commands
[Extract key commands from package.json scripts]

## Domain Knowledge
[If this is a domain-specific project, document relevant business logic or constraints]

## Code Patterns & Conventions
[Observe and document coding patterns, naming conventions, and architectural decisions used in this project]
```

### 2. Ensure .claude directory structure exists

Verify the following directories exist (create if missing):
- `.claude/pages/` - For session history
- `.claude/plans/` - For strategic planning documents  
- `.claude/code-patterns/` - For reusable code patterns
- `.claude/knowledge/` - For domain knowledge base
- `.claude/commands/` - For Claude Code commands

### 3. Configure .gitignore properly

If the project has a `.gitignore` file, add only temporary/cache files to .gitignore:

```gitignore
# Add these to .gitignore (temporary files only)
.claude/.cache/
.claude/temp/
.claude/*.tmp

# DO NOT add these to .gitignore (keep for team sharing):
# .claude/commands/     - Team needs shared commands
# .claude/plans/        - Strategic plans should be versioned
# .claude/code-patterns/ - Patterns are valuable team assets
# .claude/knowledge/    - Domain knowledge must be shared
# .claude/pages/        - Session history provides project context
```

**Important**: Most `.claude/` content should be committed to version control because:
- **Commands** enable consistent team workflows
- **Plans** document strategic decisions  
- **Patterns** prevent code duplication across team
- **Knowledge** ensures domain understanding
- **Pages** provide development context and history

## cc-self-refer System Guide

### Understanding the .claude Directory Structure

After initialization, your project will have this structure:

```
.claude/
├── commands/           # 🎯 Claude Code Commands
│   ├── page.md        # Session management (/page)
│   ├── plan.md        # Strategic planning (/plan)  
│   ├── refer-page.md  # Load session context (/refer-page)
│   ├── refer-knowledge.md # Access domain knowledge (/refer-knowledge)
│   ├── use-code-pattern.md # Apply code patterns (/use-code-pattern)
│   └── code-pattern.md     # Save new patterns (/code-pattern)
│
├── pages/             # 📄 Session History & Context
│   └── [numbered session files like: 001-login-implementation.md]
│
├── plans/             # 📋 Strategic Plans & Architecture  
│   └── [numbered plan files like: 001-user-authentication.md]
│
├── code-patterns/     # 🧩 Reusable Code Templates
│   └── [numbered pattern files like: 001-react-hook-typescript.md]
│
└── knowledge/         # 🧠 Domain Knowledge Base
    └── [organized by category like: api/rate-limits.md, business/user-roles.md]
```

### How to Use Each Directory

#### 📄 `.claude/pages/` - Session History
- **Purpose**: Preserve development context between Claude sessions
- **When to use**: End of significant development sessions
- **Content**: Code changes, decisions made, problems solved, next steps
- **Command**: `/page create "Session Title" "Summary of what was accomplished"`

#### 📋 `.claude/plans/` - Strategic Planning  
- **Purpose**: High-level project planning and architecture decisions
- **When to use**: Before starting new features or major changes
- **Content**: Implementation phases, success criteria, technical decisions, risks
- **Command**: `/plan create "Feature Name" "Description of what this feature does"`

#### 🧩 `.claude/code-patterns/` - Reusable Templates
- **Purpose**: Project-specific code patterns and templates
- **When to use**: After implementing reusable solutions
- **Content**: Component templates, utility functions, configuration patterns
- **Command**: `/code-pattern` to save patterns; `/use-code-pattern` to apply them

#### 🧠 `.claude/knowledge/` - Domain Knowledge
- **Purpose**: Business logic, domain rules, and architectural constraints  
- **When to use**: Document domain-specific information that affects code decisions
- **Content**: Business rules, API limitations, performance requirements, compliance
- **Command**: `/refer-knowledge` to access existing knowledge

### Workflow Examples

#### Starting a New Feature
1. `/plan create "User Profile Feature" "Allow users to manage their profile information"`
2. Work on implementation with Claude
3. `/code-pattern` to save any reusable patterns discovered
4. `/page create "Profile Implementation Session" "Completed user profile CRUD with validation"`

#### Continuing Previous Work
1. `/refer-page "profile"` - Load previous session context
2. `/refer-knowledge "user permissions"` - Check domain constraints
3. Continue development with full context

#### Building Team Knowledge  
1. Document domain knowledge: manually create files in `.claude/knowledge/`
2. Save proven patterns: `/code-pattern` after successful implementations
3. Plan major features: `/plan create` before starting complex work

## Success Criteria

After completion:
- `CLAUDE.md` exists with project-specific context
- `.claude/` directory structure is ready with all commands
- Self-referential development system ready for intelligent, context-aware sessions
- Team can build and share knowledge incrementally across development cycles
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

...previous content or blank

# Self Reference Context Management System (cc-self-refer cli and context storage project sturcture)

This project uses `cc-self-refer` for intelligent self-reference capabilities.
Claude Code agents should use these CLI commands to access and manage project context automatically:

## Keyword Detection and Command Intent Recognition

**When users use natural language prompts, agents should READ the corresponding command documentation and EXECUTE the instructions within:**

**CRITICAL: Always monitor for these keywords in user prompts regardless of language:**
- **spec**
- **pattern**
- **page**
- **plan**

When these keywords appear in user prompts, determine if the user intends to use the corresponding cc-self-refer commands below.

**Response Format for Self-Reference Actions**: If you determine that the user's natural language prompt requires using cc-self-refer functionality, prefix your response with `Self Refering... ♦️` to indicate self-reference action execution.

### Specification (spec) Commands
- "use spec" / "refer to spec" / "check specifications" → **Read and execute** `.claude/commands/spec-refer.md`
- "use spec #3" / "refer to spec 003" → **Read and execute** `.claude/commands/spec-refer.md` with specific ID
- "find API spec" / "search authentication spec" → **Read and execute** `.claude/commands/spec-refer.md` for search

### Pattern Commands
- "use pattern" / "apply pattern" / "use existing patterns" → **Read and execute** `.claude/commands/pattern-use.md`
- "create pattern" / "save as pattern" → **Read and execute** `.claude/commands/pattern-create.md`
- "find Redux pattern" / "search API patterns" → **Read and execute** `.claude/commands/pattern-use.md` for search
- "use pattern #5" / "apply pattern 005" → **Read and execute** `.claude/commands/pattern-use.md` with specific ID

### Page Commands
- "refer to previous conversation" / "check pages" → **Read and execute** `.claude/commands/page-refer.md`
- "yesterday's work" / "recent sessions" → **Read and execute** `.claude/commands/page-refer.md` for list

### Plan Commands
- "check plan" / "show plans" / "review planning" → **Read and execute** `.claude/commands/plan-resolve.md`
- "create plan" / "make a plan" → **Read and execute** `.claude/commands/plan-create.md`
- "edit plan" / "modify plan" → **Read and execute** `.claude/commands/plan-edit.md`
- "refactoring plan" / "migration plan" → **Read and execute** `.claude/commands/plan-resolve.md` for specific plans

**IMPORTANT Agent Behavior:**
1. **Identify** the user's intent from natural language
2. **Read** the appropriate `.claude/commands/*.md` file
3. **Execute** all instructions and commands specified in that file
4. **Use** the retrieved context to complete the user's request
5. **Follow** the exact workflow described in the command documentation

====================== END CLAUDE.md CONTENT ======================

### 2. Analyze and Initialize Specification Repository and Patterns

**Important**: Instead of manually adding technical specifications and code patterns to CLAUDE.md, analyze the project and use the CLI commands to populate the spec and pattern directories:

#### Project Specification Analysis & Extraction

After analyzing the project's business requirements, user experience needs, and technical architecture, read `.claude/commands/spec.md` and apply it's usage

#### Code Pattern Analysis & Extraction

After identifying reusable code patterns and architectural decisions: , read `.claude/commands/pattern-create.md` and apply it's usage

### 3. Ensure .claude directory structure exists

Verify the following directories exist (create if missing):

- `.claude/pages/` - For session history
- `.claude/plans/` - For strategic planning documents
- `.claude/patterns/` - For reusable code patterns
- `.claude/specs/` - For project specification repository
- `.claude/commands/` - For Claude Code commands

## Quick Reference

After running this initialization, your project will have the `.claude/` directory with all necessary commands and structure for intelligent self-reference capabilities.

## Success Criteria

After completion:

- `CLAUDE.md` exists with project-specific context
- `.claude/` directory structure is ready with all commands
- Self-referential development system ready for intelligent, context-aware sessions
- Team can build and share specifications incrementally across development cycles

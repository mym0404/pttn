# Initialize Claude Code Project with Self-Reference Capabilities

## Task

Set up this project with intelligent self-reference capabilities by creating project-specific Claude Code configuration and directory structure.

## Implementation Steps

### 1. Create or Update project agent prompt file

**Important**: Determine the active agent via `.claude/self-refer.json` (default `CLAUDE.md`). If the file already exists in the project:

- **Merge Strategy**: Improve and integrate existing sections while preserving valuable content
- **New Sections**: Add any missing sections at the end of the file
- **Preserve**: Keep any project-specific customizations and technical specifications

Create or update the selected agent prompt file in the project root with the following content, customizing it for this specific project:

====================== BEGIN PROMPT CONTENT ======================

...previous content or blank

# Self Reference Context Management System (cc-self-refer cli and context storage project sturcture)

This project uses `cc-self-refer` for intelligent self-reference capabilities.
Claude Code agents should use these CLI commands to access and manage project context automatically:

## Pattern List Table

[PATTERN LIST]

[PATTERN LIST END]

## Pattern Commands

### Pattern Matching Intelligence
**CRITICAL**: The active agent prompt context includes a [PATTERN LIST] table already with columns: ID, Name, Language, Keywords, Explanation. You should know what I mean.

**When processing ANY user request**, check if the request matches patterns in the [PATTERN LIST] by analyzing:
- **Name**: Direct pattern name matches
- **Keywords**: Related terms and concepts
- **Explanation**: Functional descriptions and use cases
- **Language**: Technology stack alignment

### Pattern Usage Workflows

**Explicit Pattern Requests:**
Pay special attention to the word "pattern" in user requests - this often indicates they want to use stored patterns.
- "use pattern" / "apply pattern X" / "use existing patterns"
- "find pattern for X" / "search patterns"
- "use pattern #5" / "apply pattern 005"

**Implicit Pattern Matching:**
When user requests involve coding tasks that align with existing pattern Names, Keywords, or Explanations:

1. **Identify Match**: Compare user's request against the [PATTERN LIST]. If no matching patterns are found, read the agent prompt file directly to get the updated pattern list
2. **Retrieve Pattern**: Use `npx cc-self-refer pattern view <id>` for matching patterns
3. **Apply Pattern**: Implement user's request using the pattern's principles and structure
4. **Inform User**: Use this format to indicate pattern usage:
   ```
   Pattern Refering... ♦️ 
   Used Patterns: #002 api-response, #003 error-handling
   ```

**Example Matching Logic:**
- "implement todo api" → Extract keywords: "api", "todo" → Match patterns containing these terms
- "create table component" → Extract keywords: "table", "component" → Match patterns with "table", "markdown", "component"
- "setup testing" → Extract keywords: "test", "setup" → Match patterns with "test", "example"
- "build React form" → Extract keywords: "react", "form" → Match patterns with "react", "form", "validation"
- "add authentication" → Extract keywords: "auth", "authentication" → Match patterns with "auth", "login", "security"
- "database connection" → Extract keywords: "database", "connection" → Match patterns with "db", "connection", "orm"
- "error handling" → Extract keywords: "error", "handling" → Match patterns with "error", "exception", "validation"

**IMPORTANT Agent Behavior:**
1. **Scan** [PATTERN LIST] for relevant matches during any coding request
2. **Retrieve** matching patterns using `npx cc-self-refer pattern view <id>`
3. **Apply** pattern principles to implement user's actual requirements

## Guide List

Guides are project-specific coding guidelines and best practices that should be followed when working on this project. They provide concrete, actionable recommendations for consistent code development.

[GUIDE LIST]

[GUIDE LIST END]

====================== END PROMPT CONTENT ======================


### 2. Analyze and Initialize Patterns

**Important**: Instead of manually adding technical specifications and code patterns to CLAUDE.md, analyze the project and use the CLI commands to populate the pattern directories:

#### Code Pattern Analysis & Extraction

After identifying reusable code patterns and architectural decisions: , read `.claude/commands/pattern-create.md` and apply it's usage

### 3. Run PATTERN LIST table sync command

```bash
npx cc-self-refer pattern sync
```

This command updates the active agent prompt file (e.g., `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`) based on `.claude/self-refer.json`.
### 4. Ensure .claude directory structure exists

Verify the following directories exist (create if missing):

- `.claude/pages/` - For session history
- `.claude/plans/` - For strategic planning documents
- `.claude/patterns/` - For reusable code patterns
- `.claude/specs/` - For project specification repository
- `.claude/commands/` - For Claude Code commands
- `.claude/self-refer.json` - For agent prompt selection

## Quick Reference

After running this initialization, your project will have the `.claude/` directory with all necessary commands and structure for intelligent self-reference capabilities.

## Success Criteria

After completion:

- Active agent prompt file exists with project-specific context
- `.claude/self-refer.json` defines the current agent
- `.claude/` directory structure is ready with all commands
- Self-referential development system ready for intelligent, context-aware sessions
- Team can build and share specifications incrementally across development cycles

# Use Code Pattern - Apply Saved Code Patterns

Retrieve and apply code patterns from `.claude/patterns/` directory by number or keyword search.

**Usage**: `/pattern-use <number|keyword>`

## Purpose

This command retrieves saved code patterns and makes them immediately available for use in development. It helps maintain consistent coding practices and speeds up implementation by reusing proven patterns.

## What does this command do

### ⚠️ IMPORTANT: CLI Command Execution Required

**This command MUST execute the following `cc-self-refer` CLI commands. Do NOT implement the functionality directly.**

### CLI Commands Used

```bash
# Search for patterns first
npx -y cc-self-refer pattern search <keyword>
npx -y cc-self-refer pattern search <keyword> --language <lang>

# View specific pattern
npx -y cc-self-refer pattern view <id_or_keyword>

# List all patterns
npx -y cc-self-refer pattern list
```

### Command Arguments
- `id_or_keyword`: Pattern ID number or search keyword  
- `language`: Optional language filter for search
- Output automatically formatted for AI consumption with code examples

### Expected Workflow
1. Search for relevant patterns using `pattern search`
2. View specific pattern using `pattern view`
3. Pattern content is displayed ready for use in development

### Search Process

The CLI tool handles:

- **Directory Management**: Automatically checks `.claude/patterns/` directory
- **Smart Matching**: Supports both exact number matches and keyword searches
- **Language Filtering**: Filter patterns by programming language
- **Content Analysis**: Searches in filenames and pattern content
- **Relevance Scoring**: Returns results ranked by relevance score

### 3. Output Format

**Single Match Found**:

````markdown
# Code Pattern: [Pattern Name]

## Pattern: `.claude/patterns/[filename]`

[Display pattern description]

## Ready-to-Use Code

```[language]
[Main code example with syntax highlighting]
```
````

## Usage Instructions

[Step-by-step usage guidelines]

## Customization Notes

[How to adapt this pattern for current context]

---

**Pattern loaded and ready for implementation**

````

**Multiple Matches**:
```markdown
# Code Patterns Found for "[search term]"

## Matching Patterns:

### 1. **[Pattern 1]** (`.claude/patterns/2-pattern-name.md`)
```[language]
[Code snippet preview]
````

_[Brief description]_

### 2. **[Pattern 2]** (`.claude/patterns/4-another-pattern.md`)

```[language]
[Code snippet preview]
```

_[Brief description]_

**Select Pattern**: `/pattern-use <number>` to load specific pattern

````

**No Matches**:
```markdown
# No Code Patterns Found

No patterns found for "[search term]".

## Available Patterns:
1. **[Pattern 1]** - [Brief description]
2. **[Pattern 2]** - [Brief description]
3. **[Pattern 3]** - [Brief description]

**Usage**: `/pattern-use <number>` or try different keywords
**Create New**: `/pattern-create <description>` to save new pattern
````

### 4. Enhanced Features

- **Code Extraction**: Extract just the code portions for easy copy-paste
- **Context Integration**: Adapt patterns to current file/component context
- **Dependency Check**: Verify required libraries are available in project
- **Pattern Suggestion**: Suggest related patterns that might be useful

## Usage Examples

### List All Patterns

```bash
npx -y cc-self-refer pattern list
```

Shows all available code patterns with languages and dates

### Search by Technology

```bash
npx -y cc-self-refer pattern search "tailwind"
```

Finds all TailwindCSS-related patterns

### Search by Feature

```bash
npx -y cc-self-refer pattern search "authentication"
```

Searches for auth-related code patterns

### Search by Language

```bash
npx -y cc-self-refer pattern search "hook" --language typescript
```

Finds TypeScript hooks patterns specifically

## Integration with Development

### During Implementation

- Quickly access proven code patterns
- Copy-paste reliable code snippets
- Follow established project conventions
- Reduce implementation time and errors

### Code Review

- Reference patterns when reviewing code
- Ensure consistency with established practices
- Suggest pattern usage for repetitive code

### Refactoring

- Identify opportunities to apply existing patterns
- Replace ad-hoc implementations with proven patterns
- Improve code maintainability and consistency

## Error Handling

- **Directory Missing**: Suggest running `/init-claude` first
- **No Patterns**: Guide user to create patterns with `/pattern-create` command
- **File Access Issues**: Report permission problems clearly
- **Invalid Pattern Files**: Handle corrupted markdown gracefully

## Performance Considerations

- Fast pattern lookup by number
- Efficient keyword search across pattern library
- Minimal file I/O for common operations
- Cached pattern summaries for quick browsing

This command transforms saved code patterns into immediately usable development assets, ensuring consistency and accelerating implementation across the project.

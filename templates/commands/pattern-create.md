# Code Pattern - Save Reusable Code Patterns

Save code patterns and implementation examples to `.claude/patterns/` directory with automatic numbering.

**Usage**:

- `/pattern-create <pattern name>` - Interactive mode: Claude will ask for pattern content
- `/pattern-create <pattern name> <code snippet>` - Direct mode: Create pattern with provided snippet

## Purpose

This command saves reusable code patterns, common implementations, and project-specific coding practices. These patterns serve as quick references and templates for consistent code implementation across the project.

## Implementation

Execute the `cc-self-refer` CLI tool's pattern creation functionality:

```bash
npx -y cc-self-refer pattern create "<pattern name>" "<pattern content>"
```

### CLI Usage Process

#### Interactive Mode (Pattern Name Only)

1. **Ask for Pattern Name**: Request a clear, descriptive name for the pattern
2. **Collect Pattern Content**: Gather the complete pattern documentation including:
   - Pattern description
   - Code examples with proper syntax highlighting
   - Usage instructions
   - When to use this pattern
   - Implementation notes
3. **Execute CLI Command**: Run the pattern create command with the collected information

#### Direct Mode (Pattern Name + Code Snippet)

1. **Extract Pattern Name**: Use the provided pattern name
2. **Process Code Snippet**: Enhance the provided code snippet with:
   - Proper markdown formatting
   - Code syntax highlighting
   - Brief explanation or context
   - Usage notes if applicable
3. **Execute CLI Command**: Run the pattern create command with formatted content

### Pattern Content Structure

When creating pattern content, include:

````markdown
# <Pattern Name>

## Pattern Description

[Brief description of what this pattern solves or achieves]

## Implementation

```[language]
// Main implementation example
[code snippet with comments]
```

## Usage Example

```[language]
// How to use this pattern
[example code]
```

## When to Use

- [Use case n]
````

### 4. Content Enhancement

When saving patterns:

1. **Code Analysis**:
   - Extract meaningful patterns from provided code snippets
   - Add explanatory comments to complex parts
   - Suggest alternative implementations if appropriate

2. **Context Integration**:
   - Relate pattern to current project's tech stack
   - Include project-specific considerations
   - Reference existing similar patterns in the codebase

3. **Pattern Categorization**:
   - Identify pattern type (UI, API, state management, etc.)
   - Tag with relevant technologies (React, TailwindCSS, etc.)
   - Cross-reference with related patterns

## Usage Examples

### Save UI Pattern

When user requests:

```bash
/pattern-create "Dark Mode Toggle Component"
```

Claude will:

1. Ask for the pattern content (implementation details, code examples)
2. Execute: `npx -y cc-self-refer pattern create "Dark Mode Toggle Component" "<collected content>"`
3. Creates: `.claude/patterns/001-dark-mode-toggle-component.md`

### Save API Pattern

When user requests:

```bash
/pattern-create "Error Handling with Tanstack Query"
```

Claude will:

1. Collect the pattern implementation and examples
2. Execute: `npx -y cc-self-refer pattern create "Error Handling with Tanstack Query" "<collected content>"`
3. Creates: `.claude/patterns/002-error-handling-with-tanstack-query.md`

### Save Code Snippet Pattern (Interactive Mode)

When user provides a code pattern:

```bash
/pattern-create "Async Form Submit Pattern"
```

Claude will:

1. Ask for or collect the pattern code and documentation
2. Format the content with proper markdown and code blocks
3. Execute: `npx -y cc-self-refer pattern create "Async Form Submit Pattern" "<formatted content>"`
4. Creates: `.claude/patterns/003-async-form-submit-pattern.md`

### Save Code Snippet Pattern (Direct Mode)

When user provides both name and code:

```bash
/pattern-create "Button Click Handler" const handleClick = (e) => { e.preventDefault(); console.log('clicked'); };
```

Claude will:

1. Extract the pattern name and code snippet
2. Format the code snippet with proper markdown structure
3. Execute: `npx -y cc-self-refer pattern create "Button Click Handler" "<formatted snippet>"`
4. Creates: `.claude/patterns/004-button-click-handler.md`

## Directory Management

- Ensure `.claude/patterns/` directory exists (create if needed)
- Patterns are numbered sequentially for easy reference
- Pattern files include:
  - Actual runnable code examples
  - Context about when and how to use
  - Project-specific adaptations
  - Cross-references to related content

## Integration Benefits

Patterns created with this command:

- Provide consistent coding approaches across the project
- Serve as quick copy-paste templates
- Document project-specific best practices
- Enable faster development through pattern reuse
- Create a searchable library of proven solutions

This command helps maintain coding consistency and accelerates development by preserving effective patterns and practices.

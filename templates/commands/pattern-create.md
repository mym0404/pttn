# Code Pattern - Save Reusable Code Patterns

Save code patterns and implementation examples to `.claude/patterns/` directory with automatic numbering.

**Usage**: `/pattern-create <code snippets or explanation>`

## Purpose

This command saves reusable code patterns, common implementations, and project-specific coding practices. These patterns serve as quick references and templates for consistent code implementation across the project.

## Implementation

### 1. Pattern Number Detection

- Check existing files in `.claude/patterns/` directory
- Find the highest numbered pattern file
- Auto-increment to create next pattern number
- If no patterns exist, start with pattern number 1

### 2. Pattern File Creation

- Create file in format: `.claude/patterns/<number>-<sanitized-name>.md`
- Sanitize the pattern name for filename (lowercase, hyphens for spaces, remove special chars)
- Auto-generate name from first few words if not explicitly provided
- Example: `/pattern-create dark mode tailwind colors` → `.claude/patterns/3-dark-mode-tailwind-colors.md`

### 3. Pattern Content Structure

Generate pattern document with following structure:

````markdown
# <Number>. <Pattern Name>

## Pattern Description

[Brief description of what this pattern solves or achieves]

## When to Use

- [Scenario 1 when this pattern is useful]
- [Scenario 2 when this pattern applies]
- [Context where this pattern should be preferred]

## Implementation

### Code Example

```[language]
// Main implementation example
[code snippet with comments]
```
````

### Variations

```[language]
// Alternative approach 1
[code snippet]
```

```[language]
// Alternative approach 2 (if applicable)
[code snippet]
```

## Usage Notes

- ✅ **Do**: [Best practice 1]
- ✅ **Do**: [Best practice 2]
- ❌ **Don't**: [Anti-pattern to avoid]
- ❌ **Don't**: [Common mistake]

## Related Patterns

- [Reference to other related patterns if any]
- [Cross-references to knowledge base items if relevant]

## Examples in Project

- [File reference where this pattern is used: file.js:45]
- [Another usage example: component.tsx:122]

## Dependencies

- [Required libraries or frameworks]
- [Configuration requirements]
- [Environment setup needed]

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
```bash
/pattern-create dark mode button with tailwind
````

Creates: `.claude/patterns/4-dark-mode-button-tailwind.md`

### Save API Pattern

```bash
/pattern-create tanstack query with error handling
```

Creates: `.claude/patterns/5-tanstack-query-error-handling.md`

### Save Code Snippet

```bash
/pattern-create const handleSubmit = async (data) => {
  try {
    await mutate(data);
  } catch (error) {
    toast.error(error.message);
  }
}
```

Creates: `.claude/patterns/6-form-submit-pattern.md`

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

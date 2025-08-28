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

1. **Ask for Pattern Name**: Request a clear pattern name
2. **Collect Pattern Content**: Gather simple code snippet (ready-to-use code)
3. **Execute CLI Command**: Run the pattern create command

#### Direct Mode (Pattern Name + Code Snippet)

1. **Extract Pattern Name**: Use the provided pattern name
2. **Process Code Snippet**: Apply minimal markdown formatting (wrap in code block)
3. **Execute CLI Command**: Run the pattern create command

### Pattern Content Structure

Patterns should be simple code snippets:

````markdown
# <Pattern Name>

```[language]
// Code snippet
[Ready-to-use code]
```

[Brief description if needed]
````

Example:

````markdown
# Zod Model Creation Pattern

```typescript
import { z } from 'zod';
import { baseModelSchema } from './Base';

export const soldierBasicInfoSchema = baseModelSchema.extend({
  name: z.string().min(1),
  rank: z.string(),
  // Additional fields...
});

export type SoldierBasicInfo = z.infer<typeof soldierBasicInfoSchema>;
```
````

### Content Guidelines

When creating patterns:
- Focus on ready-to-use code snippets
- Avoid excessive documentation
- Add minimal comments only when necessary
- Code should be copy-paste ready

## Usage Examples

### Save Pattern Examples

When user requests:

```bash
/pattern-create "API Error Handler"
```

Claude will:

1. Collect simple code snippet
2. Execute: `npx -y cc-self-refer pattern create "API Error Handler" "<code snippet>"`
3. Creates: `.claude/patterns/001-api-error-handler.md`

### Save Code Snippet Pattern

When user requests:

```bash
/pattern-create "React Hook Pattern"
```

Claude will:

1. Collect simple code snippet
2. Execute: `npx -y cc-self-refer pattern create "React Hook Pattern" "<code snippet>"`
3. Creates: `.claude/patterns/003-react-hook-pattern.md`

## Directory Management

- Ensure `.claude/patterns/` directory exists (create if needed)
- Patterns are numbered sequentially for easy reference
- Pattern files contain runnable code snippets

## Integration Benefits

Patterns created with this command:

- Quick copy-paste templates for common code patterns
- Reusable code snippets for faster development
- Consistent coding approaches across the project

This command helps save and reuse common code patterns efficiently.

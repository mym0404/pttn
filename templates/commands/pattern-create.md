# Code Pattern - Save Reusable Code Patterns

Save code patterns and implementation examples to `.claude/patterns/` directory with automatic numbering.

**Usage**:

- `/pattern-create <pattern name>` - Interactive mode: Claude will ask for pattern content
- `/pattern-create <pattern name> <code snippet>` - Direct mode: Create pattern with provided snippet

## Purpose

This command saves reusable code patterns, common implementations, and project-specific coding practices. These patterns serve as quick references and templates for consistent code implementation across the project.

## What does this command do

### ⚠️ IMPORTANT: CLI Command Execution Required

**This command MUST execute the following `cc-self-refer` CLI command.**

### CLI Command Used

```bash
npx -y cc-self-refer pattern create "<pattern-name>" "<pattern-content>" --language <language>
```

### Command Arguments
- `pattern-name`: Name of the code pattern
- `pattern-content`: Complete code snippet or pattern content
- `language`: Programming language (optional, defaults to "text")

### Expected Output
- Creates numbered pattern file in `.claude/patterns/`
- Returns pattern filename for reference
- Automatically adds metadata and formatting

### CLI Usage Process

#### Interactive Mode (Pattern Name Only)

1. **Ask for Pattern Name**: Request a clear pattern name
2. **Collect Pattern Content**: 
   - Ask for **practical usage code** (how it's actually used)
   - Focus on real-world usage snippets
   - Keep it concise and ready to copy-paste
3. **Format Content**: Structure the content with usage-only focus:
   ```markdown
   ## Usage
   [Direct, practical code snippet showing how to use]
   
   ## When to Use
   [Brief scenarios where this applies]
   ```
4. **Execute CLI Command**: Run the pattern create command with formatted content

#### Direct Mode (Pattern Name + Code Snippet)

1. **Extract Pattern Name**: Use the provided pattern name
2. **Process Code Snippet**: 
   - Keep it simple and usage-focused
   - Format as:
     ```markdown
     ## Usage
     [Provided code as-is or with minimal context]
     
     ## When to Use
     - [Brief use cases]
     ```
3. **Execute CLI Command**: Run the pattern create command with formatted content

### Pattern Content Structure

Patterns should be **concise usage snippets** ready to copy-paste:

````markdown
# <Pattern Name>

## Usage

```[language]
// Direct usage example
[Actual code snippet as used in practice]
```

## When to Use

- [Brief scenario 1]
- [Brief scenario 2]
````

Example:

````markdown
# Zod Schema Validation

## Usage

```typescript
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  age: z.number().min(18, "Must be 18 or older")
}).strict();

// Validate user input
const result = userSchema.safeParse(userData);
if (!result.success) {
  console.error(result.error.format());
  return;
}
// Use result.data safely
```

## When to Use

- Validating API request bodies
- Form data validation
- Type-safe data parsing
````

### Content Guidelines

When creating patterns:
- **Just show the usage code** - no separate pattern definitions
- Keep it **concise and practical**
- Code should be **immediately usable**
- Minimal explanation, maximum utility

## Usage Examples

### Save Pattern Examples

When user requests:

```bash
/pattern-create "API Error Handler"
```

Claude will:

1. Ask: "Show me the actual code snippet for API error handling"
2. Format content simply:
   ```markdown
   ## Usage
   ```typescript
   app.post('/api/users', async (req, res) => {
     try {
       const user = await createUser(req.body);
       res.json(user);
     } catch (error) {
       const errorResponse = {
         success: false,
         error: error instanceof Error ? error.message : 'Unknown error',
         timestamp: new Date().toISOString()
       };
       console.error('[API Error]', error);
       res.status(500).json(errorResponse);
     }
   });
   ```
   
   ## When to Use
   - API endpoint error handling
   - Consistent error responses
   ```
3. Execute: `npx -y cc-self-refer pattern create "API Error Handler" "<formatted content>"`
4. Creates: `.claude/patterns/001-api-error-handler.md`

### Save Code Snippet Pattern

When user requests:

```bash
/pattern-create "React Custom Hook" "const useCounter = () => { ... }"
```

Claude will:

1. Transform provided code into simple usage format:
   ```markdown
   ## Usage
   ```typescript
   import { useState, useCallback } from 'react';
   
   const useCounter = (initialValue = 0) => {
     const [count, setCount] = useState(initialValue);
     const increment = useCallback(() => setCount(c => c + 1), []);
     const decrement = useCallback(() => setCount(c => c - 1), []);
     const reset = useCallback(() => setCount(initialValue), [initialValue]);
     return { count, increment, decrement, reset };
   };
   
   // Using in component
   function Counter() {
     const { count, increment, decrement, reset } = useCounter(0);
     return (
       <div>
         <p>Count: {count}</p>
         <button onClick={increment}>+</button>
         <button onClick={decrement}>-</button>
         <button onClick={reset}>Reset</button>
       </div>
     );
   }
   ```
   
   ## When to Use
   - Managing counter state
   - Reusable increment/decrement logic
   ```
2. Execute: `npx -y cc-self-refer pattern create "React Custom Hook" "<formatted content>"`
3. Creates: `.claude/patterns/002-react-custom-hook.md`

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

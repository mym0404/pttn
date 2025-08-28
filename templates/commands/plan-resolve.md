# Plan Resolve - Execute Strategic Plans and Mark Complete

Load a strategic plan, execute the implementation, and optionally delete upon completion.

**Usage**: `/plan-resolve <id|keyword>`

## Purpose

This command facilitates the execution of strategic plans by:
1. Loading the plan for reference
2. Guiding implementation work
3. Optionally deleting the plan after successful completion

## What does this command do

### ⚠️ IMPORTANT: CLI Command Execution Required

**This command MUST execute the following `cc-self-refer` CLI commands. Do NOT implement the functionality directly.**

### CLI Commands Used

```bash
# Step 1: Load the plan for implementation
npx -y cc-self-refer plan view <id_or_keyword> --context

# Step 2: After successful implementation, optionally delete
npx -y cc-self-refer plan delete <id_or_keyword> --context
```

### Command Arguments
- `id_or_keyword`: Plan ID number or search keyword
- `--context`: ALWAYS use this flag for AI-optimized output

### Expected Workflow
1. Load and display the plan content
2. Execute the implementation based on plan checklist
3. After completion, ask if plan should be deleted
4. If yes, delete the plan file

## Usage Examples

### View by Plan ID

```bash
/plan-resolve 3
```

### Search by Keyword

```bash
/plan-resolve authentication
```

### List All Plans

```bash
/plan-resolve
```

## Output Formats

### Single Match

```markdown
# Plan Loaded: [Title]

## File: `.claude/plans/[filename]`

[Full plan content displayed]

---

**Status**: [Current status]
**Created**: [Date]
**Last Updated**: [Date]
```

### Multiple Matches

```markdown
# Multiple Plans Found for "[keyword]"

1. **[Plan 1]** (`3-darkmode.md`)
   📝 Brief: [Excerpt]
2. **[Plan 2]** (`5-api-optimization.md`)
   📝 Brief: [Excerpt]

**Select**: `/plan-resolve <number>` to view specific plan
```

### No Matches

```markdown
# No Plans Found

No plans matching "[search term]".

## Available Plans:

1. **Dark Mode Implementation** - UI theme switching
2. **API Optimization** - Performance improvements
3. **Authentication System** - User authentication

**Usage**: `/plan-resolve <number|keyword>`
```

## Search Capabilities

### By ID Number

- Direct access using plan number (e.g., `1`, `3`, `15`)
- Fastest method for known plans
- Returns exact match

### By Keywords

- Searches plan titles and content
- Supports partial matches
- Case-insensitive search
- Returns relevance-sorted results

### By Content

- Full-text search within plan documents
- Finds plans containing specific terms
- Useful for cross-referencing related plans

## Plan Information Display

### Metadata

- Plan ID and title
- File location
- Creation and last updated dates
- Current status (Planning/In Progress/Completed)

### Content Sections

- Full plan structure with all sections
- Implementation checklists with progress
- Timeline and milestones
- Risk assessments and mitigation strategies

### Context Loading

When using `--context` flag:

- Optimizes content for AI processing
- Highlights actionable items
- Emphasizes current phase and next steps
- Includes relevant implementation guidance

## Use Cases

### Implementation Reference

```bash
/plan-resolve authentication
```

Load authentication plan before starting implementation work.

### Progress Review

```bash
/plan-resolve 3
```

Review current status and completed items.

### Cross-Plan Reference

```bash
/plan-resolve performance
```

Check related plans when working on optimization tasks.

### Planning Discovery

```bash
/plan-resolve
```

Browse all plans to understand project scope.

## Interactive Features

### Implementation Process

When executing a plan:

1. **Load Plan**: Display full plan content with checklist
2. **Execute Tasks**: Work through implementation checklist
3. **Track Progress**: Mark items as completed during work
4. **Completion Check**: Verify all critical items are done
5. **Cleanup Option**: Offer to delete completed plan

### Deletion Confirmation

After successful implementation:

```markdown
# Plan Implementation Complete

All tasks from the plan have been executed.

Would you like to delete this plan from .claude/plans/?
- This action is permanent
- Consider keeping if plan may be referenced later
```

## Integration Benefits

### Implementation Context

- Provides strategic background for development tasks
- Clarifies requirements and success criteria
- Shows relationship to other project components

### Decision Reference

- Access to original architectural decisions
- Context for technical choices
- Risk assessment and mitigation strategies

### Progress Tracking

- Clear view of completed vs remaining work
- Timeline and milestone awareness
- Dependencies and blocking factors

## Best Practices

1. **Regular Reference**: Check relevant plans before starting implementation
2. **Context Loading**: Use `--context` flag when working on plan-related tasks
3. **Keyword Search**: Use descriptive terms for faster plan discovery
4. **ID Bookmarking**: Remember frequently accessed plan IDs

## Error Handling

- **Invalid ID**: Shows available plan IDs
- **No Keyword Matches**: Suggests similar terms and lists available plans
- **File Access Issues**: Reports file system problems with resolution steps
- **Empty Plans Directory**: Guides user to create first plan

## Performance Notes

- **Fast ID Access**: Direct ID lookups are instantaneous
- **Efficient Search**: Keyword search uses optimized indexing
- **Context Processing**: `--context` flag adds minimal processing overhead
- **Batch Operations**: List operations are optimized for large plan collections

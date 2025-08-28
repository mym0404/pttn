# Plan Resolve - View and Load Strategic Plans

View, search, and load existing strategic planning documents for implementation reference.

**Usage**: `/plan-resolve <id|keyword>`

## Purpose

This command retrieves and displays strategic plans by utilizing the `cc-self-refer` CLI tool's plan viewing functionality.

## Implementation

Execute the `npx -y cc-self-refer plan view` command:

```bash
npx -y cc-self-refer plan view <id_or_keyword> --context
```

Examples:

```bash
npx -y cc-self-refer plan view 3 --context
npx -y cc-self-refer plan view "authentication" --context
npx -y cc-self-refer plan list  # List all plans
```

**Note**: The `--context` flag formats plan output for AI consumption with strategic insights and implementation guidance.

This will:

- Find and display the requested plan
- Show full plan content with formatting
- Load plan context for implementation reference

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

### Plan Selection

When multiple matches are found:

- Shows numbered list of candidates
- Displays brief excerpts for context
- Allows refined search or direct ID selection

### Content Navigation

For large plans:

- Structured section display
- Collapsible content sections
- Quick navigation to specific phases

### Status Awareness

- Highlights current phase or active section
- Shows completion status for checklist items
- Indicates recently updated sections

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

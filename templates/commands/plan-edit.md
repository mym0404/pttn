# Plan Edit - Modify Existing Strategic Plans

Edit and update existing strategic planning documents with targeted modifications.

**Usage**: `/plan-edit <id|keyword> <modification-guide>`

## Purpose

This command modifies existing strategic plans by utilizing the `cc-self-refer` CLI tool's plan editing functionality.

## Implementation

Execute the `npx -y cc-self-refer plan edit` command:

```bash
npx -y cc-self-refer plan edit <id_or_keyword> "Modification instructions"
```

Examples:

```bash
npx -y cc-self-refer plan edit 3 "Add authentication integration to Phase 2"
npx -y cc-self-refer plan edit "dark mode" "Update performance considerations"
```

This will:

- Find the plan by ID number or keyword search
- Apply modifications to the existing plan
- Update timestamp and add modification history
- Preserve original plan structure

## Usage Examples

### Edit by Plan Number

```bash
/plan-edit 3 "Add authentication integration task to Phase 2"
```

### Edit by Keyword Search

```bash
/plan-edit darkmode "Add CSS variable optimization to performance considerations"
```

### Major Revision

```bash
/plan-edit authentication "Change entire architecture from JWT to OAuth2"
```

## Modification Types

### Adding New Items

- Add tasks to specific phases
- Include new considerations
- Append additional resources
- Insert new milestones

### Updating Existing Content

- Modify technical approaches
- Update timelines and estimates
- Revise success criteria
- Change implementation strategies

### Structural Changes

- Reorganize phases
- Merge or split sections
- Update priority ordering
- Restructure workflow

## Interactive Clarifications

Claude will ask minimal questions focused on:

- Clarifying ambiguous edit instructions
- Confirming major structural changes
- Validating technical approach changes

### Example Questions

- "Which part of Phase 2 should we add authentication logic?"
- "Which aspects should performance optimization focus on?"
- "Should I check for any conflicts with existing architecture?"

## Edit Scope Guidelines

### Minor Edits (No Confirmation Needed)

- Adding single tasks or items
- Updating estimates or dates
- Adding references or resources
- Correcting typos or formatting

### Major Edits (Confirmation Required)

- Changing core architecture
- Removing entire phases
- Restructuring the plan
- Modifying success criteria significantly

## Error Handling

- **Plan Not Found**: Show available plans for selection
- **Ambiguous Keywords**: Display multiple matches for clarification
- **Invalid ID**: Suggest correct ID format or keyword search
- **Conflicting Changes**: Highlight conflicts and request resolution

## Best Practices

1. **Be Specific**: Provide clear, actionable modification instructions
2. **Maintain Structure**: Keep consistent formatting and organization
3. **Update Related Sections**: Consider impact on timelines, risks, and dependencies
4. **Review Changes**: Verify modifications align with overall plan objectives

## Common Edit Patterns

### Adding Authentication

```bash
/plan-edit myproject "Add JWT token-based authentication system to Phase 2: login/logout API, token validation middleware, user session management"
```

### Performance Optimization

```bash
/plan-edit performance "Add to performance considerations: memoization strategy, lazy loading implementation, bundle size optimization"
```

### Timeline Adjustment

```bash
/plan-edit timeline "Adjust Phase 3 schedule from 2 weeks to 3 weeks, extend integration testing period"
```

### Risk Update

```bash
/plan-edit risks "Add new risk: third-party API dependency - Impact High, Probability Medium, Mitigation: prepare alternative API"
```

## File Management

- **Backup**: Original content is preserved in edit history
- **Versioning**: Timestamps track modification history
- **Consistency**: Maintains original numbering and file structure
- **Validation**: Ensures plan integrity after modifications

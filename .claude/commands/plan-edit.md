# Plan Edit - Replace Strategic Plan Content

Replace the entire content of an existing strategic plan with updated content.

**Usage**: `/plan-edit <id|keyword>`

## Purpose

This command replaces strategic plan content entirely using the `cc-self-refer` CLI tool. The agent should read the current plan, make modifications, and provide the complete updated content.

## What does this command do

### ⚠️ IMPORTANT: CLI Command Execution Required

**This command MUST execute the following `cc-self-refer` CLI command with the complete updated plan content.**

### CLI Command Used

```bash
# Step 1: First view the current plan
npx -y cc-self-refer plan view <id_or_keyword>

# Step 2: After editing, replace with complete content
npx -y cc-self-refer plan edit <id_or_keyword> "<complete_updated_content>"
```

### Command Arguments
- `id_or_keyword`: Plan ID number or search keyword
- `complete_updated_content`: The ENTIRE updated plan content (not just changes)

### Expected Workflow
1. Load current plan content using `plan view`
2. Agent reads and modifies the content as needed
3. Agent provides the complete updated content to `plan edit`
4. Plan file is replaced with new content and timestamp updated

## Usage Examples

### Basic Plan Update

```bash
# Load current plan first
/plan-edit 3

# Agent then:
# 1. Calls: npx -y cc-self-refer plan view 3
# 2. Reviews current content
# 3. Makes modifications based on user request
# 4. Calls: npx -y cc-self-refer plan edit 3 "<complete_updated_plan>"
```

### Keyword-Based Edit

```bash
# Edit by keyword
/plan-edit "authentication"

# Agent process is the same:
# 1. View current plan
# 2. Understand requested changes
# 3. Provide complete updated content
```

### Full Content Replacement

- Agent reads current plan content completely
- Makes necessary modifications (adding, updating, restructuring)
- Provides entire updated plan as single string
- Original plan structure is completely replaced

### What Agent Should Do

1. **Read Current Plan**: Use `plan view` to get current content
2. **Understand Request**: Analyze what changes are needed
3. **Edit Completely**: Modify the full plan content
4. **Replace Entirely**: Provide complete updated content to `plan edit`

### Content Handling

- Maintain markdown formatting and structure
- Preserve essential metadata (title, status, dates)
- Update relevant sections based on requirements
- Ensure all plan sections remain coherent

## Important Notes

1. **Complete Replacement**: Always provide entire plan content, not partial updates
2. **Preserve Structure**: Maintain original plan organization and formatting
3. **Update Timestamps**: CLI automatically updates "Last Updated" timestamp
4. **Consistent Format**: Keep markdown structure and section organization intact

# Refer Spec - Access Project Specifications

Retrieve and access project specifications from `.claude/specs/` directory by number or keyword search.

**Usage**: `/spec-refer <number|keyword>`

## Purpose

This command retrieves stored project specifications including business requirements, feature designs, user experience flows, technical architecture, and operational procedures that are essential for understanding the project scope and making informed development decisions.

## What does this command do

### ⚠️ IMPORTANT: CLI Command Execution Required

**This command MUST execute the following `cc-self-refer` CLI commands. Do NOT implement the functionality directly.**

### CLI Commands Used

```bash
# List all specifications
npx -y cc-self-refer spec list

# List by category
npx -y cc-self-refer spec list --category <category>

# Search specifications
npx -y cc-self-refer spec search <keyword>
npx -y cc-self-refer spec search <keyword> --category <category>

# View specific specification
npx -y cc-self-refer spec view <id_or_keyword>
```

### Command Arguments
- `id_or_keyword`: Specification ID number or search keyword
- `category`: Optional category filter (e.g., "api", "ui", "database")
- Output is automatically formatted for AI consumption

### Search Process

The CLI tool handles:

- **Directory Management**: Automatically checks `.claude/specs/` directory
- **Smart Search**: Supports both exact ID matches and keyword searches
- **Category Filtering**: Filter specifications by specific categories
- **Content Analysis**: Searches in filenames and specification content
- **Relevance Ranking**: Returns results sorted by relevance score

### 3. Output Format

**Single Match Found**:

```markdown
# Project Specification: [Specification Topic]

## Source: `.claude/specs/[filename]`

[Display full specification content with proper formatting]

## Key Requirements

[Highlight important requirements for quick reference]

## Applicable Context

[How this specification applies to current development work]

---

**Specification loaded and available for application**
```

**Multiple Matches**:

```markdown
# Specification Items Found for "[search term]"

## Matching Specifications:

### 1. **[Specification 1]** (`.claude/specs/001-topic.md`)

📋 _[Brief summary of key requirements]_
🎯 _Relevance: [How it applies to search]_

### 2. **[Specification 2]** (`.claude/specs/003-another-topic.md`)

📋 _[Brief summary of content]_
🎯 _Relevance: [Connection to search term]_

### 3. **[Specification 3]** (`.claude/specs/005-related-topic.md`)

⚡ _[Brief summary of requirements]_
🎯 _Relevance: [Why it matched search]_

**Access Specific**: `/spec-refer <number>` to view detailed specification
```

**No Matches**:

```markdown
# No Specification Found

No project specifications found for "[search term]".

## Available Specification Repository:

1. **[Topic 1]** - [Brief description]
2. **[Topic 2]** - [Brief description]
3. **[Topic 3]** - [Brief description]

**Usage**: `/spec-refer <number>` or try different keywords
**Add Specification**: Document new requirements as they arise during development
```

### 4. Specification Integration Features

- **Context Application**: Explain how specifications apply to current development task
- **Requirements Extraction**: Highlight technical constraints and requirements
- **Decision History**: Show rationale behind past decisions
- **Cross-Reference**: Link to related plans or code patterns when relevant

## Usage Examples

### List All Specifications

```bash
npx -y cc-self-refer spec list
```

Shows all available specification entries with categories

### Search System Requirements

```bash
npx -y cc-self-refer spec search "authentication"
```

Finds authentication-related project specifications

### Search by Category

```bash
npx -y cc-self-refer spec list --category "payment"
```

Lists all payment-related specification entries

### Search in Specific Category

```bash
npx -y cc-self-refer spec search "user roles" --category "authorization"
```

Finds user role specifications within authorization category

## Integration with Development

### Before Implementation

- Review relevant project specifications
- Understand system constraints and requirements
- Apply technical requirements to implementation decisions

### During Development

- Quick access to system requirements
- Verify implementation against specifications
- Ensure compliance with technical constraints

### Problem Solving

- Access historical context for technical decisions
- Understand why certain approaches were specified
- Apply system expertise to technical challenges

### Specification Building

- Document new requirements during development
- Capture project specification clarifications
- Record important project context for future reference

## Specification Categories

Typical specifications stored include:

- **Business Requirements**: Core business logic and rules
- **User Experience Design**: User flows and interaction patterns
- **Feature Specifications**: Detailed feature requirements and behaviors
- **Technical Architecture**: System design and implementation approach
- **Operational Procedures**: Deployment, monitoring, and maintenance workflows
- **Project Constraints**: Budget, timeline, resource, and compliance requirements

## Error Handling

- **Directory Missing**: Suggest running `/init-claude` first
- **No Specifications**: Guide user to document specifications during development
- **Access Issues**: Report file permission problems clearly
- **Content Errors**: Handle malformed specification files gracefully

## Search Quality Features

- **Partial Matching**: "auth" finds "authentication", "authorize", etc.
- **Content Scanning**: Search within specification descriptions and details
- **Relevance Ranking**: Prioritize exact matches over partial matches
- **Recent Priority**: Favor recently accessed or modified specification items

This command makes project specifications easily accessible during development, ensuring implementation aligns with comprehensive project requirements including business logic, user experience, and operational constraints.
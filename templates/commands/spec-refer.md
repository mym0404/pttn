# Refer Spec - Access Technical Specifications

Retrieve and access technical specifications from `.claude/specs/` directory by number or keyword search.

**Usage**: `/spec-refer <number|keyword>`

## Purpose

This command retrieves stored technical specifications, system requirements, project documentation, and implementation details that are essential for understanding the project structure and making informed development decisions.

## Implementation

Use the `cc-self-refer` CLI tool to efficiently access technical specifications:

```bash
npx -y cc-self-refer spec list
npx -y cc-self-refer spec list --category <category>
npx -y cc-self-refer spec search <keyword> --context
npx -y cc-self-refer spec search <keyword> --category <category> --context
npx -y cc-self-refer spec view <id_or_keyword> --context
```

**Note**: The `--context` flag formats specification output for AI consumption with technical details and applicable context.

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
# Technical Specification: [Specification Topic]

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

No technical specifications found for "[search term]".

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

Finds authentication-related technical specifications

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

- Review relevant technical specifications
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
- Capture technical specification clarifications
- Record important project context for future reference

## Specification Categories

Typical specifications stored include:

- **System Requirements**: Technical constraints and system logic
- **API Specifications**: Interface requirements and behaviors
- **Performance Requirements**: System performance expectations and constraints
- **Security Policies**: Security guidelines and compliance requirements
- **Integration Notes**: Third-party service integration details
- **Architecture Decisions**: Structural and design requirements

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

This command makes technical specifications easily accessible during development, ensuring technical implementation aligns with project requirements and system constraints.
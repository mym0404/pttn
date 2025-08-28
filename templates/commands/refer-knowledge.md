# Refer Knowledge - Access Domain Knowledge

Retrieve and access domain knowledge from `.claude/knowledge/` directory by number or keyword search.

**Usage**: `/refer-knowledge <number|keyword>`

## Purpose

This command retrieves stored domain knowledge, business rules, project insights, and non-code related information that's essential for understanding the project context and making informed development decisions.

## Implementation

Use the `cc-self-refer` CLI tool to efficiently access domain knowledge:

```bash
npx -y cc-self-refer knowledge list
npx -y cc-self-refer knowledge list --category <category>
npx -y cc-self-refer knowledge search <keyword> --context
npx -y cc-self-refer knowledge search <keyword> --category <category> --context
npx -y cc-self-refer knowledge view <id_or_keyword> --context
```

**Note**: The `--context` flag formats knowledge output for AI consumption with business insights and applicable context.

### Search Process

The CLI tool handles:
- **Directory Management**: Automatically checks `.claude/knowledge/` directory
- **Smart Search**: Supports both exact ID matches and keyword searches  
- **Category Filtering**: Filter knowledge by specific categories
- **Content Analysis**: Searches in filenames and knowledge content
- **Relevance Ranking**: Returns results sorted by relevance score

### 3. Output Format

**Single Match Found**:
```markdown
# Domain Knowledge: [Knowledge Topic]

## Source: `.claude/knowledge/[filename]`

[Display full knowledge content with proper formatting]

## Key Insights
[Highlight important points for quick reference]

## Applicable Context
[How this knowledge applies to current development work]

---

**Knowledge loaded and available for application**
```

**Multiple Matches**:
```markdown
# Knowledge Items Found for "[search term]"

## Matching Knowledge:

### 1. **[Knowledge 1]** (`.claude/knowledge/001-topic.md`)
💡 *[Brief summary of key insights]*
🎯 *Relevance: [How it applies to search]*

### 2. **[Knowledge 2]** (`.claude/knowledge/003-another-topic.md`) 
📋 *[Brief summary of content]*
🎯 *Relevance: [Connection to search term]*

### 3. **[Knowledge 3]** (`.claude/knowledge/005-related-topic.md`)
⚡ *[Brief summary of insights]*
🎯 *Relevance: [Why it matched search]*

**Access Specific**: `/refer-knowledge <number>` to view detailed knowledge
```

**No Matches**:
```markdown
# No Knowledge Found

No domain knowledge found for "[search term]".

## Available Knowledge Base:
1. **[Topic 1]** - [Brief description]
2. **[Topic 2]** - [Brief description]  
3. **[Topic 3]** - [Brief description]

**Usage**: `/refer-knowledge <number>` or try different keywords
**Add Knowledge**: Document new insights as they arise during development
```

### 4. Knowledge Integration Features

- **Context Application**: Explain how knowledge applies to current development task
- **Business Rule Extraction**: Highlight business constraints and requirements
- **Decision History**: Show rationale behind past decisions
- **Cross-Reference**: Link to related plans or code patterns when relevant

## Usage Examples

### List All Knowledge
```bash
npx -y cc-self-refer knowledge list
```
Shows all available knowledge entries with categories

### Search Business Rules
```bash
npx -y cc-self-refer knowledge search "authentication"
```
Finds authentication-related business knowledge

### Search by Category
```bash
npx -y cc-self-refer knowledge list --category "payment"
```
Lists all payment-related knowledge entries

### Search in Specific Category
```bash
npx -y cc-self-refer knowledge search "user roles" --category "authorization"
```
Finds user role knowledge within authorization category

## Integration with Development

### Before Implementation
- Review relevant business knowledge
- Understand domain constraints and requirements
- Apply business rules to technical decisions

### During Development  
- Quick access to business logic requirements
- Verify implementation against business rules
- Ensure compliance with domain constraints

### Problem Solving
- Access historical context for business decisions
- Understand why certain approaches were chosen
- Apply domain expertise to technical challenges

### Knowledge Building
- Document new insights during development
- Capture business rule clarifications
- Record important project context for future reference

## Knowledge Categories

Typical knowledge stored includes:
- **Business Rules**: Domain-specific constraints and logic
- **User Requirements**: Functional and non-functional requirements  
- **API Limitations**: External service constraints and behaviors
- **Performance Requirements**: System performance expectations
- **Security Policies**: Security guidelines and compliance requirements
- **Integration Notes**: Third-party service integration details

## Error Handling

- **Directory Missing**: Suggest running `/init-claude` first
- **No Knowledge**: Guide user to document knowledge during development
- **Access Issues**: Report file permission problems clearly  
- **Content Errors**: Handle malformed knowledge files gracefully

## Search Quality Features

- **Partial Matching**: "auth" finds "authentication", "authorize", etc.
- **Content Scanning**: Search within knowledge descriptions and details
- **Relevance Ranking**: Prioritize exact matches over partial matches
- **Recent Priority**: Favor recently accessed or modified knowledge items

This command makes business domain knowledge easily accessible during development, ensuring technical implementation aligns with business requirements and project constraints.
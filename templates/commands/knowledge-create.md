# Knowledge - Save Domain Knowledge and Business Rules

Save domain-specific knowledge, business rules, and constraints to `.claude/knowledges/` directory with automatic numbering.

**Usage**:

- `/knowledge-create <topic name>` - Interactive mode: Claude will ask for knowledge content
- `/knowledge-create <topic name> <content>` - Direct mode: Create knowledge with provided content

## Purpose

This command saves domain knowledge, business rules, API constraints, architectural decisions, and project-specific requirements. This knowledge serves as a reference for maintaining consistency across development decisions.

## Implementation

Execute the `cc-self-refer` CLI tool's knowledge creation functionality:

```bash
npx -y cc-self-refer knowledge create "<topic name>" "<knowledge content>"
```

### CLI Usage Process

#### Interactive Mode (Topic Name Only)

1. **Ask for Topic Name**: Request a clear topic name
2. **Collect Knowledge Content**: Gather concise domain knowledge (key rules, constraints, essential info)
3. **Execute CLI Command**: Run the knowledge create command

#### Direct Mode (Topic Name + Content)

1. **Extract Topic Name**: Use the provided topic name
2. **Process Content**: Apply minimal markdown formatting
3. **Execute CLI Command**: Run the knowledge create command

### Knowledge Content Structure

When creating knowledge content, use simple markdown format:

````markdown
# <Topic Name>

[Brief domain knowledge description]
[Key rules or constraints]
[Examples or references if needed]
````

Example:

````markdown
# Payment Processing

- All payments are processed through Stripe
- Minimum payment amount is $1.00
- Failed payments retry 3 times with exponential backoff
- Refunds allowed only within 90 days of original payment
````

### Content Guidelines

When creating knowledge:
- Write only essential content concisely
- Avoid excessive structuring
- Focus on practical information
- Use free-form markdown without unnecessary sections

## Usage Examples

### Save Business Rules

When user requests:

```bash
/knowledge-create "User Permission System"
```

Claude will:

1. Ask for the business rules and permission logic
2. Execute: `npx -y cc-self-refer knowledge create "User Permission System" "<collected content>"`
3. Creates: `.claude/knowledges/001-user-permission-system.md`

### Save API Constraints

When user requests:

```bash
/knowledge-create "Rate Limiting Rules"
```

Claude will:

1. Collect rate limiting constraints and retry strategies
2. Execute: `npx -y cc-self-refer knowledge create "Rate Limiting Rules" "<collected content>"`
3. Creates: `.claude/knowledges/002-rate-limiting-rules.md`

### Save Domain Knowledge (Direct Mode)

When user provides both name and content:

```bash
/knowledge-create "Payment Processing" "All payments must be processed through Stripe. Minimum amount $1.00. Failed payments retry 3 times with exponential backoff."
```

Claude will:

1. Extract the topic name and knowledge content
2. Format the content with proper markdown structure
3. Execute: `npx -y cc-self-refer knowledge create "Payment Processing" "<formatted content>"`
4. Creates: `.claude/knowledges/003-payment-processing.md`

## Directory Management

- Ensure `.claude/knowledges/` directory exists (create if needed)
- Knowledge entries are numbered sequentially for easy reference
- Knowledge files include:
  - Actionable business rules and constraints
  - Implementation implications and examples
  - Cross-references to related knowledge
  - Update history for tracking changes

## Integration Benefits

Knowledge created with this command:

- Provides consistent business rule application across features
- Documents critical domain constraints for all team members
- Serves as authoritative source for business logic questions
- Enables faster development through shared understanding
- Creates searchable repository of project-specific knowledge

This command helps maintain business rule consistency and accelerates development by preserving critical domain knowledge.

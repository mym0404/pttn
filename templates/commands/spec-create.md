# Spec - Create Technical Specifications

Create detailed technical specifications and project requirements in `.claude/specs/` directory with automatic numbering.

**Usage**:

- `/spec-create <specification name>` - Interactive mode: Claude will ask for specification content
- `/spec-create <specification name> <content>` - Direct mode: Create spec with provided content

## Purpose

This command creates comprehensive technical specifications, system requirements, API documentation, architectural decisions, and project constraints. These specifications serve as authoritative reference for implementation and maintain consistency across development decisions.

## Implementation

Execute the `cc-self-refer` CLI tool's specification creation functionality:

```bash
npx -y cc-self-refer spec create "<specification name>" "<specification content>"
```

### CLI Usage Process

#### Interactive Mode (Specification Name Only)

1. **Ask for Specification Name**: Request a clear, descriptive name for the technical specification
2. **Collect Specification Content**: Gather comprehensive specification documentation including:
   - System requirements and constraints
   - Technical implementation requirements
   - API specifications and behaviors
   - Architectural decisions and rationale
   - Performance requirements
   - Security considerations
3. **Execute CLI Command**: Run the spec create command with collected information

#### Direct Mode (Specification Name + Content)

1. **Extract Specification Name**: Use the provided specification name
2. **Process Content**: Enhance the provided content with:
   - Proper markdown formatting
   - Structured sections for clarity
   - Examples and use cases
   - Implementation implications
3. **Execute CLI Command**: Run the spec create command with formatted content

### Specification Content Structure

When creating specification content, include:

````markdown
# <Specification Name>

## Overview

[Brief description of the system or component being specified]

## Requirements and Constraints

- [Requirement or constraint 1]
- [Requirement or constraint 2]

## Implementation Guidelines

[How this specification affects code implementation]

## Examples

```[language if applicable]
// Code examples showing how to implement this specification
[example code]
```

## Related Specifications

- [Related specification entry 1]
- [Related specification entry 2]

## Last Updated

[Date and context of last update]
````

### Content Enhancement

When saving specifications:

1. **System Analysis**:
   - Extract technical requirements from discussions or documentation
   - Document API behaviors and limitations
   - Capture architectural constraints and decisions

2. **Context Integration**:
   - Relate specifications to current project's architecture
   - Include project-specific implications
   - Cross-reference with existing specification entries

3. **Specification Categorization**:
   - Identify specification type (system requirements, API specs, etc.)
   - Tag with relevant domains (authentication, payments, etc.)
   - Cross-reference with related patterns and plans

## Usage Examples

### Save System Specifications

When user requests:

```bash
/spec-create "User Authentication System"
```

Claude will:

1. Ask for the authentication requirements and system logic
2. Execute: `npx -y cc-self-refer spec create "User Authentication System" "<collected content>"`
3. Creates: `.claude/specs/001-user-authentication-system.md`

### Save API Specifications

When user requests:

```bash
/spec-create "Rate Limiting Implementation"
```

Claude will:

1. Collect rate limiting specifications and retry strategies
2. Execute: `npx -y cc-self-refer spec create "Rate Limiting Implementation" "<collected content>"`
3. Creates: `.claude/specs/002-rate-limiting-implementation.md`

### Save Technical Specifications (Direct Mode)

When user provides both name and content:

```bash
/spec-create "Payment Processing Module" "Payment system must integrate with Stripe API. Minimum transaction amount $1.00. Failed payments retry 3 times with exponential backoff starting at 1 second."
```

Claude will:

1. Extract the specification name and content
2. Format the content with proper markdown structure
3. Execute: `npx -y cc-self-refer spec create "Payment Processing Module" "<formatted content>"`
4. Creates: `.claude/specs/003-payment-processing-module.md`

## Directory Management

- Ensure `.claude/specs/` directory exists (create if needed)
- Specification entries are numbered sequentially for easy reference
- Specification files include:
  - Actionable technical requirements and constraints
  - Implementation implications and examples
  - Cross-references to related specifications
  - Update history for tracking changes

## Integration Benefits

Specifications created with this command:

- Provides consistent technical implementation across features
- Documents critical system constraints for all team members
- Serves as authoritative source for technical requirements
- Enables faster development through shared understanding
- Creates searchable repository of project-specific specifications

This command helps maintain technical consistency and accelerates development by preserving critical project specifications.
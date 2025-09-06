# Spec - Comprehensive Project Specification System

Create detailed project specifications through deep interactive dialogue.

**Usage**: `/spec`

## Purpose

This command initiates a comprehensive specification creation process through extensive conversation. It can generate either complete multi-file product specifications or individual spec documents based on your needs.

### ⚠️ IMPORTANT: CLI Command Execution Required

**This command MUST execute multiple `cc-self-refer spec create` CLI commands after the interactive planning phase.**

### CLI Commands Used

```bash
# Create each specification file after planning:
npx -y cc-self-refer spec create "<spec-title>" <<'EOF'
<spec-content>
EOF
```

## Interactive Deep-Dive Process

### Step 1: Initial Scope Understanding (MANDATORY)

When user types `/spec`, the agent MUST first ask:

```
I'll help you create comprehensive project specifications through detailed conversation.

First, I need to understand what you're building:

**What would you like to specify?**

Please describe in detail:
- The system/feature/product you want to specify
- Whether this is a complete product or specific functionality
- The core problem it solves and how it works

The more detail you provide about the functionality and system design, the better I can help create specifications that capture every important aspect of your solution.

Take your time - this initial context is crucial for creating valuable specifications.
```

### Step 2: Extensive Interactive Discovery

Based on the user's response, engage in a **fully interactive, extensive dialogue** to understand every aspect:

#### Discovery Areas to Explore:

**Core Functionality:**
- What problem does this solve and how
- Main features and capabilities
- User workflows and interactions
- Business logic and rules
- Edge cases and error handling
- Data models and relationships

**System Architecture:**
- Technical components and structure
- API design and endpoints
- Database schema and storage
- Integration points
- Authentication and authorization
- Performance requirements

**User Interface:**
- UI components and layouts
- User interaction flows
- State management
- Forms and validations
- Navigation structure
- Responsive design needs

**Data & Processing:**
- Data input/output formats
- Processing algorithms
- Storage requirements
- Caching strategies
- Real-time vs batch processing
- Data validation rules

**Security & Compliance:**
- Security requirements
- Data privacy considerations
- Access control mechanisms
- Audit logging needs
- Compliance requirements
- Encryption and protection

### Step 3: Specification Planning

After thorough discovery, determine the specification structure:

**For Complete Product Specifications:**
```
Based on our discussion, I'll create a comprehensive specification suite with these documents:

1. Product Vision & Strategy
2. User Personas & Journeys
3. Core Functional Requirements
4. Technical Architecture
5. API Specifications
6. UI/UX Design System
7. Security & Compliance Framework
8. Performance & Scalability Requirements
9. Deployment & Operations Strategy
10. Testing & Quality Assurance
[... additional specs as needed]

Let me draft these specifications based on everything we've discussed...
```

**For Focused Specifications:**
```
Based on our discussion, I'll create a detailed specification for [specific area].
This will cover [key aspects] and integrate with your existing specifications...
```

### Step 4: Create Multiple Specification Files

Execute CLI commands to create each specification:

```bash
# Example for e-commerce platform specifications
npx -y cc-self-refer spec create "E-commerce Product Vision" <<'EOF'
# E-commerce Platform Product Vision

## Executive Summary
[Comprehensive vision based on conversation]

## Business Objectives
[Detailed objectives extracted from dialogue]
...
EOF

npx -y cc-self-refer spec create "User Personas and Journeys" <<'EOF'
# User Personas and Customer Journeys

## Primary Personas
[Detailed personas developed through conversation]
...
EOF

# Continue for all planned specifications...
```

## Expected Output Structure

After extensive dialogue, the command generates multiple specification files. Here's what gets created:

### Example: E-commerce Platform Specifications

```
.claude/specs/
├── 001-product-vision-and-core-functionality.md
├── 002-user-types-and-permissions.md
├── 003-product-catalog-system.md
├── 004-shopping-cart-and-checkout.md
├── 005-payment-processing-integration.md
├── 006-order-management-system.md
├── 007-inventory-tracking.md
├── 008-search-and-filtering.md
├── 009-api-specifications.md
├── 010-database-schema.md
├── 011-security-and-authentication.md
└── 012-performance-requirements.md
```

## Key Principles

1. **Deep Discovery Through Dialogue** - Have extensive conversations to understand every nuance
2. **Adaptive Questioning** - Each question builds on previous answers to go deeper
3. **Comprehensive Coverage** - Don't stop until you understand the complete vision
4. **Multiple File Generation** - Create as many specification files as needed to properly document the project
5. **Business & Technical Balance** - Capture both the business vision and technical requirements

## Output Characteristics

The specifications created should:
- Capture the essence and vision discussed in the conversation
- Be detailed enough for implementation teams to execute
- Include context and reasoning behind decisions
- Cross-reference related specifications
- Provide clear success criteria

This command transforms specification creation into a deep collaborative process that produces comprehensive, multi-file project documentation that truly captures the project's vision and requirements.

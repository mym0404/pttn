---
id: first-steps
title: First Steps
sidebar_label: First Steps
---

# First Steps with cc-self-refer

Learn the essential commands and workflows to get productive with cc-self-refer quickly.

## Your First Specification

Start by documenting your project's core purpose:

```bash
cc-self-refer spec create "Project Overview" "This project aims to..."
```

## Essential Commands

### 1. Create a Spec
```bash
cc-self-refer spec create "Authentication" "JWT-based auth system"
```

### 2. Search Specs
```bash
cc-self-refer spec search auth
```

### 3. Save a Pattern
```bash
cc-self-refer pattern create "Repository Pattern" "class UserRepository..."
```

### 4. Create a Plan
```bash
cc-self-refer plan create "MVP Development" "Phase 1: Core features..."
```

## Claude Code Integration

In Claude Code, use slash commands:

- `/spec` - Create specifications
- `/spec-refer` - Reference existing specs
- `/pattern-create` - Save code patterns
- `/plan-create` - Create implementation plans

## Quick Wins

1. **Document Decisions**: Create specs for architectural decisions
2. **Save Patterns**: Extract successful implementations
3. **Plan Features**: Break down complex features into plans
4. **Reference Context**: Use spec-refer to maintain consistency

## Next Steps

- Explore [command documentation](/docs/commands/overview)
- Learn [best practices](/docs/guides/best-practices)
- Set up [team collaboration](/docs/guides/team-collaboration)
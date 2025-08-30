---
id: team-collaboration
title: Team Collaboration
sidebar_label: Team Collaboration
---

# Team Collaboration

Effectively share and manage context across your development team.

## Collaboration Models

### Shared Repository Model

```bash
# Include .claude in version control
git add .claude/
git commit -m "Add project context"
git push
```

**Benefits:**
- Single source of truth
- Version history
- PR reviews for specs

### Hybrid Model

```bash
# .gitignore
.claude/pages/       # Personal notes
.claude/plans/*-wip.md  # Work in progress

# Track shared content
.claude/specs/       # ✓ Shared
.claude/patterns/    # ✓ Shared
```

## Team Workflows

### Specification Review Process

1. **Draft Creation**
   ```bash
   cc-self-refer spec create "API Design" "Draft: ..."
   ```

2. **Team Review**
   ```bash
   git checkout -b spec/api-design
   git add .claude/specs/
   git commit -m "Add API design spec"
   git push origin spec/api-design
   ```

3. **Approval & Merge**
   - Create PR
   - Team reviews
   - Merge to main

### Pattern Sharing

```bash
# Developer A creates pattern
cc-self-refer pattern create "Data Validation" "..."

# Commit and share
git add .claude/patterns/
git commit -m "Add data validation pattern"
git push

# Developer B uses pattern
git pull
cc-self-refer pattern view "Data Validation"
```

## Communication Protocols

### Spec Ownership

```markdown
---
title: Authentication System
author: john.doe
reviewers: [jane.smith, bob.wilson]
status: approved
---
```

### Plan Assignment

```markdown
---
title: Sprint 15 Goals
assignee: team-frontend
due: 2024-02-01
---
```

## Conflict Resolution

### Merge Conflicts

```bash
# Handle spec conflicts
git merge main
# Resolve conflicts in .claude/specs/
cc-self-refer spec validate
git add .
git commit
```

### Naming Conflicts

```bash
# Check before creating
cc-self-refer spec list | grep "Authentication"

# Use prefixes for clarity
cc-self-refer spec create "Frontend: Authentication" "..."
cc-self-refer spec create "Backend: Authentication" "..."
```

## Knowledge Sharing

### Onboarding New Members

```bash
# Create onboarding spec
cc-self-refer spec create "Onboarding Guide" "..."

# List essential specs
cc-self-refer spec list --tag essential

# Export for offline reading
cc-self-refer spec export --format pdf
```

### Documentation Standards

```markdown
# Spec Template
## Overview
Brief description

## Context
Why this exists

## Requirements
- Requirement 1
- Requirement 2

## Implementation Notes
Technical details

## References
- Related specs
- External docs
```

## Access Control

### Branch Protection

```yaml
# .github/CODEOWNERS
.claude/specs/security/ @security-team
.claude/specs/api/ @backend-team
.claude/patterns/ @tech-leads
```

### Sensitive Information

```bash
# Keep sensitive specs separate
mkdir .claude-private/
echo ".claude-private/" >> .gitignore

# Encrypted sharing
cc-self-refer spec export --encrypt
```

## Collaboration Tools

### Slack Integration

```bash
# Notify on spec updates
cc-self-refer spec create "..." && \
  curl -X POST $SLACK_WEBHOOK -d '{"text":"New spec created"}'
```

### CI/CD Integration

```yaml
# Validate specs on PR
- name: Validate Specs
  run: |
    cc-self-refer spec validate
    cc-self-refer pattern lint
```

## Team Conventions

### Naming Standards

- **Specs**: `[Component]: [Feature]`
- **Plans**: `[Sprint/Quarter] - [Goal]`
- **Patterns**: `[Pattern Type] - [Use Case]`

### Review Requirements

- Specs require 2 approvals
- Patterns require tech lead review
- Plans updated weekly

## Metrics & Reporting

### Team Velocity

```bash
# Weekly spec creation
cc-self-refer spec list --created-since 7d

# Pattern adoption
cc-self-refer pattern usage-stats
```

### Knowledge Coverage

```bash
# Areas with specs
cc-self-refer spec coverage

# Gaps analysis
cc-self-refer spec suggest
```

## Best Practices

1. **Regular Sync**: Weekly spec review meetings
2. **Clear Ownership**: Assign spec maintainers
3. **Version Control**: Tag important versions
4. **Documentation**: Keep specs up-to-date
5. **Accessibility**: Ensure all team members can access
---
id: workflow-optimization
title: Workflow Optimization
sidebar_label: Workflow Optimization
---

# Workflow Optimization

Streamline your development process with optimized cc-self-refer workflows.

## Quick Start Workflows

### New Feature Development

```bash
# 1. Create specification
cc-self-refer spec create "User Profile Feature" "..."

# 2. Create implementation plan
cc-self-refer plan create "Profile Implementation" "..."

# 3. Start development
# ... code ...

# 4. Save successful patterns
cc-self-refer pattern create "Profile Component" "..."

# 5. Complete plan
cc-self-refer plan resolve 1
```

### Bug Fixing Workflow

```bash
# 1. Document the issue
cc-self-refer spec create "Bug: Login Timeout" "..."

# 2. Reference related specs
cc-self-refer spec search authentication

# 3. Apply known patterns
cc-self-refer pattern view "Error Handling"

# 4. Document solution
cc-self-refer page create "Login Timeout Fix" "..."
```

## Automation Strategies

### Git Hooks

```bash
# .git/hooks/pre-commit
#!/bin/sh
# Update specs before commit
cc-self-refer spec list --modified
```

### NPM Scripts

```json
{
  "scripts": {
    "dev:plan": "cc-self-refer plan view active && npm run dev",
    "build:doc": "cc-self-refer spec export && npm run build"
  }
}
```

## Keyboard Shortcuts

### Shell Aliases

```bash
# Add to ~/.bashrc or ~/.zshrc
alias ccs="cc-self-refer spec"
alias ccp="cc-self-refer plan"
alias ccpt="cc-self-refer pattern"
alias ccpg="cc-self-refer page"

# Quick commands
alias cc-init="cc-self-refer init"
alias cc-search="cc-self-refer spec search"
```

## IDE Integration

### VS Code Tasks

```json
// .vscode/tasks.json
{
  "tasks": [
    {
      "label": "Create Spec",
      "type": "shell",
      "command": "cc-self-refer spec create"
    },
    {
      "label": "View Plans",
      "type": "shell",
      "command": "cc-self-refer plan list"
    }
  ]
}
```

## Batch Operations

### Multiple Specs Creation

```bash
# Create related specs
for module in auth user profile; do
  cc-self-refer spec create "$module Module" "Specification for $module"
done
```

### Pattern Migration

```bash
# Export patterns for sharing
cc-self-refer pattern export > patterns.json

# Import on another machine
cc-self-refer pattern import < patterns.json
```

## Search Optimization

### Effective Searching

```bash
# Search with context
cc-self-refer spec search "auth AND jwt"

# Search by ID range
cc-self-refer spec view 1-5

# Recent items
cc-self-refer page list --recent 10
```

## Context Switching

### Project Switching

```bash
# Save current context
cc-self-refer page create "Project A Status" "..."

# Switch project
cd ../project-b

# Load new context
cc-self-refer spec list
cc-self-refer plan view active
```

### Feature Branches

```bash
# Create branch-specific plan
git checkout -b feature/payment
cc-self-refer plan create "Payment Feature" "..."

# Merge context back
git checkout main
git merge feature/payment
```

## Performance Tips

### Caching Strategies

```bash
# Cache frequently accessed specs
cc-self-refer spec view 1 > .cache/auth-spec.md

# Quick reference
cat .cache/auth-spec.md
```

### Lazy Loading

```bash
# List without full content
cc-self-refer spec list --summary

# Load only when needed
cc-self-refer spec view 3
```

## Monitoring & Metrics

### Progress Tracking

```bash
# Daily progress
cc-self-refer plan status --today

# Weekly summary
cc-self-refer page list --days 7 | wc -l
```

### Quality Metrics

```bash
# Pattern usage
cc-self-refer pattern stats

# Spec coverage
cc-self-refer spec coverage
```

## Advanced Workflows

### CI/CD Integration

```yaml
# .github/workflows/docs.yml
steps:
  - name: Generate Docs
    run: |
      cc-self-refer spec export --format md
      cc-self-refer pattern export --format md
```

### Template Generation

```bash
# Generate from patterns
cc-self-refer pattern apply "Repository" --output src/repos/
```

## Troubleshooting Workflows

### Debugging Process

1. Check relevant specs
2. Review recent changes
3. Search for similar issues
4. Document solution as pattern

### Recovery Workflow

```bash
# Backup before changes
cp -r .claude .claude.backup

# Restore if needed
rm -rf .claude && mv .claude.backup .claude
```
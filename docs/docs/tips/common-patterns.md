---
id: common-patterns
title: Common Patterns
sidebar_label: Common Patterns
---

# Common Patterns

Frequently used patterns and solutions with cc-self-refer.

## Project Setup Patterns

### New Project Template

:::tip
Create a standard setup for all new projects.
:::

```bash
#!/bin/bash
# setup-project.sh

# Initialize cc-self-refer
cc-self-refer init

# Create standard specs
cc-self-refer spec create "Project Overview" "$1"
cc-self-refer spec create "Technical Stack" "$2"
cc-self-refer spec create "Team Structure" "$3"

# Create initial plan
cc-self-refer plan create "MVP Development" "Phase 1: Core features"
```

### Monorepo Pattern

```bash
# Root .claude for shared specs
.claude/
  specs/
    shared/

# Package-specific contexts
packages/
  frontend/.claude/
  backend/.claude/
```

## Development Workflow Patterns

### Feature Development

:::info
Standard flow for new features.
:::

1. Create specification
2. Create implementation plan
3. Develop feature
4. Save successful patterns
5. Complete plan

```bash
# Automated workflow
function new-feature() {
  cc-self-refer spec create "$1" "$2"
  cc-self-refer plan create "$1 Implementation" "Tasks for $1"
  git checkout -b "feature/$1"
}
```

### Bug Fix Pattern

```bash
function fix-bug() {
  local bug_id="$1"
  local description="$2"
  
  # Document bug
  cc-self-refer spec create "Bug #$bug_id" "$description"
  
  # Check related code
  cc-self-refer pattern search "error handling"
  
  # Create fix branch
  git checkout -b "fix/$bug_id"
}
```

## Code Review Patterns

### PR Documentation

:::note
Automatically generate PR descriptions from specs.
:::

```bash
# Generate PR description
function pr-description() {
  echo "## Changes"
  cc-self-refer spec view --recent 1 --format markdown
  
  echo "\n## Related Specs"
  cc-self-refer spec list --modified
}
```

### Review Checklist

```markdown
<!-- .claude/patterns/review-checklist.md -->
# Code Review Checklist

- [ ] Specs updated
- [ ] Patterns documented
- [ ] Plans completed
- [ ] Tests passing
- [ ] Documentation current
```

## Documentation Patterns

### Auto-Documentation

```bash
# Generate docs from specs
function generate-docs() {
  echo "# Project Documentation\n"
  
  echo "## Specifications\n"
  cc-self-refer spec list --format markdown
  
  echo "\n## Patterns\n"
  cc-self-refer pattern list --format markdown
}
```

### Changelog Generation

```bash
# Generate changelog from completed plans
cc-self-refer plan list --completed --since "2024-01-01" \
  --format markdown > CHANGELOG.md
```

## Testing Patterns

### Test Documentation

```bash
# Document test scenarios
cc-self-refer spec create "Test Scenarios" "..."
cc-self-refer pattern create "Test Helper" "..."
```

### Coverage Tracking

```bash
# Track test coverage in specs
function update-coverage() {
  local coverage=$(npm test -- --coverage | grep "All files")
  cc-self-refer spec update "Test Coverage" "$coverage"
}
```

## Deployment Patterns

### Release Preparation

:::warning
Always verify specs before release.
:::

```bash
# Pre-release checklist
function prepare-release() {
  echo "Checking specs..."
  cc-self-refer spec validate
  
  echo "Checking plans..."
  cc-self-refer plan list --incomplete
  
  echo "Generating release notes..."
  cc-self-refer plan list --completed --since last-release
}
```

### Environment Configuration

```bash
# Document environment configs
cc-self-refer spec create "Production Config" "..."
cc-self-refer spec create "Staging Config" "..."
cc-self-refer spec create "Development Config" "..."
```

## Maintenance Patterns

### Regular Cleanup

```bash
# Weekly maintenance
function weekly-maintenance() {
  # Archive old pages
  cc-self-refer page archive --days 30
  
  # Complete stale plans
  cc-self-refer plan list --stale
  
  # Deduplicate patterns
  cc-self-refer pattern dedupe
}
```

### Backup Strategy

```bash
# Backup .claude directory
function backup-context() {
  local date=$(date +%Y%m%d)
  tar -czf ".claude-backup-$date.tar.gz" .claude/
  echo "Backup created: .claude-backup-$date.tar.gz"
}
```

## Integration Patterns

### CI/CD Integration

```yaml
# .github/workflows/context.yml
name: Context Management
on: [push]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install -g cc-self-refer
      - run: cc-self-refer spec validate
      - run: cc-self-refer pattern lint
```

### Git Hooks

```bash
# .git/hooks/pre-commit
#!/bin/sh
cc-self-refer spec validate || exit 1
cc-self-refer plan status --incomplete
```

## Common Aliases

```bash
# Add to ~/.zshrc or ~/.bashrc

# Quick access
alias ccsi="cc-self-refer spec init"
alias ccsl="cc-self-refer spec list"
alias ccsv="cc-self-refer spec view"
alias ccss="cc-self-refer spec search"

# Plan management
alias ccpl="cc-self-refer plan list"
alias ccpa="cc-self-refer plan active"
alias ccpc="cc-self-refer plan complete"

# Pattern library
alias ccptl="cc-self-refer pattern list"
alias ccptv="cc-self-refer pattern view"
alias ccpta="cc-self-refer pattern apply"
```
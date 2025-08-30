---
id: performance
title: Performance Optimization
sidebar_label: Performance
---

# Performance Optimization

Optimize cc-self-refer for large projects and fast operations.

## Search Performance

### Index Optimization

:::tip
Use specific search terms and ID lookups for fastest results.
:::

```bash
# Fast: Direct ID lookup
cc-self-refer spec view 5

# Slower: Full text search
cc-self-refer spec search "authentication"
```

### Caching Strategies

```bash
# Cache frequently accessed specs
mkdir .cache
cc-self-refer spec view 1 > .cache/auth.md
```

## File System Performance

### Directory Organization

:::info
Organize content into subdirectories when you have 50+ files per category.
:::

```bash
# For large projects
.claude/
  specs/
    frontend/
    backend/
    infrastructure/
```

### File Size Management

- Keep individual files under 10KB
- Split large specs into multiple files
- Archive old content regularly

## Memory Usage

### Lazy Loading

```bash
# List without loading content
cc-self-refer spec list --summary

# Load only when needed
cc-self-refer spec view 3
```

### Batch Operations

```bash
# Process multiple files efficiently
for id in 1 2 3 4 5; do
  cc-self-refer spec view $id --format json
done | jq -s '.'
```

## Command Optimization

### Shell Aliases

```bash
# ~/.zshrc or ~/.bashrc
alias ccs="cc-self-refer spec"
alias ccp="cc-self-refer plan"
alias ccpt="cc-self-refer pattern"
```

### Background Processing

```bash
# Run long operations in background
cc-self-refer spec export --all &
```

## Network Performance

### Offline Mode

:::note
All cc-self-refer operations work offline - no network required.
:::

### Git Operations

```bash
# Optimize git with sparse checkout
git sparse-checkout set .claude/specs .claude/patterns
```

## Monitoring

### Performance Metrics

```bash
# Time operations
time cc-self-refer spec search "complex query"

# Monitor file counts
find .claude -type f | wc -l
```

### Cleanup Scripts

```bash
#!/bin/bash
# cleanup.sh
echo "Cleaning old pages..."
find .claude/pages -mtime +30 -delete

echo "Compacting plans..."
cc-self-refer plan archive --completed
```

## Best Practices

:::warning
Avoid recursive operations on large directories.
:::

1. **Regular Maintenance**: Archive old content monthly
2. **Smart Searching**: Use IDs when possible
3. **Batch Processing**: Group related operations
4. **File Hygiene**: Keep files organized and sized appropriately
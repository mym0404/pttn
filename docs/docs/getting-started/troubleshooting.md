---
id: troubleshooting
title: Troubleshooting
sidebar_label: Troubleshooting
---

# Troubleshooting Guide

Common issues and solutions for cc-self-refer.

## Installation Issues

### Command Not Found

```bash
# Verify installation
npm list -g cc-self-refer

# Reinstall if needed
npm install -g cc-self-refer
```

### Permission Errors

```bash
# Fix with npm prefix
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

## Initialization Problems

### Init Fails

```bash
# Clean and retry
rm -rf .claude/
cc-self-refer init --verbose
```

### Missing Commands

```bash
# Re-download templates
cc-self-refer init --force
```

## Claude Code Issues

### Commands Not Appearing

1. Restart Claude Code
2. Check `.claude/commands/` exists
3. Verify command files are valid markdown

### Command Execution Fails

1. Check cc-self-refer is in PATH
2. Verify you're in project root
3. Check file permissions

## File System Issues

### Permission Denied

```bash
chmod -R u+rw .claude/
```

### Disk Space

```bash
# Check available space
df -h .

# Clean old files if needed
cc-self-refer page clean --days 30
```

## Search Problems

### No Results Found

1. Check file exists in directory
2. Try broader search terms
3. Verify file format is correct

## Getting Help

- GitHub Issues: Report bugs
- Discussions: Ask questions
- Documentation: Check guides
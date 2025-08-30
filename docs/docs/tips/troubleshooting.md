---
id: troubleshooting
title: Troubleshooting Tips
sidebar_label: Troubleshooting
---

# Troubleshooting Tips

Advanced troubleshooting techniques for cc-self-refer issues.

## Debug Mode

### Enable Verbose Output

:::tip
Use verbose mode to see detailed execution information.
:::

```bash
# Add --verbose flag
cc-self-refer spec create --verbose "Title" "Content"

# Set environment variable
export CC_SELF_REFER_DEBUG=1
cc-self-refer spec list
```

### Trace File Operations

```bash
# Monitor file changes
watch -n 1 'ls -la .claude/specs/ | tail -5'

# Track file access
strace -e open,read,write cc-self-refer spec view 1
```

## Common Issues

### Corrupted Files

:::warning
Always backup before attempting recovery.
:::

```bash
# Check for corrupted markdown
for file in .claude/**/*.md; do
  if ! head -1 "$file" | grep -q "^---$"; then
    echo "Invalid: $file"
  fi
done

# Fix frontmatter
function fix-frontmatter() {
  local file=$1
  echo "---" > temp.md
  echo "title: Recovery" >> temp.md
  echo "---" >> temp.md
  cat "$file" >> temp.md
  mv temp.md "$file"
}
```

### Permission Problems

```bash
# Diagnose permission issues
ls -la .claude/ | grep "^d"
find .claude -type f ! -readable
find .claude -type d ! -executable

# Fix permissions
chmod -R u+rw .claude/
find .claude -type d -exec chmod u+x {} \;
```

### Search Not Working

:::info
Search uses Jaro-Winkler algorithm which requires exact spelling for best results.
:::

```bash
# Debug search
cc-self-refer spec search --debug "term"

# Rebuild search index (future feature)
cc-self-refer index rebuild
```

## Recovery Procedures

### Backup and Restore

```bash
# Create backup
function backup-claude() {
  local timestamp=$(date +%Y%m%d_%H%M%S)
  cp -r .claude ".claude.backup.$timestamp"
  echo "Backup created: .claude.backup.$timestamp"
}

# Restore from backup
function restore-claude() {
  local backup=$1
  if [ -d "$backup" ]; then
    rm -rf .claude
    cp -r "$backup" .claude
    echo "Restored from $backup"
  else
    echo "Backup not found: $backup"
  fi
}
```

### File Recovery

```bash
# Recover deleted spec
function recover-spec() {
  local id=$1
  local file=$(printf ".claude/specs/%03d-*.md" $id)
  
  # Check git history
  git show HEAD:$file > recovered.md
  
  # Or check system trash
  # macOS
  ls ~/.Trash/ | grep "^$id-"
  
  # Linux
  ls ~/.local/share/Trash/files/ | grep "^$id-"
}
```

## Performance Debugging

### Slow Operations

:::note
Profile commands to identify bottlenecks.
:::

```bash
# Time individual operations
time cc-self-refer spec list
time cc-self-refer spec search "complex query"

# Profile with more detail
/usr/bin/time -v cc-self-refer spec list

# Check file counts
find .claude -type f | wc -l
du -sh .claude/*
```

### Memory Issues

```bash
# Monitor memory usage
watch -n 1 'ps aux | grep cc-self-refer'

# Limit memory usage
ulimit -v 500000  # 500MB limit
cc-self-refer spec list
```

## Network Diagnostics

### Proxy Issues

:::warning
cc-self-refer works offline but npm installation may need network.
:::

```bash
# Check npm proxy
npm config get proxy
npm config get https-proxy

# Clear proxy if needed
npm config delete proxy
npm config delete https-proxy
```

### Installation Problems

```bash
# Clean npm cache
npm cache clean --force

# Try different registry
npm install -g cc-self-refer --registry https://registry.npmjs.org

# Install from git
npm install -g git+https://github.com/mym0404/cc-self-refer.git
```

## Environment Issues

### Path Problems

```bash
# Check installation
which cc-self-refer
npm list -g cc-self-refer

# Add to PATH manually
export PATH=$PATH:$(npm bin -g)

# Verify Node version
node --version  # Should be >= 18.0.0
```

### Shell Compatibility

```bash
# Test in different shells
bash -c "cc-self-refer --version"
zsh -c "cc-self-refer --version"
sh -c "cc-self-refer --version"

# Check for aliases/functions conflict
type cc-self-refer
which -a cc-self-refer
```

## Logging and Monitoring

### Enable Logging

```bash
# Create log directory
mkdir -p ~/.cc-self-refer/logs

# Redirect output
cc-self-refer spec list 2>&1 | tee ~/.cc-self-refer/logs/$(date +%Y%m%d).log
```

### Audit Trail

```bash
# Track all commands
function cc-self-refer-audit() {
  local cmd="cc-self-refer $@"
  echo "[$(date)] $cmd" >> ~/.cc-self-refer/audit.log
  eval $cmd
}

alias cc-self-refer=cc-self-refer-audit
```

## Advanced Debugging

### Strace Analysis

```bash
# Trace system calls
strace -o trace.log cc-self-refer spec list
grep -E "open|read|write" trace.log
```

### Node.js Debugging

```bash
# Enable Node.js debugging
NODE_DEBUG=* cc-self-refer spec list

# Use Node inspector
node --inspect $(which cc-self-refer) spec list
```

## Getting Help

:::tip
When reporting issues, include:
1. cc-self-refer version
2. Node.js version
3. Operating system
4. Error messages
5. Steps to reproduce
:::

```bash
# Generate debug report
function debug-report() {
  echo "=== Debug Report ==="
  echo "Date: $(date)"
  echo "cc-self-refer: $(cc-self-refer --version)"
  echo "Node: $(node --version)"
  echo "NPM: $(npm --version)"
  echo "OS: $(uname -a)"
  echo "PWD: $(pwd)"
  echo ""
  echo "=== Directory Structure ==="
  ls -la .claude/
  echo ""
  echo "=== Recent Errors ==="
  cc-self-refer spec list 2>&1 | head -20
}

debug-report > debug-report.txt
```
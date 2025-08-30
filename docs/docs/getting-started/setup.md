---
id: setup
title: Initial Setup
sidebar_label: Setup
---

# Initial Setup

After installing cc-self-refer, you need to initialize your project to start using the self-reference capabilities. This guide walks through the setup process.

## Quick Setup

The fastest way to get started:

```bash
# Navigate to your project
cd your-project

# Initialize cc-self-refer
cc-self-refer init

# Verify setup
ls -la .claude/
```

## What Init Does

The `init` command performs several important tasks:

### 1. Creates Directory Structure

```
.claude/
├── commands/     # Claude Code slash commands
├── pages/        # Session history storage
├── plans/        # Strategic planning documents
├── patterns/     # Reusable code patterns
└── specs/        # Project specifications
```

### 2. Downloads Command Templates

Automatically fetches the latest Claude Code command templates from GitHub:

- `/page-save` - Save current session
- `/page-refer` - Reference saved sessions
- `/plan-create` - Create strategic plan
- `/plan-edit` - Edit existing plan
- `/plan-resolve` - Execute and resolve plan
- `/pattern-create` - Save code pattern
- `/pattern-use` - Apply saved pattern
- `/spec` - Create specification
- `/spec-refer` - Reference specifications

### 3. Sets Up Git Integration

If your project uses Git, the init process:
- Detects existing `.gitignore`
- Optionally adds `.claude/` to gitignore
- Preserves your existing Git configuration

## Configuration Options

### Custom Directory Location

By default, cc-self-refer uses `.claude/` in your project root. Currently, this location is fixed, but future versions may support custom paths.

### Command Selection

All commands are installed by default. You can manually remove unwanted commands:

```bash
# Remove specific command
rm .claude/commands/command-name.md
```

### Content Organization

You can customize how content is organized:

```bash
# Create subcategories for better organization
mkdir .claude/specs/frontend
mkdir .claude/specs/backend
mkdir .claude/patterns/components
mkdir .claude/patterns/services
```

## Verifying Your Setup

### Check Installation

```bash
# Verify CLI is accessible
cc-self-refer --version

# Check directory structure
tree .claude/ -L 2
```

Expected output:
```
.claude/
├── commands/
│   ├── page-save.md
│   ├── page-refer.md
│   ├── plan-create.md
│   └── ...
├── pages/
├── plans/
├── patterns/
└── specs/
```

### Test Basic Operations

Create your first specification:

```bash
cc-self-refer spec create "Project Overview" "Main project documentation"
```

List specifications:

```bash
cc-self-refer spec list
```

## Claude Code Integration

### Enabling Commands

Once initialized, Claude Code automatically recognizes the slash commands in `.claude/commands/`.

### Testing Commands

In Claude Code, try:

```
/spec Project Setup
```

This should trigger the spec creation workflow.

### Command Discovery

Claude Code will show available commands when you type `/` in the chat.

## Project Templates

### For New Projects

Starting a new project with cc-self-refer:

```bash
# Create project directory
mkdir my-new-project
cd my-new-project

# Initialize git (optional)
git init

# Initialize cc-self-refer
cc-self-refer init

# Create initial specification
cc-self-refer spec create "Project Requirements" "..."
```

### For Existing Projects

Adding cc-self-refer to an existing project:

```bash
# In your project root
cc-self-refer init

# Import existing documentation
cc-self-refer spec create "Existing Architecture" "$(cat docs/architecture.md)"
```

## Team Setup

### Sharing Context

When working in a team:

1. **Include in Git**: Add `.claude/` to version control
2. **Exclude in Git**: Add to `.gitignore` for personal context

```bash
# To share with team (recommended)
git add .claude/
git commit -m "Add project context"

# To keep private
echo ".claude/" >> .gitignore
```

### Onboarding New Members

For new team members:

```bash
# Clone repository (includes .claude/ if committed)
git clone <repository>

# Or initialize fresh
cc-self-refer init

# Sync team specifications
cc-self-refer spec list  # View available specs
```

## Environment-Specific Setup

### Development Environment

```bash
# Create dev-specific plans
cc-self-refer plan create "Development Setup" "Local development configuration"
```

### Production Considerations

```bash
# Document production requirements
cc-self-refer spec create "Production Config" "Production environment setup"
```

## Troubleshooting Setup

### Permission Issues

If you encounter permission errors:

```bash
# Fix permissions
chmod -R u+rw .claude/

# Verify ownership
ls -la .claude/
```

### Missing Commands

If commands aren't appearing in Claude Code:

```bash
# Re-download commands
rm -rf .claude/commands
cc-self-refer init

# Verify commands exist
ls .claude/commands/
```

### Init Failures

If initialization fails:

```bash
# Clean and retry
rm -rf .claude/
cc-self-refer init

# Check for errors
cc-self-refer init --verbose
```

## Advanced Setup

### Custom Workflows

Create project-specific commands:

```bash
# Create custom command
cat > .claude/commands/custom-workflow.md << 'EOF'
# Custom Workflow
Custom command for project-specific tasks
EOF
```

### Automation

Integrate with your build process:

```json
// package.json
{
  "scripts": {
    "postinstall": "cc-self-refer init",
    "docs:generate": "cc-self-refer spec list"
  }
}
```

## Next Steps

Now that your project is set up:

1. [Learn the basic commands](./first-steps)
2. [Create your first specification](/docs/commands/spec)
3. [Set up your first plan](/docs/commands/plan-create)
4. [Save useful patterns](/docs/commands/pattern-create)

## Best Practices

1. **Initialize Early**: Set up cc-self-refer at project start
2. **Document Immediately**: Create specs as you make decisions
3. **Regular Updates**: Keep context current with project evolution
4. **Team Alignment**: Share important context via Git
5. **Organize Logically**: Use meaningful names and descriptions
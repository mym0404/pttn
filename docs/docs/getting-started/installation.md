---
id: installation
title: Installation
sidebar_label: Installation
---

# Installation

Get started with cc-self-refer in just a few minutes. This guide will walk you through installing the CLI tool and setting up your first project.

## Prerequisites

Before installing cc-self-refer, ensure you have:

- **Node.js** version 18.0.0 or higher
- **npm** or **pnpm** package manager
- **Git** (recommended for version control)

You can verify your Node.js installation:

```bash
node --version
# Should output v18.0.0 or higher
```

## Installation Methods

### Method 1: Global Installation (Recommended)

Install cc-self-refer globally for use across all projects:

```bash
npm install -g cc-self-refer
```

Or with pnpm:

```bash
pnpm add -g cc-self-refer
```

Verify the installation:

```bash
cc-self-refer --version
```

### Method 2: npx (No Installation)

Use cc-self-refer without installing:

```bash
npx cc-self-refer init
```

This method always uses the latest version but requires an internet connection.

### Method 3: Project-Specific Installation

Add cc-self-refer as a dev dependency:

```bash
npm install --save-dev cc-self-refer
```

Or with pnpm:

```bash
pnpm add -D cc-self-refer
```

Then use with npx in your project:

```bash
npx cc-self-refer init
```

## Quick Start

### 1. Initialize Your Project

Navigate to your project directory and run:

```bash
cc-self-refer init
```

This command will:
- Create the `.claude` directory structure
- Download Claude Code command templates
- Set up initial configuration

Expected output:
```
✅ Created .claude directory structure
✅ Downloaded command templates
✅ Initialization complete!

Your project is now ready for self-referencing with Claude Code.
```

### 2. Verify Installation

Check that all directories were created:

```bash
ls -la .claude/
```

You should see:
```
.claude/
├── commands/     # Claude Code slash commands
├── pages/        # Session history
├── plans/        # Strategic plans
├── patterns/     # Code patterns
└── specs/        # Project specifications
```

### 3. Test Basic Commands

Try creating your first specification:

```bash
cc-self-refer spec create "Authentication System" "User authentication with JWT"
```

## Platform-Specific Notes

### macOS

cc-self-refer works out of the box on macOS. If you encounter permission issues with global installation:

```bash
sudo npm install -g cc-self-refer
```

### Windows

On Windows, you may need to:

1. Run your terminal as Administrator for global installation
2. Ensure Node.js is in your PATH
3. Use PowerShell or Git Bash for best compatibility

### Linux

On Linux systems, you might need to configure npm's global directory:

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

## Troubleshooting

### Command Not Found

If `cc-self-refer` is not recognized after global installation:

1. Check npm's global bin directory:
```bash
npm bin -g
```

2. Ensure this directory is in your PATH:
```bash
echo $PATH
```

3. Reinstall if necessary:
```bash
npm uninstall -g cc-self-refer
npm install -g cc-self-refer
```

### Permission Errors

If you encounter EACCES errors:

**Option 1**: Use a Node version manager (recommended)
- Install [nvm](https://github.com/nvm-sh/nvm) (macOS/Linux)
- Install [nvm-windows](https://github.com/coreybutler/nvm-windows) (Windows)

**Option 2**: Change npm's default directory
```bash
npm config set prefix ~/.npm-global
```

### Network Issues

If installation fails due to network issues:

1. Check your npm registry:
```bash
npm config get registry
# Should be: https://registry.npmjs.org/
```

2. Clear npm cache:
```bash
npm cache clean --force
```

3. Try alternative registry:
```bash
npm install -g cc-self-refer --registry https://registry.npmjs.org/
```

## Updating cc-self-refer

### Global Installation

Update to the latest version:

```bash
npm update -g cc-self-refer
```

Or reinstall:

```bash
npm uninstall -g cc-self-refer
npm install -g cc-self-refer
```

### Project Installation

Update in your project:

```bash
npm update cc-self-refer
```

Or with pnpm:

```bash
pnpm update cc-self-refer
```

## Uninstalling

### Global Uninstall

```bash
npm uninstall -g cc-self-refer
```

### Project Uninstall

```bash
npm uninstall cc-self-refer
```

### Clean Up Project

To remove cc-self-refer from a project:

```bash
rm -rf .claude/
```

⚠️ **Warning**: This will delete all stored context, specifications, plans, and patterns.

## Next Steps

Now that you have cc-self-refer installed, proceed to:

- [Setup Guide](/docs/getting-started/setup) - Configure your first project
- [First Steps](/docs/getting-started/first-steps) - Learn basic commands
- [Commands Overview](/docs/commands/overview) - Explore all available commands

## Getting Help

If you encounter issues not covered here:

- Check our [Troubleshooting Guide](/docs/getting-started/troubleshooting)
- [Open an issue](https://github.com/mym0404/cc-self-refer/issues)
- [Join the discussion](https://github.com/mym0404/cc-self-refer/discussions)
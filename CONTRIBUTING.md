# Contributing to cc-self-refer

Thank you for your interest in contributing to cc-self-refer! This guide will help you get started.

## Quick Start

1. **Fork** the repository
2. **Clone** your fork locally
3. **Install** dependencies: `pnpm install`
4. **Build**: `pnpm build`
5. **Test**: `node dist/cli.js --help`

## Development Workflow

### Prerequisites

- Node.js 18 or higher
- pnpm (latest version via corepack)

### Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/cc-self-refer.git
cd cc-self-refer

# Enable corepack and install dependencies
corepack enable
pnpm install

# Build the project
pnpm build
```

### Making Changes

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes
# ... edit code ...

# Test your changes
pnpm build
node dist/cli.js --help

# Format and lint
pnpm format
pnpm lint:fix
```

### Testing

Since this is a CLI tool that integrates with Claude Code:

1. **Build** the project: `pnpm build`
2. **Test CLI** directly: `node dist/cli.js [command]`
3. **Test init** in a temp directory:
   ```bash
   mkdir /tmp/test-project
   cd /tmp/test-project
   node /path/to/cc-self-refer/dist/cli.js init
   ```

## Project Structure

```
cc-self-refer/
├── src/
│   ├── cli.ts           # Main CLI interface with Commander.js
│   ├── index.ts         # Core managers and functions
│   └── formatters.ts    # Output formatting for Claude Code
├── templates/
│   └── commands/        # Claude Code command templates
├── dist/                # Built output (generated)
└── package.json         # Dependencies and scripts
```

## Code Style

- **TypeScript**: Use TypeScript for all code
- **Formatting**: Prettier with default config
- **Linting**: ESLint with TypeScript rules
- **Functions**: Prefer arrow functions over function declarations
- **Parameters**: Use object parameters with destructuring
- **Exports**: Prefer named exports over default exports

## Types of Contributions

### 🐛 Bug Reports

- Use GitHub Issues
- Provide clear reproduction steps
- Include CLI output and error messages

### 💡 Feature Requests

- Use GitHub Issues with "enhancement" label
- Describe the use case and benefit
- Consider how it fits with Claude Code workflow

### 🔧 Code Contributions

#### CLI Commands

- Add new commands to `src/cli.ts`
- Follow existing pattern with Commander.js

#### Managers and Functions

- Core logic goes in `src/index.ts`
- Use interfaces for type safety
- Follow existing manager pattern

#### Output Formatting

- Claude Code-specific formatting in `src/formatters.ts`
- Include emojis and clear structure

#### Command Templates

- Add new templates to `templates/commands/`
- Use established format with Usage and Implementation sections
- Reference `npx cc-self-refer` commands

### 📚 Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for complex functions
- Keep examples simple and practical

## Submission Guidelines

### Pull Request Process

1. **Fork** and create a feature branch
2. **Make changes** following code style
3. **Test thoroughly** - build and test CLI
4. **Update docs** if needed
5. **Submit PR** with clear description

### PR Requirements

- ✅ Code builds successfully (`pnpm build`)
- ✅ Linting passes (`pnpm lint`)
- ✅ Formatting is correct (`pnpm format:check`)
- ✅ Manual testing completed
- ✅ Clear PR description with rationale

### Commit Messages

Use conventional commit format:

- `feat: add new search functionality`
- `fix: resolve pattern matching issue`
- `docs: update README with new examples`
- `refactor: improve manager interfaces`

## Release Process

Releases are handled by maintainers:

1. Version bump in `package.json`
2. Update changelog
3. Create GitHub release
4. Publish to npm

## Getting Help

- 🐛 **Bug reports**: GitHub Issues
- 💡 **Feature ideas**: GitHub Issues
- 🤔 **Questions**: GitHub Discussions
- 💬 **Chat**: Join our community discussions

## Recognition

All contributors will be:

- Listed in repository contributors
- Mentioned in release notes for their contributions
- Welcomed as part of the cc-self-refer community

Thank you for making cc-self-refer better! 🚀

# Build System Specification

**Category**: build

## Overview
This specification defines the build and development processes for cc-self-refer CLI tool.

## Build Configuration

### TypeScript Configuration
- **Target**: ES2022 with ESNext modules for modern JavaScript features
- **Module Resolution**: bundler strategy for optimal bundling
- **Strict Mode**: Enabled with comprehensive type checking
- **Output**: Both CommonJS and ESM builds in `dist/` directory
- **Declaration Files**: Generated with source maps for debugging

### Build Tools
- **Primary Builder**: tsdown (simplified TypeScript bundler)
- **Package Manager**: pnpm 10.15.0 with lockfile for reproducible builds
- **Output Directory**: `dist/` with CLI executable and library exports

## Development Scripts

### Core Commands
```bash
pnpm build        # Production build with type checking
pnpm dev          # Development build and run CLI
pnpm t            # Comprehensive validation (lint + typecheck)
pnpm typecheck    # TypeScript validation without output
pnpm lint         # ESLint validation with auto-fix capability
pnpm format       # Prettier code formatting
```

### Quality Gates
- **ESLint Configuration**: TypeScript-specific rules with prettier integration
- **Prettier**: Code formatting with consistent style
- **TypeScript**: Strict type checking with unused code detection
- **Pre-publish Pipeline**: Full validation before npm publication

### Build Targets
- **CLI Executable**: `dist/cli.js` with Node.js shebang
- **Library Export**: `dist/index.js` for programmatic usage
- **Type Definitions**: Complete `.d.ts` files with source maps

## Release Process

### Commit Standards
- **Style**: Conventional Commit format
- **Messages**: Concise English descriptions without AI attribution
- **Validation**: Pre-commit hooks ensure code quality

### Version Management
- **Tool**: release-it for automated version bumping
- **Strategy**: Patch releases for bug fixes, minor for features
- **Publication**: Automatic npm registry publication after validation

### Quality Assurance
- **Pre-pack**: Full test suite and build validation
- **Pre-publish**: Build output verification
- **Node Compatibility**: Engines requirement ≥18.0.0

## Dependencies

### Runtime Dependencies
- `commander`: CLI framework for command structure
- `fs-extra`: Enhanced file system operations
- `natural`: Text similarity algorithms for search
- `glob`: File pattern matching for content discovery
- `@clack/prompts`: Interactive CLI prompts

### Development Dependencies
- `tsdown`: TypeScript bundler for build process
- `eslint` + `typescript-eslint`: Code quality and type safety
- `prettier`: Code formatting consistency
- `release-it`: Automated release management

---
**Created**: 2024-08-29T04:08:00.000Z
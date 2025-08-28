# cc-self-refer

Claude Code Self Reference Helper - CLI tool for managing `.claude` directory content

## TODO
- docusaurus docs
- vitest tests

## Features

- 📄 **Page Management**: Manage session pages in `.claude/pages/`
- 📋 **Plan Management**: Create and edit strategic plans in `.claude/plans/`
- 🧩 **Pattern Management**: Browse code patterns in `.claude/code-patterns/`
- 🧠 **Knowledge Management**: Search and view knowledge base in `.claude/knowledge/`
- 🔍 **Smart Search**: Semantic search using natural language processing
- 🎨 **Beautiful CLI**: Colorful output with icons and formatting

## Installation

```bash
# Install globally via npm
npm install -g cc-self-refer

# Or via pnpm
pnpm add -g cc-self-refer

# Or run directly with npx
npx cc-self-refer --help
```

## Prerequisites

- Node.js 18 or higher
- An existing `.claude` directory in your home directory
- Claude Code setup (run `claude-code init` first if you haven't)

## Usage

### Page Management

```bash
# List all session pages
cc-self-refer page list

# Search pages by keyword
cc-self-refer page search "authentication"

# View a specific page
cc-self-refer page view 1
cc-self-refer page view "login"
```

### Plan Management

```bash
# List strategic plans
cc-self-refer plan list

# Create a new plan
cc-self-refer plan create "Dark Mode Implementation" "Add dark theme support to the application"

# View a plan
cc-self-refer plan view 1
cc-self-refer plan view "dark mode"

# Edit an existing plan
cc-self-refer plan edit 1 "Add accessibility considerations to Phase 2"
```

### Code Pattern Management

```bash
# List all code patterns
cc-self-refer pattern list

# Search patterns by keyword
cc-self-refer pattern search "react hook"

# Search patterns by language
cc-self-refer pattern search "authentication" --language typescript
```

### Knowledge Base Management

```bash
# List knowledge entries
cc-self-refer knowledge list

# Filter by category
cc-self-refer knowledge list --category "database"

# Search knowledge base
cc-self-refer knowledge search "caching strategies"
```

## Directory Structure

The tool expects the following structure in your home directory:

```
~/.claude/
├── pages/          # Session page dumps
├── plans/          # Strategic planning documents
├── code-patterns/  # Reusable code patterns
└── knowledge/      # Domain knowledge and learnings
```

## Search Features

- **Semantic Search**: Uses Jaro-Winkler distance for intelligent matching
- **Keyword Matching**: Finds exact keyword matches in titles and content
- **Score-based Ranking**: Results ranked by relevance score
- **Fuzzy Matching**: Handles typos and partial matches

## Plan Template

When creating new plans, the tool generates a comprehensive template:

- **Overview**: Project description and context
- **Goals & Success Criteria**: Objectives and metrics
- **Implementation Approach**: Architecture and tech stack
- **Implementation Checklist**: Phase-based tasks
- **Key Considerations**: Technical, UX, and maintenance aspects
- **Risks & Mitigation**: Risk assessment table
- **Timeline Estimation**: Phase breakdown and milestones

## Development

```bash
# Clone the repository
git clone <repository-url>
cd cc-self-refer

# Install dependencies
pnpm install

# Run in development mode
pnpm dev

# Build for production
pnpm build

# Test the CLI
node dist/cli.js --help
```

## Built With

- **Commander.js**: CLI framework
- **tsdown**: TypeScript bundler
- **Picocolors**: Terminal colors
- **@clack/prompts**: Interactive prompts
- **Natural**: Natural language processing
- **Glob**: File pattern matching

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

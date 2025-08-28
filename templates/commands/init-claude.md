# Init Claude - Initialize Claude Code Project with Self-Reference Commands

Initialize a Claude Code project with cc-self-refer command integration.

**Usage**: `/init-claude`

## Purpose

This command sets up a new or existing project with Claude Code self-reference capabilities by:
1. Creating the `.claude` directory structure
2. Installing cc-self-refer command templates
3. Setting up project-specific command integration

## Implementation

Execute the following steps to initialize Claude Code with cc-self-refer integration:

### 1. Create Project Structure

```bash
mkdir -p .claude/commands
mkdir -p .claude/pages
mkdir -p .claude/plans  
mkdir -p .claude/code-patterns
mkdir -p .claude/knowledge
```

### 2. Download Command Templates

Install cc-self-refer command templates from the official repository:

```bash
# Base URL for cc-self-refer command templates
BASE_URL="https://raw.githubusercontent.com/user/cc-self-refer/main/templates/commands"

# Download core self-reference commands
curl -s "$BASE_URL/page.md" > .claude/commands/page.md
curl -s "$BASE_URL/plan.md" > .claude/commands/plan.md  
curl -s "$BASE_URL/refer-page.md" > .claude/commands/refer-page.md
curl -s "$BASE_URL/refer-knowledge.md" > .claude/commands/refer-knowledge.md
curl -s "$BASE_URL/use-code-pattern.md" > .claude/commands/use-code-pattern.md
curl -s "$BASE_URL/code-pattern.md" > .claude/commands/code-pattern.md
```

### 3. Verify Installation

```bash
echo "✅ Claude Code project initialized with cc-self-refer integration"
echo ""
echo "📁 Created directories:"
echo "  .claude/commands/     - Claude Code commands"
echo "  .claude/pages/        - Session history"  
echo "  .claude/plans/        - Strategic plans"
echo "  .claude/code-patterns/ - Reusable code patterns"
echo "  .claude/knowledge/    - Domain knowledge base"
echo ""
echo "🎯 Available commands:"
echo "  /page                 - Manage session pages"
echo "  /plan                 - Create and manage strategic plans"
echo "  /refer-page           - Load session context"
echo "  /refer-knowledge      - Access domain knowledge" 
echo "  /use-code-pattern     - Apply saved code patterns"
echo "  /code-pattern         - Save new code patterns"
echo ""
echo "🚀 Next steps:"
echo "  1. Install cc-self-refer: npm install -g cc-self-refer"
echo "  2. Start using commands: /plan create 'My Project' 'Description'"
echo "  3. Build your knowledge: /refer-knowledge and /use-code-pattern"
```

## Advanced Setup

### Custom Repository

To use a custom cc-self-refer repository:

```bash
# Set custom base URL
CUSTOM_BASE_URL="https://raw.githubusercontent.com/yourorg/your-cc-self-refer/main/templates/commands"

# Download with custom URL
curl -s "$CUSTOM_BASE_URL/page.md" > .claude/commands/page.md
# ... repeat for other commands
```

### Selective Installation

Install only specific commands:

```bash
BASE_URL="https://raw.githubusercontent.com/user/cc-self-refer/main/templates/commands"

# Install only planning commands
curl -s "$BASE_URL/plan.md" > .claude/commands/plan.md

# Install only pattern commands  
curl -s "$BASE_URL/use-code-pattern.md" > .claude/commands/use-code-pattern.md
curl -s "$BASE_URL/code-pattern.md" > .claude/commands/code-pattern.md
```

## Integration Features

### Project-Local Commands

All installed commands work with the local `.claude` directory:
- Commands automatically use project-specific content
- No global command pollution
- Each project maintains its own context

### cc-self-refer Integration  

Commands use `npx -y cc-self-refer` for optimal performance:
- Fast Node.js-based operations
- Intelligent semantic search
- AI-optimized context formatting
- Cross-platform compatibility

### Command Syncing

Keep commands updated:

```bash
# Re-run installation to update commands
BASE_URL="https://raw.githubusercontent.com/user/cc-self-refer/main/templates/commands"
curl -s "$BASE_URL/page.md" > .claude/commands/page.md
# ... repeat for other commands

echo "🔄 Commands updated to latest version"
```

## Directory Structure

After initialization, your project will have:

```
project/
├── .claude/
│   ├── commands/           # Claude Code commands  
│   │   ├── page.md
│   │   ├── plan.md
│   │   ├── refer-page.md
│   │   ├── refer-knowledge.md
│   │   ├── use-code-pattern.md
│   │   └── code-pattern.md
│   ├── pages/             # Session history files
│   ├── plans/             # Strategic plan documents
│   ├── code-patterns/     # Reusable code patterns
│   └── knowledge/         # Domain knowledge base
└── [your project files]
```

## Usage Examples

### Initialize New Project

```bash
cd my-new-project
# Run /init-claude command
# Commands are now available in this project
```

### Add to Existing Project

```bash  
cd existing-project
# Run /init-claude command  
# Adds Claude Code capabilities without disrupting existing structure
```

### Team Collaboration

```bash
# Team member clones project
git clone project-repo
cd project-repo

# Initialize Claude Code (commands already in repo)
# Ready to use project-specific Claude context
```

## Error Handling

### Network Issues
- **Connection Failed**: Check internet connection and try again
- **404 Errors**: Verify repository URL and branch name
- **Timeout**: Retry command or check repository availability

### Permission Issues  
- **Write Failed**: Ensure write permissions in project directory
- **Directory Creation**: Check if `.claude` can be created in current directory

### Command Conflicts
- **Existing Commands**: Backup existing `.claude/commands/` before reinstalling
- **Custom Commands**: Avoid overwriting custom command modifications

This command provides seamless Claude Code project initialization with integrated cc-self-refer capabilities, enabling powerful self-referential development workflows.
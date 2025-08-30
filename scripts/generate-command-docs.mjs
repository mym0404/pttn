#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

/**
 * Parse command template markdown file
 */
const parseCommandTemplate = (content, filename) => {
  const lines = content.split('\n');
  const commandName = filename.replace('.md', '');
  
  // Extract title from first heading
  const titleMatch = lines.find(line => line.startsWith('# '))?.replace('# ', '');
  
  // Extract usage from usage section
  const usageIndex = lines.findIndex(line => line.includes('**Usage**:'));
  const usage = usageIndex >= 0 ? lines[usageIndex].replace('**Usage**:', '').trim() : '';
  
  // Extract purpose section
  const purposeIndex = lines.findIndex(line => line.includes('## Purpose'));
  let purpose = '';
  if (purposeIndex >= 0) {
    let i = purposeIndex + 2; // Skip the heading and empty line
    while (i < lines.length && !lines[i].startsWith('#')) {
      if (lines[i].trim()) {
        purpose += lines[i] + '\n';
      }
      i++;
    }
  }
  
  // Extract CLI commands
  const cliCommands = [];
  const codeBlocks = content.match(/```bash\n([\s\S]*?)```/g) || [];
  codeBlocks.forEach(block => {
    const commands = block.replace(/```bash\n|```/g, '').trim().split('\n');
    commands.forEach(cmd => {
      if (cmd.includes('cc-self-refer')) {
        cliCommands.push(cmd.trim());
      }
    });
  });
  
  // Extract examples
  const exampleIndex = lines.findIndex(line => line.includes('## Usage Examples'));
  let examples = '';
  if (exampleIndex >= 0) {
    let i = exampleIndex + 1;
    while (i < lines.length && !lines[i].startsWith('## ')) {
      examples += lines[i] + '\n';
      i++;
    }
  }
  
  return {
    commandName,
    title: titleMatch || commandName,
    usage,
    purpose: purpose.trim(),
    cliCommands,
    examples: examples.trim(),
    originalContent: content
  };
};

/**
 * Generate documentation page for command
 */
const generateCommandDoc = (command) => {
  const { commandName, title, usage, purpose, cliCommands, examples } = command;
  
  const docContent = `---
id: ${commandName}
title: ${title}
sidebar_label: /${commandName}
---

# ${title}

${usage ? `**Usage**: ${usage}` : ''}

## Overview

${purpose || 'This command provides functionality for cc-self-refer.'}

## CLI Integration

This Claude Code command integrates with the cc-self-refer CLI tool. Under the hood, it executes the following commands:

${cliCommands.length > 0 ? cliCommands.map(cmd => `\`\`\`bash\n${cmd}\n\`\`\``).join('\n\n') : '```bash\n# No specific CLI commands documented\n```'}

## How It Works

1. **Command Invocation**: When you type \`/${commandName}\` in Claude Code, the command is triggered
2. **CLI Execution**: The command executes the cc-self-refer CLI with appropriate parameters
3. **Result Processing**: Output is formatted and presented in the Claude Code interface

${examples ? `## Examples\n\n${examples}` : ''}

## Interactive Demo

<CommandDemo command="${commandName}" />

## Related Commands

${getRelatedCommands(commandName).map(cmd => `- [/${cmd}](./${cmd})`).join('\n')}

## Troubleshooting

### Command Not Found

If the command is not recognized:

1. Ensure cc-self-refer is initialized: \`cc-self-refer init\`
2. Check that command templates are downloaded
3. Verify the .claude/commands directory exists

### CLI Errors

If the underlying CLI command fails:

1. Check that cc-self-refer is installed globally
2. Verify you're in a project with .claude directory
3. Review the specific error message for details

## API Reference

For detailed CLI documentation, see:

\`\`\`bash
cc-self-refer ${getBaseCommand(commandName)} --help
\`\`\`
`;
  
  return docContent;
};

/**
 * Get related commands based on command name
 */
const getRelatedCommands = (commandName) => {
  const commandGroups = {
    page: ['page-save', 'page-refer'],
    plan: ['plan-create', 'plan-edit', 'plan-resolve'],
    pattern: ['pattern-create', 'pattern-use'],
    spec: ['spec', 'spec-refer']
  };
  
  for (const [group, commands] of Object.entries(commandGroups)) {
    if (commandName.startsWith(group)) {
      return commands.filter(cmd => cmd !== commandName);
    }
  }
  
  return [];
};

/**
 * Get base command from command name
 */
const getBaseCommand = (commandName) => {
  if (commandName.includes('-')) {
    return commandName.split('-')[0];
  }
  return commandName;
};

/**
 * Main function to generate command documentation
 */
const generateCommandDocs = async () => {
  console.log('📚 Generating command documentation...');
  
  const templatesDir = path.join(projectRoot, 'templates/commands');
  const outputDir = path.join(projectRoot, 'docs/docs/commands');
  
  // Ensure output directory exists
  await fs.ensureDir(outputDir);
  
  // Find all command template files
  const templateFiles = await glob('*.md', { cwd: templatesDir });
  console.log(`Found ${templateFiles.length} command templates`);
  
  // Process each template
  const commands = [];
  for (const file of templateFiles) {
    const filePath = path.join(templatesDir, file);
    const content = await fs.readFile(filePath, 'utf-8');
    const command = parseCommandTemplate(content, file);
    commands.push(command);
    
    // Generate documentation
    const docContent = generateCommandDoc(command);
    const outputPath = path.join(outputDir, file);
    await fs.writeFile(outputPath, docContent);
    console.log(`✅ Generated docs for /${command.commandName}`);
  }
  
  // Generate overview page
  const overviewContent = `---
id: overview
title: Commands Overview
sidebar_label: Overview
---

# Commands Overview

cc-self-refer provides a comprehensive set of commands for managing your project context. These commands are available both through the CLI and as Claude Code slash commands.

## Command Categories

### 📝 Page Commands

Session history and conversation management:

${commands.filter(c => c.commandName.startsWith('page')).map(c => `- **[/${c.commandName}](./${c.commandName})** - ${c.title}`).join('\n')}

### 📋 Plan Commands

Strategic planning and task management:

${commands.filter(c => c.commandName.startsWith('plan')).map(c => `- **[/${c.commandName}](./${c.commandName})** - ${c.title}`).join('\n')}

### 🎨 Pattern Commands

Code pattern library management:

${commands.filter(c => c.commandName.startsWith('pattern')).map(c => `- **[/${c.commandName}](./${c.commandName})** - ${c.title}`).join('\n')}

### 📚 Spec Commands

Project specification management:

${commands.filter(c => c.commandName.startsWith('spec')).map(c => `- **[/${c.commandName}](./${c.commandName})** - ${c.title}`).join('\n')}

## Quick Reference

| Command | Purpose | CLI Equivalent |
|---------|---------|----------------|
${commands.map(c => `| \`/${c.commandName}\` | ${c.title} | \`cc-self-refer ${getBaseCommand(c.commandName)}\` |`).join('\n')}

## Using Commands

### In Claude Code

Simply type the slash command in your conversation:

\`\`\`
/spec-refer authentication
\`\`\`

### Via CLI

Use the cc-self-refer CLI directly:

\`\`\`bash
cc-self-refer spec view authentication
\`\`\`

## Command Workflow

\`\`\`mermaid
graph LR
    A[User Input] --> B{Command Type}
    B -->|Page| C[Session Management]
    B -->|Plan| D[Strategic Planning]
    B -->|Pattern| E[Pattern Library]
    B -->|Spec| F[Specifications]
    
    C --> G[.claude/pages/]
    D --> H[.claude/plans/]
    E --> I[.claude/patterns/]
    F --> J[.claude/specs/]
    
    style A fill:#ff6b35,stroke:#fff,stroke-width:2px,color:#fff
    style B fill:#ff8659,stroke:#fff,stroke-width:2px,color:#fff
\`\`\`

## Best Practices

1. **Start with Specs**: Define your project requirements first
2. **Create Plans**: Break down implementations into manageable tasks
3. **Save Patterns**: Extract reusable code for consistency
4. **Reference Pages**: Use historical context for continuity

## Getting Help

- Use \`--help\` flag with any CLI command
- Check individual command documentation
- Visit our [GitHub repository](https://github.com/your-username/cc-self-refer) for issues
`;
  
  await fs.writeFile(path.join(outputDir, 'overview.md'), overviewContent);
  console.log('✅ Generated commands overview');
  
  console.log(`\n✨ Successfully generated documentation for ${commands.length} commands`);
};

// Run the script
generateCommandDocs().catch(console.error);
#!/usr/bin/env node

import { Command } from 'commander';
import { existsSync } from 'fs';
import { resolve } from 'path';
import pc from 'picocolors';
import { findPackageRoot } from 'workspace-tools';

import { registerInitCommands } from './commands/initCommands.js';
import { registerKnowledgeCommands } from './commands/knowledgeCommands.js';
import { registerPageCommands } from './commands/pageCommands.js';
import { registerPatternCommands } from './commands/patternCommands.js';
import { registerPlanCommands } from './commands/planCommands.js';

const program = new Command();

// Get .claude directory path for commands
const getClaudeDir = (): string => {
  return resolve(findPackageRoot(process.cwd()), '.claude');
};

// Get content directory based on --dir option
const getContentDir = (cmdOptions: { dir?: string }): string => {
  const projectRoot = findPackageRoot(process.cwd());
  return cmdOptions.dir
    ? resolve(projectRoot, cmdOptions.dir)
    : resolve(projectRoot, '.claude');
};

program
  .name('cc-self-refer')
  .description(
    'Claude Code Self Reference Helper - CLI tool for managing .claude directory content'
  )
  .version('1.0.0')
  .option(
    '-d, --dir <directory>',
    'Directory for pages, plans, patterns, and knowledges (default: .claude)',
    '.claude'
  );

// Register all command groups
registerPageCommands(program, getContentDir);
registerPlanCommands(program, getContentDir);
registerPatternCommands(program, getContentDir);
registerKnowledgeCommands(program, getContentDir);
registerInitCommands(program);

// Check if .claude directory exists (skip for init commands)
const args = process.argv;
const isInitCommand =
  args.includes('init-get-prompt') || args.includes('init-setup-project');

if (!isInitCommand) {
  const claudeDir = getClaudeDir();
  if (!existsSync(claudeDir)) {
    console.log(pc.yellow('⚠️  .claude directory not found in home directory'));
    console.log(
      pc.dim('Run `claude-code init` first or create the directory manually')
    );
    process.exit(1);
  }
}

program.parse();

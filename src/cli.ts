#!/usr/bin/env node

import { Command } from 'commander';
import { resolve } from 'path';
import { findPackageRoot } from 'workspace-tools';

import { registerInitCommands } from './commands/initCommands.js';
import { registerKnowledgeCommands } from './commands/knowledgeCommands.js';
import { registerPageCommands } from './commands/pageCommands.js';
import { registerPatternCommands } from './commands/patternCommands.js';
import { registerPlanCommands } from './commands/planCommands.js';

const program = new Command();

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

program.parse();

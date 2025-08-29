#!/usr/bin/env node

import { Command } from 'commander';
import { resolve } from 'path';
import { findPackageRoot } from 'workspace-tools';

import { registerInitCommands } from './commands/initCommands.js';
import { registerPageCommands } from './commands/pageCommands.js';
import { registerPatternCommands } from './commands/patternCommands.js';
import { registerPlanCommands } from './commands/planCommands.js';
import { registerSpecCommands } from './commands/specCommands.js';
import { getPackageVersion } from './utils/version.js';

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
  .version(getPackageVersion())
  .option(
    '-d, --dir <directory>',
    'Directory for pages, plans, patterns, and project specs (default: .claude)',
    '.claude'
  );

// Register all command groups
registerPageCommands(program, getContentDir);
registerPlanCommands(program, getContentDir);
registerPatternCommands(program, getContentDir);
registerSpecCommands(program, getContentDir);
registerInitCommands(program);

program.parse();

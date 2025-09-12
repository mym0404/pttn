#!/usr/bin/env node

import { Command } from 'commander';
import { resolve } from 'path';

import { registerInitCommands } from './commands/initCommands.js';
import { registerPageCommands } from './commands/pageCommands.js';
import { registerPatternCommands } from './commands/patternCommands.js';
import { registerPlanCommands } from './commands/planCommands.js';
import { registerSpecCommands } from './commands/specCommands.js';
import { getPackageVersion } from './utils';
import { getProjectRoot } from './utils/getProjectRoot';

const program = new Command();

// Get content directory based on --dir option
const getContentDir = (cmdOptions: { dir?: string }): string => {
  return cmdOptions.dir
    ? resolve(getProjectRoot(), cmdOptions.dir)
    : resolve(getProjectRoot(), '.claude');
};

program
  .name('cc-self-refer')
  .description(
    'Claude Code Self Reference Helper - CLI tool for managing .claude directory content'
  )
  .version(getPackageVersion())
  .option(
    '-d, --dir <directory>',
    'Directory for pages, plans, patterns, and project specs',
    '.claude'
  );

// Register all command groups
registerPageCommands(program, getContentDir);
registerPlanCommands(program, getContentDir);
registerPatternCommands(program, getContentDir);
registerSpecCommands(program, getContentDir);
registerInitCommands(program, getContentDir);

program.parse();

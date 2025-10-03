#!/usr/bin/env node

import { Command } from 'commander';
import { resolve } from 'path';

import { registerInitCommands } from './commands/initCommands.js';
import { registerPatternCommands } from './commands/patternCommands.js';
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
  .name('pttn')
  .description(
    'Claude Code Pattern Helper - CLI tool for managing .claude directory content'
  )
  .version(getPackageVersion())
  .option('-d, --dir <directory>', 'Directory for patterns', '.claude');

// Register all command groups
registerPatternCommands(program, getContentDir);
registerInitCommands(program, getContentDir);

program.parse();

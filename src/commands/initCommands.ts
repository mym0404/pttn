import { Command } from 'commander';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

import { setupClaudeSelfReferProject } from '../setup';
import { logger } from '../utils';

export const registerInitCommands = (program: Command): void => {
  program
    .command('init-get-prompt')
    .description('Get initialization prompt for Claude Code to execute')
    .action(async () => {
      try {
        const promptPath = resolve(
          import.meta.dirname,
          '..',
          'templates',
          'prompts',
          'init.md'
        );
        if (existsSync(promptPath)) {
          const promptContent = readFileSync(promptPath, 'utf-8');
          console.log(promptContent);
        } else {
          logger.error('Prompt template not found');
          process.exit(1);
        }
      } catch (error) {
        logger.error('Failed to read prompt', error);
        process.exit(1);
      }
    });

  program
    .command('init-setup-project')
    .description(
      'Setup Claude Code project directory structure and download command templates'
    )
    .option(
      '--repo <url>',
      'Custom repository URL',
      'https://raw.githubusercontent.com/mym0404/cc-self-refer/main'
    )
    .action(async (options: { repo?: string }) => {
      try {
        await setupClaudeSelfReferProject(process.cwd(), options.repo);
      } catch (error) {
        logger.error('Project setup failed', error);
        process.exit(1);
      }
    });
};

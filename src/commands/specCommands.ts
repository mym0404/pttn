import { Command } from 'commander';

import { createSpecManager } from '../managers';
import { logger, readStdin } from '../utils';
import {
  createFormatOptions,
  formatList,
  formatNoMatchResult,
  formatSearchResults,
  formatViewResult,
} from '../utils/formatters.js';

export const registerSpecCommands = (
  program: Command,
  getContentDir: (options: { dir?: string }) => string
): void => {
  const specCmd = program
    .command('spec')
    .description('Project specification management commands');

  specCmd
    .command('list')
    .description('List all project specification entries')
    .option('-c, --category <category>', 'Filter by category')
    .action(async (cmdOptions: { category?: string }) => {
      const globalOptions = program.opts();
      const manager = createSpecManager(getContentDir(globalOptions));
      try {
        const entries = await manager.list(cmdOptions.category);

        if (entries.length === 0) {
          const msg = cmdOptions.category
            ? `No spec entries found in category "${cmdOptions.category}"`
            : 'No spec entries found in .claude/specs/';
          logger.warning(msg);
          return;
        }

        const items = entries.map(
          (entry) =>
            `${entry.id}. ${entry.title} (${entry.category} | ${entry.lastUpdated.toLocaleDateString()})`
        );
        formatList('Project Specifications', items);
      } catch (error) {
        logger.error('Error listing specs', error);
      }
    });

  specCmd
    .command('search')
    .description('Search project specification repository')
    .argument('<keyword>', 'Search keyword')
    .option('-c, --category <category>', 'Filter by category')
    .action(async (keyword: string, cmdOptions: { category?: string }) => {
      const globalOptions = program.opts();
      const manager = createSpecManager(getContentDir(globalOptions));
      try {
        const results = await manager.search(keyword, cmdOptions.category);
        const specs = await manager.list(cmdOptions.category);

        const formatOptions = createFormatOptions('spec', keyword);

        formatSearchResults(
          results,
          specs,
          formatOptions,
          (item) =>
            `Category: ${item.category} | Updated: ${item.lastUpdated.toLocaleDateString()}`
        );
      } catch (error) {
        logger.error('Error searching specs', error);
      }
    });

  specCmd
    .command('create')
    .description('Create a new project specification from stdin input')
    .argument('<title>', 'Specification title')
    .option('-c, --category <category>', 'Category', 'general')
    .action(async (title: string, cmdOptions?: { category?: string }) => {
      logger.startWorkflow('Creating Project Specification');

      const globalOptions = program.opts();
      const manager = createSpecManager(getContentDir(globalOptions));
      try {
        const content = await readStdin();
        if (!content) {
          throw new Error('No content provided via stdin');
        }

        const result = await manager.create(
          title,
          content,
          cmdOptions?.category
        );
        logger.success(
          `Specification created successfully with ID: ${result.id} (${result.filename})`
        );
      } catch (error) {
        logger.error('Error creating specification', error);
      }
    });

  specCmd
    .command('view')
    .description('View a specific specification entry by ID number')
    .argument('<id>', 'Specification ID number')
    .action(async (id: string) => {
      const globalOptions = program.opts();
      const manager = createSpecManager(getContentDir(globalOptions));

      // Validate that id is a number
      if (!/^\d+$/.test(id)) {
        logger.error('Invalid ID format. Please provide a numeric ID.');
        return;
      }

      try {
        const content = await manager.view(id);
        formatViewResult(content);
      } catch (error) {
        formatNoMatchResult('spec', id);
      }
    });
};

import { Command } from 'commander';

import { createSpecManager } from '../managers';
import { logger, readStdin } from '../utils';

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
        logger.list('📋 Project Specifications', items);
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

        // Always use AI-optimized output
        const { formatSingleMatch, formatMultipleMatches, formatNoMatches } =
          await import('../utils/formatters.js');

        const formattedItems = results.map((result) => {
          const entry = specs.find((s) => s.file === result.file);
          return {
            id: entry?.id || 0,
            title: result.title.replace(/\s*\([^)]*\)$/, ''), // Remove category suffix
            file: result.file,
            metadata: `Category: ${entry?.category || 'Unknown'} | Updated: ${entry?.lastUpdated.toLocaleDateString() || 'Unknown'}`,
            content: entry?.content || '',
          };
        });

        const formatOptions = {
          type: 'spec' as const,
          searchTerm: keyword,
          emoji: '📋',
          title: 'Project Specifications',
        };

        if (results.length === 0) {
          const availableSpecs = specs.slice(0, 5).map((entry) => ({
            id: entry.id,
            title: entry.title,
            file: entry.file,
            metadata: `Category: ${entry.category} | Updated: ${entry.lastUpdated.toLocaleDateString()}`,
            content: entry.content || '',
          }));
          console.log(formatNoMatches(availableSpecs, formatOptions));
        } else if (results.length === 1) {
          console.log(formatSingleMatch(formattedItems[0], formatOptions));
        } else {
          console.log(formatMultipleMatches(formattedItems, formatOptions));
        }
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
        logger.endWorkflow();
      } catch (error) {
        logger.error('Error creating specification', error);
        logger.endWorkflow();
      }
    });

  specCmd
    .command('view')
    .description('View a specific specification entry by ID or search term')
    .argument('<idOrKeyword>', 'Specification ID or search keyword')
    .action(async (idOrKeyword: string) => {
      const globalOptions = program.opts();
      const manager = createSpecManager(getContentDir(globalOptions));
      try {
        const content = await manager.view(idOrKeyword);

        // Always use AI-optimized output
        const specs = await manager.list();
        const entry = specs.find(
          (s) =>
            s.id.toString() === idOrKeyword ||
            s.title.toLowerCase().includes(idOrKeyword.toLowerCase())
        );

        if (entry) {
          const { formatSingleMatch } = await import('../utils/formatters.js');

          const formattedItem = {
            id: entry.id,
            title: entry.title,
            file: entry.file,
            metadata: `Category: ${entry.category} | Updated: ${entry.lastUpdated.toLocaleDateString()}`,
            content: content,
          };

          const formatOptions = {
            type: 'spec' as const,
            emoji: '📋',
            title: 'Project Specifications',
          };

          console.log(formatSingleMatch(formattedItem, formatOptions));
        }
      } catch (error) {
        logger.error('Error viewing spec', error);
      }
    });
};

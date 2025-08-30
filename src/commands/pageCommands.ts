import { Command } from 'commander';

import { createPageManager } from '../managers';
import { logger } from '../utils';
import {
  createFormatOptions,
  formatList,
  formatNoMatchResult,
  formatSearchResults,
  formatViewResult,
} from '../utils/formatters.js';
import { SessionExtractor } from '../utils/SessionExtractor.js';

export const registerPageCommands = (
  program: Command,
  getContentDir: (options: { dir?: string }) => string
): void => {
  const pageCmd = program
    .command('page')
    .description('Manage session pages in .claude/pages/');

  pageCmd
    .command('list')
    .description('List all session pages')
    .action(async () => {
      const globalOptions = program.opts();
      const manager = createPageManager(getContentDir(globalOptions));
      try {
        const pages = await manager.list();

        if (pages.length === 0) {
          logger.warning('No pages found in .claude/pages/');
          return;
        }

        const items = pages.map((page) => ({
          id: page.id,
          text: `${page.title} (${page.file}) - Created: ${page.createdAt.toLocaleDateString()}`,
        }));
        formatList('Session Pages', items);
      } catch (error) {
        logger.error('Error listing pages', error);
      }
    });

  pageCmd
    .command('search')
    .description('Search session pages by keyword')
    .argument('<keyword>', 'Search keyword')
    .action(async (keyword: string) => {
      const globalOptions = program.opts();
      const manager = createPageManager(getContentDir(globalOptions));
      try {
        const results = await manager.search(keyword);
        const pages = await manager.list();
        const formatOptions = createFormatOptions('page', keyword);

        formatSearchResults(
          results,
          pages,
          formatOptions,
          (item) => `Created: ${item.createdAt.toLocaleDateString()}`
        );
        // Always return AI-optimized output, no need for console output
      } catch (error) {
        logger.error('Error searching pages', error);
      }
    });

  pageCmd
    .command('view')
    .description('View a specific page by ID number')
    .argument('<id>', 'Page ID number')
    .action(async (id: string) => {
      const globalOptions = program.opts();
      const manager = createPageManager(getContentDir(globalOptions));

      // Validate that id is a number
      if (!/^\d+$/.test(id)) {
        logger.error('Invalid ID format. Please provide a numeric ID.');
        return;
      }

      try {
        const content = await manager.view(id);
        formatViewResult(content);
      } catch (error) {
        formatNoMatchResult('page', id);
      }
    });

  // Alias for save command - automatically extracts session if no content provided
  pageCmd
    .command('create')
    .description(
      'Create a new page - automatically extracts current session if no content provided'
    )
    .argument('[title]', 'Page title (optional)')
    .action(async (title?: string) => {
      const globalOptions = program.opts();
      const manager = createPageManager(getContentDir(globalOptions));

      try {
        let finalTitle =
          title ||
          `Session-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}`;

        let finalContent = '';

        try {
          const extractor = new SessionExtractor();
          finalContent = await extractor.extractCurrentSession();

          if (!title) {
            finalTitle = `Session-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}`;
          }
        } catch (extractError) {
          throw new Error(`Session extraction failed: ${extractError}`);
        }

        if (!finalContent) {
          throw new Error('No content provided and session extraction failed');
        }

        await manager.create(finalTitle, finalContent);

        console.log(`Page Created Successfully`);
      } catch (error) {
        console.error(`# Page Creation Failed`);
      }
    });
};

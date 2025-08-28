import { Command } from 'commander';
import pc from 'picocolors';

import { createPageManager } from '../managers';

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
          console.log(pc.yellow('No pages found in .claude/pages/'));
          return;
        }

        console.log(pc.cyan('\n📄 Session Pages:'));
        pages.forEach((page, index) => {
          console.log(
            `  ${index + 1}. ${pc.bold(page.title)} ${pc.dim(`(${page.file})`)}`
          );
          console.log(
            `     ${pc.dim(`Created: ${page.createdAt.toLocaleDateString()}`)}`
          );
        });
        console.log();
      } catch (error) {
        console.error(pc.red('Error listing pages:'), error);
      }
    });

  pageCmd
    .command('search')
    .description('Search session pages by keyword')
    .argument('<keyword>', 'Search keyword')
    .option('--context', 'Output formatted for AI context instead of console')
    .action(async (keyword: string, cmdOptions: { context?: boolean }) => {
      const globalOptions = program.opts();
      const manager = createPageManager(getContentDir(globalOptions));
      try {
        const results = await manager.search(keyword);
        const pages = await manager.list();

        if (cmdOptions.context) {
          const { formatSingleMatch, formatMultipleMatches, formatNoMatches } =
            await import('../formatters.js');

          const formattedItems = results.map((result) => {
            const page = pages.find((p) => p.file === result.file);
            return {
              id: page?.id || 0,
              title: result.title,
              file: result.file,
              metadata: `Created: ${page?.createdAt.toLocaleDateString() || 'Unknown'}`,
              content: page?.content || '',
            };
          });

          const formatOptions = {
            type: 'page' as const,
            searchTerm: keyword,
            emoji: '📄',
            title: 'Session Page',
            outputMode: 'context' as const,
          };

          if (results.length === 0) {
            const availablePages = pages.slice(0, 5).map((page) => ({
              id: page.id,
              title: page.title,
              file: page.file,
              metadata: `Created: ${page.createdAt.toLocaleDateString()}`,
              content: page.content || '',
            }));
            console.log(formatNoMatches(availablePages, formatOptions));
          } else if (results.length === 1) {
            console.log(formatSingleMatch(formattedItems[0], formatOptions));
          } else {
            console.log(formatMultipleMatches(formattedItems, formatOptions));
          }
          return;
        }

        // Original console output
        if (results.length === 0) {
          console.log(pc.yellow(`No pages found matching "${keyword}"`));
          return;
        }

        console.log(pc.cyan(`\n🔍 Search results for "${keyword}":`));
        results.forEach((result, index) => {
          console.log(
            `  ${index + 1}. ${pc.bold(result.title)} ${pc.dim(`(score: ${result.score})`)}`
          );
          console.log(`     ${pc.dim(result.file)}`);
        });
        console.log();
      } catch (error) {
        console.error(pc.red('Error searching pages:'), error);
      }
    });

  pageCmd
    .command('view')
    .description('View a specific page by ID or search term')
    .argument('<idOrKeyword>', 'Page ID or search keyword')
    .option('--context', 'Output formatted for AI context instead of console')
    .action(async (idOrKeyword: string, cmdOptions: { context?: boolean }) => {
      const globalOptions = program.opts();
      const manager = createPageManager(getContentDir(globalOptions));
      try {
        const content = await manager.view(idOrKeyword);
        const pages = await manager.list();
        const page = pages.find(
          (p) =>
            p.id.toString() === idOrKeyword ||
            p.title.toLowerCase().includes(idOrKeyword.toLowerCase())
        );

        if (cmdOptions.context && page) {
          const { formatSingleMatch } = await import('../formatters.js');

          const formattedItem = {
            id: page.id,
            title: page.title,
            file: page.file,
            metadata: `Created: ${page.createdAt.toLocaleDateString()}`,
            content: content,
          };

          const formatOptions = {
            type: 'page' as const,
            emoji: '📄',
            title: 'Session Page',
            outputMode: 'context' as const,
          };

          console.log(formatSingleMatch(formattedItem, formatOptions));
          return;
        }

        // Original console output
        console.log(pc.cyan('\n📄 Page Content:\n'));
        console.log(content);
      } catch (error) {
        console.error(pc.red('Error viewing page:'), error);
      }
    });

  pageCmd
    .command('save')
    .description('Save session history to pages')
    .argument('<title>', 'Page title')
    .argument('<content>', 'Page content')
    .action(async (title: string, content: string) => {
      const globalOptions = program.opts();
      const manager = createPageManager(getContentDir(globalOptions));
      try {
        const pageId = await manager.save(title, content);
        console.log(pc.green(`✅ Page saved successfully: ${pageId}`));
      } catch (error) {
        console.error(pc.red('Error saving page:'), error);
      }
    });

  // Alias for save command
  pageCmd
    .command('create')
    .description('Create a new page (alias for save)')
    .argument('<title>', 'Page title')
    .argument('<content>', 'Page content')
    .action(async (title: string, content: string) => {
      const globalOptions = program.opts();
      const manager = createPageManager(getContentDir(globalOptions));
      try {
        const pageId = await manager.create(title, content);
        console.log(pc.green(`✅ Page created successfully: ${pageId}`));
      } catch (error) {
        console.error(pc.red('Error creating page:'), error);
      }
    });
};

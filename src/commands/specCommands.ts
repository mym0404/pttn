import { Command } from 'commander';
import pc from 'picocolors';

import { createSpecManager } from '../managers';

export const registerSpecCommands = (
  program: Command,
  getContentDir: (options: { dir?: string }) => string
): void => {
  const specCmd = program
    .command('spec')
    .description('Manage technical specifications in .claude/specs/');

  specCmd
    .command('list')
    .description('List all spec entries')
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
          console.log(pc.yellow(msg));
          return;
        }

        console.log(pc.cyan('\n📋 Technical Specifications:'));
        entries.forEach((entry) => {
          console.log(`  ${pc.bold(`${entry.id}.`)} ${entry.title}`);
          console.log(
            `     ${pc.dim(`Category: ${entry.category} | Updated: ${entry.lastUpdated.toLocaleDateString()}`)}`
          );
        });
        console.log();
      } catch (error) {
        console.error(pc.red('Error listing specs:'), error);
      }
    });

  specCmd
    .command('search')
    .description('Search specification repository')
    .argument('<keyword>', 'Search keyword')
    .option('-c, --category <category>', 'Filter by category')
    .option('--context', 'Output formatted for AI context instead of console')
    .action(
      async (
        keyword: string,
        cmdOptions: { category?: string; context?: boolean }
      ) => {
        const globalOptions = program.opts();
        const manager = createSpecManager(getContentDir(globalOptions));
        try {
          const results = await manager.search(keyword, cmdOptions.category);
          const specs = await manager.list(cmdOptions.category);

          if (cmdOptions.context) {
            const {
              formatSingleMatch,
              formatMultipleMatches,
              formatNoMatches,
            } = await import('../formatters.js');

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
              title: 'Technical Specifications',
              outputMode: 'context' as const,
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
            return;
          }

          if (results.length === 0) {
            console.log(
              pc.yellow(`No spec entries found matching "${keyword}"`)
            );
            return;
          }

          console.log(
            pc.cyan(`\n🔍 Specification search results for "${keyword}":`)
          );
          results.forEach((result, index) => {
            console.log(
              `  ${index + 1}. ${pc.bold(result.title)}`
            );
            console.log(
              `     ${pc.dim(`Score: ${result.score} | ${result.file}`)}`
            );
          });
          console.log();
        } catch (error) {
          console.error(pc.red('Error searching specs:'), error);
        }
      }
    );

  specCmd
    .command('create')
    .description('Create a new specification entry')
    .argument('<title>', 'Title for the specification entry')
    .argument('<content>', 'Specification content')
    .option(
      '-c, --category <category>',
      'Category for the specification entry',
      'general'
    )
    .action(
      async (
        title: string,
        content: string,
        cmdOptions: { category?: string }
      ) => {
        const globalOptions = program.opts();
        const manager = createSpecManager(getContentDir(globalOptions));

        try {
          const { id, filename } = await manager.create(
            title,
            content,
            cmdOptions.category || 'general'
          );

          console.log(pc.green(`✅ Created specification entry #${id}: ${title}`));
          console.log(pc.dim(`   File: .claude/specs/${filename}`));
          console.log(
            pc.dim(`   Category: ${cmdOptions.category || 'general'}`)
          );
        } catch (error) {
          console.error(pc.red('Error creating spec entry:'), error);
        }
      }
    );

  specCmd
    .command('view')
    .description('View a specific specification entry by ID or search term')
    .argument('<idOrKeyword>', 'Specification ID or search keyword')
    .option('--context', 'Output formatted for AI context instead of console')
    .action(async (idOrKeyword: string, cmdOptions: { context?: boolean }) => {
      const globalOptions = program.opts();
      const manager = createSpecManager(getContentDir(globalOptions));
      try {
        const content = await manager.view(idOrKeyword);

        if (cmdOptions.context) {
          const specs = await manager.list();
          const entry = specs.find(
            (s) =>
              s.id.toString() === idOrKeyword ||
              s.title.toLowerCase().includes(idOrKeyword.toLowerCase())
          );

          if (entry) {
            const { formatSingleMatch } = await import('../formatters.js');

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
              title: 'Technical Specifications',
              outputMode: 'context' as const,
            };

            console.log(formatSingleMatch(formattedItem, formatOptions));
            return;
          }
        }

        console.log(pc.cyan('\n📋 Specification Content:\n'));
        console.log(content);
      } catch (error) {
        console.error(pc.red('Error viewing spec:'), error);
      }
    });
};
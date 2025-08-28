import { Command } from 'commander';
import pc from 'picocolors';

import { createKnowledgeManager } from '../managers';

export const registerKnowledgeCommands = (
  program: Command,
  getContentDir: (options: { dir?: string }) => string
): void => {
  const knowledgeCmd = program
    .command('knowledge')
    .description('Manage knowledge base in .claude/knowledges/');

  knowledgeCmd
    .command('list')
    .description('List all knowledge entries')
    .option('-c, --category <category>', 'Filter by category')
    .action(async (cmdOptions: { category?: string }) => {
      const globalOptions = program.opts();
      const manager = createKnowledgeManager(getContentDir(globalOptions));
      try {
        const entries = await manager.list(cmdOptions.category);

        if (entries.length === 0) {
          const msg = cmdOptions.category
            ? `No knowledge entries found in category "${cmdOptions.category}"`
            : 'No knowledge entries found in .claude/knowledges/';
          console.log(pc.yellow(msg));
          return;
        }

        console.log(pc.cyan('\n🧠 Knowledge Base:'));
        entries.forEach((entry) => {
          console.log(`  ${pc.bold(`${entry.id}.`)} ${entry.title}`);
          console.log(
            `     ${pc.dim(`Category: ${entry.category} | Updated: ${entry.lastUpdated.toLocaleDateString()}`)}`
          );
        });
        console.log();
      } catch (error) {
        console.error(pc.red('Error listing knowledge:'), error);
      }
    });

  knowledgeCmd
    .command('search')
    .description('Search knowledge base')
    .argument('<keyword>', 'Search keyword')
    .option('-c, --category <category>', 'Filter by category')
    .option('--context', 'Output formatted for AI context instead of console')
    .action(
      async (
        keyword: string,
        cmdOptions: { category?: string; context?: boolean }
      ) => {
        const globalOptions = program.opts();
        const manager = createKnowledgeManager(getContentDir(globalOptions));
        try {
          const results = await manager.search(keyword, cmdOptions.category);
          const knowledge = await manager.list(cmdOptions.category);

          if (cmdOptions.context) {
            const {
              formatSingleMatch,
              formatMultipleMatches,
              formatNoMatches,
            } = await import('../formatters.js');

            const formattedItems = results.map((result) => {
              const entry = knowledge.find((k) => k.file === result.file);
              return {
                id: entry?.id || 0,
                title: result.title.replace(/\s*\([^)]*\)$/, ''), // Remove category suffix
                file: result.file,
                metadata: `Category: ${entry?.category || 'Unknown'} | Updated: ${entry?.lastUpdated.toLocaleDateString() || 'Unknown'}`,
                content: entry?.content || '',
              };
            });

            const formatOptions = {
              type: 'knowledge' as const,
              searchTerm: keyword,
              emoji: '🧠',
              title: 'Domain Knowledge',
              outputMode: 'context' as const,
            };

            if (results.length === 0) {
              const availableKnowledge = knowledge.slice(0, 5).map((entry) => ({
                id: entry.id,
                title: entry.title,
                file: entry.file,
                metadata: `Category: ${entry.category} | Updated: ${entry.lastUpdated.toLocaleDateString()}`,
                content: entry.content || '',
              }));
              console.log(formatNoMatches(availableKnowledge, formatOptions));
            } else if (results.length === 1) {
              console.log(formatSingleMatch(formattedItems[0], formatOptions));
            } else {
              console.log(formatMultipleMatches(formattedItems, formatOptions));
            }
            return;
          }

          if (results.length === 0) {
            console.log(
              pc.yellow(`No knowledge entries found matching "${keyword}"`)
            );
            return;
          }

          console.log(
            pc.cyan(`\n🔍 Knowledge search results for "${keyword}":`)
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
          console.error(pc.red('Error searching knowledge:'), error);
        }
      }
    );

  knowledgeCmd
    .command('create')
    .description('Create a new knowledge entry')
    .argument('<title>', 'Title for the knowledge entry')
    .argument('<content>', 'Knowledge content')
    .option(
      '-c, --category <category>',
      'Category for the knowledge entry',
      'general'
    )
    .action(
      async (
        title: string,
        content: string,
        cmdOptions: { category?: string }
      ) => {
        const globalOptions = program.opts();
        const manager = createKnowledgeManager(getContentDir(globalOptions));

        try {
          const { id, filename } = await manager.create(
            title,
            content,
            cmdOptions.category || 'general'
          );

          console.log(pc.green(`✅ Created knowledge entry #${id}: ${title}`));
          console.log(pc.dim(`   File: .claude/knowledges/${filename}`));
          console.log(
            pc.dim(`   Category: ${cmdOptions.category || 'general'}`)
          );
        } catch (error) {
          console.error(pc.red('Error creating knowledge entry:'), error);
        }
      }
    );

  knowledgeCmd
    .command('view')
    .description('View a specific knowledge entry by ID or search term')
    .argument('<idOrKeyword>', 'Knowledge ID or search keyword')
    .option('--context', 'Output formatted for AI context instead of console')
    .action(async (idOrKeyword: string, cmdOptions: { context?: boolean }) => {
      const globalOptions = program.opts();
      const manager = createKnowledgeManager(getContentDir(globalOptions));
      try {
        const content = await manager.view(idOrKeyword);

        if (cmdOptions.context) {
          const knowledge = await manager.list();
          const entry = knowledge.find(
            (k) =>
              k.id.toString() === idOrKeyword ||
              k.title.toLowerCase().includes(idOrKeyword.toLowerCase())
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
              type: 'knowledge' as const,
              emoji: '🧠',
              title: 'Domain Knowledge',
              outputMode: 'context' as const,
            };

            console.log(formatSingleMatch(formattedItem, formatOptions));
            return;
          }
        }

        console.log(pc.cyan('\n🧠 Knowledge Content:\n'));
        console.log(content);
      } catch (error) {
        console.error(pc.red('Error viewing knowledge:'), error);
      }
    });
};

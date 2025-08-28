import { intro, outro } from '@clack/prompts';
import { Command } from 'commander';
import pc from 'picocolors';

import { createPatternManager } from '../managers';

export const registerPatternCommands = (
  program: Command,
  getContentDir: (options: { dir?: string }) => string
): void => {
  const patternCmd = program
    .command('pattern')
    .description('Manage code patterns in .claude/patterns/');

  patternCmd
    .command('list')
    .description('List all code patterns')
    .action(async () => {
      const globalOptions = program.opts();
      const manager = createPatternManager(getContentDir(globalOptions));
      try {
        const patterns = await manager.list();

        if (patterns.length === 0) {
          console.log(pc.yellow('No patterns found in .claude/patterns/'));
          return;
        }

        console.log(pc.cyan('\n🧩 Code Patterns:'));
        patterns.forEach((pattern) => {
          console.log(`  ${pc.bold(`${pattern.id}.`)} ${pattern.title}`);
          console.log(
            `     ${pc.dim(`Language: ${pattern.language} | Updated: ${pattern.lastUpdated.toLocaleDateString()}`)}`
          );
        });
        console.log();
      } catch (error) {
        console.error(pc.red('Error listing patterns:'), error);
      }
    });

  patternCmd
    .command('search')
    .description('Search code patterns')
    .argument('<keyword>', 'Search keyword')
    .option('-l, --language <lang>', 'Filter by programming language')
    .option('--context', 'Output formatted for AI context instead of console')
    .action(
      async (
        keyword: string,
        cmdOptions: { language?: string; context?: boolean }
      ) => {
        const globalOptions = program.opts();
        const manager = createPatternManager(getContentDir(globalOptions));
        try {
          const results = await manager.search(keyword, cmdOptions.language);
          const patterns = await manager.list();

          if (cmdOptions.context) {
            const {
              formatSingleMatch,
              formatMultipleMatches,
              formatNoMatches,
            } = await import('../formatters.js');

            const formattedItems = results.map((result) => {
              const pattern = patterns.find((p) => p.file === result.file);
              return {
                id: pattern?.id || 0,
                title: result.title.replace(/\s*\([^)]*\)$/, ''), // Remove language suffix
                file: result.file,
                metadata: `Language: ${pattern?.language || 'Unknown'} | Updated: ${pattern?.lastUpdated.toLocaleDateString() || 'Unknown'}`,
                content: pattern?.content || '',
              };
            });

            const formatOptions = {
              type: 'pattern' as const,
              searchTerm: keyword,
              emoji: '🧩',
              title: 'Code Pattern',
              outputMode: 'context' as const,
            };

            if (results.length === 0) {
              const availablePatterns = patterns.slice(0, 5).map((pattern) => ({
                id: pattern.id,
                title: pattern.title,
                file: pattern.file,
                metadata: `Language: ${pattern.language} | Updated: ${pattern.lastUpdated.toLocaleDateString()}`,
                content: pattern.content || '',
              }));
              console.log(formatNoMatches(availablePatterns, formatOptions));
            } else if (results.length === 1) {
              console.log(formatSingleMatch(formattedItems[0], formatOptions));
            } else {
              console.log(formatMultipleMatches(formattedItems, formatOptions));
            }
            return;
          }

          if (results.length === 0) {
            console.log(pc.yellow(`No patterns found matching "${keyword}"`));
            return;
          }

          console.log(pc.cyan(`\n🔍 Pattern search results for "${keyword}":`));
          results.forEach((result, index) => {
            console.log(
              `  ${index + 1}. ${pc.bold(result.title)} ${pc.dim(`(${result.language})`)}`
            );
            console.log(
              `     ${pc.dim(`Score: ${result.score} | ${result.file}`)}`
            );
          });
          console.log();
        } catch (error) {
          console.error(pc.red('Error searching patterns:'), error);
        }
      }
    );

  patternCmd
    .command('view')
    .description('View a specific code pattern by ID or search term')
    .argument('<idOrKeyword>', 'Pattern ID or search keyword')
    .option('--context', 'Output formatted for AI context instead of console')
    .action(async (idOrKeyword: string, cmdOptions: { context?: boolean }) => {
      const globalOptions = program.opts();
      const manager = createPatternManager(getContentDir(globalOptions));
      try {
        const content = await manager.view(idOrKeyword);

        if (cmdOptions.context) {
          const patterns = await manager.list();
          const pattern = patterns.find(
            (p) =>
              p.id.toString() === idOrKeyword ||
              p.title.toLowerCase().includes(idOrKeyword.toLowerCase())
          );

          if (pattern) {
            const { formatSingleMatch } = await import('../formatters.js');

            const formattedItem = {
              id: pattern.id,
              title: pattern.title,
              file: pattern.file,
              metadata: `Language: ${pattern.language} | Updated: ${pattern.lastUpdated.toLocaleDateString()}`,
              content: content,
            };

            const formatOptions = {
              type: 'pattern' as const,
              emoji: '🧩',
              title: 'Code Pattern',
              outputMode: 'context' as const,
            };

            console.log(formatSingleMatch(formattedItem, formatOptions));
            return;
          }
        }

        console.log(pc.cyan('\n🧩 Pattern Content:\n'));
        console.log(content);
      } catch (error) {
        console.error(pc.red('Error viewing pattern:'), error);
      }
    });

  patternCmd
    .command('create')
    .description('Create a new code pattern')
    .argument('<name>', 'Pattern name')
    .argument('[content]', 'Pattern description or content (optional)')
    .option('-l, --language <lang>', 'Programming language', 'text')
    .action(
      async (
        name: string,
        content?: string,
        cmdOptions?: { language?: string }
      ) => {
        intro(pc.cyan('Creating Code Pattern'));

        const globalOptions = program.opts();
        const manager = createPatternManager(getContentDir(globalOptions));
        try {
          // If no content provided, use just the name as content
          const patternContent = content || name;
          const filename = await manager.create(
            name,
            patternContent,
            cmdOptions?.language
          );
          outro(pc.green(`✅ Pattern created successfully: ${filename}`));
        } catch (error) {
          outro(pc.red(`❌ Error creating pattern: ${error}`));
        }
      }
    );

  patternCmd
    .command('use')
    .description('Use a code pattern by ID or search term')
    .argument('<idOrKeyword>', 'Pattern ID or search keyword')
    .option('--context', 'Output formatted for AI context instead of console')
    .action(async (idOrKeyword: string, cmdOptions: { context?: boolean }) => {
      const globalOptions = program.opts();
      const manager = createPatternManager(getContentDir(globalOptions));
      try {
        const content = await manager.use(idOrKeyword);

        if (cmdOptions.context) {
          const patterns = await manager.list();
          const pattern = patterns.find(
            (p) =>
              p.id.toString() === idOrKeyword ||
              p.title.toLowerCase().includes(idOrKeyword.toLowerCase())
          );

          if (pattern) {
            const { formatSingleMatch } = await import('../formatters.js');

            const formattedItem = {
              id: pattern.id,
              title: pattern.title,
              file: pattern.file,
              metadata: `Language: ${pattern.language} | Updated: ${pattern.lastUpdated.toLocaleDateString()}`,
              content: content,
            };

            const formatOptions = {
              type: 'pattern' as const,
              emoji: '🧩',
              title: 'Code Pattern',
              outputMode: 'context' as const,
            };

            console.log(formatSingleMatch(formattedItem, formatOptions));
            return;
          }
        }

        console.log(pc.cyan('\n🧩 Pattern Content:\n'));
        console.log(content);
      } catch (error) {
        console.error(pc.red('Error using pattern:'), error);
      }
    });
};

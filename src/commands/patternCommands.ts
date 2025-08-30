import { Command } from 'commander';

import { createPatternManager } from '../managers/index.js';
import { logger, readStdin } from '../utils/index.js';

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
          logger.warning('No patterns found in .claude/patterns/');
          return;
        }

        const items = patterns.map(
          (pattern) =>
            `${pattern.title} - Language: ${pattern.language} | Updated: ${pattern.lastUpdated.toLocaleDateString()}`
        );
        logger.list('🧩 Code Patterns', items);
      } catch (error) {
        logger.error('Error listing patterns', error);
      }
    });

  patternCmd
    .command('search')
    .description('Search code patterns')
    .argument('<keyword>', 'Search keyword')
    .option('-l, --language <lang>', 'Filter by programming language')
    .action(async (keyword: string, cmdOptions: { language?: string }) => {
      const globalOptions = program.opts();
      const manager = createPatternManager(getContentDir(globalOptions));
      try {
        const results = await manager.search(keyword, cmdOptions.language);
        const patterns = await manager.list();

        // Always use AI-optimized output
        const { formatSingleMatch, formatMultipleMatches, formatNoMatches } =
          await import('../utils/formatters.js');

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
      } catch (error) {
        logger.error('Error searching patterns', error);
      }
    });

  patternCmd
    .command('view')
    .description('View a specific code pattern by ID or search term')
    .argument('<idOrKeyword>', 'Pattern ID or search keyword')
    .action(async (idOrKeyword: string) => {
      const globalOptions = program.opts();
      const manager = createPatternManager(getContentDir(globalOptions));
      try {
        const content = await manager.view(idOrKeyword);

        // Always use AI-optimized output
        const patterns = await manager.list();
        const pattern = patterns.find(
          (p) =>
            p.id.toString() === idOrKeyword ||
            p.title.toLowerCase().includes(idOrKeyword.toLowerCase())
        );

        if (pattern) {
          const { formatSingleMatch } = await import('../utils/formatters.js');

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
          };

          console.log(formatSingleMatch(formattedItem, formatOptions));
          return;
        }
      } catch (error) {
        logger.error('Error viewing pattern', error);
      }
    });

  patternCmd
    .command('create')
    .description('Create a new code pattern from stdin input')
    .argument('<name>', 'Pattern name')
    .action(async (name: string) => {
      logger.startWorkflow('Creating Code Pattern');

      const globalOptions = program.opts();
      const manager = createPatternManager(getContentDir(globalOptions));
      try {
        const content = await readStdin();
        if (!content) {
          throw new Error('No content provided via stdin');
        }

        const filename = await manager.create(name, content);
        logger.success(`Pattern created successfully: ${filename}`);
        logger.endWorkflow();
      } catch (error) {
        logger.error('Error creating pattern', error);
        logger.endWorkflow();
      }
    });
};

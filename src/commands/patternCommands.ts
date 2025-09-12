import { Command } from 'commander';
import pc from 'picocolors';

import { createPatternManager } from '../managers';
import {
  createFormatOptions,
  formatList,
  formatNoMatchResult,
  formatSearchResults,
  formatViewResult,
} from '../utils/formatters.js';
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
          logger.warning('No patterns found');
          return;
        }

        const items = patterns.map((pattern) => ({
          id: pattern.id,
          text: `${pattern.title}${pattern.keywords && pattern.keywords.length > 0 ? ` - Keywords: ${pattern.keywords.join(', ')}` : ''}${pattern.explanation ? `\n     ${pc.white(pattern.explanation)}` : ''}`,
        }));
        formatList('Code Patterns', items);
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
        const formatOptions = createFormatOptions('pattern', keyword);

        formatSearchResults(
          results,
          patterns,
          formatOptions,
          (item) =>
            `${item.keywords && item.keywords.length > 0 ? ` - Keywords: ${item.keywords.join(', ')}` : ''}${item.explanation ? ` - ${pc.white(item.explanation)}` : ''}`
        );
      } catch (error) {
        logger.error('Error searching patterns', error);
      }
    });

  patternCmd
    .command('view')
    .description('View a specific code pattern by ID number')
    .argument('<id>', 'Pattern ID number')
    .action(async (id: string) => {
      const globalOptions = program.opts();
      const manager = createPatternManager(getContentDir(globalOptions));

      // Validate that id is a number
      if (!/^\d+$/.test(id)) {
        logger.error('Invalid ID format. Please provide a numeric ID.');
        return;
      }

      try {
        const content = await manager.view(id);
        formatViewResult(content);
      } catch (error) {
        formatNoMatchResult('pattern', id);
      }
    });

  patternCmd
    .command('create')
    .description('Create a new code pattern from stdin input')
    .argument('<name>', 'Pattern name')
    .argument('<keywords>', 'Comma-separated keywords for the pattern')
    .action(async (name: string, keywords: string) => {
      logger.startWorkflow('Creating Code Pattern');

      const globalOptions = program.opts();
      const manager = createPatternManager(getContentDir(globalOptions));
      try {
        const content = await readStdin();
        if (!content) {
          throw new Error('No content provided via stdin');
        }

        // Parse keywords from argument
        const keywordsList = keywords
          .split(',')
          .map((k) => k.trim())
          .filter((k) => k);

        if (keywordsList.length === 0) {
          throw new Error('At least one keyword is required');
        }

        const filename = await manager.create(name, content, keywordsList);
        logger.success(`Pattern created successfully: ${filename}`);
        logger.info(
          `Added to CLAUDE.md with keywords: ${keywordsList.join(', ')}`
        );
      } catch (error) {
        logger.error('Error creating pattern', error);
      }
    });
};

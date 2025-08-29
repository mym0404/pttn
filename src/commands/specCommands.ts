import { Command } from 'commander';

import { createSpecManager } from '../managers';
import { logger } from '../utils';

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
          await import('../formatters.js');

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
    .description('Launch interactive project planning system')
    .argument('[concept]', 'Initial concept or feature name (optional)')
    .action(async (concept?: string) => {
      try {
        logger.info(
          '\n🚀 Launching Interactive Specification Planning System...\n'
        );

        if (concept) {
          logger.info(`Starting specification planning for: "${concept}"`);
        } else {
          logger.info('Ready to begin comprehensive specification planning');
        }

        logger.info(
          '🔄 Interactive specification planning is available through Claude Code...\n'
        );

        logger.warning(
          '📋 To use the Interactive Specification Planning System:'
        );
        logger.info('   1. Open Claude Code in your project');

        if (concept) {
          logger.info(`   2. Type: /spec ${concept}`);
        } else {
          logger.info('   2. Type: /spec [concept name]');
        }

        logger.info(
          '   3. Engage in deep collaborative planning with AI agents'
        );
        logger.info(
          '   4. Generate multiple comprehensive specification files\n'
        );

        logger.success('✨ Features available in Claude Code:');
        logger.info(
          '   • Multi-agent collaboration (Research, Architecture, UX, Business, Security)'
        );
        logger.info(
          '   • Deep requirement analysis with "why-chain" questioning'
        );
        logger.info('   • Multiple interconnected specification files');
        logger.info('   • Professional-grade, implementation-ready output');
        logger.info('   • Iterative refinement and validation\n');

        // Suggest creating a simple spec if they provided content via CLI
        if (concept) {
          logger.info(`Ready to plan specifications for: "${concept}"`);
          logger.info(
            'Use the Claude Code command above for the full interactive experience.'
          );
        }
      } catch (error) {
        logger.error('Error launching specification planning system', error);
        logger.info(
          '\nTip: Ensure you have proper network connectivity and try again.'
        );
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
            title: 'Project Specifications',
          };

          console.log(formatSingleMatch(formattedItem, formatOptions));
        }
      } catch (error) {
        logger.error('Error viewing spec', error);
      }
    });
};

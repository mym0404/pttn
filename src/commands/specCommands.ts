import { Command } from 'commander';
import pc from 'picocolors';

import { createSpecManager } from '../managers';

export const registerSpecCommands = (
  program: Command,
  getContentDir: (options: { dir?: string }) => string
): void => {
  const specCmd = program
    .command('spec')
    .description('Specification management commands');

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
            console.log(`  ${index + 1}. ${pc.bold(result.title)}`);
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
    .description('Launch interactive specification planning system')
    .argument('[concept]', 'Initial concept or feature name (optional)')
    .action(async (concept?: string) => {
      const globalOptions = program.opts();
      const _contentDir = getContentDir(globalOptions);

      try {
        console.log(
          pc.cyan(
            '\n🚀 Launching Interactive Specification Planning System...\n'
          )
        );

        if (concept) {
          console.log(
            pc.blue(`Starting specification planning for: "${concept}"`)
          );
        } else {
          console.log(
            pc.blue('Ready to begin comprehensive specification planning')
          );
        }

        console.log(
          pc.dim(
            '🔄 Interactive specification planning is available through Claude Code...\n'
          )
        );

        console.log(
          pc.yellow('📋 To use the Interactive Specification Planning System:')
        );
        console.log(pc.dim('   1. Open Claude Code in your project'));

        if (concept) {
          console.log(pc.dim(`   2. Type: ${pc.bold(`/spec ${concept}`)}`));
        } else {
          console.log(pc.dim(`   2. Type: ${pc.bold('/spec')} [concept name]`));
        }

        console.log(
          pc.dim('   3. Engage in deep collaborative planning with AI agents')
        );
        console.log(
          pc.dim('   4. Generate multiple comprehensive specification files\n')
        );

        console.log(pc.green('✨ Features available in Claude Code:'));
        console.log(
          pc.dim(
            '   • Multi-agent collaboration (Research, Architecture, UX, Business, Security)'
          )
        );
        console.log(
          pc.dim('   • Deep requirement analysis with "why-chain" questioning')
        );
        console.log(pc.dim('   • Multiple interconnected specification files'));
        console.log(
          pc.dim('   • Professional-grade, implementation-ready output')
        );
        console.log(pc.dim('   • Iterative refinement and validation\n'));

        // Suggest creating a simple spec if they provided content via CLI
        if (concept) {
          console.log(
            pc.blue(`Ready to plan specifications for: "${concept}"`)
          );
          console.log(
            pc.dim(
              'Use the Claude Code command above for the full interactive experience.'
            )
          );
        }
      } catch (error) {
        console.error(
          pc.red('\n❌ Error launching specification planning system:'),
          error
        );
        console.log(
          pc.dim(
            '\nTip: Ensure you have proper network connectivity and try again.'
          )
        );
      }
    });

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

import { intro, outro } from '@clack/prompts';
import { Command } from 'commander';
import pc from 'picocolors';

import { createPlanManager } from '../managers';

export const registerPlanCommands = (
  program: Command,
  getContentDir: (options: { dir?: string }) => string
): void => {
  const planCmd = program
    .command('plan')
    .description('Manage strategic plans in .claude/plans/');

  planCmd
    .command('create')
    .description('Create a new strategic plan')
    .argument('<name>', 'Plan name')
    .argument('<description>', 'Initial description')
    .action(async (name: string, description: string) => {
      intro(pc.cyan('Creating Strategic Plan'));

      const globalOptions = program.opts();
      const manager = createPlanManager(getContentDir(globalOptions));
      try {
        const planId = await manager.create(name, description);
        outro(pc.green(`✅ Plan created successfully: ${planId}`));
      } catch (error) {
        outro(pc.red(`❌ Error creating plan: ${error}`));
      }
    });

  planCmd
    .command('list')
    .description('List all strategic plans')
    .action(async () => {
      const globalOptions = program.opts();
      const manager = createPlanManager(getContentDir(globalOptions));
      try {
        const plans = await manager.list();

        if (plans.length === 0) {
          console.log(pc.yellow('No plans found in .claude/plans/'));
          return;
        }

        console.log(pc.cyan('\n📋 Strategic Plans:'));
        plans.forEach((plan) => {
          console.log(`  ${pc.bold(`${plan.id}.`)} ${plan.title}`);
          console.log(
            `     ${pc.dim(`Status: ${plan.status} | Updated: ${plan.lastUpdated.toLocaleDateString()}`)}`
          );
        });
        console.log();
      } catch (error) {
        console.error(pc.red('Error listing plans:'), error);
      }
    });

  planCmd
    .command('view')
    .description('View a strategic plan')
    .argument('<idOrKeyword>', 'Plan ID or search keyword')
    .option('--context', 'Output formatted for AI context instead of console')
    .action(async (idOrKeyword: string, cmdOptions: { context?: boolean }) => {
      const globalOptions = program.opts();
      const manager = createPlanManager(getContentDir(globalOptions));
      try {
        const content = await manager.view(idOrKeyword);

        if (cmdOptions.context) {
          const plans = await manager.list();
          const plan = plans.find(
            (p) =>
              p.id.toString() === idOrKeyword ||
              p.title.toLowerCase().includes(idOrKeyword.toLowerCase())
          );

          if (plan) {
            const { formatSingleMatch } = await import('../formatters.js');

            const formattedItem = {
              id: plan.id,
              title: plan.title,
              file: plan.file,
              metadata: `Status: ${plan.status} | Updated: ${plan.lastUpdated.toLocaleDateString()}`,
              content: content,
            };

            const formatOptions = {
              type: 'plan' as const,
              emoji: '📋',
              title: 'Strategic Plan',
              outputMode: 'context' as const,
            };

            console.log(formatSingleMatch(formattedItem, formatOptions));
            return;
          }
        }

        console.log(pc.cyan('\n📋 Plan Content:\n'));
        console.log(content);
      } catch (error) {
        console.error(pc.red('Error viewing plan:'), error);
      }
    });

  planCmd
    .command('search')
    .description('Search strategic plans')
    .argument('<keyword>', 'Search keyword')
    .option('--context', 'Output formatted for AI context instead of console')
    .action(async (keyword: string, cmdOptions: { context?: boolean }) => {
      const globalOptions = program.opts();
      const manager = createPlanManager(getContentDir(globalOptions));
      try {
        const results = await manager.search(keyword);
        const plans = await manager.list();

        if (cmdOptions.context) {
          const { formatSingleMatch, formatMultipleMatches, formatNoMatches } =
            await import('../formatters.js');

          const formattedItems = results.map((result) => {
            const plan = plans.find((p) => p.file === result.file);
            return {
              id: plan?.id || 0,
              title: result.title,
              file: result.file,
              metadata: `Status: ${plan?.status || 'Unknown'} | Updated: ${plan?.lastUpdated.toLocaleDateString() || 'Unknown'}`,
              content: plan?.content || '',
            };
          });

          const formatOptions = {
            type: 'plan' as const,
            searchTerm: keyword,
            emoji: '📋',
            title: 'Strategic Plan',
            outputMode: 'context' as const,
          };

          if (results.length === 0) {
            const availablePlans = plans.slice(0, 5).map((plan) => ({
              id: plan.id,
              title: plan.title,
              file: plan.file,
              metadata: `Status: ${plan.status} | Updated: ${plan.lastUpdated.toLocaleDateString()}`,
              content: plan.content || '',
            }));
            console.log(formatNoMatches(availablePlans, formatOptions));
          } else if (results.length === 1) {
            console.log(formatSingleMatch(formattedItems[0], formatOptions));
          } else {
            console.log(formatMultipleMatches(formattedItems, formatOptions));
          }
          return;
        }

        if (results.length === 0) {
          console.log(pc.yellow(`No plans found matching "${keyword}"`));
          return;
        }

        console.log(pc.cyan(`\n🔍 Plan search results for "${keyword}":`));
        results.forEach((result, index) => {
          console.log(
            `  ${index + 1}. ${pc.bold(result.title)} ${pc.dim(`(score: ${result.score})`)}`
          );
          console.log(`     ${pc.dim(result.file)}`);
        });
        console.log();
      } catch (error) {
        console.error(pc.red('Error searching plans:'), error);
      }
    });

  planCmd
    .command('edit')
    .description('Edit an existing plan')
    .argument('<idOrKeyword>', 'Plan ID or search keyword')
    .argument('<modifications>', 'Modification guide')
    .action(async (idOrKeyword: string, modifications: string) => {
      intro(pc.cyan('Editing Strategic Plan'));

      const globalOptions = program.opts();
      const manager = createPlanManager(getContentDir(globalOptions));
      try {
        await manager.edit(idOrKeyword, modifications);
        outro(pc.green('✅ Plan updated successfully'));
      } catch (error) {
        outro(pc.red(`❌ Error editing plan: ${error}`));
      }
    });
};

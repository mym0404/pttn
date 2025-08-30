import { Command } from 'commander';

import { createPlanManager } from '../managers';
import { logger, readStdin } from '../utils';
import {
  createFormatOptions,
  formatNoMatchResult,
  formatSearchResults,
  formatViewResult,
} from '../utils/formatters.js';

export const registerPlanCommands = (
  program: Command,
  getContentDir: (options: { dir?: string }) => string
): void => {
  const planCmd = program
    .command('plan')
    .description('Manage strategic plans in .claude/plans/');

  planCmd
    .command('create')
    .description('Create a new strategic plan from stdin input')
    .argument('<title>', 'Plan title')
    .action(async (title: string) => {
      logger.startWorkflow('Creating Strategic Plan');

      const globalOptions = program.opts();
      const manager = createPlanManager(getContentDir(globalOptions));
      try {
        const content = await readStdin();
        if (!content) {
          throw new Error('No content provided via stdin');
        }

        const planId = await manager.create(title, content);
        logger.success(`Plan created successfully with ID: ${planId}`);
        logger.endWorkflow();
      } catch (error) {
        logger.error('Error creating plan', error);
        logger.endWorkflow();
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
          logger.warning('No plans found in .claude/plans/');
          return;
        }

        const items = plans.map(
          (plan) =>
            `${plan.title} - Status: ${plan.status} | Updated: ${plan.lastUpdated.toLocaleDateString()}`
        );
        logger.list('📋 Strategic Plans', items);
      } catch (error) {
        logger.error('Error listing plans', error);
      }
    });

  planCmd
    .command('view')
    .description('View a strategic plan by ID number')
    .argument('<id>', 'Plan ID number')
    .action(async (id: string) => {
      const globalOptions = program.opts();
      const manager = createPlanManager(getContentDir(globalOptions));

      // Validate that id is a number
      if (!/^\d+$/.test(id)) {
        logger.error('Invalid ID format. Please provide a numeric ID.');
        return;
      }

      try {
        const content = await manager.view(id);
        formatViewResult(content);
      } catch (error) {
        formatNoMatchResult('plan', id);
      }
    });

  planCmd
    .command('search')
    .description('Search strategic plans')
    .argument('<keyword>', 'Search keyword')
    .action(async (keyword: string) => {
      const globalOptions = program.opts();
      const manager = createPlanManager(getContentDir(globalOptions));
      try {
        const results = await manager.search(keyword);
        const plans = await manager.list();

        const formatOptions = createFormatOptions('plan', keyword);

        formatSearchResults(
          results,
          plans,
          formatOptions,
          (item) =>
            `Status: ${item.status} | Updated: ${item.lastUpdated.toLocaleDateString()}`
        );
      } catch (error) {
        logger.error('Error searching plans', error);
      }
    });

  planCmd
    .command('edit')
    .description('Edit an existing plan with full content replacement')
    .argument('<idOrKeyword>', 'Plan ID or search keyword')
    .argument('<fullContent>', 'Complete updated plan content')
    .action(async (idOrKeyword: string, fullContent: string) => {
      logger.startWorkflow('Editing Strategic Plan');

      const globalOptions = program.opts();
      const manager = createPlanManager(getContentDir(globalOptions));
      try {
        await manager.edit(idOrKeyword, fullContent);
        logger.success('Plan updated successfully');
        logger.endWorkflow();
      } catch (error) {
        logger.error('Error editing plan', error);
        logger.endWorkflow();
      }
    });

  planCmd
    .command('resolve')
    .description('Mark a plan as completed')
    .argument('<idOrKeyword>', 'Plan ID or search keyword')
    .action(async (idOrKeyword: string) => {
      logger.startWorkflow('Resolving Strategic Plan');

      const globalOptions = program.opts();
      const manager = createPlanManager(getContentDir(globalOptions));
      try {
        await manager.resolve(idOrKeyword);
        logger.success('Plan marked as completed');
        logger.endWorkflow();
      } catch (error) {
        logger.error('Error resolving plan', error);
        logger.endWorkflow();
      }
    });

  planCmd
    .command('delete')
    .description('Delete a completed or obsolete plan')
    .argument('<idOrKeyword>', 'Plan ID or search keyword')
    .action(async (idOrKeyword: string) => {
      const globalOptions = program.opts();
      const manager = createPlanManager(getContentDir(globalOptions));

      try {
        // Get plan info before deletion for confirmation
        const content = await manager.view(idOrKeyword);
        const title = content
          .split('\n')[0]
          .replace(/^#\s*\d+\.\s*/, '')
          .trim();

        // Delete the plan
        await manager.delete(idOrKeyword);

        // Always use AI-optimized output
        console.log(`# Plan Deleted Successfully

**Title**: ${title}
**ID/Keyword**: ${idOrKeyword}

## Action Completed

The plan has been removed from .claude/plans/ directory.

---

*Plan deletion successful. The plan file has been permanently removed.*`);
      } catch (error) {
        // Always use AI-optimized error output
        console.error(`# Plan Deletion Failed

**Error**: ${error}

## Troubleshooting

1. Verify the plan exists with \`plan list\`
2. Check the plan ID or keyword is correct
3. Ensure you have write permissions for .claude/plans/

*Unable to delete plan. Please check the error message above.*`);
      }
    });
};

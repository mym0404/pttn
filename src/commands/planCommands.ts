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
};

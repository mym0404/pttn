#!/usr/bin/env node

import { intro, outro } from '@clack/prompts';
import { Command } from 'commander';
import { existsSync } from 'fs';
import { homedir } from 'os';
import { resolve } from 'path';
import pc from 'picocolors';

import {
  createKnowledgeManager,
  createPageManager,
  createPatternManager,
  createPlanManager,
  initClaudeProject,
} from './index.js';

const program = new Command();

// Get .claude directory path
const getClaudeDir = (): string => {
  return resolve(homedir(), '.claude');
};

program
  .name('cc-self-refer')
  .description(
    'Claude Code Self Reference Helper - CLI tool for managing .claude directory content'
  )
  .version('1.0.0');

// Page management commands
const pageCmd = program
  .command('page')
  .description('Manage session pages in .claude/pages/');

pageCmd
  .command('list')
  .description('List all session pages')
  .action(async () => {
    const manager = createPageManager(getClaudeDir());
    try {
      const pages = await manager.list();

      if (pages.length === 0) {
        console.log(pc.yellow('No pages found in .claude/pages/'));
        return;
      }

      console.log(pc.cyan('\n📄 Session Pages:'));
      pages.forEach((page, index) => {
        console.log(
          `  ${index + 1}. ${pc.bold(page.title)} ${pc.dim(`(${page.file})`)}`
        );
        console.log(
          `     ${pc.dim(`Created: ${page.createdAt.toLocaleDateString()}`)}`
        );
      });
      console.log();
    } catch (error) {
      console.error(pc.red('Error listing pages:'), error);
    }
  });

pageCmd
  .command('search')
  .description('Search session pages by keyword')
  .argument('<keyword>', 'Search keyword')
  .option('--context', 'Output formatted for AI context instead of console')
  .action(async (keyword: string, options: { context?: boolean }) => {
    const manager = createPageManager(getClaudeDir());
    try {
      const results = await manager.search(keyword);
      const pages = await manager.list();

      if (options.context) {
        const { formatSingleMatch, formatMultipleMatches, formatNoMatches } =
          await import('./formatters.js');

        const formattedItems = results.map((result) => {
          const page = pages.find((p) => p.file === result.file);
          return {
            id: page?.id || 0,
            title: result.title,
            file: result.file,
            metadata: `Created: ${page?.createdAt.toLocaleDateString() || 'Unknown'}`,
            content: page?.content || '',
          };
        });

        const formatOptions = {
          type: 'page' as const,
          searchTerm: keyword,
          emoji: '📄',
          title: 'Session Page',
          outputMode: 'context' as const,
        };

        if (results.length === 0) {
          const availablePages = pages.slice(0, 5).map((page) => ({
            id: page.id,
            title: page.title,
            file: page.file,
            metadata: `Created: ${page.createdAt.toLocaleDateString()}`,
            content: page.content || '',
          }));
          console.log(formatNoMatches(availablePages, formatOptions));
        } else if (results.length === 1) {
          console.log(formatSingleMatch(formattedItems[0], formatOptions));
        } else {
          console.log(formatMultipleMatches(formattedItems, formatOptions));
        }
        return;
      }

      // Original console output
      if (results.length === 0) {
        console.log(pc.yellow(`No pages found matching "${keyword}"`));
        return;
      }

      console.log(pc.cyan(`\n🔍 Search results for "${keyword}":`));
      results.forEach((result, index) => {
        console.log(
          `  ${index + 1}. ${pc.bold(result.title)} ${pc.dim(`(score: ${result.score})`)}`
        );
        console.log(`     ${pc.dim(result.file)}`);
      });
      console.log();
    } catch (error) {
      console.error(pc.red('Error searching pages:'), error);
    }
  });

pageCmd
  .command('view')
  .description('View a specific page by ID or search term')
  .argument('<idOrKeyword>', 'Page ID or search keyword')
  .option('--context', 'Output formatted for AI context instead of console')
  .action(async (idOrKeyword: string, options: { context?: boolean }) => {
    const manager = createPageManager(getClaudeDir());
    try {
      const content = await manager.view(idOrKeyword);
      const pages = await manager.list();
      const page = pages.find(
        (p) =>
          p.id.toString() === idOrKeyword ||
          p.title.toLowerCase().includes(idOrKeyword.toLowerCase())
      );

      if (options.context && page) {
        const { formatSingleMatch } = await import('./formatters.js');

        const formattedItem = {
          id: page.id,
          title: page.title,
          file: page.file,
          metadata: `Created: ${page.createdAt.toLocaleDateString()}`,
          content: content,
        };

        const formatOptions = {
          type: 'page' as const,
          emoji: '📄',
          title: 'Session Page',
          outputMode: 'context' as const,
        };

        console.log(formatSingleMatch(formattedItem, formatOptions));
        return;
      }

      // Original console output
      console.log(pc.cyan('\n📄 Page Content:\n'));
      console.log(content);
    } catch (error) {
      console.error(pc.red('Error viewing page:'), error);
    }
  });

// Plan management commands
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

    const manager = createPlanManager(getClaudeDir());
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
    const manager = createPlanManager(getClaudeDir());
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
  .action(async (idOrKeyword: string, options: { context?: boolean }) => {
    const manager = createPlanManager(getClaudeDir());
    try {
      const content = await manager.view(idOrKeyword);

      if (options.context) {
        const plans = await manager.list();
        const plan = plans.find(
          (p) =>
            p.id.toString() === idOrKeyword ||
            p.title.toLowerCase().includes(idOrKeyword.toLowerCase())
        );

        if (plan) {
          const { formatSingleMatch } = await import('./formatters.js');

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
  .action(async (keyword: string, options: { context?: boolean }) => {
    const manager = createPlanManager(getClaudeDir());
    try {
      const results = await manager.search(keyword);
      const plans = await manager.list();

      if (options.context) {
        const { formatSingleMatch, formatMultipleMatches, formatNoMatches } =
          await import('./formatters.js');

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

    const manager = createPlanManager(getClaudeDir());
    try {
      await manager.edit(idOrKeyword, modifications);
      outro(pc.green('✅ Plan updated successfully'));
    } catch (error) {
      outro(pc.red(`❌ Error editing plan: ${error}`));
    }
  });

// Code pattern management commands
const patternCmd = program
  .command('pattern')
  .description('Manage code patterns in .claude/code-patterns/');

patternCmd
  .command('list')
  .description('List all code patterns')
  .action(async () => {
    const manager = createPatternManager(getClaudeDir());
    try {
      const patterns = await manager.list();

      if (patterns.length === 0) {
        console.log(pc.yellow('No patterns found in .claude/code-patterns/'));
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
      options: { language?: string; context?: boolean }
    ) => {
      const manager = createPatternManager(getClaudeDir());
      try {
        const results = await manager.search(keyword, options.language);
        const patterns = await manager.list();

        if (options.context) {
          const { formatSingleMatch, formatMultipleMatches, formatNoMatches } =
            await import('./formatters.js');

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
  .action(async (idOrKeyword: string, options: { context?: boolean }) => {
    const manager = createPatternManager(getClaudeDir());
    try {
      const content = await manager.view(idOrKeyword);

      if (options.context) {
        const patterns = await manager.list();
        const pattern = patterns.find(
          (p) =>
            p.id.toString() === idOrKeyword ||
            p.title.toLowerCase().includes(idOrKeyword.toLowerCase())
        );

        if (pattern) {
          const { formatSingleMatch } = await import('./formatters.js');

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

// Knowledge management commands
const knowledgeCmd = program
  .command('knowledge')
  .description('Manage knowledge base in .claude/knowledge/');

knowledgeCmd
  .command('list')
  .description('List all knowledge entries')
  .option('-c, --category <category>', 'Filter by category')
  .action(async (options: { category?: string }) => {
    const manager = createKnowledgeManager(getClaudeDir());
    try {
      const entries = await manager.list(options.category);

      if (entries.length === 0) {
        const msg = options.category
          ? `No knowledge entries found in category "${options.category}"`
          : 'No knowledge entries found in .claude/knowledge/';
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
      options: { category?: string; context?: boolean }
    ) => {
      const manager = createKnowledgeManager(getClaudeDir());
      try {
        const results = await manager.search(keyword, options.category);
        const knowledge = await manager.list(options.category);

        if (options.context) {
          const { formatSingleMatch, formatMultipleMatches, formatNoMatches } =
            await import('./formatters.js');

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

        console.log(pc.cyan(`\n🔍 Knowledge search results for "${keyword}":`));
        results.forEach((result, index) => {
          console.log(
            `  ${index + 1}. ${pc.bold(result.title)} ${pc.dim(`(${result.category})`)}`
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
  .command('view')
  .description('View a specific knowledge entry by ID or search term')
  .argument('<idOrKeyword>', 'Knowledge ID or search keyword')
  .option('--context', 'Output formatted for AI context instead of console')
  .action(async (idOrKeyword: string, options: { context?: boolean }) => {
    const manager = createKnowledgeManager(getClaudeDir());
    try {
      const content = await manager.view(idOrKeyword);

      if (options.context) {
        const knowledge = await manager.list();
        const entry = knowledge.find(
          (k) =>
            k.id.toString() === idOrKeyword ||
            k.title.toLowerCase().includes(idOrKeyword.toLowerCase())
        );

        if (entry) {
          const { formatSingleMatch } = await import('./formatters.js');

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

// Project initialization command
program
  .command('init')
  .description('Initialize Claude Code project with cc-self-refer commands')
  .option('--repo <url>', 'Custom repository URL', 'https://raw.githubusercontent.com/user/cc-self-refer/main')
  .action(async (options: { repo?: string }) => {
    intro(pc.cyan('🚀 Initializing Claude Code Project'));
    
    try {
      await initClaudeProject(process.cwd(), options.repo);
      outro(pc.green('✅ Claude Code project initialized successfully!'));
    } catch (error) {
      outro(pc.red(`❌ Initialization failed: ${error}`));
      process.exit(1);
    }
  });

// Check if .claude directory exists
const claudeDir = getClaudeDir();
if (!existsSync(claudeDir)) {
  console.log(pc.yellow('⚠️  .claude directory not found in home directory'));
  console.log(
    pc.dim('Run `claude-code init` first or create the directory manually')
  );
  process.exit(1);
}

program.parse();

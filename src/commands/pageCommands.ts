import { Command } from 'commander';

import { createPageManager } from '../managers';
import { logger } from '../utils';
import { SessionExtractor } from '../utils/SessionExtractor.js';

export const registerPageCommands = (
  program: Command,
  getContentDir: (options: { dir?: string }) => string
): void => {
  const pageCmd = program
    .command('page')
    .description('Manage session pages in .claude/pages/');

  pageCmd
    .command('list')
    .description('List all session pages')
    .action(async () => {
      const globalOptions = program.opts();
      const manager = createPageManager(getContentDir(globalOptions));
      try {
        const pages = await manager.list();

        if (pages.length === 0) {
          logger.warning('No pages found in .claude/pages/');
          return;
        }

        const items = pages.map(
          (page) =>
            `${page.title} (${page.file}) - Created: ${page.createdAt.toLocaleDateString()}`
        );
        logger.list('📄 Session Pages', items);
      } catch (error) {
        logger.error('Error listing pages', error);
      }
    });

  pageCmd
    .command('search')
    .description('Search session pages by keyword')
    .argument('<keyword>', 'Search keyword')
    .action(async (keyword: string) => {
      const globalOptions = program.opts();
      const manager = createPageManager(getContentDir(globalOptions));
      try {
        const results = await manager.search(keyword);
        const pages = await manager.list();

        // Always use AI-optimized output
        const { formatSingleMatch, formatMultipleMatches, formatNoMatches } =
          await import('../utils/formatters.js');

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
        // Always return AI-optimized output, no need for console output
      } catch (error) {
        logger.error('Error searching pages', error);
      }
    });

  pageCmd
    .command('view')
    .description('View a specific page by ID or search term')
    .argument('<idOrKeyword>', 'Page ID or search keyword')
    .action(async (idOrKeyword: string) => {
      const globalOptions = program.opts();
      const manager = createPageManager(getContentDir(globalOptions));
      try {
        const content = await manager.view(idOrKeyword);
        const pages = await manager.list();
        const page = pages.find(
          (p) =>
            p.id.toString() === idOrKeyword ||
            p.title.toLowerCase().includes(idOrKeyword.toLowerCase())
        );

        if (page) {
          // Always use AI-optimized output
          const { formatSingleMatch } = await import('../utils/formatters.js');

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
          };

          console.log(formatSingleMatch(formattedItem, formatOptions));
        } else {
          // If page metadata not found, still output content in AI format
          console.log(`# Page Content

${content}

---

*Page loaded successfully.*`);
        }
      } catch (error) {
        logger.error('Error viewing page', error);
      }
    });

  // Alias for save command - automatically extracts session if no content provided
  pageCmd
    .command('create')
    .description(
      'Create a new page - automatically extracts current session if no content provided'
    )
    .argument(
      '[title]',
      'Page title (optional, defaults to "Session-{timestamp}")'
    )
    .argument(
      '[content]',
      'Page content (optional, extracts current session if not provided)'
    )
    .action(async (title?: string, content?: string) => {
      const globalOptions = program.opts();
      const manager = createPageManager(getContentDir(globalOptions));

      try {
        let finalTitle =
          title ||
          `Session-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}`;
        let finalContent = content;
        let isSessionExtracted = false;

        // If no content provided, automatically extract the current session
        if (!content) {
          try {
            const extractor = new SessionExtractor();
            finalContent = await extractor.extractCurrentSession();
            isSessionExtracted = true;

            if (!title) {
              // Auto-generate title from session
              finalTitle = `Session-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}`;
            }

            // Silent extraction for AI usage
          } catch (extractError) {
            // Session extraction failed, but we need content
            throw new Error(`Session extraction failed: ${extractError}`);
          }
        }

        if (!finalContent) {
          throw new Error('No content provided and session extraction failed');
        }

        const pageId = await manager.create(finalTitle, finalContent);

        // Always use AI-optimized output
        console.log(`# Page Created Successfully

**ID**: ${pageId}
**Title**: ${finalTitle}
**Location**: .claude/pages/${pageId}-${finalTitle
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')}.md
${isSessionExtracted ? '**Type**: Extracted Session' : '**Type**: User Content'}

## Content Preview

${finalContent.substring(0, 500)}${finalContent.length > 500 ? '...' : ''}

---

*Page has been saved ${isSessionExtracted ? '(session extracted automatically)' : ''} and is ready for future reference.*`);
      } catch (error) {
        // Always use AI-optimized error output
        console.error(`# Page Creation Failed

**Error**: ${error}

## Troubleshooting

1. If session extraction: Ensure Claude Code has an active session
2. Check ~/.claude/projects/ directory exists
3. Verify write permissions for .claude/pages/

*Unable to create page. Please check the error message above.*`);
      }
    });
};

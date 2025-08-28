import { readFile, stat, writeFile } from 'fs/promises';
import { glob } from 'glob';
import { join, resolve } from 'path';

import { PageInfo, PageManager, SearchResult } from '../types/index.js';
import { ensureDir } from '../utils/index.js';
import { extractTitle } from '../utils/textExtraction.js';
import { AdvancedSearchEngine, SearchableItem } from '../utils/advancedSearch.js';

export const createPageManager = (contentDir: string): PageManager => {
  const pagesDir = resolve(contentDir, 'pages');

  return {
    async list(): Promise<PageInfo[]> {
      await ensureDir(pagesDir);

      const files = await glob('*.md', { cwd: pagesDir });
      const pages: PageInfo[] = [];

      for (const file of files) {
        const filepath = join(pagesDir, file);
        const stats = await stat(filepath);
        const content = await readFile(filepath, 'utf-8');
        const title = extractTitle(content);
        const idMatch = file.match(/^(\d+)-/);
        const id = idMatch && idMatch[1] ? parseInt(idMatch[1]) : 0;

        pages.push({
          id,
          title,
          file,
          createdAt: stats.birthtime,
          content,
        });
      }

      return pages.sort((a, b) => b.id - a.id);
    },

    async search(keyword: string): Promise<SearchResult[]> {
      const pages = await this.list();
      
      // Convert PageInfo to SearchableItem format
      const searchableItems: SearchableItem[] = pages
        .filter(page => page.content)
        .map(page => ({
          id: page.id,
          title: page.title,
          content: page.content!,
          lastUpdated: page.createdAt,
          file: page.file,
        }));

      // Initialize advanced search engine
      const searchEngine = new AdvancedSearchEngine({
        minScore: 0.3,
        maxResults: 50,
      });

      const enhancedResults = searchEngine.search(keyword, searchableItems);

      // Convert enhanced results back to SearchResult format
      return enhancedResults.map(result => ({
        title: result.item.title,
        file: result.item.file,
        score: Math.round(result.score.final * 100) / 100,
        matchedFields: result.matchedFields,
        highlights: result.matchHighlights,
        scoreBreakdown: {
          exactMatch: result.score.exactMatch,
          semanticSimilarity: result.score.semanticSimilarity,
          keywordRelevance: result.score.keywordRelevance,
          categoryBoost: result.score.categoryBoost,
          recencyScore: result.score.recencyScore,
          fieldBoost: result.score.fieldBoost,
        },
      }));
    },

    async view(idOrKeyword: string): Promise<string> {
      const pages = await this.list();

      // Try to find by ID first
      const idNum = parseInt(idOrKeyword);
      if (!isNaN(idNum)) {
        const page = pages.find((p: PageInfo) => p.id === idNum);
        if (page?.content) {
          return page.content;
        }
      }

      // Search by keyword
      const results = await this.search(idOrKeyword);
      if (results.length > 0) {
        const bestMatch = results[0];
        const page = pages.find((p: PageInfo) => p.file === bestMatch.file);
        if (page?.content) {
          return page.content;
        }
      }

      throw new Error(`Page not found: ${idOrKeyword}`);
    },

    async create(title: string, content: string): Promise<number> {
      await ensureDir(pagesDir);

      const pages = await this.list();
      const nextId =
        pages.length > 0
          ? Math.max(...pages.map((p: PageInfo) => p.id)) + 1
          : 1;

      const filename = `${nextId}-${title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')}.md`;
      const filepath = join(pagesDir, filename);

      const fullContent = `# ${title}

${content}

---
**Status**: Active
**Created**: ${new Date().toISOString()}
`;

      await writeFile(filepath, fullContent);
      return nextId;
    },
  };
};

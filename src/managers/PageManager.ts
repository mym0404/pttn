import { readFile, stat, writeFile } from 'fs/promises';
import { glob } from 'glob';
import { join, resolve } from 'path';

import { PageInfo, PageManager, SearchResult } from '../types/index.js';
import { ensureDir } from '../utils/index.js';
import { calculateSimilarity } from '../utils/similarity.js';
import { extractTitle } from '../utils/textExtraction.js';

export const createPageManager = (claudeDir: string): PageManager => {
  const pagesDir = resolve(claudeDir, 'pages');

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
      const results: SearchResult[] = [];

      for (const page of pages) {
        if (!page.content) continue;

        const titleScore = calculateSimilarity(keyword, page.title);
        const contentScore = calculateSimilarity(keyword, page.content) * 0.7;
        const score = Math.max(titleScore, contentScore);

        if (score > 0.3) {
          results.push({
            title: page.title,
            file: page.file,
            score: Math.round(score * 100) / 100,
          });
        }
      }

      return results.sort((a, b) => b.score - a.score);
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

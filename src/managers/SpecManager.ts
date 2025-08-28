import { readFile, stat } from 'fs/promises';
import { glob } from 'glob';
import { join, resolve } from 'path';

import { SpecInfo, SpecManager, SearchResult } from '../types';
import { calculateSimilarity, ensureDir } from '../utils';
import { extractCategory, extractTitle } from '../utils';

export const createSpecManager = (
  contentDir: string
): SpecManager => {
  const specDir = resolve(contentDir, 'specs');

  return {
    async list(category?: string): Promise<SpecInfo[]> {
      await ensureDir(specDir);

      // For numbered files in spec directory
      const files = await glob('*.md', { cwd: specDir });
      const entries: SpecInfo[] = [];

      for (const file of files) {
        const filepath = join(specDir, file);
        const stats = await stat(filepath);
        const content = await readFile(filepath, 'utf-8');
        const title = extractTitle(content);
        const entryCategory = extractCategory(content, file);
        const idMatch = file.match(/^(\d+)-/);
        const id = idMatch && idMatch[1] ? parseInt(idMatch[1]) : 0;

        // Filter by category if specified
        if (category && entryCategory !== category) continue;

        entries.push({
          id,
          title,
          file,
          category: entryCategory,
          lastUpdated: stats.mtime,
          content,
        });
      }

      return entries.sort((a, b) => b.id - a.id);
    },

    async search(keyword: string, category?: string): Promise<SearchResult[]> {
      const entries = await this.list(category);
      const results: SearchResult[] = [];

      for (const entry of entries) {
        if (!entry.content) continue;

        const titleScore = calculateSimilarity(keyword, entry.title);
        const contentScore = calculateSimilarity(keyword, entry.content) * 0.7;
        const score = Math.max(titleScore, contentScore);

        if (score > 0.3) {
          results.push({
            title: `${entry.title} (${entry.category})`,
            file: entry.file,
            score: Math.round(score * 100) / 100,
          });
        }
      }

      return results.sort((a, b) => b.score - a.score);
    },

    async view(idOrKeyword: string): Promise<string> {
      const entries = await this.list();

      // Try to find by ID first
      const idNum = parseInt(idOrKeyword);
      if (!isNaN(idNum)) {
        const entry = entries.find((e: SpecInfo) => e.id === idNum);
        if (entry?.content) {
          return entry.content;
        }
      }

      // Search by keyword
      const results = await this.search(idOrKeyword);
      if (results.length > 0) {
        const bestMatch = results[0];
        const entry = entries.find(
          (e: SpecInfo) => e.file === bestMatch.file
        );
        if (entry?.content) {
          return entry.content;
        }
      }

      throw new Error(`Spec entry not found: ${idOrKeyword}`);
    },
  };
};
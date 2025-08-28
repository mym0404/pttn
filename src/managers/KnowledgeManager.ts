import { readFile, stat } from 'fs/promises';
import { glob } from 'glob';
import { join, resolve } from 'path';

import { KnowledgeInfo, KnowledgeManager, SearchResult } from '../types';
import { ensureDir } from '../utils';
import { extractCategory, extractTitle } from '../utils';
import { AdvancedSearchEngine, SearchableItem } from '../utils/advancedSearch';

export const createKnowledgeManager = (
  contentDir: string
): KnowledgeManager => {
  const knowledgeDir = resolve(contentDir, 'knowledges');

  return {
    async list(category?: string): Promise<KnowledgeInfo[]> {
      await ensureDir(knowledgeDir);

      // For numbered files in knowledge directory
      const files = await glob('*.md', { cwd: knowledgeDir });
      const entries: KnowledgeInfo[] = [];

      for (const file of files) {
        const filepath = join(knowledgeDir, file);
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
      
      // Convert KnowledgeInfo to SearchableItem format
      const searchableItems: SearchableItem[] = entries
        .filter(entry => entry.content)
        .map(entry => ({
          id: entry.id,
          title: entry.title,
          content: entry.content!,
          category: entry.category,
          lastUpdated: entry.lastUpdated,
          file: entry.file,
        }));

      // Initialize advanced search engine with category filter
      const searchEngine = new AdvancedSearchEngine({
        categoryFilter: category,
        minScore: 0.3,
        maxResults: 50,
      });

      const enhancedResults = searchEngine.search(keyword, searchableItems);

      // Convert enhanced results back to SearchResult format
      return enhancedResults.map(result => ({
        title: `${result.item.title} (${result.item.category})`,
        file: result.item.file,
        score: Math.round(result.score.final * 100) / 100,
        category: result.item.category,
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
      const entries = await this.list();

      // Try to find by ID first
      const idNum = parseInt(idOrKeyword);
      if (!isNaN(idNum)) {
        const entry = entries.find((e: KnowledgeInfo) => e.id === idNum);
        if (entry?.content) {
          return entry.content;
        }
      }

      // Search by keyword
      const results = await this.search(idOrKeyword);
      if (results.length > 0) {
        const bestMatch = results[0];
        const entry = entries.find(
          (e: KnowledgeInfo) => e.file === bestMatch.file
        );
        if (entry?.content) {
          return entry.content;
        }
      }

      throw new Error(`Knowledge entry not found: ${idOrKeyword}`);
    },
  };
};

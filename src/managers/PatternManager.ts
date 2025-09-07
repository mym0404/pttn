import { readFile, stat, writeFile } from 'fs/promises';
import { glob } from 'glob';
import { join, resolve } from 'path';

import { PatternInfo, PatternManager, SearchResult } from '../types/index.js';
import {
  AdvancedSearchEngine,
  SearchableItem,
} from '../utils/advancedSearch.js';
import { ensureDir, sanitizeFilename } from '../utils/index.js';
import {
  extractExplanation,
  extractLanguage,
  extractTitle,
} from '../utils/index.js';

export const createPatternManager = (contentDir: string): PatternManager => {
  const patternsDir = resolve(contentDir, 'patterns');

  return {
    async list(): Promise<PatternInfo[]> {
      await ensureDir(patternsDir);

      const files = await glob('*.md', { cwd: patternsDir });
      const patterns: PatternInfo[] = [];

      for (const file of files) {
        const filepath = join(patternsDir, file);
        const stats = await stat(filepath);
        const content = await readFile(filepath, 'utf-8');
        const title = extractTitle(content);
        const language = extractLanguage(content, file);
        const explanation = extractExplanation(content);
        const idMatch = file.match(/^(\d+)-/);
        const id = idMatch && idMatch[1] ? parseInt(idMatch[1]) : 0;

        patterns.push({
          id,
          title,
          file,
          language,
          explanation,
          lastUpdated: stats.mtime,
          content,
        });
      }

      return patterns.sort((a, b) => a.id - b.id);
    },

    async search(keyword: string, language?: string): Promise<SearchResult[]> {
      const patterns = await this.list();

      // Filter by language first if specified
      const filteredPatterns = language
        ? patterns.filter(
            (pattern) => pattern.language === language.toLowerCase()
          )
        : patterns;

      // Convert PatternInfo to SearchableItem format
      const searchableItems: SearchableItem[] = filteredPatterns
        .filter((pattern) => pattern.content)
        .map((pattern) => ({
          id: pattern.id,
          title: pattern.title,
          content: pattern.content!,
          category: pattern.language, // Use language as category for patterns
          lastUpdated: pattern.lastUpdated,
          file: pattern.file,
        }));

      // Initialize advanced search engine
      const searchEngine = new AdvancedSearchEngine({
        minScore: 0.3,
        maxResults: 50,
      });

      const enhancedResults = searchEngine.search(keyword, searchableItems);

      // Convert enhanced results back to SearchResult format
      return enhancedResults.map((result) => ({
        title: `${result.item.title} (${result.item.category})`,
        file: result.item.file,
        score: Math.round(result.score.final * 100) / 100,
        language: result.item.category, // This will be the pattern language
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

    async view(id: string): Promise<string> {
      const patterns = await this.list();

      // Try to find by ID first
      const idNum = parseInt(id);
      if (!isNaN(idNum)) {
        const pattern = patterns.find((p: PatternInfo) => p.id === idNum);
        if (pattern?.content) {
          return pattern.content;
        }
      }

      throw new Error(`Pattern not found: ${id}`);
    },

    async create(name: string, content: string): Promise<string> {
      await ensureDir(patternsDir);

      const patterns = await this.list();
      const nextId =
        patterns.length > 0
          ? Math.max(...patterns.map((p: PatternInfo) => p.id)) + 1
          : 1;

      const paddedId = nextId.toString().padStart(3, '0');
      const filename = `${paddedId}-${sanitizeFilename(name)}.md`;
      const filepath = join(patternsDir, filename);

      const fullContent = `${content}`;

      await writeFile(filepath, fullContent);
      return filename;
    },
  };
};

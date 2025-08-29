import { existsSync } from 'fs';
import { mkdir, readFile, stat, writeFile } from 'fs/promises';
import { glob } from 'glob';
import { join, resolve } from 'path';

import { SearchResult, SpecInfo, SpecManager } from '../types';
import { ensureDir } from '../utils';
import { extractCategory, extractTitle } from '../utils';
import { AdvancedSearchEngine, SearchableItem } from '../utils/advancedSearch';

export const createSpecManager = (contentDir: string): SpecManager => {
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

      // Convert SpecInfo to SearchableItem format
      const searchableItems: SearchableItem[] = entries
        .filter((entry) => entry.content)
        .map((entry) => ({
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
      return enhancedResults.map((result) => ({
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
        const entry = entries.find((e: SpecInfo) => e.id === idNum);
        if (entry?.content) {
          return entry.content;
        }
      }

      // Search by keyword
      const results = await this.search(idOrKeyword);
      if (results.length > 0) {
        const bestMatch = results[0];
        const entry = entries.find((e: SpecInfo) => e.file === bestMatch.file);
        if (entry?.content) {
          return entry.content;
        }
      }

      throw new Error(`Spec entry not found: ${idOrKeyword}`);
    },

    async create(
      title: string,
      content: string,
      category: string = 'general'
    ): Promise<{ id: number; filename: string }> {
      // Ensure directory exists
      if (!existsSync(specDir)) {
        await mkdir(specDir, { recursive: true });
      }

      // Get existing spec entries to determine next ID
      const entries = await this.list();
      const nextId =
        entries.length > 0 ? Math.max(...entries.map((e) => e.id)) + 1 : 1;

      // Create filename with zero-padded ID
      const paddedId = nextId.toString().padStart(3, '0');
      const filename = `${paddedId}-${title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')}.md`;
      const filepath = join(specDir, filename);

      // Create full content with metadata
      const fullContent = `# ${title}

**Category**: ${category}

${content}
`;

      await writeFile(filepath, fullContent);

      return { id: nextId, filename };
    },
  };
};

import { existsSync } from 'fs';
import { mkdir, readFile, stat, writeFile } from 'fs/promises';
import { glob } from 'glob';
import { join, resolve } from 'path';

import { SearchResult, SpecInfo, SpecManager } from '../types';
import { ensureDir, sanitizeFilename } from '../utils';
import { extractTitle } from '../utils';
import { AdvancedSearchEngine, SearchableItem } from '../utils/advancedSearch';

export const createSpecManager = (contentDir: string): SpecManager => {
  const specDir = resolve(contentDir, 'specs');

  return {
    async list(): Promise<SpecInfo[]> {
      await ensureDir(specDir);

      // For numbered files in spec directory
      const files = await glob('*.md', { cwd: specDir });
      const entries: SpecInfo[] = [];

      for (const file of files) {
        const filepath = join(specDir, file);
        const stats = await stat(filepath);
        const content = await readFile(filepath, 'utf-8');
        const title = extractTitle(content);
        const idMatch = file.match(/^(\d+)-/);
        const id = idMatch && idMatch[1] ? parseInt(idMatch[1]) : 0;

        entries.push({
          id,
          title,
          file,
          lastUpdated: stats.mtime,
          content,
        });
      }

      return entries.sort((a, b) => b.id - a.id);
    },

    async search(keyword: string): Promise<SearchResult[]> {
      const entries = await this.list();

      // Convert SpecInfo to SearchableItem format
      const searchableItems: SearchableItem[] = entries
        .filter((entry) => entry.content)
        .map((entry) => ({
          id: entry.id,
          title: entry.title,
          content: entry.content!,
          lastUpdated: entry.lastUpdated,
          file: entry.file,
        }));

      // Initialize advanced search engine
      const searchEngine = new AdvancedSearchEngine({
        minScore: 0.3,
        maxResults: 50,
      });

      const enhancedResults = searchEngine.search(keyword, searchableItems);

      // Convert enhanced results back to SearchResult format
      return enhancedResults.map((result) => ({
        title: result.item.title,
        file: result.item.file,
        score: Math.round(result.score.final * 100) / 100,
        matchedFields: result.matchedFields,
        highlights: result.matchHighlights,
        scoreBreakdown: {
          exactMatch: result.score.exactMatch,
          semanticSimilarity: result.score.semanticSimilarity,
          keywordRelevance: result.score.keywordRelevance,
          recencyScore: result.score.recencyScore,
          fieldBoost: result.score.fieldBoost,
        },
      }));
    },

    async view(id: string): Promise<string> {
      const entries = await this.list();

      // Try to find by ID first
      const idNum = parseInt(id);
      if (!isNaN(idNum)) {
        const entry = entries.find((e: SpecInfo) => e.id === idNum);
        if (entry?.content) {
          return entry.content;
        }
      }

      throw new Error(`Spec entry not found: ${id}`);
    },

    async create(
      title: string,
      content: string
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
      const filename = `${paddedId}-${sanitizeFilename(title)}.md`;
      const filepath = join(specDir, filename);

      // Create full content with metadata
      const fullContent = `# ${title}

${content}
`;

      await writeFile(filepath, fullContent);

      return { id: nextId, filename };
    },
  };
};

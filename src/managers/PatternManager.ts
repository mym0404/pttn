import { readFile, stat, writeFile } from 'fs/promises';
import { glob } from 'glob';
import { join, resolve } from 'path';

import { PatternInfo, PatternManager, SearchResult } from '../types/index.js';
import { ensureDir } from '../utils/index.js';
import { extractLanguage, extractTitle } from '../utils/textExtraction.js';
import { AdvancedSearchEngine, SearchableItem } from '../utils/advancedSearch.js';

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
        const idMatch = file.match(/^(\d+)-/);
        const id = idMatch && idMatch[1] ? parseInt(idMatch[1]) : 0;

        patterns.push({
          id,
          title,
          file,
          language,
          lastUpdated: stats.mtime,
          content,
        });
      }

      return patterns.sort((a, b) => b.id - a.id);
    },

    async search(keyword: string, language?: string): Promise<SearchResult[]> {
      const patterns = await this.list();
      
      // Filter by language first if specified
      const filteredPatterns = language 
        ? patterns.filter(pattern => pattern.language === language.toLowerCase())
        : patterns;
      
      // Convert PatternInfo to SearchableItem format
      const searchableItems: SearchableItem[] = filteredPatterns
        .filter(pattern => pattern.content)
        .map(pattern => ({
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
      return enhancedResults.map(result => ({
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

    async view(idOrKeyword: string): Promise<string> {
      const patterns = await this.list();

      // Try to find by ID first
      const idNum = parseInt(idOrKeyword);
      if (!isNaN(idNum)) {
        const pattern = patterns.find((p: PatternInfo) => p.id === idNum);
        if (pattern?.content) {
          return pattern.content;
        }
      }

      // Search by keyword
      const results = await this.search(idOrKeyword);
      if (results.length > 0) {
        const bestMatch = results[0];
        const pattern = patterns.find(
          (p: PatternInfo) => p.file === bestMatch.file
        );
        if (pattern?.content) {
          return pattern.content;
        }
      }

      throw new Error(`Pattern not found: ${idOrKeyword}`);
    },

    async create(
      name: string,
      content: string,
      language: string = 'text'
    ): Promise<string> {
      await ensureDir(patternsDir);

      const patterns = await this.list();
      const nextId =
        patterns.length > 0
          ? Math.max(...patterns.map((p: PatternInfo) => p.id)) + 1
          : 1;

      const paddedId = nextId.toString().padStart(3, '0');
      const filename = `${paddedId}-${name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')}.md`;
      const filepath = join(patternsDir, filename);

      // Add language metadata if not already present
      let fullContent = content;
      if (!content.includes('**Language**:')) {
        fullContent = `# ${name}

**Language**: ${language}

${content}

---
**Created**: ${new Date().toISOString()}
`;
      }

      await writeFile(filepath, fullContent);
      return filename;
    },

    async use(idOrKeyword: string): Promise<string> {
      const patterns = await this.list();

      // Try to find by ID first
      const idNum = parseInt(idOrKeyword);
      if (!isNaN(idNum)) {
        const pattern = patterns.find((p: PatternInfo) => p.id === idNum);
        if (pattern?.content) {
          return pattern.content;
        }
      }

      // Search by keyword
      const results = await this.search(idOrKeyword);
      if (results.length > 0) {
        const bestMatch = results[0];
        const pattern = patterns.find(
          (p: PatternInfo) => p.file === bestMatch.file
        );
        if (pattern?.content) {
          return pattern.content;
        }
      }

      throw new Error(`Pattern not found: ${idOrKeyword}`);
    },
  };
};

import { readFile, stat, writeFile } from 'fs/promises';
import { glob } from 'glob';
import { join, resolve } from 'path';

import { PatternInfo, PatternManager, SearchResult } from '../types/index.js';
import { ensureDir } from '../utils/index.js';
import { calculateSimilarity } from '../utils/similarity.js';
import { extractLanguage, extractTitle } from '../utils/textExtraction.js';

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
      const results: SearchResult[] = [];

      for (const pattern of patterns) {
        if (!pattern.content) continue;
        if (language && pattern.language !== language.toLowerCase()) continue;

        const titleScore = calculateSimilarity(keyword, pattern.title);
        const contentScore =
          calculateSimilarity(keyword, pattern.content) * 0.7;
        const score = Math.max(titleScore, contentScore);

        if (score > 0.3) {
          results.push({
            title: `${pattern.title} (${pattern.language})`,
            file: pattern.file,
            score: Math.round(score * 100) / 100,
          });
        }
      }

      return results.sort((a, b) => b.score - a.score);
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

    async create(name: string, content: string): Promise<string> {
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

      const fullContent = content;

      await writeFile(filepath, fullContent);
      return filename;
    },
  };
};

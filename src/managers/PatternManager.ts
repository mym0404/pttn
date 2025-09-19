import fm from 'front-matter';
import { readFile, stat, writeFile } from 'fs/promises';
import { glob } from 'glob';
import { join, resolve } from 'path';

import type { AgentSelection } from '../constants/agents.js';
import { PatternInfo, PatternManager, SearchResult } from '../types/index.js';
import {
  AdvancedSearchEngine,
  SearchableItem,
} from '../utils/advancedSearch.js';
import { syncAgentPromptPatternTable } from '../utils/agentPromptPatternManager.js';
import { ensureDir, sanitizeFilename } from '../utils/index.js';
import {
  extractExplanation,
  extractKeywords,
  extractLanguage,
  extractTitle,
} from '../utils/index.js';

export const createPatternManager = (contentDir: string): PatternManager => {
  const patternsDir = resolve(contentDir, 'patterns');

  const list = async (): Promise<PatternInfo[]> => {
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
      const keywords = extractKeywords(content);
      const idMatch = file.match(/^(\d+)-/);
      const id = idMatch && idMatch[1] ? parseInt(idMatch[1]) : 0;

      patterns.push({
        id,
        title,
        file,
        language,
        keywords,
        explanation,
        lastUpdated: stats.mtime,
        content,
      });
    }

    return patterns.sort((a, b) => a.id - b.id);
  };

  return {
    list,

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
          keywords: pattern.keywords,
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

    async create(
      name: string,
      content: string,
      keywords: string[],
      language: string,
      explanation: string
    ): Promise<string> {
      await ensureDir(patternsDir);

      const patterns = await this.list();
      const nextId =
        patterns.length > 0
          ? Math.max(...patterns.map((p: PatternInfo) => p.id)) + 1
          : 1;

      const paddedId = nextId.toString().padStart(3, '0');
      const filename = `${paddedId}-${sanitizeFilename(name)}.md`;
      const filepath = join(patternsDir, filename);

      // Add keywords to content using front-matter
      let fullContent: string;

      if (content.startsWith('---')) {
        // Parse existing frontmatter and add metadata
        const parsed = fm(content);
        const frontMatter = parsed.attributes as any;
        frontMatter.keywords = keywords.join(', ');
        frontMatter.language = language;
        frontMatter.explanation = explanation;

        // Rebuild content with updated frontmatter
        const frontMatterYaml = Object.entries(frontMatter)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');

        fullContent = `---
${frontMatterYaml}
---

${parsed.body}`;
      } else {
        // Add new frontmatter with metadata
        fullContent = `---
keywords: ${keywords.join(', ')}
language: ${language}
explanation: ${explanation}
---

${content}`;
      }

      await writeFile(filepath, fullContent);

      // Sync agent prompt after creating pattern
      await syncAgentPromptPatternTable(await list(), { contentDir });

      return filename;
    },

    syncPromptTable: async (): Promise<AgentSelection> =>
      syncAgentPromptPatternTable(await list(), { contentDir }),
  };
};

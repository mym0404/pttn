import { readFile, stat, writeFile } from 'fs/promises';
import { glob } from 'glob';
import { join, resolve } from 'path';

import { PlanInfo, PlanManager, SearchResult } from '../types';
import { ensureDir, sanitizeFilename } from '../utils';
import { extractStatus, extractTitle } from '../utils';
import {
  AdvancedSearchEngine,
  SearchableItem,
} from '../utils/advancedSearch.js';

export const createPlanManager = (contentDir: string): PlanManager => {
  const plansDir = resolve(contentDir, 'plans');

  return {
    async list(): Promise<PlanInfo[]> {
      await ensureDir(plansDir);

      const files = await glob('*.md', { cwd: plansDir });
      const plans: PlanInfo[] = [];

      for (const file of files) {
        const filepath = join(plansDir, file);
        const stats = await stat(filepath);
        const content = await readFile(filepath, 'utf-8');
        const title = extractTitle(content);
        const status = extractStatus(content);
        const idMatch = file.match(/^(\d+)-/);
        const id = idMatch && idMatch[1] ? parseInt(idMatch[1]) : 0;

        plans.push({
          id,
          title,
          file,
          status,
          lastUpdated: stats.mtime,
          content,
        });
      }

      return plans.sort((a, b) => b.id - a.id);
    },

    async search(keyword: string): Promise<SearchResult[]> {
      const plans = await this.list();

      // Convert PlanInfo to SearchableItem format
      const searchableItems: SearchableItem[] = plans
        .filter((plan) => plan.content)
        .map((plan) => ({
          id: plan.id,
          title: plan.title,
          content: plan.content!,
          category: plan.status, // Use status as category for plans
          lastUpdated: plan.lastUpdated,
          file: plan.file,
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
        category: result.item.category, // This will be the plan status
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
      const plans = await this.list();

      // Try to find by ID first
      const idNum = parseInt(id);
      if (!isNaN(idNum)) {
        const plan = plans.find((p: PlanInfo) => p.id === idNum);
        if (plan?.content) {
          return plan.content;
        }
      }

      throw new Error(`Plan not found: ${id}`);
    },

    async create(title: string, content: string): Promise<number> {
      await ensureDir(plansDir);

      const plans = await this.list();
      const nextId =
        plans.length > 0
          ? Math.max(...plans.map((p: PlanInfo) => p.id)) + 1
          : 1;

      const paddedId = nextId.toString().padStart(3, '0');
      const filename = `${paddedId}-${sanitizeFilename(title)}.md`;
      const filepath = join(plansDir, filename);

      const fullContent = `# ${title}

${content}
`;

      await writeFile(filepath, fullContent);
      return nextId;
    },

    async resolve(idOrKeyword: string): Promise<void> {
      const content = await this.view(idOrKeyword);
      const plans = await this.list();

      // Find the plan file
      let targetFile: string;
      const idNum = parseInt(idOrKeyword);
      if (!isNaN(idNum)) {
        const plan = plans.find((p: PlanInfo) => p.id === idNum);
        if (!plan) throw new Error(`Plan not found: ${idOrKeyword}`);
        targetFile = plan.file;
      } else {
        const results = await this.search(idOrKeyword);
        if (results.length === 0)
          throw new Error(`Plan not found: ${idOrKeyword}`);
        targetFile = results[0].file;
      }

      const filepath = join(plansDir, targetFile);

      // Update status to Completed
      const updatedContent = content.replace(
        /\*\*Status\*\*: \[.*\]/,
        '**Status**: [Completed]'
      );
      const finalContent = updatedContent.replace(
        /\*\*Last Updated\*\*: .+/,
        `**Last Updated**: ${new Date().toISOString()}`
      );

      await writeFile(filepath, finalContent);
    },
  };
};

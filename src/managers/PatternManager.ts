import fm from 'front-matter';
import { readFile, stat, writeFile } from 'fs/promises';
import { glob } from 'glob';
import { join, resolve } from 'path';

import type { PatternInfo } from '../types/index.js';
import { syncClaudeMdPatternTable } from '../utils/claudeMdPatternManager.js';
import { ensureDir, sanitizeFilename } from '../utils/index.js';
import { parsePatternMetadata } from '../utils/patternParser.js';
import {
  type PatternSearchResult,
  searchPatterns,
} from '../utils/patternSearch.js';

/**
 * Pattern manager for handling pattern CRUD operations
 */
export class PatternManager {
  private patternsDir: string;

  constructor(contentDir: string) {
    this.patternsDir = resolve(contentDir, 'patterns');
  }

  async list(): Promise<PatternInfo[]> {
    await ensureDir(this.patternsDir);

    const files = await glob('*.md', { cwd: this.patternsDir });
    const patterns: PatternInfo[] = [];

    for (const file of files) {
      const filepath = join(this.patternsDir, file);
      const stats = await stat(filepath);
      const content = await readFile(filepath, 'utf-8');
      const { title, language, keywords, explanation } = parsePatternMetadata(
        content,
        file
      );
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
  }

  async search(
    keyword: string,
    language?: string
  ): Promise<PatternSearchResult[]> {
    const patterns = await this.list();

    // Filter by language first if specified
    const filteredPatterns = language
      ? patterns.filter(
          (pattern) => pattern.language === language.toLowerCase()
        )
      : patterns;

    return searchPatterns(keyword, filteredPatterns);
  }

  async view(id: string): Promise<string> {
    const patterns = await this.list();

    // Try to find by ID first
    const idNum = parseInt(id);
    if (!isNaN(idNum)) {
      const pattern = patterns.find((p) => p.id === idNum);
      if (pattern?.content) {
        return pattern.content;
      }
    }

    throw new Error(`Pattern not found: ${id}`);
  }

  async create(
    name: string,
    content: string,
    keywords: string[],
    language: string,
    explanation: string
  ): Promise<string> {
    await ensureDir(this.patternsDir);

    const patterns = await this.list();
    const nextId =
      patterns.length > 0 ? Math.max(...patterns.map((p) => p.id)) + 1 : 1;

    const paddedId = nextId.toString().padStart(3, '0');
    const filename = `${paddedId}-${sanitizeFilename(name)}.md`;
    const filepath = join(this.patternsDir, filename);

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

    // Sync CLAUDE.md after creating pattern
    await syncClaudeMdPatternTable(await this.list());

    return filename;
  }

  async syncClaudeMd(): Promise<void> {
    await syncClaudeMdPatternTable(await this.list());
  }
}

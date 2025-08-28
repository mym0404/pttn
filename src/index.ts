import { existsSync } from 'fs';
import { mkdir, readFile, stat, writeFile } from 'fs/promises';
import { glob } from 'glob';
import * as natural from 'natural';
import { join, resolve } from 'path';

// Types
export interface PageInfo {
  id: number;
  title: string;
  file: string;
  createdAt: Date;
  content?: string;
}

export interface SearchResult {
  title: string;
  file: string;
  score: number;
  language?: string;
  category?: string;
}

export interface PlanInfo {
  id: number;
  title: string;
  file: string;
  status: 'Planning' | 'In Progress' | 'Completed';
  lastUpdated: Date;
  content?: string;
}

export interface PatternInfo {
  id: number;
  title: string;
  file: string;
  language: string;
  lastUpdated: Date;
  content?: string;
}

export interface KnowledgeInfo {
  id: number;
  title: string;
  file: string;
  category: string;
  lastUpdated: Date;
  content?: string;
}

// Utility functions
const ensureDir = async (path: string): Promise<void> => {
  if (!existsSync(path)) {
    await mkdir(path, { recursive: true });
  }
};

const extractTitle = (content: string): string => {
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#')) {
      return trimmed.replace(/^#+\s*/, '').trim();
    }
  }
  return 'Untitled';
};

const extractStatus = (content: string): PlanInfo['status'] => {
  const statusMatch = content.match(/\*\*Status\*\*:\s*\[([^\]]+)]/);
  if (statusMatch && statusMatch[1]) {
    const status = statusMatch[1].trim();
    if (['Planning', 'In Progress', 'Completed'].includes(status)) {
      return status as PlanInfo['status'];
    }
  }
  return 'Planning';
};

const extractLanguage = (content: string, filename: string): string => {
  // Try to extract from code blocks
  const codeBlockMatch = content.match(/```([a-zA-Z]+)/);
  if (codeBlockMatch && codeBlockMatch[1]) {
    return codeBlockMatch[1].toLowerCase();
  }

  // Fallback to filename pattern
  const langMatch = filename.match(/-([a-zA-Z]+)\.(md|txt)$/);
  if (langMatch && langMatch[1]) {
    return langMatch[1].toLowerCase();
  }

  return 'general';
};

const extractCategory = (content: string, filepath: string): string => {
  // Try to extract from content metadata
  const categoryMatch = content.match(/\*\*Category\*\*:\s*([^\n]+)/);
  if (categoryMatch && categoryMatch[1]) {
    return categoryMatch[1].trim();
  }

  // Try to infer from directory structure
  const pathParts = filepath.split('/');
  if (pathParts.length > 1) {
    return pathParts[pathParts.length - 2] || 'general';
  }

  return 'general';
};

const calculateSimilarity = (query: string, text: string): number => {
  try {
    const distance = natural.JaroWinklerDistance
      ? natural.JaroWinklerDistance(query.toLowerCase(), text.toLowerCase(), undefined)
      : 0;
    
    // Also check for keyword matches
    const queryWords = query.toLowerCase().split(/\s+/);
    const textLower = text.toLowerCase();
    const keywordMatches = queryWords.filter((word) =>
      textLower.includes(word)
    ).length;
    const keywordScore = keywordMatches / queryWords.length;

    // Combine Jaro-Winkler with keyword matching
    return Math.max(distance, keywordScore * 0.8);
  } catch (error) {
    // Fallback to keyword-only matching if JaroWinkler fails
    const queryWords = query.toLowerCase().split(/\s+/);
    const textLower = text.toLowerCase();
    const keywordMatches = queryWords.filter((word) =>
      textLower.includes(word)
    ).length;
    return keywordMatches / queryWords.length;
  }
};

// Page Manager
export interface PageManager {
  list(): Promise<PageInfo[]>;
  search(keyword: string): Promise<SearchResult[]>;
  view(idOrKeyword: string): Promise<string>;
  create(title: string, content: string): Promise<number>;
}

export const createPageManager = (claudeDir: string): PageManager => {
  const pagesDir = resolve(claudeDir, 'pages');

  return {
    async list(): Promise<PageInfo[]> {
      await ensureDir(pagesDir);

      const files = await glob('*.md', { cwd: pagesDir });
      const pages: PageInfo[] = [];

      for (const file of files) {
        const filepath = join(pagesDir, file);
        const stats = await stat(filepath);
        const content = await readFile(filepath, 'utf-8');
        const title = extractTitle(content);
        const idMatch = file.match(/^(\d+)-/);
        const id = idMatch && idMatch[1] ? parseInt(idMatch[1]) : 0;

        pages.push({
          id,
          title,
          file,
          createdAt: stats.birthtime,
          content,
        });
      }

      return pages.sort((a, b) => b.id - a.id);
    },

    async search(keyword: string): Promise<SearchResult[]> {
      const pages = await this.list();
      const results: SearchResult[] = [];

      for (const page of pages) {
        if (!page.content) continue;

        const titleScore = calculateSimilarity(keyword, page.title);
        const contentScore = calculateSimilarity(keyword, page.content) * 0.7;
        const score = Math.max(titleScore, contentScore);

        if (score > 0.3) {
          results.push({
            title: page.title,
            file: page.file,
            score: Math.round(score * 100) / 100,
          });
        }
      }

      return results.sort((a, b) => b.score - a.score);
    },

    async view(idOrKeyword: string): Promise<string> {
      const pages = await this.list();

      // Try to find by ID first
      const idNum = parseInt(idOrKeyword);
      if (!isNaN(idNum)) {
        const page = pages.find((p: PageInfo) => p.id === idNum);
        if (page?.content) {
          return page.content;
        }
      }

      // Search by keyword
      const results = await this.search(idOrKeyword);
      if (results.length > 0) {
        const bestMatch = results[0];
        const page = pages.find((p: PageInfo) => p.file === bestMatch.file);
        if (page?.content) {
          return page.content;
        }
      }

      throw new Error(`Page not found: ${idOrKeyword}`);
    },

    async create(title: string, content: string): Promise<number> {
      await ensureDir(pagesDir);

      const pages = await this.list();
      const nextId =
        pages.length > 0
          ? Math.max(...pages.map((p: PageInfo) => p.id)) + 1
          : 1;

      const filename = `${nextId}-${title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')}.md`;
      const filepath = join(pagesDir, filename);

      const fullContent = `# ${title}

${content}

---
**Status**: Active
**Created**: ${new Date().toISOString()}
`;

      await writeFile(filepath, fullContent);
      return nextId;
    },
  };
};

// Plan Manager
export interface PlanManager {
  list(): Promise<PlanInfo[]>;
  search(keyword: string): Promise<SearchResult[]>;
  view(idOrKeyword: string): Promise<string>;
  create(name: string, description: string): Promise<string>;
  edit(idOrKeyword: string, modifications: string): Promise<void>;
}

export const createPlanManager = (claudeDir: string): PlanManager => {
  const plansDir = resolve(claudeDir, 'plans');

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
      const results: SearchResult[] = [];

      for (const plan of plans) {
        if (!plan.content) continue;

        const titleScore = calculateSimilarity(keyword, plan.title);
        const contentScore = calculateSimilarity(keyword, plan.content) * 0.7;
        const score = Math.max(titleScore, contentScore);

        if (score > 0.3) {
          results.push({
            title: plan.title,
            file: plan.file,
            score: Math.round(score * 100) / 100,
          });
        }
      }

      return results.sort((a, b) => b.score - a.score);
    },

    async view(idOrKeyword: string): Promise<string> {
      const plans = await this.list();

      // Try to find by ID first
      const idNum = parseInt(idOrKeyword);
      if (!isNaN(idNum)) {
        const plan = plans.find((p: PlanInfo) => p.id === idNum);
        if (plan?.content) {
          return plan.content;
        }
      }

      // Search by keyword
      const results = await this.search(idOrKeyword);
      if (results.length > 0) {
        const bestMatch = results[0];
        const plan = plans.find((p: PlanInfo) => p.file === bestMatch.file);
        if (plan?.content) {
          return plan.content;
        }
      }

      throw new Error(`Plan not found: ${idOrKeyword}`);
    },

    async create(name: string, description: string): Promise<string> {
      await ensureDir(plansDir);

      const plans = await this.list();
      const nextId =
        plans.length > 0
          ? Math.max(...plans.map((p: PlanInfo) => p.id)) + 1
          : 1;

      const filename = `${nextId}-${name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')}.md`;
      const filepath = join(plansDir, filename);

      const template = `# ${nextId}. ${name}

## 개요 (Overview)
${description}

## 목표 및 성공 기준 (Goals & Success Criteria)
### 주요 목표
- [ ] Primary objective to be defined

### 성공 기준
- ✅ Success metric 1
- ✅ Success metric 2
- ✅ Success metric 3

## 전체적인 구현 방식 (Implementation Approach)
### 아키텍처 접근법
To be defined based on requirements

### 기술 스택 및 도구
- **Frontend**: TBD
- **Backend**: TBD
- **Tools**: TBD

### 핵심 설계 결정사항
1. Key design decision and rationale
2. Technical approach justification

## 세부 구현 항목 및 체크리스트 (Implementation Checklist)
### Phase 1: 기초 설정 및 준비
- [ ] 환경 설정 및 의존성 확인
- [ ] 기본 구조 설계 검토
- [ ] 필요한 패키지/라이브러리 조사

### Phase 2: 핵심 기능 구현
- [ ] Core feature implementation
- [ ] Integration points
- [ ] Data flow implementation

### Phase 3: 통합 및 최적화
- [ ] 컴포넌트 통합 테스트
- [ ] 성능 최적화
- [ ] 에러 핸들링 강화

### Phase 4: 검증 및 마무리
- [ ] 전체 기능 테스트
- [ ] 문서화 업데이트
- [ ] 배포 준비

## 주요 고려사항 (Key Considerations)
### 기술적 고려사항
- **성능**: Performance requirements
- **확장성**: Scalability considerations
- **보안**: Security requirements

### 리스크 및 완화 방안
| 리스크 | 영향도 | 확률 | 완화 방안 |
|--------|--------|------|-----------|
| Risk 1 | Medium | Low | Mitigation strategy |

## 예상 일정 (Timeline Estimation)
- **Phase 1**: TBD
- **Phase 2**: TBD
- **Phase 3**: TBD
- **Phase 4**: TBD

---
**Status**: [Planning]
**Last Updated**: ${new Date().toISOString()}
`;

      await writeFile(filepath, template);
      return filename;
    },

    async edit(idOrKeyword: string, modifications: string): Promise<void> {
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

      // Simple modification - in a real implementation, this would be more sophisticated
      const updatedContent =
        content +
        `\n\n## Modifications (${new Date().toLocaleDateString()})\n${modifications}\n`;
      const finalContent = updatedContent.replace(
        /\*\*Last Updated\*\*: .+/,
        `**Last Updated**: ${new Date().toISOString()}`
      );

      await writeFile(filepath, finalContent);
    },
  };
};

// Pattern Manager
export interface PatternManager {
  list(): Promise<PatternInfo[]>;
  search(keyword: string, language?: string): Promise<SearchResult[]>;
  view(idOrKeyword: string): Promise<string>;
}

export const createPatternManager = (claudeDir: string): PatternManager => {
  const patternsDir = resolve(claudeDir, 'code-patterns');

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
  };
};

// Knowledge Manager
export interface KnowledgeManager {
  list(category?: string): Promise<KnowledgeInfo[]>;
  search(keyword: string, category?: string): Promise<SearchResult[]>;
  view(idOrKeyword: string): Promise<string>;
}

export const createKnowledgeManager = (claudeDir: string): KnowledgeManager => {
  const knowledgeDir = resolve(claudeDir, 'knowledge');

  return {
    async list(category?: string): Promise<KnowledgeInfo[]> {
      await ensureDir(knowledgeDir);

      const pattern = category ? `**/${category}/**/*.md` : '**/*.md';
      const files = await glob(pattern, { cwd: knowledgeDir });
      const entries: KnowledgeInfo[] = [];

      for (const file of files) {
        const filepath = join(knowledgeDir, file);
        const stats = await stat(filepath);
        const content = await readFile(filepath, 'utf-8');
        const title = extractTitle(content);
        const entryCategory = extractCategory(content, file);
        const idMatch = file.match(/^(\d+)-/);
        const id = idMatch && idMatch[1] ? parseInt(idMatch[1]) : 0;

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

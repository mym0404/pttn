import { readFile, stat, writeFile } from 'fs/promises';
import { glob } from 'glob';
import { join, resolve } from 'path';

import { PlanInfo, PlanManager, SearchResult } from '../types/index.js';
import { ensureDir } from '../utils/index.js';
import { calculateSimilarity } from '../utils/similarity.js';
import { extractStatus, extractTitle } from '../utils/textExtraction.js';

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

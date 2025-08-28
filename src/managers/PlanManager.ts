import { readFile, stat, writeFile } from 'fs/promises';
import { glob } from 'glob';
import { join, resolve } from 'path';

import { PlanInfo, PlanManager, SearchResult } from '../types/index.js';
import { ensureDir } from '../utils/index.js';
import { calculateSimilarity } from '../utils/similarity.js';
import { extractStatus, extractTitle } from '../utils/textExtraction.js';

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

## Overview
${description}

## Goals & Success Criteria
### Main Goals
- [ ] Primary objective to be defined

### Success Criteria
- ✅ Success metric 1
- ✅ Success metric 2
- ✅ Success metric 3

## Implementation Approach
### Architecture Approach
To be defined based on requirements

### Tech Stack & Tools
- **Frontend**: TBD
- **Backend**: TBD
- **Tools**: TBD

### Key Design Decisions
1. Key design decision and rationale
2. Technical approach justification

## Implementation Checklist
### Phase 1: Initial Setup & Preparation
- [ ] Environment setup and dependency verification
- [ ] Basic structure design review
- [ ] Required packages/libraries research

### Phase 2: Core Feature Implementation
- [ ] Core feature implementation
- [ ] Integration points
- [ ] Data flow implementation

### Phase 3: Integration & Optimization
- [ ] Component integration testing
- [ ] Performance optimization
- [ ] Enhanced error handling

### Phase 4: Validation & Finalization
- [ ] End-to-end testing
- [ ] Documentation updates
- [ ] Deployment preparation

## Key Considerations
### Technical Considerations
- **Performance**: Performance requirements
- **Scalability**: Scalability considerations
- **Security**: Security requirements

### Risks & Mitigation
| Risk | Impact | Probability | Mitigation |
|--------|--------|------|-----------|
| Risk 1 | Medium | Low | Mitigation strategy |

## Timeline Estimation
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

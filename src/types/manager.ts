import type { AgentSelection } from '../constants/agents.js';
import type { PageInfo, PatternInfo, PlanInfo, SpecInfo } from './content.js';
import type { SearchResult } from './search.js';

export interface PageManager {
  list(): Promise<PageInfo[]>;
  search(keyword: string): Promise<SearchResult[]>;
  view(idOrKeyword: string): Promise<string>;
  create(title: string, content: string): Promise<number>;
}

export interface PlanManager {
  list(): Promise<PlanInfo[]>;
  search(keyword: string): Promise<SearchResult[]>;
  view(idOrKeyword: string): Promise<string>;
  create(title: string, content: string): Promise<number>;
}

export interface PatternManager {
  list(): Promise<PatternInfo[]>;
  search(keyword: string, language?: string): Promise<SearchResult[]>;
  view(idOrKeyword: string): Promise<string>;
  create(
    name: string,
    content: string,
    keywords: string[],
    language: string,
    explanation: string
  ): Promise<string>;
  syncPromptTable(): Promise<AgentSelection>;
}

export interface SpecManager {
  list(): Promise<SpecInfo[]>;
  search(keyword: string): Promise<SearchResult[]>;
  view(idOrKeyword: string): Promise<string>;
  create(
    title: string,
    content: string
  ): Promise<{ id: number; filename: string }>;
}

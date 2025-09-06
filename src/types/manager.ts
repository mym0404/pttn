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
  resolve(idOrKeyword: string): Promise<void>;
}

export interface PatternManager {
  list(): Promise<PatternInfo[]>;
  search(keyword: string, language?: string): Promise<SearchResult[]>;
  view(idOrKeyword: string): Promise<string>;
  create(name: string, content: string): Promise<string>;
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

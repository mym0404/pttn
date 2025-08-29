import { PageInfo, PatternInfo, PlanInfo, SpecInfo } from './content.js';
import { SearchResult } from './search.js';

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
  edit(idOrKeyword: string, fullContent: string): Promise<void>;
  resolve(idOrKeyword: string): Promise<void>;
  delete(idOrKeyword: string): Promise<void>;
}

export interface PatternManager {
  list(): Promise<PatternInfo[]>;
  search(keyword: string, language?: string): Promise<SearchResult[]>;
  view(idOrKeyword: string): Promise<string>;
  create(name: string, content: string, language?: string): Promise<string>;
}

export interface SpecManager {
  list(category?: string): Promise<SpecInfo[]>;
  search(keyword: string, category?: string): Promise<SearchResult[]>;
  view(idOrKeyword: string): Promise<string>;
  create(
    title: string,
    content: string,
    category?: string
  ): Promise<{ id: number; filename: string }>;
}

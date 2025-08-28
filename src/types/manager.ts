import { KnowledgeInfo, PageInfo, PatternInfo, PlanInfo } from './content.js';
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
  create(name: string, description: string): Promise<string>;
  edit(idOrKeyword: string, modifications: string): Promise<void>;
}

export interface PatternManager {
  list(): Promise<PatternInfo[]>;
  search(keyword: string, language?: string): Promise<SearchResult[]>;
  view(idOrKeyword: string): Promise<string>;
}

export interface KnowledgeManager {
  list(category?: string): Promise<KnowledgeInfo[]>;
  search(keyword: string, category?: string): Promise<SearchResult[]>;
  view(idOrKeyword: string): Promise<string>;
}
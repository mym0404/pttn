import type { PatternInfo } from './content.js';
import type { SearchResult } from './search.js';

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
  syncClaudeMd(): Promise<void>;
}

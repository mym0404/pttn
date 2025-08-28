export interface SearchResult {
  title: string;
  file: string;
  score: number;
  language?: string;
  category?: string;
  matchedFields?: string[];
  highlights?: string[];
  scoreBreakdown?: {
    exactMatch?: number;
    semanticSimilarity?: number;
    keywordRelevance?: number;
    categoryBoost?: number;
    recencyScore?: number;
    fieldBoost?: number;
  };
}

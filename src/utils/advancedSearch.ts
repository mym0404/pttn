import * as natural from 'natural';

export interface SearchScore {
  exactMatch: number;
  semanticSimilarity: number;
  keywordRelevance: number;
  categoryBoost: number;
  recencyScore: number;
  fieldBoost: number;
  final: number;
}

export interface SearchableItem {
  id: number;
  title: string;
  content: string;
  category?: string;
  keywords?: string[];
  lastUpdated: Date;
  file: string;
}

export interface EnhancedSearchResult {
  item: SearchableItem;
  score: SearchScore;
  matchedFields: string[];
  matchHighlights: string[];
}

interface SearchOptions {
  minScore?: number;
  maxResults?: number;
  categoryFilter?: string;
  fieldWeights?: {
    id: number;
    title: number;
    content: number;
    category: number;
  };
  recencyWeight?: number;
}

const DEFAULT_OPTIONS: Required<SearchOptions> = {
  minScore: 0.3,
  maxResults: 50,
  categoryFilter: '',
  fieldWeights: {
    id: 1.0,
    title: 0.8,
    content: 0.6,
    category: 0.4,
  },
  recencyWeight: 0.05,
};

export class AdvancedSearchEngine {
  private options: Required<SearchOptions>;

  constructor(options: SearchOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  search(query: string, items: SearchableItem[]): EnhancedSearchResult[] {
    // Handle ID-based search first (highest priority)
    const idMatch = this.tryIdSearch(query, items);
    if (idMatch) {
      return [idMatch];
    }

    const results: EnhancedSearchResult[] = [];
    const normalizedQuery = query.toLowerCase().trim();

    for (const item of items) {
      // Apply category filter if specified
      if (
        this.options.categoryFilter &&
        item.category !== this.options.categoryFilter
      ) {
        continue;
      }

      const score = this.calculateComprehensiveScore(normalizedQuery, item);

      if (score.final >= this.options.minScore) {
        const matchedFields = this.getMatchedFields(normalizedQuery, item);
        const highlights = this.generateHighlights(normalizedQuery, item);

        results.push({
          item,
          score,
          matchedFields,
          matchHighlights: highlights,
        });
      }
    }

    // Sort by final score (descending)
    return results
      .sort((a, b) => b.score.final - a.score.final)
      .slice(0, this.options.maxResults);
  }

  private tryIdSearch(
    query: string,
    items: SearchableItem[]
  ): EnhancedSearchResult | null {
    const idNum = parseInt(query);
    if (isNaN(idNum)) return null;

    const exactMatch = items.find((item) => item.id === idNum);
    if (!exactMatch) return null;

    const perfectScore: SearchScore = {
      exactMatch: 1.0,
      semanticSimilarity: 1.0,
      keywordRelevance: 1.0,
      categoryBoost: 0.0,
      recencyScore: this.calculateRecencyScore(exactMatch.lastUpdated),
      fieldBoost: this.options.fieldWeights.id,
      final: 1.0,
    };

    return {
      item: exactMatch,
      score: perfectScore,
      matchedFields: ['id'],
      matchHighlights: [`ID: ${idNum}`],
    };
  }

  private calculateComprehensiveScore(
    query: string,
    item: SearchableItem
  ): SearchScore {
    // 1. Exact match scoring
    const exactMatch = this.calculateExactMatchScore(query, item);

    // 2. Semantic similarity using Jaro-Winkler
    const semanticSimilarity = this.calculateSemanticSimilarity(query, item);

    // 3. Keyword relevance scoring
    const keywordRelevance = this.calculateKeywordRelevance(query, item);

    // 4. Category boost if query matches category
    const categoryBoost = this.calculateCategoryBoost(query, item);

    // 5. Recency score
    const recencyScore = this.calculateRecencyScore(item.lastUpdated);

    // 6. Field-based boost
    const fieldBoost = this.calculateFieldBoost(query, item);

    // Combine scores with weighted formula
    const final = this.combineScores({
      exactMatch,
      semanticSimilarity,
      keywordRelevance,
      categoryBoost,
      recencyScore,
      fieldBoost,
    });

    return {
      exactMatch,
      semanticSimilarity,
      keywordRelevance,
      categoryBoost,
      recencyScore,
      fieldBoost,
      final,
    };
  }

  private calculateExactMatchScore(
    query: string,
    item: SearchableItem
  ): number {
    const titleMatch = item.title.toLowerCase() === query ? 0.95 : 0;
    const contentMatch = item.content.toLowerCase().includes(query) ? 0.7 : 0;
    const categoryMatch = item.category?.toLowerCase() === query ? 0.8 : 0;

    return Math.max(titleMatch, contentMatch, categoryMatch);
  }

  private calculateSemanticSimilarity(
    query: string,
    item: SearchableItem
  ): number {
    try {
      const titleSimilarity = natural.JaroWinklerDistance
        ? natural.JaroWinklerDistance(query, item.title.toLowerCase(), {})
        : 0;

      const contentSimilarity = natural.JaroWinklerDistance
        ? natural.JaroWinklerDistance(
            query,
            item.content.toLowerCase().substring(0, 200),
            {}
          )
        : 0;

      return Math.max(
        titleSimilarity * this.options.fieldWeights.title,
        contentSimilarity * this.options.fieldWeights.content
      );
    } catch {
      return 0;
    }
  }

  private calculateKeywordRelevance(
    query: string,
    item: SearchableItem
  ): number {
    const queryWords = query.split(/\s+/).filter((word) => word.length > 0);
    if (queryWords.length === 0) return 0;

    let totalScore = 0;
    let matchCount = 0;

    // Check each field for keyword matches
    const fields = [
      { text: item.title, weight: this.options.fieldWeights.title },
      { text: item.content, weight: this.options.fieldWeights.content },
      { text: item.category || '', weight: this.options.fieldWeights.category },
      { text: item.keywords?.join(' ') || '', weight: 2.5 }, // High weight for keywords
    ];

    for (const field of fields) {
      const fieldText = field.text.toLowerCase();
      let fieldScore = 0;

      for (const word of queryWords) {
        if (fieldText.includes(word)) {
          // Bonus for exact word matches
          const exactWordMatch = new RegExp(`\\b${word}\\b`).test(fieldText);
          fieldScore += exactWordMatch ? 1.0 : 0.7;
          matchCount++;
        }
      }

      totalScore += (fieldScore / queryWords.length) * field.weight;
    }

    // Normalize by number of fields and add completeness bonus
    const completeness = matchCount / (queryWords.length * fields.length);
    return (totalScore / fields.length) * (1 + completeness * 0.2);
  }

  private calculateCategoryBoost(query: string, item: SearchableItem): number {
    if (!item.category) return 0;

    const categoryMatch = item.category.toLowerCase().includes(query) ? 0.1 : 0;
    const exactCategoryMatch = item.category.toLowerCase() === query ? 0.2 : 0;

    return Math.max(categoryMatch, exactCategoryMatch);
  }

  private calculateRecencyScore(lastUpdated: Date): number {
    const now = new Date();
    const daysSinceUpdate =
      (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);

    // Exponential decay: newer items get higher scores
    return Math.exp(-daysSinceUpdate / 30) * this.options.recencyWeight;
  }

  private calculateFieldBoost(query: string, item: SearchableItem): number {
    let boost = 0;

    // Length-based scoring (shorter matches are often more relevant)
    if (item.title.toLowerCase().includes(query)) {
      const titleLength = item.title.length;
      boost += Math.max(0.1, 1.0 - titleLength / 100) * 0.2;
    }

    // N-gram matching for partial matches
    boost += this.calculateNGramScore(query, item.title) * 0.1;

    return boost;
  }

  private calculateNGramScore(query: string, text: string): number {
    if (query.length < 2) return 0;

    const queryGrams = this.generateNGrams(query, 2);
    const textGrams = this.generateNGrams(text.toLowerCase(), 2);

    if (textGrams.size === 0) return 0;

    let matches = 0;
    for (const gram of queryGrams) {
      if (textGrams.has(gram)) matches++;
    }

    return matches / queryGrams.size;
  }

  private generateNGrams(text: string, n: number): Set<string> {
    const grams = new Set<string>();
    const normalized = text.toLowerCase().replace(/\s+/g, ' ');

    for (let i = 0; i <= normalized.length - n; i++) {
      grams.add(normalized.substring(i, i + n));
    }

    return grams;
  }

  private combineScores(scores: Omit<SearchScore, 'final'>): number {
    const {
      exactMatch,
      semanticSimilarity,
      keywordRelevance,
      categoryBoost,
      recencyScore,
      fieldBoost,
    } = scores;

    // Weighted combination with diminishing returns
    const baseScore =
      exactMatch * 0.4 +
      semanticSimilarity * 0.25 +
      keywordRelevance * 0.2 +
      categoryBoost * 0.1 +
      recencyScore +
      fieldBoost;

    // Apply contextual multipliers
    let multiplier = 1.0;

    // Boost if multiple scoring methods agree
    const nonZeroScores = [
      exactMatch,
      semanticSimilarity,
      keywordRelevance,
    ].filter((s) => s > 0.1).length;
    if (nonZeroScores >= 2) {
      multiplier *= 1.1;
    }

    // Cap at 1.0 but allow slight overflow for exceptional matches
    return Math.min(1.0, baseScore * multiplier);
  }

  private getMatchedFields(query: string, item: SearchableItem): string[] {
    const matches: string[] = [];

    if (item.title.toLowerCase().includes(query)) matches.push('title');
    if (item.content.toLowerCase().includes(query)) matches.push('content');
    if (item.category?.toLowerCase().includes(query)) matches.push('category');

    return matches;
  }

  private generateHighlights(query: string, item: SearchableItem): string[] {
    const highlights: string[] = [];
    const queryWords = query.split(/\s+/);

    // Highlight matches in title
    if (item.title.toLowerCase().includes(query)) {
      highlights.push(`Title: "${item.title}"`);
    }

    // Highlight matches in content (snippet)
    for (const word of queryWords) {
      const contentLower = item.content.toLowerCase();
      const index = contentLower.indexOf(word);
      if (index !== -1) {
        const start = Math.max(0, index - 50);
        const end = Math.min(item.content.length, index + word.length + 50);
        const snippet = item.content.substring(start, end);
        highlights.push(`...${snippet}...`);
        break; // Only show first match to avoid clutter
      }
    }

    return highlights;
  }
}

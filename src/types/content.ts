export interface PatternInfo {
  id: number;
  title: string;
  file: string;
  language: string;
  keywords?: string[];
  explanation?: string;
  lastUpdated: Date;
  content?: string;
}

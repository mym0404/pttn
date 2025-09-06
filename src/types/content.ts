export interface PageInfo {
  id: number;
  title: string;
  file: string;
  createdAt: Date;
  content?: string;
}

export interface PlanInfo {
  id: number;
  title: string;
  file: string;
  status: 'Planning' | 'In Progress' | 'Completed';
  lastUpdated: Date;
  content?: string;
}

export interface PatternInfo {
  id: number;
  title: string;
  file: string;
  language: string;
  lastUpdated: Date;
  content?: string;
}

export interface SpecInfo {
  id: number;
  title: string;
  file: string;
  lastUpdated: Date;
  content?: string;
}

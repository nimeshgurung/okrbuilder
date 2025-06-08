export interface KeyResult {
  id: string;
  description: string;
  progress: number;
  target: number;
  unit: string;
  isCompleted: boolean;
}

export interface Objective {
  id: string;
  title: string;
  description: string;
  keyResults: KeyResult[];
  progress: number;
  isCompleted: boolean;
  quarter: string;
}

export interface OKRAgentState {
  objectives: Objective[];
  currentQuarter: string;
  lastUpdated: string;
}
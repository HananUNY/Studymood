export type ThemeColor = 'rose' | 'blue' | 'orange' | 'purple' | 'green';

export interface QuestionData {
  id: number;
  text: string;
  icon: string;
  theme: ThemeColor;
}

export type LikertValue = 0 | 1 | 2 | 3 | 4;

export const LIKERT_LABELS: Record<LikertValue, string> = {
  0: 'Never',
  1: 'Rarely',
  2: 'Sometimes',
  3: 'Often',
  4: 'Always',
};
export interface MoodDataPoint {
  day: string;
  value: number; // 0-100
}

export interface StressorDataPoint {
  name: string;
  value: number; // 0-100
  color: string;
}

export interface SurveyMetric {
  label: string;
  value: string; // e.g., "High (8/10)"
  score: number; // 0-10
  colorClass: string;
  shadowColor: string;
}

export interface NavItem {
  icon: string;
  label: string;
  active?: boolean;
  colorClass: string;
}

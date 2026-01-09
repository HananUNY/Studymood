export interface Category {
  id: string;
  name: string;
  icon: string;
  colorClass: string;
  iconColorClass: string;
  textColorClass: string;
}

export interface StressLevel {
  id: string;
  label: string;
  icon: string;
  value: number;
}

export interface Stressor {
  id: string;
  label: string;
  icon: string;
}

export interface EntryData {
  category: string;
  stressLevelId: string;
  confidence: number;
  selectedStressors: string[];
  journalText: string;
}
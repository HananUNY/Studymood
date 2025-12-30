export interface CalendarDay {
  day: number;
  mood?: string;
  moodColor?: string;
  isSelected?: boolean;
}

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  tag: string;
  tagColorClass: string;
}

export type ViewMode = 'Week' | 'Month';

export interface MoodEntry {
  emoji: string;
  title: string;
  description: string;
  colorClass: string;
}
import { Category, StressLevel, Stressor } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'math',
    name: 'Math',
    icon: 'functions',
    colorClass: 'bg-primary shadow-sm shadow-blue-200 dark:shadow-none',
    iconColorClass: 'text-white',
    textColorClass: 'text-white',
  },
  {
    id: 'science',
    name: 'Science',
    icon: 'science',
    colorClass: 'bg-rose-100 dark:bg-rose-900/40 hover:bg-rose-200 dark:hover:bg-rose-900',
    iconColorClass: 'text-rose-600 dark:text-rose-300',
    textColorClass: 'text-rose-900 dark:text-rose-100',
  },
  {
    id: 'english',
    name: 'English',
    icon: 'book_2',
    colorClass: 'bg-emerald-100 dark:bg-emerald-900/40 hover:bg-emerald-200 dark:hover:bg-emerald-900',
    iconColorClass: 'text-emerald-600 dark:text-emerald-300',
    textColorClass: 'text-emerald-900 dark:text-emerald-100',
  },
  {
    id: 'general',
    name: 'General',
    icon: 'psychology',
    colorClass: 'bg-amber-100 dark:bg-amber-900/40 hover:bg-amber-200 dark:hover:bg-amber-900',
    iconColorClass: 'text-amber-600 dark:text-amber-300',
    textColorClass: 'text-amber-900 dark:text-amber-100',
  },
];

export const STRESS_LEVELS: StressLevel[] = [
  { id: 'calm', label: 'Calm', icon: 'sentiment_very_satisfied', value: 1 },
  { id: 'happy', label: '', icon: 'sentiment_satisfied', value: 2 },
  { id: 'okay', label: 'Okay', icon: 'sentiment_neutral', value: 3 },
  { id: 'sad', label: '', icon: 'sentiment_dissatisfied', value: 4 },
  { id: 'high', label: 'High', icon: 'sentiment_very_dissatisfied', value: 5 },
];

export const STRESSORS: Stressor[] = [
  { id: 'deadlines', label: 'Deadlines', icon: 'schedule' },
  { id: 'exams', label: 'Exams', icon: 'school' },
  { id: 'peers', label: 'Peers', icon: 'group' },
  { id: 'sleep', label: 'Sleep', icon: 'bedtime' },
];
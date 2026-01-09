import { CalendarDay, Task, MoodEntry } from './types';

export const MOOD_ENTRIES: Record<number, MoodEntry> = {
  5: {
    emoji: '🤩',
    title: 'Feeling unstoppable!',
    description: 'Finally cracked the calculus problem set. The study session really paid off!',
    colorClass: 'bg-pastel-green'
  }
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    text: 'Biology Review',
    completed: true,
    tag: 'BIO',
    tagColorClass: 'bg-pastel-green/20 text-green-700 dark:text-green-300'
  },
  {
    id: 2,
    text: 'Calculus Chapter 4',
    completed: false,
    tag: 'MATH',
    tagColorClass: 'bg-pastel-blue/20 text-blue-700 dark:text-blue-300'
  },
  {
    id: 3,
    text: 'History Essay Outline',
    completed: false,
    tag: 'HIST',
    tagColorClass: 'bg-pastel-yellow/20 text-yellow-700 dark:text-yellow-300'
  },
  {
    id: 4,
    text: 'Gym Session',
    completed: false,
    tag: 'HEALTH',
    tagColorClass: 'bg-pastel-pink/20 text-pink-700 dark:text-pink-300'
  }
];

// Helper to generate a month of data roughly matching the screenshot
export const generateCalendarData = (): CalendarDay[] => {
  const days: CalendarDay[] = [];
  
  // Padding for start of month (assuming Oct 1st is Sunday for visual match with screenshot layout, although strictly Oct 1 2023 was Sunday)
  // The screenshot shows 1st on Wednesday (index 3). Wait, screenshot shows 1st under W.
  // S M T W T F S
  //       1 2 3 4
  
  // Let's match the visual grid exactly.
  // Row 1: empty, empty, empty, 1, 2, 3, 4
  const startPadding = 3; 

  for (let i = 0; i < startPadding; i++) {
    days.push({ day: 0 }); // 0 denotes padding
  }

  const moodMap: Record<number, { emoji: string; color: string }> = {
    2: { emoji: '🙂', color: 'bg-pastel-blue' },
    3: { emoji: '😐', color: 'bg-pastel-purple' },
    5: { emoji: '🤩', color: 'bg-pastel-green' }, // Selected
    6: { emoji: '😢', color: 'bg-pastel-pink' },
    8: { emoji: '😴', color: 'bg-pastel-yellow' },
    10: { emoji: '😤', color: 'bg-pastel-blue' },
    12: { emoji: '😇', color: 'bg-pastel-green' },
    14: { emoji: '😎', color: 'bg-pastel-blue' },
    16: { emoji: '😭', color: 'bg-pastel-pink' },
    18: { emoji: '🤯', color: 'bg-pastel-blue' },
    19: { emoji: '🥳', color: 'bg-pastel-yellow' },
    21: { emoji: '😐', color: 'bg-pastel-green' },
    23: { emoji: '🥰', color: 'bg-pastel-purple' },
  };

  for (let d = 1; d <= 31; d++) {
    days.push({
      day: d,
      mood: moodMap[d]?.emoji,
      moodColor: moodMap[d]?.color,
      isSelected: d === 5
    });
  }

  return days;
};

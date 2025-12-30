import React from 'react';
import { QuestionData, LikertValue, LIKERT_LABELS, ThemeColor } from '../types';

interface QuestionCardProps {
  question: QuestionData;
  value: LikertValue | null;
  onChange: (id: number, val: LikertValue) => void;
}

// Helper to get theme-specific styles
const getThemeStyles = (theme: ThemeColor) => {
  switch (theme) {
    case 'rose':
      return {
        card: 'bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/20',
        iconBg: 'bg-rose-200 dark:bg-rose-800/40',
        iconText: 'text-rose-700 dark:text-rose-200',
        radioBorder: 'border-rose-200 dark:border-rose-800',
        radioActive: 'bg-rose-400 text-white border-rose-400',
        labelText: 'text-rose-400'
      };
    case 'blue':
      return {
        card: 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20',
        iconBg: 'bg-blue-200 dark:bg-blue-800/40',
        iconText: 'text-blue-700 dark:text-blue-200',
        radioBorder: 'border-blue-200 dark:border-blue-800',
        radioActive: 'bg-blue-400 text-white border-blue-400',
        labelText: 'text-blue-400'
      };
    case 'orange':
      return {
        card: 'bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/20',
        iconBg: 'bg-orange-200 dark:bg-orange-800/40',
        iconText: 'text-orange-700 dark:text-orange-200',
        radioBorder: 'border-orange-200 dark:border-orange-800',
        radioActive: 'bg-orange-400 text-white border-orange-400',
        labelText: 'text-orange-400'
      };
    case 'purple':
      return {
        card: 'bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900/20',
        iconBg: 'bg-purple-200 dark:bg-purple-800/40',
        iconText: 'text-purple-700 dark:text-purple-200',
        radioBorder: 'border-purple-200 dark:border-purple-800',
        radioActive: 'bg-purple-400 text-white border-purple-400',
        labelText: 'text-purple-400'
      };
    case 'green':
      return {
        card: 'bg-primary/10 dark:bg-primary/5 border-primary/20',
        iconBg: 'bg-primary/20 dark:bg-primary/20',
        iconText: 'text-emerald-700 dark:text-primary',
        radioBorder: 'border-primary/30 dark:border-primary/30',
        radioActive: 'bg-primary text-black border-primary',
        labelText: 'text-emerald-600 dark:text-primary'
      };
    default:
      return {
         card: 'bg-gray-50',
         iconBg: 'bg-gray-200',
         iconText: 'text-gray-700',
         radioBorder: 'border-gray-200',
         radioActive: 'bg-gray-400',
         labelText: 'text-gray-400'
      };
  }
};

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, value, onChange }) => {
  const styles = getThemeStyles(question.theme);
  const options: LikertValue[] = [0, 1, 2, 3, 4];

  return (
    <div className={`flex flex-col p-5 rounded-[2rem] shadow-sm transition-transform hover:scale-[1.01] border ${styles.card}`}>
      {/* Header with Icon and Text */}
      <div className="flex items-start gap-3 mb-4">
        <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${styles.iconBg} ${styles.iconText}`}>
          <span className="material-symbols-outlined">{question.icon}</span>
        </div>
        <p className="text-lg font-semibold text-text-main dark:text-gray-100 leading-snug pt-1">
          {question.text}
        </p>
      </div>

      {/* Likert Scale Radio Group */}
      <div className="flex justify-between items-center mt-2 px-1">
        {options.map((optionValue) => {
          const isSelected = value === optionValue;
          
          return (
            <label key={optionValue} className="group flex flex-col items-center gap-2 cursor-pointer touch-manipulation">
              <input
                className="peer sr-only"
                name={`q-${question.id}`}
                type="radio"
                value={optionValue}
                checked={isSelected}
                onChange={() => onChange(question.id, optionValue)}
              />
              <div
                className={`
                  size-10 sm:size-12 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-all duration-200
                  ${isSelected ? styles.radioActive + ' scale-110 shadow-sm' : styles.radioBorder + ' bg-white dark:bg-gray-800 text-gray-400'}
                `}
              >
                {optionValue}
              </div>
              
              {/* Floating Label - Only visible when selected */}
              <span 
                className={`
                  text-xs font-medium transition-opacity duration-300 absolute mt-12 sm:mt-14 pointer-events-none
                  ${styles.labelText}
                  ${isSelected ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}
                `}
              >
                {LIKERT_LABELS[optionValue]}
              </span>
              
              {/* Invisible spacer to reserve height for label if we wanted fixed height, 
                  but here we are using absolute positioning for the clean look in the screenshot, 
                  relying on the parent padding to avoid clipping if needed. 
                  Actually, the original screenshot layout suggests they might reserve space or overlap.
                  Given the tight packing, absolute is safer for alignment, but we need bottom margin on the container.
               */}
            </label>
          );
        })}
      </div>
      {/* Spacer for the labels */}
      <div className="h-6 w-full" aria-hidden="true" />
    </div>
  );
};
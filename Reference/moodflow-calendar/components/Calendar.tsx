import React from 'react';
import { CalendarDay } from '../types';

interface CalendarProps {
  days: CalendarDay[];
  onSelectDay: (day: number) => void;
  selectedDay: number;
}

const WeekDays = () => (
  <div className="grid grid-cols-7 mb-2">
    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
      <p key={i} className="text-gray-400 dark:text-gray-500 text-[11px] font-bold uppercase tracking-wider text-center py-2">
        {day}
      </p>
    ))}
  </div>
);

const Calendar: React.FC<CalendarProps> = ({ days, onSelectDay, selectedDay }) => {
  return (
    <div className="px-4 py-2">
      <WeekDays />
      <div className="grid grid-cols-7 gap-y-4 gap-x-1">
        {days.map((dayData, index) => {
          if (dayData.day === 0) {
            return <div key={`empty-${index}`} />;
          }

          const isSelected = dayData.day === selectedDay;

          if (isSelected) {
            return (
              <button
                key={dayData.day}
                onClick={() => onSelectDay(dayData.day)}
                className="relative group flex flex-col items-center justify-start h-16 -mt-1 w-full rounded-2xl bg-white dark:bg-[#2c2249] ring-2 ring-primary shadow-lg shadow-primary/10 z-10 pt-2 transition-all transform scale-105"
              >
                <span className="text-sm font-bold text-primary">{dayData.day}</span>
                <div className="mt-1 text-xl leading-none transform scale-110 drop-shadow-sm animate-pulse-once">
                  {dayData.mood || '😶'}
                </div>
                <div className="flex gap-0.5 mt-1.5">
                  <div className={`size-1.5 rounded-full ${dayData.moodColor || 'bg-gray-300'}`}></div>
                  <div className="size-1.5 rounded-full bg-pastel-blue"></div>
                </div>
                <div className="absolute -bottom-2.5 bg-primary text-white rounded-full p-0.5 shadow-sm scale-75">
                  <span className="material-symbols-outlined text-[12px] block font-bold">keyboard_arrow_down</span>
                </div>
              </button>
            );
          }

          return (
            <button
              key={dayData.day}
              onClick={() => onSelectDay(dayData.day)}
              className="relative group flex flex-col items-center justify-start h-14 w-full rounded-2xl hover:bg-gray-200 dark:hover:bg-white/5 transition-colors pt-1"
            >
              <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-gray-600 dark:text-gray-300'}`}>
                {dayData.day}
              </span>
              {dayData.mood && (
                <>
                  <div className="mt-1 text-lg leading-none transform transition-transform group-hover:scale-110">
                    {dayData.mood}
                  </div>
                  <div className={`mt-1 size-1.5 rounded-full ${dayData.moodColor}`}></div>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
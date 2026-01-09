import React from 'react';
import { Task, MoodEntry } from '../types';

interface DailyOverviewProps {
  selectedDate: number;
  moodEntry: MoodEntry | undefined;
  tasks: Task[];
  onToggleTask: (id: number) => void;
}

const DailyOverview: React.FC<DailyOverviewProps> = ({ selectedDate, moodEntry, tasks, onToggleTask }) => {
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <section className="mt-2 px-4 pb-28 relative z-10 animate-fade-in-up">
      <div className="rounded-[2rem] bg-white/70 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-xl shadow-black/5 p-5 backdrop-blur-md">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-gray-900 dark:text-white text-lg font-bold">
              Thursday, {selectedDate}{getOrdinalSuffix(selectedDate)}
            </h3>
            <p className="text-xs text-primary font-bold uppercase tracking-wide opacity-80">
              Daily Overview
            </p>
          </div>
          <button className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary pl-3 pr-2 py-1.5 rounded-full text-xs font-bold transition-colors">
            <span>Full Journal</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        {/* Mood Card */}
        {moodEntry ? (
          <div className="flex items-start gap-3 mb-5 p-3.5 rounded-2xl bg-white/60 dark:bg-black/20 border border-white/20 dark:border-white/5 transition-all hover:bg-white/80 dark:hover:bg-black/30">
            <div className="shrink-0 text-3xl drop-shadow-sm">{moodEntry.emoji}</div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                {moodEntry.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                {moodEntry.description}
              </p>
            </div>
          </div>
        ) : (
           <div className="flex items-center justify-center gap-3 mb-5 p-6 rounded-2xl bg-white/40 dark:bg-white/5 border border-dashed border-gray-300 dark:border-gray-700 text-gray-400">
             <span className="text-sm">No journal entry for today</span>
           </div>
        )}

        {/* Tasks Header */}
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Today's Focus
          </h4>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 transition-all">
            {completedCount}/{tasks.length} Done
          </span>
        </div>

        {/* Task List */}
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className="group flex items-center gap-3 p-2.5 rounded-2xl hover:bg-white/40 dark:hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/20"
            >
              <div
                className={`flex items-center justify-center size-5 rounded-full border-2 transition-all duration-300 ${
                  task.completed
                    ? 'border-pastel-green bg-pastel-green/20 text-pastel-green'
                    : 'border-gray-300 dark:border-gray-600 group-hover:border-primary'
                }`}
              >
                {task.completed && (
                  <span className="material-symbols-outlined text-sm font-bold">check</span>
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium transition-colors ${
                    task.completed
                      ? 'text-gray-500 dark:text-gray-400 line-through decoration-gray-400/50'
                      : 'text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {task.text}
                </p>
              </div>
              <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${task.tagColorClass}`}>
                {task.tag}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

function getOrdinalSuffix(i: number) {
  const j = i % 10;
  const k = i % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}

export default DailyOverview;
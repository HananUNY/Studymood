import React from 'react';

export const StreakCard: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-card-dark shadow-soft p-1">
      <div className="flex items-stretch">
        <div className="relative w-1/3 min-w-[100px] rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pastel-orange/20 to-pastel-red/20 z-10"></div>
          <div 
            className="w-full h-full bg-cover bg-center" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAVwR2Th_FrUkFgtaK0uN26qBhBtaFtBt1enGhOLTGeMQnJFkxKK89Tsp2jm2dMp1m85tjUL498Y2O7jXFIBcwaIGzUtLlX69eG5nRSf-q4uiE4zzLdZqvoqMxzpwnEZlvaz0I9xo2SiGdWdyVw-oDgoZwv4qeX-GsL0SN38UI3T_LoJDRAUpkC6Z3MnbBI5j7DvZVOXjWPaFdr-oQeVt1fpOtIPUS1qqvQk5ZxgKCq5xq-KlKTgyUOgcUAZJU3HiWucP3tn6anFjI")' }}
          ></div>
        </div>
        <div className="flex-1 p-5 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-900/20 px-2.5 py-1 rounded-full border border-orange-100 dark:border-orange-900/30">
              <span className="text-sm">🔥</span>
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wide">On Fire</span>
            </div>
            <span className="text-xs font-medium text-pastel-green">+2 days</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">12</span>
            <span className="text-lg font-bold text-slate-500 dark:text-slate-400">Day Streak</span>
          </div>
          <p className="text-xs text-text-secondary mt-2 leading-relaxed">You're consistent! Keep logging to hit your 14-day goal.</p>
        </div>
      </div>
    </div>
  );
};
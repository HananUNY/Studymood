import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-6 py-5 sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-white/20 dark:border-white/5">
      <div>
        <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-0.5">Dashboard</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Analytics</h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-card-dark shadow-sm border border-gray-100 dark:border-gray-800 text-slate-600 dark:text-gray-300 hover:scale-105 transition-transform">
          <span className="material-symbols-outlined text-[20px]">calendar_today</span>
        </button>
        <button className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-card-dark shadow-sm border border-gray-100 dark:border-gray-800 text-slate-600 dark:text-gray-300 hover:scale-105 transition-transform">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-pastel-red rounded-full ring-2 ring-white dark:ring-card-dark"></span>
        </button>
      </div>
    </header>
  );
};
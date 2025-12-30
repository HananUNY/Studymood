import React from 'react';

export const GoldenHourCard: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <span className="material-symbols-outlined text-pastel-yellow">light_mode</span>
        Golden Hour Finder
      </h2>
      
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-card-dark shadow-soft">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pastel-yellow/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row sm:items-center p-1">
          <div className="flex-1 p-6 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/20 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-700 dark:text-yellow-400">Peak Productivity</span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1">8:00 PM</h3>
            <p className="text-sm text-text-secondary">You feel most <span className="text-slate-900 dark:text-white font-semibold">Focused</span> during late evenings.</p>
          </div>
          <div 
            className="relative w-full sm:w-32 h-32 sm:h-full bg-cover bg-center m-1 rounded-2xl sm:rounded-2xl" 
            style={{ 
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDDqwLgHtmlUumUvibHEHdnhu1GRkwj2tMxHm4WHrYcFGAIBzAzxDvDBxOZMsXiUtUhIJY0t0v-XHBn_M3vtSxk8lO7pSvNm-Mynf8Ig3fJBM71_blDlrr4XpUFO9irQTpiR45xW_JmB-AflP2JDHa5aZqBzuQdSNzNo4zL0u99fKyW34PKdRo-_tFkKu-5ydMTBz5K59Vc7WU01rDvhW1VZDJhfw4tZ6o37zB9EFguY57brafKYVza-3GrT0E2eWtPCmee6CMnMOY")',
              minHeight: '120px'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
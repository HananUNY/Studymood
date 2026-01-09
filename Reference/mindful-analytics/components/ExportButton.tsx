import React from 'react';

export const ExportButton: React.FC = () => {
  return (
    <div className="pt-4 pb-8">
      <button className="w-full group relative flex items-center justify-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl h-14 font-bold shadow-lg shadow-slate-200 dark:shadow-none hover:translate-y-[-2px] active:translate-y-[0px] transition-all overflow-hidden">
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        <span className="material-symbols-outlined relative z-10">download</span>
        <span className="relative z-10">Export PDF Report</span>
      </button>
      <p className="text-center text-[10px] text-gray-400 mt-3">Last exported: 2 days ago</p>
    </div>
  );
};
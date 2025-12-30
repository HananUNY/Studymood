import React from 'react';
import { ViewMode } from '../types';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const Header: React.FC<HeaderProps> = ({ viewMode, setViewMode }) => {
  return (
    <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 transition-colors duration-300">
      <div className="flex items-center justify-between px-4 py-3">
        <button className="p-2 -ml-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-gray-300">
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight">October 2023</h2>
        <button className="p-2 -mr-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-gray-300">
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
      
      <div className="px-4 pb-4">
        <div className="flex h-10 w-full items-center rounded-full bg-gray-200 dark:bg-[#2c2249] p-1 transition-colors">
          <button
            onClick={() => setViewMode('Week')}
            className={`flex-1 h-full rounded-full text-sm font-semibold transition-all duration-200 ${
              viewMode === 'Week'
                ? 'bg-white dark:bg-background-dark text-primary shadow-sm'
                : 'text-gray-500 dark:text-[#9e8fcc] hover:text-gray-700 dark:hover:text-white'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode('Month')}
            className={`flex-1 h-full rounded-full text-sm font-semibold transition-all duration-200 ${
              viewMode === 'Month'
                ? 'bg-white dark:bg-background-dark text-primary shadow-sm'
                : 'text-gray-500 dark:text-[#9e8fcc] hover:text-gray-700 dark:hover:text-white'
            }`}
          >
            Month
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
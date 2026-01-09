import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-100 dark:border-white/5">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer transition-colors">
        <span className="material-symbols-outlined text-text-main dark:text-white" style={{ fontSize: '24px' }}>
          arrow_back
        </span>
      </div>
      <h2 className="text-text-main dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
        Weekly Check-in
      </h2>
      <div className="flex w-16 items-center justify-end cursor-pointer">
        <p className="text-text-sub text-base font-bold leading-normal tracking-[0.015em] shrink-0 hover:opacity-80 transition-opacity">
          Cancel
        </p>
      </div>
    </header>
  );
};
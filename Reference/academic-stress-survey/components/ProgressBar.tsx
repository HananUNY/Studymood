import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="flex flex-col gap-2 mt-2 mb-6">
      <div className="flex gap-6 justify-between items-end">
        <p className="text-text-main dark:text-white text-base font-medium leading-normal">
          Survey Progress
        </p>
        <p className="text-sm font-bold text-primary">{Math.round(progress)}%</p>
      </div>
      <div className="rounded-full bg-[#d1e6d8] dark:bg-white/10 h-3 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};
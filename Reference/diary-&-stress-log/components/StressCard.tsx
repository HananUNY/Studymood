import React from 'react';
import { STRESS_LEVELS, STRESSORS } from '../constants';
import { Icon } from './Icon';
import { Slider } from './Slider';

interface StressCardProps {
  stressLevelId: string;
  setStressLevelId: (id: string) => void;
  confidence: number;
  setConfidence: (val: number) => void;
  selectedStressors: string[];
  toggleStressor: (id: string) => void;
}

export const StressCard: React.FC<StressCardProps> = ({
  stressLevelId,
  setStressLevelId,
  confidence,
  setConfidence,
  selectedStressors,
  toggleStressor,
}) => {
  return (
    <div className="bg-white dark:bg-[#1e2a30] rounded-[2rem] p-6 shadow-sm mb-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Icon name="analytics" className="text-primary" />
        <h3 className="text-[#0e161b] dark:text-white text-lg font-bold leading-tight">
          Academic Stress Check-in
        </h3>
      </div>

      {/* Stress Level Faces */}
      <div className="mb-8">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4 ml-1">
          Current Stress Level
        </p>
        <div className="flex justify-between items-center gap-1">
          {STRESS_LEVELS.map((level) => {
            const isSelected = stressLevelId === level.id;
            
            // Define colors based on the emotion (simplified for demo matching the image)
            let activeColorClass = "";
            let textClass = "text-gray-400";
            let bgClass = "bg-gray-50 dark:bg-gray-800/50";
            
            if (level.id === 'calm') {
                activeColorClass = "text-emerald-400";
                bgClass = isSelected ? "bg-emerald-100" : "bg-emerald-50 dark:bg-emerald-900/20";
                textClass = isSelected ? "text-emerald-500" : "text-emerald-400";
            } else if (level.id === 'okay') {
                activeColorClass = "text-white"; 
                bgClass = "bg-primary";
            } else if (level.id === 'high') {
                activeColorClass = "text-rose-400";
                bgClass = isSelected ? "bg-rose-100" : "bg-rose-50 dark:bg-rose-900/20";
                textClass = isSelected ? "text-rose-500" : "text-rose-400";
            } else if (level.id === 'happy') {
                textClass = "text-teal-400";
                bgClass = "bg-teal-50 dark:bg-teal-900/20";
            } else if (level.id === 'sad') {
                textClass = "text-orange-400";
                bgClass = "bg-orange-50 dark:bg-orange-900/20";
            }

            return (
              <button
                key={level.id}
                onClick={() => setStressLevelId(level.id)}
                className={`flex flex-col items-center gap-2 group relative transition-all duration-300 ${isSelected ? 'scale-110 z-10' : 'scale-100'}`}
              >
                {/* Glow Effect for Selected 'Okay' */}
                {isSelected && level.id === 'okay' && (
                  <div className="absolute -inset-1 bg-primary/20 rounded-full blur-sm"></div>
                )}

                <div
                  className={`
                    flex items-center justify-center rounded-full transition-all duration-300
                    ${level.id === 'okay' && isSelected ? 'size-14 bg-primary text-white shadow-lg shadow-primary/30' : 'size-12 group-hover:bg-opacity-80'}
                    ${!isSelected && level.id !== 'okay' ? bgClass : ''}
                    ${!isSelected && level.id === 'okay' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-400' : ''} 
                    ${isSelected && level.id !== 'okay' ? bgClass : ''}
                    ${isSelected ? '' : textClass}
                  `}
                >
                  <Icon 
                    name={level.icon} 
                    className={`${level.id === 'okay' && isSelected ? 'text-4xl' : 'text-3xl'}`} 
                  />
                </div>
                
                {level.label && (
                  <span className={`text-[10px] font-bold uppercase tracking-wide transition-colors ${isSelected ? 'text-primary' : 'text-gray-400'}`}>
                    {level.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Confidence Slider */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-4 px-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Confidence in Material
          </p>
          <span className="text-primary font-bold text-lg">{confidence}%</span>
        </div>
        <Slider value={confidence} onChange={setConfidence} />
      </div>

      {/* Main Stressors */}
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3 ml-1">
          Main Stressors
        </p>
        <div className="flex flex-wrap gap-2">
          {STRESSORS.map((stressor) => {
            const isChecked = selectedStressors.includes(stressor.id);
            return (
              <label key={stressor.id} className="cursor-pointer group select-none">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={isChecked}
                  onChange={() => toggleStressor(stressor.id)}
                />
                <div className={`
                  flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-200
                  ${isChecked 
                    ? 'bg-primary/10 text-primary ring-1 ring-primary' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}
                `}>
                  <Icon name={stressor.icon} className="text-lg" />
                  <span className="text-sm font-medium">{stressor.label}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
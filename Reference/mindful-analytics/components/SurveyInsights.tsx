import React from 'react';
import { SurveyMetric } from '../types';

const metrics: SurveyMetric[] = [
  { label: 'Academic Pressure', value: 'High (8/10)', score: 80, colorClass: 'bg-pastel-red', shadowColor: 'rgba(252,165,165,0.5)' },
  { label: 'Sleep Quality', value: 'Moderate (5/10)', score: 50, colorClass: 'bg-pastel-yellow', shadowColor: 'rgba(253,224,71,0.5)' },
  { label: 'Social Connection', value: 'Good (7/10)', score: 70, colorClass: 'bg-pastel-green', shadowColor: 'rgba(134,239,172,0.5)' },
];

export const SurveyInsights: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <span className="material-symbols-outlined text-pastel-teal">assignment_turned_in</span>
        Survey Insights
      </h2>
      
      <div className="bg-white dark:bg-card-dark rounded-3xl p-6 shadow-soft border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Weekly Check-in</span>
          <span className="text-xs font-semibold text-pastel-purple bg-pastel-purple/10 px-2 py-1 rounded-lg">2 days ago</span>
        </div>
        
        <div className="space-y-6">
          {metrics.map((metric, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-slate-700 dark:text-gray-300">{metric.label}</span>
                <span className={`text-xs font-bold ${metric.colorClass.replace('bg-', 'text-')}`}>{metric.value}</span>
              </div>
              <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${metric.colorClass} rounded-full transition-all duration-1000 ease-out`}
                  style={{ 
                    width: `${metric.score}%`,
                    boxShadow: `0 0 10px ${metric.shadowColor}`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-text-secondary italic">"You reported high anxiety before Calculus exams. Try the 5-min breathing exercise."</p>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { MoodDataPoint } from '../types';

const data: MoodDataPoint[] = [
  { day: 'MON', value: 20 },
  { day: 'TUE', value: 60 },
  { day: 'WED', value: 50 },
  { day: 'THU', value: 35 },
  { day: 'FRI', value: 75 },
  { day: 'SAT', value: 65 },
  { day: 'SUN', value: 70 },
];

export const MoodTrendChart: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-pastel-purple">ecg_heart</span>
          Mood Trend
        </h2>
        <div className="flex bg-gray-100 dark:bg-gray-800 p-0.5 rounded-lg">
          <button className="px-3 py-1 text-[10px] font-bold bg-white dark:bg-gray-700 shadow-sm rounded-md text-slate-900 dark:text-white transition-all">7 Days</button>
          <button className="px-3 py-1 text-[10px] font-bold text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-all">30 Days</button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-card-dark p-6 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-800 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-pastel-purple/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="flex justify-between items-baseline mb-4 relative z-10">
          <div>
            <p className="text-xs font-bold text-text-secondary uppercase mb-1">Average Mood</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Happy <span className="text-2xl">😊</span>
            </h3>
          </div>
          <div className="flex items-center gap-1 text-pastel-green text-xs font-bold bg-pastel-green/10 px-2 py-1 rounded-full">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>Stable</span>
          </div>
        </div>

        <div className="h-48 w-full -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D8B4FE" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#D8B4FE" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 500 }} 
                dy={10}
              />
              <YAxis 
                hide={true} 
                domain={[0, 100]} 
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#D8B4FE" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorMood)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
              />
              {/* Custom background grid lines/labels simulated in HTML, but here we keep it clean or could add custom ReferenceLines */}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Background Labels Overlay (Simulated to match original design's dashed lines) */}
        <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-gray-300 dark:text-gray-700 pointer-events-none pb-12 pl-6 pr-6 pt-24 z-0 opacity-50">
          <div className="border-b border-dashed border-gray-100 dark:border-gray-800 w-full flex justify-between items-center h-0"></div>
          <div className="border-b border-dashed border-gray-100 dark:border-gray-800 w-full flex justify-between items-center h-0"></div>
          <div className="border-b border-dashed border-gray-100 dark:border-gray-800 w-full flex justify-between items-center h-0"></div>
          <div className="border-b border-dashed border-gray-100 dark:border-gray-800 w-full flex justify-between items-center h-0"></div>
        </div>
      </div>
    </div>
  );
};
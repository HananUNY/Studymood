import React from 'react';
import { BarChart, Bar, Cell, ResponsiveContainer, XAxis } from 'recharts';
import { StressorDataPoint } from '../types';

const data: StressorDataPoint[] = [
  { name: 'CALC', value: 85, color: '#FCA5A5' }, // pastel-red
  { name: 'PHYS', value: 45, color: '#93C5FD' }, // pastel-blue
  { name: 'LIT', value: 30, color: '#86EFAC' },  // pastel-green
  { name: 'BIO', value: 60, color: '#D8B4FE' },  // pastel-purple
  { name: 'HIST', value: 25, color: '#FDE047' }, // pastel-yellow
];

// Custom shape for rounded top bars
const CustomBar = (props: any) => {
  const { fill, x, y, width, height } = props;
  const radius = 10; 
  return (
    <g>
        {/* Semi-transparent background track for the bar */}
        <path 
            d={`M${x},${y + height} L${x},${props.background.y + radius} Q${x},${props.background.y} ${x + radius},${props.background.y} L${x + width - radius},${props.background.y} Q${x + width},${props.background.y} ${x + width},${props.background.y + radius} L${x + width},${y + height} Z`} 
            fill={fill} 
            fillOpacity={0.15}
        />
        {/* Actual Value Bar */}
        <path 
            d={`M${x},${y + height} L${x},${y + radius} Q${x},${y} ${x + radius},${y} L${x + width - radius},${y} Q${x + width},${y} ${x + width},${y + radius} L${x + width},${y + height} Z`} 
            fill={fill} 
            fillOpacity={0.9}
        />
    </g>
  );
};

export const StressSourcesChart: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-pastel-red">psychology_alt</span>
          Stress Sources
        </h2>
        <button className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">Details</button>
      </div>
      
      <div className="rounded-3xl bg-white dark:bg-card-dark p-6 shadow-soft border border-gray-100 dark:border-gray-800">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Highest Stressor</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Calculus</h3>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Trend</p>
            <div className="flex items-center justify-end gap-1 text-pastel-red">
              <span className="material-symbols-outlined text-base">trending_up</span>
              <span className="text-sm font-bold">+15%</span>
            </div>
          </div>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barSize={40}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 700 }}
                dy={10}
              />
              <Bar dataKey="value" shape={<CustomBar />} isAnimationActive={true}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
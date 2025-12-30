import React from 'react';

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 pb-[env(safe-area-inset-bottom)]">
      {/* Blurry Background */}
      <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-t border-white/40 dark:border-white/10 shadow-[0_-8px_32px_-4px_rgba(0,0,0,0.1)]"></div>
      
      {/* Top Border Glow */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50"></div>
      
      <div className="relative flex justify-around items-center h-[80px] px-2 max-w-lg mx-auto">
        
        {/* Home Item */}
        <a className="group flex flex-col items-center gap-1 p-2 w-16 text-slate-400 dark:text-slate-500 hover:text-pastel-blue transition-all" href="#">
          <span 
            className="material-symbols-outlined text-2xl group-hover:-translate-y-1 transition-transform duration-300 group-hover:text-pastel-blue" 
            style={{ textShadow: '0 0 10px rgba(147, 197, 253, 0.3)' }}
          >
            home
          </span>
          <span className="text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-1 text-pastel-blue">Home</span>
        </a>

        {/* Analytics Item (Active) */}
        <a className="group flex flex-col items-center gap-1 p-2 w-16 text-primary dark:text-white relative" href="#">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-pastel-purple/20 rounded-full blur-lg"></div>
          <span className="material-symbols-outlined text-2xl filled relative z-10 text-pastel-purple drop-shadow-[0_0_8px_rgba(216,180,254,0.5)]">bar_chart</span>
          <span className="text-[10px] font-bold relative z-10 text-pastel-purple">Analytics</span>
        </a>

        {/* Floating Add Button */}
        <div className="relative -top-8">
          <button className="group flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pastel-purple to-pastel-indigo text-white shadow-[0_8px_20px_-4px_rgba(165,180,252,0.6)] border-[4px] border-white/40 dark:border-gray-800/40 backdrop-blur-sm hover:scale-105 transition-all">
            <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform duration-300">add</span>
          </button>
        </div>

        {/* Journal Item */}
        <a className="group flex flex-col items-center gap-1 p-2 w-16 text-slate-400 dark:text-slate-500 hover:text-pastel-pink transition-all" href="#">
          <span 
            className="material-symbols-outlined text-2xl group-hover:-translate-y-1 transition-transform duration-300 group-hover:text-pastel-pink"
            style={{ textShadow: '0 0 10px rgba(249, 168, 212, 0.3)' }}
          >
            book
          </span>
          <span className="text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-1 text-pastel-pink">Journal</span>
        </a>

        {/* Profile Item */}
        <a className="group flex flex-col items-center gap-1 p-2 w-16 text-slate-400 dark:text-slate-500 hover:text-pastel-orange transition-all" href="#">
          <span 
            className="material-symbols-outlined text-2xl group-hover:-translate-y-1 transition-transform duration-300 group-hover:text-pastel-orange"
            style={{ textShadow: '0 0 10px rgba(253, 186, 116, 0.3)' }}
          >
            person
          </span>
          <span className="text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-1 text-pastel-orange">Profile</span>
        </a>

      </div>
    </nav>
  );
};
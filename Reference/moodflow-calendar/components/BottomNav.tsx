import React from 'react';

type Tab = 'calendar' | 'stats' | 'journal' | 'profile';

interface BottomNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'calendar', icon: 'calendar_today', color: 'text-pastel-purple', hoverBg: 'bg-pastel-purple/20', shadowColor: 'rgba(179,158,181,0.2)' },
    { id: 'stats', icon: 'bar_chart', color: 'text-pastel-blue', hoverBg: 'bg-pastel-blue/20', shadowColor: 'rgba(174,198,207,0.2)' },
    { id: 'journal', icon: 'menu_book', color: 'text-pastel-green', hoverBg: 'bg-pastel-green/20', shadowColor: 'rgba(119,221,119,0.2)' },
    { id: 'profile', icon: 'person', color: 'text-pastel-pink', hoverBg: 'bg-pastel-pink/20', shadowColor: 'rgba(255,183,178,0.2)' },
  ] as const;

  return (
    <>
      <button className="fixed bottom-24 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-300">
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      <nav className="fixed bottom-6 left-4 right-4 z-40">
        <div className="flex items-center justify-around h-20 rounded-[2.5rem] bg-white/80 dark:bg-[#1a1625]/80 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-2xl shadow-black/10 ring-1 ring-white/20">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className="relative group flex flex-col items-center justify-center gap-1.5 p-1 w-16"
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 group-hover:-translate-y-1 ${
                    isActive
                      ? `${item.hoverBg} text-primary dark:${item.color}`
                      : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                  style={isActive ? { boxShadow: `0 0 15px ${item.shadowColor}` } : {}}
                >
                  <span className={`material-symbols-outlined text-[28px] ${isActive ? 'filled' : ''}`}>
                    {item.icon}
                  </span>
                </div>
                <div
                  className={`h-1 w-1 rounded-full transition-colors duration-300 ${
                    isActive ? 'bg-primary dark:bg-white shadow-[0_0_8px_currentColor]' : 'bg-transparent'
                  }`}
                ></div>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
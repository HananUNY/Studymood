import React, { useState } from 'react';
import { CATEGORIES } from './constants';
import { StressCard } from './components/StressCard';
import { Icon } from './components/Icon';

const App: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState('math');
  const [stressLevelId, setStressLevelId] = useState('okay');
  const [confidence, setConfidence] = useState(75);
  const [selectedStressors, setSelectedStressors] = useState<string[]>(['deadlines']);
  const [journalText, setJournalText] = useState('');

  const toggleStressor = (id: string) => {
    setSelectedStressors((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    console.log({
      category: selectedCategoryId,
      stressLevelId,
      confidence,
      selectedStressors,
      journalText,
    });
    alert('Entry Saved!');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-4 pb-2 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <button className="flex size-10 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-[#0e161b] dark:text-white">
          <Icon name="arrow_back_ios_new" className="text-xl" />
        </button>
        <h2 className="text-[#0e161b] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
          New Entry
        </h2>
        <div className="size-10"></div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-md mx-auto w-full px-4 pb-32">
        {/* Date Display */}
        <div className="flex flex-col items-center py-4">
          <p className="text-[#507e95] dark:text-[#8ab0c2] text-sm font-medium leading-normal">
            Oct 24, 4:30 PM
          </p>
        </div>

        {/* Category Selector (Horizontal Scroll) */}
        <div className="w-full overflow-x-auto no-scrollbar pb-2 mb-6 -mx-4 px-4">
          <div className="flex gap-3 min-w-max">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategoryId === cat.id;
              // If inactive, use default simple styling, otherwise use the category's active styling
              const activeClass = isActive 
                ? `${cat.colorClass}`
                : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm border border-transparent dark:border-gray-700";

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`group flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full pl-3 pr-4 transition-all duration-300 ${activeClass}`}
                >
                  <Icon 
                    name={cat.icon} 
                    className={`text-[18px] ${isActive ? cat.iconColorClass : 'text-gray-400 dark:text-gray-500'}`} 
                  />
                  <p className={`text-sm font-medium leading-normal ${isActive ? cat.textColorClass : ''}`}>
                    {cat.name}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stress Card Component */}
        <StressCard 
          stressLevelId={stressLevelId}
          setStressLevelId={setStressLevelId}
          confidence={confidence}
          setConfidence={setConfidence}
          selectedStressors={selectedStressors}
          toggleStressor={toggleStressor}
        />

        {/* Journal Entry Area */}
        <div className="flex-1 mb-8">
          <label htmlFor="journal-entry" className="sr-only">
            Journal Entry
          </label>
          <div className="relative group">
            <textarea
              id="journal-entry"
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="How are you feeling about your studies today? Take a deep breath and write freely..."
              className="form-input w-full resize-none rounded-3xl border-0 bg-white dark:bg-[#1e2a30] text-[#0e161b] dark:text-gray-100 placeholder:text-[#9bb2c0] dark:placeholder:text-gray-500 p-6 text-base font-normal leading-relaxed focus:ring-2 focus:ring-primary/20 shadow-sm min-h-[240px] transition-shadow duration-200"
            ></textarea>
            <div className="absolute bottom-4 right-4 text-gray-400 dark:text-gray-600 pointer-events-none group-focus-within:text-primary transition-colors">
              <Icon name="edit_note" className="text-xl" />
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Save Button Footer */}
      <div className="fixed bottom-0 left-0 w-full z-10 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light/95 dark:via-background-dark/95 to-transparent pb-6 pt-10 px-4 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <button 
            onClick={handleSave}
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold text-lg h-14 rounded-full shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] hover:shadow-primary/40"
          >
            <span>Save Entry</span>
            <Icon name="check_circle" className="text-2xl" filled />
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
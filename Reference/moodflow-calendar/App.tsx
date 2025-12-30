import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Calendar from './components/Calendar';
import DailyOverview from './components/DailyOverview';
import BottomNav from './components/BottomNav';
import { ViewMode, Task } from './types';
import { generateCalendarData, MOOD_ENTRIES, INITIAL_TASKS } from './data';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('Month');
  const [selectedDay, setSelectedDay] = useState<number>(5);
  const [activeTab, setActiveTab] = useState<'calendar' | 'stats' | 'journal' | 'profile'>('calendar');
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  // Memoize calendar data so it doesn't regenerate on every render
  const calendarDays = useMemo(() => generateCalendarData(), []);

  const handleToggleTask = (id: number) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
  };

  return (
    <div className="relative flex flex-col w-full max-w-md mx-auto min-h-screen bg-background-light dark:bg-background-dark overflow-hidden shadow-2xl transition-colors duration-300">
      
      <Header viewMode={viewMode} setViewMode={setViewMode} />
      
      <main className="flex-1 flex flex-col relative">
        <div className={`transition-opacity duration-300 ${viewMode === 'Week' ? 'opacity-50 blur-sm pointer-events-none' : 'opacity-100'}`}>
             <Calendar 
                days={calendarDays} 
                selectedDay={selectedDay} 
                onSelectDay={handleSelectDay} 
            />
        </div>
       
       {/* 
         In a real app, the Week view would replace the Calendar grid.
         For this UI demo, we'll keep the Month view as the primary interactive element 
         but technically 'disable' it visually if Week is clicked to show interactivity.
       */}

        <DailyOverview 
          selectedDate={selectedDay}
          moodEntry={MOOD_ENTRIES[selectedDay]}
          tasks={tasks}
          onToggleTask={handleToggleTask}
        />
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Background Decor Gradients for aesthetic depth */}
      <div className="fixed top-0 left-0 w-full h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -z-10 pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-64 h-64 bg-pastel-purple/10 rounded-full blur-3xl translate-y-1/4 -z-10 pointer-events-none"></div>
    </div>
  );
};

export default App;
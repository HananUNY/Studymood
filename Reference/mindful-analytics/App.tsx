import React from 'react';
import { Header } from './components/Header';
import { StreakCard } from './components/StreakCard';
import { MoodTrendChart } from './components/MoodTrendChart';
import { StressSourcesChart } from './components/StressSourcesChart';
import { SurveyInsights } from './components/SurveyInsights';
import { GoldenHourCard } from './components/GoldenHourCard';
import { ExportButton } from './components/ExportButton';
import { BottomNav } from './components/BottomNav';

const App: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-primary dark:text-white min-h-screen flex flex-col pb-28 selection:bg-pastel-purple selection:text-white">
      <Header />
      
      <main className="flex-1 flex flex-col gap-6 px-6 pt-4 max-w-2xl mx-auto w-full">
        <StreakCard />
        <MoodTrendChart />
        <StressSourcesChart />
        <SurveyInsights />
        <GoldenHourCard />
        <ExportButton />
      </main>

      <BottomNav />
    </div>
  );
};

export default App;
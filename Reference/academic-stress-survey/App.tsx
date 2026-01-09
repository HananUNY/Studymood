import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { QuestionCard } from './components/QuestionCard';
import { QUESTIONS } from './constants';
import { LikertValue } from './types';

const App: React.FC = () => {
  // State to store answers. Key is question ID, value is LikertValue (0-4)
  const [answers, setAnswers] = useState<Record<number, LikertValue>>({});

  const handleAnswerChange = (id: number, val: LikertValue) => {
    setAnswers(prev => ({
      ...prev,
      [id]: val
    }));
  };

  const progress = useMemo(() => {
    const answeredCount = Object.keys(answers).length;
    return (answeredCount / QUESTIONS.length) * 100;
  }, [answers]);

  const allAnswered = Object.keys(answers).length === QUESTIONS.length;

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden font-display text-text-main dark:text-gray-100 transition-colors duration-300">
      <Header />
      
      <main className="flex flex-col flex-1 px-4 pb-32 max-w-2xl mx-auto w-full">
        {/* Date Meta */}
        <div className="flex justify-center py-2 opacity-60">
          <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full">
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            <p className="text-sm font-medium leading-normal">Oct 24, 2023</p>
          </div>
        </div>

        {/* Progress */}
        <ProgressBar progress={progress} />

        {/* Headline */}
        <div className="mb-2">
          <h3 className="text-text-main dark:text-white tracking-tight text-3xl font-bold leading-tight text-left">
            How are you feeling about school?
          </h3>
        </div>

        {/* Instructions */}
        <div className="mb-8">
          <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-relaxed">
            Rate the following statements from <span className="font-bold text-text-main dark:text-gray-200">0 (Never)</span> to <span className="font-bold text-text-main dark:text-gray-200">4 (Always)</span>.
          </p>
        </div>

        {/* Question Cards List */}
        <div className="flex flex-col gap-6">
          {QUESTIONS.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              value={answers[q.id] ?? null}
              onChange={handleAnswerChange}
            />
          ))}
        </div>
      </main>

      {/* Floating Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark/90 pt-16 pb-8 z-30 pointer-events-none">
        <div className="max-w-2xl mx-auto w-full pointer-events-auto">
          <button 
            disabled={!allAnswered}
            className={`
              w-full text-[#0e1b12] text-xl font-bold py-4 rounded-full shadow-lg shadow-primary/30 
              transform transition-all duration-300 active:scale-95 flex items-center justify-center gap-2
              ${allAnswered 
                ? 'bg-primary hover:bg-primary-dark cursor-pointer' 
                : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed opacity-80 shadow-none'}
            `}
          >
            <span>Submit Survey</span>
            <span className="material-symbols-outlined">
              {allAnswered ? 'check_circle' : 'lock'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
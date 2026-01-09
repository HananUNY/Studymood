import React, { useRef, useState, useEffect } from 'react';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export const Slider: React.FC<SliderProps> = ({ value, onChange, min = 0, max = 100 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const calculateValue = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = x / rect.width;
    const newValue = Math.round(percent * (max - min) + min);
    onChange(newValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    calculateValue(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    calculateValue(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      calculateValue(clientX);
    };

    const handleUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDragging, max, min]); // eslint-disable-line react-hooks/exhaustive-deps

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-8 flex items-center cursor-pointer touch-none"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-primary h-full rounded-full transition-all duration-75 ease-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div 
        className="absolute bg-white dark:bg-gray-800 border-4 border-primary size-6 rounded-full shadow-md transition-all duration-75 ease-out hover:scale-110" 
        style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
      ></div>
    </div>
  );
};
import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { Pedometer } from 'expo-sensors';

// Context type
type StepCounterContextType = {
  isActive: boolean;
  stepCount: number;
  start: () => void;
  stop: () => void;
  lastResult: number | null;
};

const StepCounterContext = createContext<StepCounterContextType | undefined>(undefined);

export const StepCounterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [lastResult, setLastResult] = useState<number | null>(null);
  const subscription = useRef<any>(null);

  const start = useCallback(() => {
    if (subscription.current) return;
    setStepCount(0);
    setIsActive(true);
    subscription.current = Pedometer.watchStepCount((result) => {
      setStepCount(result.steps);
    });
  }, []);

  const stop = useCallback(() => {
    if (subscription.current) {
      subscription.current.remove();
      subscription.current = null;
    }
    setIsActive(false);
    setLastResult(stepCount);
    setStepCount(0);
    setTimeout(() => setLastResult(null), 5000);
  }, [stepCount]);

  return (
    <StepCounterContext.Provider value={{ isActive, stepCount, start, stop, lastResult }}>
      {children}
    </StepCounterContext.Provider>
  );
};

export const useStepCounter = () => {
  const ctx = useContext(StepCounterContext);
  if (!ctx) throw new Error('useStepCounter must be used within StepCounterProvider');
  return ctx;
}; 
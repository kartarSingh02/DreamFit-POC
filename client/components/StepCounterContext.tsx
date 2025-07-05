import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import { Pedometer } from 'expo-sensors';

// Context type
type StepCounterContextType = {
  isActive: boolean;
  stepCount: number;
  start: () => void;
  stop: () => void;
  lastResult: number | null;
  hasActiveParticipation: boolean;
  setActiveParticipation: (hasActive: boolean) => void;
};

const StepCounterContext = createContext<StepCounterContextType | undefined>(undefined);

export const StepCounterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [lastResult, setLastResult] = useState<number | null>(null);
  const [hasActiveParticipation, setHasActiveParticipation] = useState(false);
  const subscription = useRef<any>(null);
  const mockInterval = useRef<NodeJS.Timeout | null>(null);

  // Auto-start tracking when user has active participation
  useEffect(() => {
    if (hasActiveParticipation && !isActive) {
      start();
    } else if (!hasActiveParticipation && isActive) {
      stop();
    }
  }, [hasActiveParticipation, isActive]);

  const start = useCallback(() => {
    if (subscription.current || mockInterval.current) return;
    setStepCount(0);
    setIsActive(true);

    // Check if we're on web or if Pedometer is not available
    if (Platform.OS === 'web' || !Pedometer.isAvailableAsync) {
      // Mock implementation for web/PC testing
      console.log('Using mock step counter for web/PC testing');
      mockInterval.current = setInterval(() => {
        setStepCount(prev => prev + Math.floor(Math.random() * 3) + 1); // Simulate 1-3 steps per second
      }, 1000);
    } else {
      // Real implementation for mobile devices
      try {
        subscription.current = Pedometer.watchStepCount((result) => {
          setStepCount(result.steps);
        });
      } catch (error) {
        console.log('Pedometer not available, using mock implementation');
        // Fallback to mock if Pedometer fails
        mockInterval.current = setInterval(() => {
          setStepCount(prev => prev + Math.floor(Math.random() * 3) + 1);
        }, 1000);
      }
    }
  }, []);

  const stop = useCallback(() => {
    if (subscription.current) {
      subscription.current.remove();
      subscription.current = null;
    }
    if (mockInterval.current) {
      clearInterval(mockInterval.current);
      mockInterval.current = null;
    }
    setIsActive(false);
    setLastResult(stepCount);
    setStepCount(0);
    setTimeout(() => setLastResult(null), 5000);
  }, [stepCount]);

  const setActiveParticipation = useCallback((hasActive: boolean) => {
    setHasActiveParticipation(hasActive);
  }, []);

  return (
    <StepCounterContext.Provider value={{ 
      isActive, 
      stepCount, 
      start, 
      stop, 
      lastResult, 
      hasActiveParticipation,
      setActiveParticipation
    }}>
      {children}
    </StepCounterContext.Provider>
  );
};

export const useStepCounter = () => {
  const ctx = useContext(StepCounterContext);
  if (!ctx) throw new Error('useStepCounter must be used within StepCounterProvider');
  return ctx;
}; 
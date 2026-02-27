import { useState, useEffect, useRef, useCallback } from 'react';

export function useStudyTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const stop = useCallback(() => {
    setIsRunning(false);
    const mins = Math.ceil(elapsedSeconds / 60);
    setElapsedSeconds(0);
    return mins;
  }, [elapsedSeconds]);
  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsedSeconds(0);
  }, []);

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return { isRunning, elapsedSeconds, minutes, seconds, display, start, pause, stop, reset };
}

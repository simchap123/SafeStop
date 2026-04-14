import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerOptions {
  /** Initial seconds (for countdowns, set this; for elapsed timers, leave 0) */
  initialSeconds?: number;
  /** If true, counts down from initialSeconds to 0 */
  countdown?: boolean;
  /** Auto-start when mounted */
  autoStart?: boolean;
  /** Called when countdown reaches 0 */
  onComplete?: () => void;
}

interface UseTimerReturn {
  seconds: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: (newSeconds?: number) => void;
  /** Formatted as "M:SS" */
  formatted: string;
}

export function useTimer({
  initialSeconds = 0,
  countdown = false,
  autoStart = false,
  onComplete,
}: UseTimerOptions = {}): UseTimerReturn {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);

  onCompleteRef.current = onComplete;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (countdown) {
            if (prev <= 1) {
              clearTimer();
              setIsRunning(false);
              onCompleteRef.current?.();
              return 0;
            }
            return prev - 1;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [isRunning, countdown, clearTimer]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(
    (newSeconds?: number) => {
      clearTimer();
      setSeconds(newSeconds ?? initialSeconds);
      setIsRunning(false);
    },
    [initialSeconds, clearTimer]
  );

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const formatted = `${m}:${s.toString().padStart(2, '0')}`;

  return { seconds, isRunning, start, pause, reset, formatted };
}

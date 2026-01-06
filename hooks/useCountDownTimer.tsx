import { useState, useEffect, useRef } from 'react';

/**
 * Return type interface for the countdown timer hook
 */
interface CountDownTimerResult {
  timeLeft: number;
  startTimer: () => void;
}

/**
 * A custom hook that manages a countdown timer.
 * * @param initialTime - The starting number of seconds (default is 10)
 * @returns {timeLeft, startTimer}
 */
const useCountDownTimer = (initialTime: number = 10): CountDownTimerResult => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // In React Native / Browser, setInterval returns a numeric ID or a Timeout object
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Function to start the timer manually
  const startTimer = (): void => {
    if (timeLeft === 0) {
      setTimeLeft(initialTime);
    }
  };

  // Effect to handle countdown logic
  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Cleanup interval on unmount or when timeLeft changes
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft]);

  return { timeLeft, startTimer };
};

export default useCountDownTimer;

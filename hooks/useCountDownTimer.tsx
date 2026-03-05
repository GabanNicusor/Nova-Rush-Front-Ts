import {useEffect, useRef, useState} from 'react';

interface CountDownTimerResult {
    timeLeft: number;
    startTimer: () => void;
}

export default function useCountDownTimer(initialTime: number = 10): CountDownTimerResult {
    const [timeLeft, setTimeLeft] = useState<number>(0);

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startTimer = (): void => {
        if (timeLeft === 0) {
            setTimeLeft(initialTime);
        }
    };

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

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [timeLeft]);

    return {timeLeft, startTimer};
};

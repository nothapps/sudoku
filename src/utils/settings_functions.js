import { useState, useEffect, useCallback } from "react";

export default function useTimer() {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    const startTimer = useCallback(() => setIsRunning(true), []);
    const stopTimer = useCallback(() => setIsRunning(false), []);
    const resetTimer = useCallback(() => {
        setTime(0);
        setIsRunning(true)
    }, []);

    useEffect(() => {
        let interval = null;

        if (isRunning) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isRunning]);

    return { time, startTimer, stopTimer, resetTimer };
}

export function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}
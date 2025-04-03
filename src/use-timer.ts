import { useCallback, useState } from "react";

type UseTimerReturn = {
  timer: {
    start: () => void;
    stop: () => void;
  };
  calculateKPM: (totalKeys: number) => number;
  calculateCurrentKPM: (keys: number) => number;
};

export function useTimer(): UseTimerReturn {
  const [startTime, setStartTime] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0); // msで足していく

  const start = () => {
    console.log("timer start");
    setStartTime(Date.now());
  };

  const stop = () => {
    console.log("timer stop");
    const now = Date.now();
    console.log((now - startTime) / 1000);
    setTotalDuration((prev) => prev + (now - startTime));
  };

  const calculateKPM = useCallback(
    (totalKeys: number): number => {
      console.log(totalDuration, totalKeys);
      const minutes = totalDuration / 1000 / 60;
      if (minutes === 0) return 0;
      return Math.round(totalKeys / minutes);
    },
    [totalDuration]
  );

  const calculateCurrentKPM = useCallback(
    (keys: number): number => {
      const elapsed = Date.now() - startTime;
      const minutes = elapsed / 1000 / 60;
      if (minutes === 0) return 0;
      return Math.round(keys / minutes);
    },
    [startTime]
  );

  return {
    timer: {
      start,
      stop,
    },
    calculateKPM,
    calculateCurrentKPM,
  };
}

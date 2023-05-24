import { useEffect, useRef, useState } from 'react';

const useCountdown = (targetDate: number) => {
  const countDownDateRef = useRef(new Date(targetDate).getTime());
  const [countDown, setCountDown] = useState(countDownDateRef.current - new Date().getTime());
  const [isActive, setIsActive] = useState(false);

  const clearTimer = (timerRef: NodeJS.Timer) => {
    setIsActive(false);
    clearInterval(timerRef);
  };

  const startTimer = () => {
    const timerRef = setInterval(() => {
      setCountDown(countDownDateRef.current - new Date().getTime());
      const shouldClearTimer = countDownDateRef.current - new Date().getTime() < 0;
      if (!shouldClearTimer && !isActive) setIsActive(true);
      if (shouldClearTimer) clearTimer(timerRef);
    }, 1000);
    return timerRef;
  };

  useEffect(() => {
    const timerRef = startTimer();
    return () => clearInterval(timerRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  const onTargetDateChange = (value: string | number | Date) => {
    countDownDateRef.current = new Date(value).getTime();
    if (!isActive) startTimer();
  };

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return { data: getReturnValues(countDown), onTargetDateChange };
};

const getReturnValues = (countDown: number) => {
  // calculate time left
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return [days, hours, minutes, seconds];
};

export default useCountdown;

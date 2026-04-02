import { useMemo } from 'react';
import { fishingTips } from '../data/fishingTips';

export const useDailyTip = () => {
  const tip = useMemo(() => {
    const dayIndex = new Date().getDate() % fishingTips.length;
    return fishingTips[dayIndex];
  }, []);

  return { tip };
};
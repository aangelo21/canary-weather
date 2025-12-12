import { fetchAndStoreWarnings } from './meteoalarmService.js';

const DAY_MS = 24 * 60 * 60 * 1000;
let intervalId = null;

const runOnce = async () => {
  try {
    await fetchAndStoreWarnings();
  } catch (error) {
    console.error('Scheduled alert fetch failed:', error);
  }
};

export const startAlertScheduler = () => {
  if (intervalId) return;
  runOnce();
  intervalId = setInterval(runOnce, DAY_MS);
};

export const stopAlertScheduler = () => {
  if (!intervalId) return;
  clearInterval(intervalId);
  intervalId = null;
};

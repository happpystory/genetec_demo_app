import type { ScheduleEvent } from '../types/event.types';

export const formatEventStart = (event: ScheduleEvent): string => {
  const startDate = new Date(event.start);

  return startDate.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
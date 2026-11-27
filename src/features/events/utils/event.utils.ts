import type { ScheduleEvent } from '../types/event.types';

const startDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const formatEventStart = (event: ScheduleEvent): string => {
  const startDate = new Date(event.start);
  return startDateFormatter.format(startDate);
};
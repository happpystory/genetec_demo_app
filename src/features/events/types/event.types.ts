export type EventCategory =
  | 'Meeting'
  | 'Maintenance'
  | 'Inspection'
  | 'Training'
  | 'Alert';

export interface ScheduleEvent {
  id: string;
  title: string;
  start: string;
  durationMin: number;
  category: EventCategory;
  location: string;
  organizer: string;
}

export interface LoadOptions {
  simulateError?: boolean;
}

export type LoadStatus = 'loading' | 'ready' | 'error';
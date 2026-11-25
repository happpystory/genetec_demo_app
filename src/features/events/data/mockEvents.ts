import type { EventCategory, ScheduleEvent } from '../types/event.types';

const CATEGORIES: EventCategory[] = ['Meeting', 'Maintenance', 'Inspection', 'Training', 'Alert'];
const LOCATIONS = ['Vienna HQ', 'Klagenfurt', 'Munich', 'Düsseldorf', 'Remote', 'Montreal'];
const ORGANIZERS = ['A. Huber', 'M. Novak', 'S. Berger', 'L. Moreau', 'K. Fischer', 'J. Tremblay'];
const TITLES = [
  'Weekly sync',
  'Camera firmware rollout',
  'Access control audit',
  'Safety briefing',
  'Server maintenance',
  'Incident review',
  'Onboarding session',
  'Vendor call',
];

const DURATIONS_IN_MINUTES = [15, 30, 45, 60, 90, 120];

const START_DATE_IN_MILLISECONDS = new Date('2026-01-01T00:00:00Z').getTime();
const QUARTER_HOUR_IN_MILLISECONDS = 15 * 60 * 1000;
const TWO_YEARS_IN_QUARTER_HOURS = 2 * 365 * 24 * 4;

const pickRandomItem = <ItemType>(items: ItemType[]): ItemType => {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
};

export const generateMockEvents = (count: number): ScheduleEvent[] => {
  const events: ScheduleEvent[] = [];

  for (let index = 0; index < count; index++) {
    const randomQuarterHour = Math.floor(Math.random() * TWO_YEARS_IN_QUARTER_HOURS);
    const startInMilliseconds =
      START_DATE_IN_MILLISECONDS + randomQuarterHour * QUARTER_HOUR_IN_MILLISECONDS;

    const event: ScheduleEvent = {
      id: `event-${index + 1}`,
      title: `${pickRandomItem(TITLES)} #${index + 1}`,
      start: new Date(startInMilliseconds).toISOString(),
      durationMin: pickRandomItem(DURATIONS_IN_MINUTES),
      category: pickRandomItem(CATEGORIES),
      location: pickRandomItem(LOCATIONS),
      organizer: pickRandomItem(ORGANIZERS),
    };

    events.push(event);
  }

  return events;
}
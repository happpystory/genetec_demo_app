import { useCallback, useEffect, useState } from 'react';
import { generateMockEvents } from '../data/mockEvents';
import type { LoadOptions, LoadStatus, ScheduleEvent } from '../types/event.types';

const EVENT_COUNT = 100_000;
const FAKE_LATENCY_MS = 800;

export function useEvents() {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [status, setStatus] = useState<LoadStatus>('loading');

  const loadEvents = useCallback((options: LoadOptions = {}) => {
    setStatus('loading');

    setTimeout(() => {
      if (options.simulateError) {
        setStatus('error');
        return;
      }

      const generatedEvents = generateMockEvents(EVENT_COUNT)
      setEvents(generatedEvents);
      setStatus('ready');
    }, FAKE_LATENCY_MS);
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return { events, status, reload: loadEvents };
}
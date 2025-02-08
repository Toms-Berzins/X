import { useState, useCallback } from 'react';

export type UsageEvent = {
  timestamp: Date;
  event: string;
  details: Record<string, any>;
};

export function useUsageTracker() {
  const [events, setEvents] = useState<UsageEvent[]>([]);

  const trackEvent = useCallback((event: string, details: Record<string, any> = {}) => {
    const usageEvent: UsageEvent = { timestamp: new Date(), event, details };
    setEvents((prevEvents) => [...prevEvents, usageEvent]);
  }, []);

  return { events, trackEvent };
} 
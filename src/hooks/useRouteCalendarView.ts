
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export type CalendarView = 'month' | 'week' | 'day';

export const useRouteCalendarView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [calendarView, setCalendarView] = useState<CalendarView>('month');

  useEffect(() => {
    const viewParam = searchParams.get('view') as CalendarView;
    if (viewParam && ['month', 'week', 'day'].includes(viewParam)) {
      setCalendarView(viewParam);
    }
  }, [searchParams]);

  const updateUrlView = (view: CalendarView) => {
    setCalendarView(view);
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('view', view);
      return newParams;
    });
  };

  return {
    calendarView,
    updateUrlView,
  };
};

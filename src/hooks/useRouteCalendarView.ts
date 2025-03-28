
import { useEffect, useState } from 'react';
import { CalendarViewType } from '@/components/appointments/calendar/types';

export function useRouteCalendarView() {
  const [calendarView, setCalendarView] = useState<CalendarViewType>("month");
  
  // Initialize view from URL parameter if present
  useEffect(() => {
    const url = new URL(window.location.href);
    const viewParam = url.searchParams.get('view') as CalendarViewType | null;
    if (viewParam && ['month', 'week', 'day'].includes(viewParam)) {
      setCalendarView(viewParam);
    }
  }, []);
  
  // Function to update URL with the current view
  const updateUrlView = (newView: CalendarViewType) => {
    setCalendarView(newView);
    
    // Using browser history API to update the URL with the view parameter
    const url = new URL(window.location.href);
    url.searchParams.set('view', newView);
    window.history.pushState({}, '', url);
  };
  
  return { calendarView, updateUrlView };
}

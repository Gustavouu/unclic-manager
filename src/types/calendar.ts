
export type CalendarViewType = 'month' | 'week' | 'day';

export interface CalendarView {
  type: CalendarViewType;
  date: Date;
}

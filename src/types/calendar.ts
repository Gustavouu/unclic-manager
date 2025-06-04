
export type CalendarViewType = "month" | "week" | "day";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  data?: any;
}

export interface CalendarViewProps {
  view: CalendarViewType;
  date: Date;
  events: CalendarEvent[];
  onViewChange: (view: CalendarViewType) => void;
  onDateChange: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onSlotClick?: (date: Date, time?: string) => void;
}

export interface BusinessHour {
  isOpen: boolean;
  hours?: string;
}

export interface BusinessHours {
  monday: BusinessHour;
  tuesday: BusinessHour;
  wednesday: BusinessHour;
  thursday: BusinessHour;
  friday: BusinessHour;
  saturday: BusinessHour;
  sunday: BusinessHour;
}

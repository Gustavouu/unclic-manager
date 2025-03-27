
import { useMemo } from "react";

export type TimeSlot = {
  time: string;
  period: "morning" | "afternoon" | "evening";
};

export type Period = "morning" | "afternoon" | "evening" | "all";

export function useTimeSlots() {
  // Generate available time slots
  const timeSlots = useMemo(() => {
    const slots: TimeSlot[] = [];
    
    // Morning slots (9:00 - 11:30)
    for (let hour = 9; hour < 12; hour++) {
      slots.push({ time: `${hour}:00`, period: "morning" });
      slots.push({ time: `${hour}:30`, period: "morning" });
    }
    
    // Afternoon slots (12:00 - 17:30)
    for (let hour = 12; hour < 18; hour++) {
      slots.push({ time: `${hour}:00`, period: "afternoon" });
      slots.push({ time: `${hour}:30`, period: "afternoon" });
    }
    
    // Evening slots (18:00 - 20:30)
    for (let hour = 18; hour < 21; hour++) {
      slots.push({ time: `${hour}:00`, period: "evening" });
      slots.push({ time: `${hour}:30`, period: "evening" });
    }
    
    return slots;
  }, []);

  // Group time slots by period
  const morningSlots = timeSlots.filter(slot => slot.period === "morning");
  const afternoonSlots = timeSlots.filter(slot => slot.period === "afternoon");
  const eveningSlots = timeSlots.filter(slot => slot.period === "evening");

  return {
    timeSlots,
    morningSlots,
    afternoonSlots,
    eveningSlots
  };
}

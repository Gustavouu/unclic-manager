
import { useState } from "react";
import { BookingData } from "../types";

export function useBookingData() {
  const [bookingData, setBookingData] = useState<BookingData>({
    serviceId: "",
    serviceName: "",
    servicePrice: 0,
    serviceDuration: 0,
    professionalId: "",
    professionalName: "",
    date: undefined,
    time: "",
    notes: ""
  });

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  return {
    bookingData,
    updateBookingData
  };
}

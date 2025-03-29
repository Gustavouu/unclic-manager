
import { useState } from "react";
import { BookingData } from "../types";

// Initial state for booking data
const initialBookingData: BookingData = {
  serviceId: "",
  serviceName: "",
  servicePrice: 0,
  serviceDuration: 0,
  professionalId: "",
  professionalName: "",
  date: undefined,
  time: "",
  notes: "",
  clientId: undefined,
  clientName: undefined,
  clientEmail: undefined,
  clientPhone: undefined
};

export const useBookingData = () => {
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingData);

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData(prevData => ({
      ...prevData,
      ...data
    }));
  };

  const resetBookingData = () => {
    setBookingData(initialBookingData);
  };

  return {
    bookingData,
    updateBookingData,
    resetBookingData
  };
};

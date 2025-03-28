
// Types related to booking steps and state management
import { BookingData } from "../types";

export interface BookingStepsState {
  step: number;
  bookingData: BookingData;
}

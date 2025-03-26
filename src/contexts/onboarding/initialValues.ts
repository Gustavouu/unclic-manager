
import { BusinessData, BusinessHours } from "./types";

// Initial business data
export const initialBusinessData: BusinessData = {
  name: "",
  email: "",
  phone: "",
  logo: null,
  banner: null,
  cep: "",
  address: "",
  number: "",
  neighborhood: "",
  city: "",
  state: ""
};

// Initial business hours
export const initialBusinessHours: BusinessHours = {
  monday: { open: true, openTime: "09:00", closeTime: "18:00" },
  tuesday: { open: true, openTime: "09:00", closeTime: "18:00" },
  wednesday: { open: true, openTime: "09:00", closeTime: "18:00" },
  thursday: { open: true, openTime: "09:00", closeTime: "18:00" },
  friday: { open: true, openTime: "09:00", closeTime: "18:00" },
  saturday: { open: true, openTime: "09:00", closeTime: "13:00" },
  sunday: { open: false, openTime: "09:00", closeTime: "18:00" }
};

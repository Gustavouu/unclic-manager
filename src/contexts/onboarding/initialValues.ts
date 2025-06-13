
import { BusinessData, BusinessHours } from "./types";

// Initial business data
export const initialBusinessData: BusinessData = {
  id: '',
  name: "",
  email: "",
  phone: "",
  logoUrl: "",
  bannerUrl: "",
  cep: "", // Maintain for backward compatibility
  zipCode: "", // New field name
  address: "",
  number: "", // Maintain for backward compatibility
  addressNumber: "", // New field name
  neighborhood: "",
  city: "",
  state: "",
  adminEmail: "",
  ownerName: "",
  businessType: "",
  description: "",
  website: "",
  socialMedia: {
    facebook: "",
    instagram: "",
    website: "",
    linkedin: "",
  }
};

// Initial business hours
export const initialBusinessHours: BusinessHours = {
  monday: { start: "09:00", end: "18:00", isOpen: true, open: true, openTime: "09:00", closeTime: "18:00" },
  tuesday: { start: "09:00", end: "18:00", isOpen: true, open: true, openTime: "09:00", closeTime: "18:00" },
  wednesday: { start: "09:00", end: "18:00", isOpen: true, open: true, openTime: "09:00", closeTime: "18:00" },
  thursday: { start: "09:00", end: "18:00", isOpen: true, open: true, openTime: "09:00", closeTime: "18:00" },
  friday: { start: "09:00", end: "18:00", isOpen: true, open: true, openTime: "09:00", closeTime: "18:00" },
  saturday: { start: "09:00", end: "13:00", isOpen: true, open: true, openTime: "09:00", closeTime: "13:00" },
  sunday: { start: "09:00", end: "18:00", isOpen: false, open: false, openTime: "09:00", closeTime: "18:00" }
};

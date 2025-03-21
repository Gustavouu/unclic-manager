
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { isAfter, isBefore, isToday, startOfDay, endOfDay, addDays } from "date-fns";
import { Appointment, AppointmentStatus, ServiceType, DateFilter } from "../../types";

export const useAppointmentsFilter = (appointments: Appointment[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all");
  const [serviceFilter, setServiceFilter] = useState<ServiceType>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);
  
  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };
  
  const filterAppointments = () => {
    return appointments.filter(appointment => {
      // Search filter
      const matchesSearch = 
        appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = 
        statusFilter === "all" || 
        appointment.status === statusFilter;
      
      // Service filter
      const matchesService = 
        serviceFilter === "all" || 
        appointment.serviceType === serviceFilter;
      
      // Date filter
      let matchesDate = true;
      const today = startOfDay(new Date());
      const tomorrow = startOfDay(addDays(new Date(), 1));
      const nextWeek = startOfDay(addDays(new Date(), 7));
      
      switch(dateFilter) {
        case "today":
          matchesDate = isToday(appointment.date);
          break;
        case "tomorrow":
          matchesDate = isSameDay(appointment.date, tomorrow);
          break;
        case "thisWeek":
          matchesDate = isAfter(appointment.date, today) && isBefore(appointment.date, nextWeek);
          break;
        case "custom":
          if (customDateRange?.from) {
            matchesDate = isAfter(appointment.date, startOfDay(customDateRange.from));
            
            if (customDateRange.to) {
              matchesDate = matchesDate && isBefore(appointment.date, endOfDay(customDateRange.to));
            }
          }
          break;
        default:
          matchesDate = true;
      }
      
      return matchesSearch && matchesStatus && matchesService && matchesDate;
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setServiceFilter("all");
    setDateFilter("all");
    setCustomDateRange(undefined);
  };

  const filteredAppointments = filterAppointments();

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    serviceFilter,
    setServiceFilter,
    dateFilter,
    setDateFilter,
    customDateRange,
    setCustomDateRange,
    showFilters,
    setShowFilters,
    filteredAppointments,
    handleResetFilters
  };
};

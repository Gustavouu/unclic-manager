
import { useState, useEffect } from "react";
import { useAppointments } from "@/hooks/appointments/useAppointments";
import { format, addDays, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AppointmentStatus } from "../types"; // Fix import

export type ReportTimeframe = "daily" | "weekly" | "monthly" | "yearly";

export interface ReportData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

export const useReportsData = (timeframe: ReportTimeframe = "weekly") => {
  const { appointments, isLoading } = useAppointments();
  const [revenueData, setRevenueData] = useState<ReportData>({ labels: [], datasets: [] });
  const [appointmentsData, setAppointmentsData] = useState<ReportData>({ labels: [], datasets: [] });
  const [completionRateData, setCompletionRateData] = useState<ReportData>({ labels: [], datasets: [] });

  useEffect(() => {
    if (isLoading || !appointments.length) return;

    try {
      // Get current date
      const today = new Date();
      let labels: string[] = [];
      let revenueValues: number[] = [];
      let appointmentCounts: number[] = [];
      let completionRates: number[] = [];

      // Generate labels and empty data arrays based on timeframe
      if (timeframe === "daily") {
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = subDays(today, i);
          labels.push(format(date, "EEE", { locale: ptBR }));
          revenueValues.push(0);
          appointmentCounts.push(0);
          completionRates.push(0);
        }
      } else if (timeframe === "weekly") {
        // Last 4 weeks
        for (let i = 3; i >= 0; i--) {
          const weekStart = subDays(today, i * 7 + 6);
          const weekEnd = i === 0 ? today : subDays(today, i * 7);
          labels.push(`${format(weekStart, "dd/MM")} - ${format(weekEnd, "dd/MM")}`);
          revenueValues.push(0);
          appointmentCounts.push(0);
          completionRates.push(0);
        }
      } else if (timeframe === "monthly") {
        // Last 6 months
        for (let i = 5; i >= 0; i--) {
          const month = today.getMonth() - i;
          const year = today.getFullYear() + Math.floor((today.getMonth() - i) / 12);
          const date = new Date(year, ((month % 12) + 12) % 12, 1);
          labels.push(format(date, "MMM", { locale: ptBR }));
          revenueValues.push(0);
          appointmentCounts.push(0);
          completionRates.push(0);
        }
      } else if (timeframe === "yearly") {
        // Last 5 years
        for (let i = 4; i >= 0; i--) {
          const year = today.getFullYear() - i;
          labels.push(year.toString());
          revenueValues.push(0);
          appointmentCounts.push(0);
          completionRates.push(0);
        }
      }

      // Process appointment data
      appointments.forEach(appt => {
        if (!appt.date) return;
        
        const apptDate = new Date(appt.date);
        let index = -1;
        
        if (timeframe === "daily") {
          // Check if appointment is within the last 7 days
          const daysDiff = Math.floor((today.getTime() - apptDate.getTime()) / (1000 * 60 * 60 * 24));
          if (daysDiff >= 0 && daysDiff < 7) {
            index = 6 - daysDiff;
          }
        } else if (timeframe === "weekly") {
          // Check which of the last 4 weeks the appointment belongs to
          const daysDiff = Math.floor((today.getTime() - apptDate.getTime()) / (1000 * 60 * 60 * 24));
          if (daysDiff >= 0 && daysDiff < 28) {
            index = 3 - Math.floor(daysDiff / 7);
          }
        } else if (timeframe === "monthly") {
          // Check which of the last 6 months the appointment belongs to
          const monthDiff = (today.getMonth() - apptDate.getMonth()) + 
                           12 * (today.getFullYear() - apptDate.getFullYear());
          if (monthDiff >= 0 && monthDiff < 6) {
            index = 5 - monthDiff;
          }
        } else if (timeframe === "yearly") {
          // Check which of the last 5 years the appointment belongs to
          const yearDiff = today.getFullYear() - apptDate.getFullYear();
          if (yearDiff >= 0 && yearDiff < 5) {
            index = 4 - yearDiff;
          }
        }
        
        if (index >= 0) {
          // Count appointment
          appointmentCounts[index]++;
          
          // Add revenue
          if (appt.price) {
            revenueValues[index] += appt.price;
          }
          
          // Check if completed
          if (appt.status === "concluido") {
            completionRates[index]++;
          }
        }
      });
      
      // Calculate completion rates as percentages
      completionRates = completionRates.map((completed, index) => 
        appointmentCounts[index] > 0 ? (completed / appointmentCounts[index]) * 100 : 0
      );

      // Set chart data
      setRevenueData({
        labels,
        datasets: [{
          label: 'Receita (R$)',
          data: revenueValues
        }]
      });
      
      setAppointmentsData({
        labels,
        datasets: [{
          label: 'Agendamentos',
          data: appointmentCounts
        }]
      });
      
      setCompletionRateData({
        labels,
        datasets: [{
          label: 'Taxa de Conclusão (%)',
          data: completionRates
        }]
      });
    } catch (error) {
      console.error("Error processing report data:", error);
    }
  }, [appointments, isLoading, timeframe]);

  return {
    revenueData,
    appointmentsData,
    completionRateData,
    isLoading
  };
};

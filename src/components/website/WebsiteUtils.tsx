
import React from "react";

// Format weekday names in Portuguese
export const formatWeekday = (day: string): string => {
  const weekdays: Record<string, string> = {
    sunday: "Domingo",
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado"
  };
  return weekdays[day] || day;
};

// Format price to BRL
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};

// Format duration to human readable
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return hours === 1 ? "1 hora" : `${hours} horas`;
  }
  
  return `${hours}h${remainingMinutes}min`;
};

// Format social media URLs
export const formatSocialMediaUrl = (url: string): string => {
  if (!url) return '';
  
  // Add http:// if it doesn't have a protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  
  return url;
};

// Get social media icon
export const getSocialMediaIcon = (type: string): string => {
  const icons: Record<string, string> = {
    facebook: "💬",
    instagram: "📸",
    twitter: "🐦",
    linkedin: "🔗"
  };
  return icons[type] || "🌐";
};

// Create shareable links
export const createShareableLink = (businessName: string): string => {
  const formattedName = businessName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
  
  return `/${formattedName}.unclic.com.br`;
};


import { Professional, ProfessionalStatus } from "./types";

// Mock data for professionals
export const mockProfessionals: Professional[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@example.com",
    phone: "(11) 98765-4321",
    position: "Cabeleireiro Senior",
    bio: "Especialista em cortes masculinos com mais de 10 anos de experiência.",
    photo_url: "/assets/professionals/joao-silva.jpg", // Fixed property name
    status: ProfessionalStatus.ACTIVE,
    specialties: ["Corte Masculino", "Barba"],
    commission_percentage: 30,
    hire_date: new Date().toISOString(),
    business_id: "1",
    user_id: "user-1",
    working_hours: {
      monday: { start: "09:00", end: "18:00", isAvailable: true },
      tuesday: { start: "09:00", end: "18:00", isAvailable: true },
      wednesday: { start: "09:00", end: "18:00", isAvailable: true },
      thursday: { start: "09:00", end: "18:00", isAvailable: true },
      friday: { start: "09:00", end: "18:00", isAvailable: true },
      saturday: { start: "09:00", end: "14:00", isAvailable: true },
      sunday: { start: "00:00", end: "00:00", isAvailable: false },
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Maria Oliveira",
    email: "maria.oliveira@example.com",
    phone: "(11) 91234-5678",
    position: "Especialista em Coloração",
    bio: "Especialista em coloração e mechas, formada pela academia L'Oréal.",
    photo_url: "/assets/professionals/maria-oliveira.jpg", // Fixed property name
    status: ProfessionalStatus.ACTIVE,
    specialties: ["Coloração", "Mechas", "Tratamentos"],
    commission_percentage: 35,
    hire_date: new Date().toISOString(),
    business_id: "1",
    user_id: "user-2",
    working_hours: {
      monday: { start: "09:00", end: "18:00", isAvailable: true },
      tuesday: { start: "09:00", end: "18:00", isAvailable: true },
      wednesday: { start: "09:00", end: "18:00", isAvailable: true },
      thursday: { start: "09:00", end: "18:00", isAvailable: true },
      friday: { start: "09:00", end: "18:00", isAvailable: true },
      saturday: { start: "09:00", end: "14:00", isAvailable: true },
      sunday: { start: "00:00", end: "00:00", isAvailable: false },
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Ana Costa",
    email: "ana.costa@example.com",
    phone: "(11) 98888-7777",
    position: "Manicure e Pedicure",
    bio: "Especialista em unhas, com formação em nail art e técnicas avançadas.",
    photo_url: "/assets/professionals/ana-costa.jpg", // Fixed property name
    status: ProfessionalStatus.ON_LEAVE,
    specialties: ["Manicure", "Pedicure", "Nail Art"],
    commission_percentage: 25,
    hire_date: new Date().toISOString(),
    business_id: "1",
    user_id: "user-3",
    working_hours: {
      monday: { start: "13:00", end: "20:00", isAvailable: true },
      tuesday: { start: "13:00", end: "20:00", isAvailable: true },
      wednesday: { start: "13:00", end: "20:00", isAvailable: true },
      thursday: { start: "13:00", end: "20:00", isAvailable: true },
      friday: { start: "13:00", end: "20:00", isAvailable: true },
      saturday: { start: "10:00", end: "16:00", isAvailable: true },
      sunday: { start: "00:00", end: "00:00", isAvailable: false },
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Pedro Santos",
    email: "pedro.santos@example.com",
    phone: "(11) 97777-6666",
    position: "Barbeiro",
    bio: "Especialista em barbearia clássica e cortes modernos.",
    photo_url: "/assets/professionals/pedro-santos.jpg", // Fixed property name
    status: ProfessionalStatus.ACTIVE,
    specialties: ["Corte Masculino", "Barba", "Tratamentos Masculinos"],
    commission_percentage: 30,
    hire_date: new Date().toISOString(),
    business_id: "1",
    user_id: "user-4",
    working_hours: {
      monday: { start: "10:00", end: "19:00", isAvailable: true },
      tuesday: { start: "10:00", end: "19:00", isAvailable: true },
      wednesday: { start: "10:00", end: "19:00", isAvailable: true },
      thursday: { start: "10:00", end: "19:00", isAvailable: true },
      friday: { start: "10:00", end: "19:00", isAvailable: true },
      saturday: { start: "09:00", end: "15:00", isAvailable: true },
      sunday: { start: "00:00", end: "00:00", isAvailable: false },
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Carolina Lima",
    email: "carolina.lima@example.com",
    phone: "(11) 96666-5555",
    position: "Esteticista",
    bio: "Especialista em estética facial e corporal, com mais de 8 anos de experiência.",
    photo_url: "/assets/professionals/carolina-lima.jpg", // Fixed property name
    status: ProfessionalStatus.INACTIVE,
    specialties: ["Limpeza de Pele", "Massagem", "Drenagem Linfática"],
    commission_percentage: 30,
    hire_date: new Date().toISOString(),
    business_id: "1",
    user_id: "user-5",
    working_hours: {
      monday: { start: "09:00", end: "18:00", isAvailable: true },
      tuesday: { start: "09:00", end: "18:00", isAvailable: true },
      wednesday: { start: "09:00", end: "18:00", isAvailable: true },
      thursday: { start: "09:00", end: "18:00", isAvailable: true },
      friday: { start: "09:00", end: "18:00", isAvailable: true },
      saturday: { start: "09:00", end: "14:00", isAvailable: true },
      sunday: { start: "00:00", end: "00:00", isAvailable: false },
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Ricardo Ferreira",
    email: "ricardo.ferreira@example.com",
    phone: "(11) 95555-4444",
    position: "Cabeleireiro",
    bio: "Cabeleireiro versátil com especialização em técnicas modernas de corte e coloração.",
    photo_url: "/assets/professionals/ricardo-ferreira.jpg", // Fixed property name
    status: ProfessionalStatus.ACTIVE,
    specialties: ["Corte Feminino", "Coloração", "Penteados"],
    commission_percentage: 35,
    hire_date: new Date().toISOString(),
    business_id: "1",
    user_id: "user-6",
    working_hours: {
      monday: { start: "12:00", end: "21:00", isAvailable: true },
      tuesday: { start: "12:00", end: "21:00", isAvailable: true },
      wednesday: { start: "12:00", end: "21:00", isAvailable: true },
      thursday: { start: "12:00", end: "21:00", isAvailable: true },
      friday: { start: "12:00", end: "21:00", isAvailable: true },
      saturday: { start: "10:00", end: "16:00", isAvailable: true },
      sunday: { start: "00:00", end: "00:00", isAvailable: false },
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

// Function to get specialties from all professionals
export const getAllSpecialties = () => {
  const specialties = new Set<string>();
  mockProfessionals.forEach(professional => {
    if (professional.specialties) {
      professional.specialties.forEach(specialty => {
        specialties.add(specialty);
      });
    }
  });
  return Array.from(specialties);
};

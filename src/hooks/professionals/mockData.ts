
import { Professional, ProfessionalStatus } from "./types";

export const mockProfessionals: Professional[] = [
  {
    id: "pro-1",
    name: "Dr. João Silva",
    position: "Médico",
    email: "joao.silva@example.com",
    phone: "(11) 99999-1111",
    specialties: ["Clínica Geral", "Pediatria"],
    photoUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    bio: "Médico com 15 anos de experiência em clínica geral e pediatria.",
    status: ProfessionalStatus.ACTIVE,
    hire_date: "2020-01-15",
    commission_percentage: 30
  },
  {
    id: "pro-2",
    name: "Maria Souza",
    position: "Fisioterapeuta",
    email: "maria.souza@example.com",
    phone: "(11) 99999-2222",
    specialties: ["Fisioterapia Ortopédica", "Acupuntura"],
    photoUrl: "https://randomuser.me/api/portraits/women/2.jpg",
    bio: "Especialista em reabilitação física com foco em tratamentos ortopédicos.",
    status: ProfessionalStatus.ACTIVE,
    hire_date: "2021-03-10",
    commission_percentage: 25
  },
  {
    id: "pro-3",
    name: "Carlos Mendes",
    position: "Nutricionista",
    email: "carlos.mendes@example.com",
    phone: "(11) 99999-3333",
    specialties: ["Nutrição Esportiva", "Nutrição Clínica"],
    photoUrl: "https://randomuser.me/api/portraits/men/3.jpg",
    bio: "Especialista em nutrição esportiva e emagrecimento saudável.",
    status: ProfessionalStatus.ON_LEAVE,
    hire_date: "2019-11-05",
    commission_percentage: 20
  },
  {
    id: "pro-4",
    name: "Ana Oliveira",
    position: "Psicóloga",
    email: "ana.oliveira@example.com",
    phone: "(11) 99999-4444",
    specialties: ["Terapia Cognitivo-Comportamental", "Psicologia Infantil"],
    photoUrl: "https://randomuser.me/api/portraits/women/4.jpg",
    bio: "Psicóloga com abordagem em terapia cognitivo-comportamental.",
    status: ProfessionalStatus.ACTIVE,
    hire_date: "2022-02-20",
    commission_percentage: 28
  },
  {
    id: "pro-5",
    name: "Roberto Almeida",
    position: "Dentista",
    email: "roberto.almeida@example.com",
    phone: "(11) 99999-5555",
    specialties: ["Ortodontia", "Endodontia"],
    photoUrl: "https://randomuser.me/api/portraits/men/5.jpg",
    bio: "Especialista em tratamentos estéticos e ortodônticos.",
    status: ProfessionalStatus.INACTIVE,
    hire_date: "2018-08-12",
    commission_percentage: 35
  },
  {
    id: "pro-6",
    name: "Fernanda Lima",
    position: "Dermatologista",
    email: "fernanda.lima@example.com",
    phone: "(11) 99999-6666",
    specialties: ["Dermatologia Clínica", "Procedimentos Estéticos"],
    photoUrl: "https://randomuser.me/api/portraits/women/6.jpg",
    bio: "Especialista em tratamentos dermatológicos avançados e estética facial.",
    status: ProfessionalStatus.ACTIVE,
    hire_date: "2021-05-30",
    commission_percentage: 32
  }
];

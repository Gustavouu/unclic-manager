
import { Professional, ProfessionalStatus } from "./types";

// Dados mockados para exemplo
export const initialProfessionals: Professional[] = [
  {
    id: "p1",
    name: "Ana Lúcia Pereira",
    role: "Cabeleireira Master",
    email: "ana.lucia@salon.com",
    phone: "(11) 98765-4321",
    specialties: ["Corte feminino", "Coloração", "Escova progressiva"],
    photoUrl: "https://i.pravatar.cc/150?img=5",
    bio: "Ana tem mais de 15 anos de experiência em salões de alto padrão.",
    status: "ACTIVE" as ProfessionalStatus,
    hireDate: "2019-05-10",
    commissionPercentage: 40,
    userId: "u1"
  },
  {
    id: "p2",
    name: "Carlos Eduardo Santos",
    role: "Barbeiro",
    email: "carlos.santos@salon.com",
    phone: "(11) 98321-6754",
    specialties: ["Corte masculino", "Barba", "Sobrancelha"],
    photoUrl: "https://i.pravatar.cc/150?img=12",
    bio: "Especialista em cortes modernos e barbas estilizadas.",
    status: "ACTIVE" as ProfessionalStatus,
    hireDate: "2020-02-15",
    commissionPercentage: 35,
    userId: "u2"
  },
  {
    id: "p3",
    name: "Mariana Costa",
    role: "Esteticista",
    email: "mariana.costa@salon.com",
    phone: "(11) 97890-1234",
    specialties: ["Limpeza de pele", "Massagem facial", "Peeling"],
    photoUrl: "https://i.pravatar.cc/150?img=9",
    bio: "Especializada em tratamentos faciais e corporais rejuvenescedores.",
    status: "ON_LEAVE" as ProfessionalStatus,
    hireDate: "2021-10-01",
    commissionPercentage: 30,
    userId: "u3"
  },
  {
    id: "p4",
    name: "Roberto Almeida",
    role: "Nail Designer",
    email: "roberto.almeida@salon.com",
    phone: "(11) 99876-5432",
    specialties: ["Manicure", "Pedicure", "Unhas em gel"],
    photoUrl: "https://i.pravatar.cc/150?img=11",
    bio: "Especialista em design de unhas e técnicas artísticas.",
    status: "ON_LEAVE" as ProfessionalStatus,
    hireDate: "2022-03-20",
    commissionPercentage: 30,
    userId: "u4"
  },
  {
    id: "p5",
    name: "Fernanda Lima",
    role: "Maquiadora",
    email: "fernanda.lima@salon.com",
    phone: "(11) 99765-4321",
    specialties: ["Maquiagem social", "Maquiagem artística", "Penteados"],
    photoUrl: "https://i.pravatar.cc/150?img=1",
    bio: "Maquiadora profissional com experiência em eventos e produções.",
    status: "ACTIVE" as ProfessionalStatus,
    hireDate: "2022-01-15",
    commissionPercentage: 35,
    userId: "u5"
  },
  {
    id: "p6",
    name: "Paulo Henrique",
    role: "Massagista",
    email: "paulo.henrique@salon.com",
    phone: "(11) 98432-1765",
    specialties: ["Massagem relaxante", "Massagem terapêutica", "Drenagem linfática"],
    photoUrl: "https://i.pravatar.cc/150?img=15",
    bio: "Profissional com formação em técnicas de massagem oriental e ocidental.",
    status: "INACTIVE" as ProfessionalStatus,
    hireDate: "2020-08-10",
    commissionPercentage: 40,
    userId: "u6"
  }
];

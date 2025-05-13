
import { Professional, ProfessionalStatus } from "./types";

export const mockProfessionals: Professional[] = [
  {
    id: "1",
    name: "John Doe",
    position: "Barber",
    role: "Barber", // For backward compatibility
    email: "john.doe@example.com",
    phone: "555-1234",
    specialties: ["Haircut", "Beard Trim"],
    photo_url: "https://randomuser.me/api/portraits/men/1.jpg",
    photoUrl: "https://randomuser.me/api/portraits/men/1.jpg", // For backward compatibility
    bio: "Expert barber with 5 years of experience",
    status: ProfessionalStatus.ACTIVE,
    hire_date: new Date("2022-01-15"),
    commission_percentage: 25,
    commissionPercentage: 25, // For backward compatibility
    userId: "user1",
    business_id: "business1"
  },
  {
    id: "2",
    name: "Jane Smith",
    position: "Stylist",
    role: "Stylist", // For backward compatibility
    email: "jane.smith@example.com",
    phone: "555-5678",
    specialties: ["Coloring", "Highlights", "Styling"],
    photo_url: "https://randomuser.me/api/portraits/women/1.jpg",
    photoUrl: "https://randomuser.me/api/portraits/women/1.jpg", // For backward compatibility
    bio: "Creative stylist specializing in color transformations",
    status: ProfessionalStatus.ACTIVE,
    hire_date: new Date("2021-08-10"),
    commission_percentage: 30,
    commissionPercentage: 30, // For backward compatibility
    userId: "user2",
    business_id: "business1"
  },
  {
    id: "3",
    name: "Mike Johnson",
    position: "Barber",
    role: "Barber", // For backward compatibility
    email: "mike.johnson@example.com",
    phone: "555-9876",
    specialties: ["Haircut", "Shaving"],
    photo_url: "https://randomuser.me/api/portraits/men/2.jpg",
    photoUrl: "https://randomuser.me/api/portraits/men/2.jpg", // For backward compatibility
    bio: "Traditional barber with attention to detail",
    status: ProfessionalStatus.INACTIVE,
    hire_date: new Date("2020-05-20"),
    commission_percentage: 25,
    commissionPercentage: 25, // For backward compatibility
    userId: "user3",
    business_id: "business1"
  },
  {
    id: "4",
    name: "Emily Davis",
    position: "Manicurist",
    role: "Manicurist", // For backward compatibility
    email: "emily.davis@example.com",
    phone: "555-4321",
    specialties: ["Manicure", "Pedicure", "Nail Art"],
    photo_url: "https://randomuser.me/api/portraits/women/2.jpg",
    photoUrl: "https://randomuser.me/api/portraits/women/2.jpg", // For backward compatibility
    bio: "Nail artist with a passion for creative designs",
    status: ProfessionalStatus.ACTIVE,
    hire_date: new Date("2022-03-15"),
    commission_percentage: 25,
    commissionPercentage: 25, // For backward compatibility
    userId: "user4",
    business_id: "business1"
  },
  {
    id: "5",
    name: "Robert Wilson",
    position: "Hair Stylist",
    role: "Hair Stylist", // For backward compatibility
    email: "robert.wilson@example.com",
    phone: "555-8765",
    specialties: ["Haircut", "Styling", "Extensions"],
    photo_url: "https://randomuser.me/api/portraits/men/3.jpg",
    photoUrl: "https://randomuser.me/api/portraits/men/3.jpg", // For backward compatibility
    bio: "Experienced stylist specialized in modern techniques",
    status: ProfessionalStatus.ON_LEAVE,
    hire_date: new Date("2021-11-05"),
    commission_percentage: 30,
    commissionPercentage: 30, // For backward compatibility
    userId: "user5",
    business_id: "business1"
  },
  {
    id: "6",
    name: "Sarah Thompson",
    position: "Esthetician",
    role: "Esthetician", // For backward compatibility
    email: "sarah.thompson@example.com",
    phone: "555-2345",
    specialties: ["Facials", "Waxing", "Skincare"],
    photo_url: "https://randomuser.me/api/portraits/women/3.jpg",
    photoUrl: "https://randomuser.me/api/portraits/women/3.jpg", // For backward compatibility
    bio: "Licensed esthetician offering premium skincare services",
    status: ProfessionalStatus.ACTIVE,
    hire_date: new Date("2022-01-25"),
    commission_percentage: 28,
    commissionPercentage: 28, // For backward compatibility
    userId: "user6",
    business_id: "business1"
  }
];


import { useParams } from "react-router-dom";
import { useBusinessWebsite } from "@/hooks/useBusinessWebsite";
import { WebsiteHeader } from "@/components/website/WebsiteHeader";
import { WebsiteBanner } from "@/components/website/WebsiteBanner";
import { AboutSection } from "@/components/website/AboutSection";
import { ServicesSection } from "@/components/website/ServicesSection";
import { ProfessionalsSection } from "@/components/website/ProfessionalsSection";
import { AppointmentSection } from "@/components/website/AppointmentSection";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { WebsiteBookingModal } from "@/components/website/WebsiteBookingModal";
import { WebsiteLoading } from "@/components/website/WebsiteLoading";

export interface StaffData {
  id: string;
  name: string;
  position?: string;
  photo_url?: string;
  business_id: string;
  specialties?: string[];
  role: string; // Make this required
}

const BusinessWebsite = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const { 
    business, 
    services, 
    staff, 
    loading, 
    error, 
    isBookingOpen, 
    startBooking, 
    closeBooking,
    checkIsCorrectBusiness
  } = useBusinessWebsite(businessId);

  if (loading) {
    return <WebsiteLoading type="business" />;
  }

  if (error || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Negócio não encontrado
          </h1>
          <p className="text-gray-600">
            O negócio que você está procurando não existe ou não está disponível.
          </p>
        </div>
      </div>
    );
  }

  // Validate business access
  if (!checkIsCorrectBusiness(businessId)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Acesso não autorizado
          </h1>
          <p className="text-gray-600">
            Você não tem permissão para acessar este negócio.
          </p>
        </div>
      </div>
    );
  }

  // Map SimpleStaff to StaffData
  const mappedStaff: StaffData[] = staff.map(member => ({
    ...member,
    role: member.role || 'staff' // Provide default role
  }));

  return (
    <div className="min-h-screen bg-white">
      <WebsiteHeader 
        business={business}
        onBookingClick={startBooking}
      />
      
      <main>
        <WebsiteBanner 
          business={business}
          onBookingClick={startBooking}
        />
        
        <AboutSection business={business} />
        
        <ServicesSection 
          services={services}
          onBookingClick={startBooking}
        />
        
        <ProfessionalsSection 
          staff={mappedStaff}
          onBookingClick={startBooking}
        />
        
        <AppointmentSection 
          business={business}
          onBookingClick={startBooking}
        />
      </main>
      
      <WebsiteFooter business={business} />
      
      <WebsiteBookingModal
        isOpen={isBookingOpen}
        onClose={closeBooking}
        business={business}
        services={services}
        staff={mappedStaff}
      />
    </div>
  );
};

export default BusinessWebsite;

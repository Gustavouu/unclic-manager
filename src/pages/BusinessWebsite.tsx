
import React, { useEffect, useState } from "react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  Clock, 
  DollarSign,
  Users,
  Scissors,
  CheckCircle
} from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { ServiceData, StaffData, BusinessHours } from "@/contexts/onboarding/types";
import { useProfessionals } from "@/hooks/professionals/useProfessionals";
import { services as mockServices } from "@/components/services/servicesData";

const BusinessWebsite = () => {
  const { businessData, loadProgress, services, staffMembers, businessHours } = useOnboarding();
  const { businessName } = useParams();
  const navigate = useNavigate();
  const [availableServices, setAvailableServices] = useState<ServiceData[]>([]);
  const [staff, setStaff] = useState<StaffData[]>([]);
  const { professionals } = useProfessionals();
  
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Set services data - use onboarding services or mock if empty
  useEffect(() => {
    if (services && services.length > 0) {
      setAvailableServices(services);
    } else {
      // Use mock services as fallback
      setAvailableServices(mockServices);
    }
  }, [services]);

  // Set staff data - use onboarding staff or professionals if empty
  useEffect(() => {
    if (staffMembers && staffMembers.length > 0) {
      setStaff(staffMembers);
    } else if (professionals && professionals.length > 0) {
      // Convert professionals to staff format
      const convertedStaff = professionals.map(p => ({
        id: p.id,
        name: p.name,
        role: p.role || "Profissional",
        email: p.email,
        phone: p.phone,
        specialties: p.specialties || []
      }));
      setStaff(convertedStaff);
    }
  }, [staffMembers, professionals]);

  // Check if this business exists
  const isCorrectBusiness = () => {
    if (!businessData.name) return false;
    
    const formattedName = businessData.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
    
    return businessName === formattedName;
  };

  const handleScheduleAppointment = () => {
    toast.info("Agendamento não disponível neste momento");
  };

  // Format weekday names in Portuguese
  const formatWeekday = (day: string): string => {
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
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // Format duration to human readable
  const formatDuration = (minutes: number): string => {
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

  if (!businessData.name) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Carregando...</h1>
          <p className="text-muted-foreground mt-2">Aguarde enquanto buscamos as informações do estabelecimento</p>
        </div>
      </div>
    );
  }

  if (!isCorrectBusiness()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Estabelecimento não encontrado</h1>
          <p className="text-muted-foreground mt-2">
            O estabelecimento que você está procurando não existe
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate("/")}
          >
            Voltar para página inicial
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner and Logo */}
      <div 
        className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative"
        style={{
          backgroundImage: businessData.bannerUrl 
            ? `url(${businessData.bannerUrl})` 
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4 h-full flex items-end">
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-2 shadow-lg">
            {businessData.logoUrl ? (
              <img 
                src={businessData.logoUrl} 
                alt={`${businessData.name} logo`} 
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-500">
                  {businessData.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">{businessData.name}</h1>
          {businessData.address && (
            <p className="text-muted-foreground mt-2 flex items-center justify-center gap-1">
              <MapPin className="h-4 w-4" />
              {businessData.address}
              {businessData.number && `, ${businessData.number}`}
              {businessData.neighborhood && ` - ${businessData.neighborhood}`}
              {businessData.city && `, ${businessData.city}`}
              {businessData.state && ` - ${businessData.state}`}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* About Section */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-xl">Sobre Nós</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Bem-vindo a {businessData.name}! Somos especializados em 
                oferecer os melhores serviços com qualidade e conforto para 
                nossos clientes.
              </p>
              
              <div className="space-y-2">
                {businessData.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{businessData.phone}</span>
                  </div>
                )}
                
                {businessData.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{businessData.email}</span>
                  </div>
                )}
              </div>
              
              {businessHours && Object.keys(businessHours).length > 0 && (
                <>
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Horário de Funcionamento
                    </h3>
                    <div className="space-y-1 text-sm">
                      {Object.entries(businessHours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between">
                          <span className="font-medium">{formatWeekday(day)}</span>
                          {hours.open ? (
                            <span>{hours.openTime} - {hours.closeTime}</span>
                          ) : (
                            <span className="text-muted-foreground">Fechado</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {businessData.socialMedia && (
                <>
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Redes Sociais</h3>
                    <div className="flex flex-wrap gap-2">
                      {businessData.socialMedia?.facebook && (
                        <a 
                          href={businessData.socialMedia.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          Facebook <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      
                      {businessData.socialMedia?.instagram && (
                        <a 
                          href={businessData.socialMedia.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-pink-600 hover:underline"
                        >
                          Instagram <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      
                      {businessData.socialMedia?.linkedin && (
                        <a 
                          href={businessData.socialMedia.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-800 hover:underline"
                        >
                          LinkedIn <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      
                      {businessData.socialMedia?.twitter && (
                        <a 
                          href={businessData.socialMedia.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-400 hover:underline"
                        >
                          Twitter <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          {/* Services and Professionals Section */}
          <div className="md:col-span-2 space-y-6">
            {/* Services Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Scissors className="h-5 w-5" />
                  Nossos Serviços
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableServices.slice(0, 6).map((service) => (
                    <div 
                      key={service.id} 
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{service.name}</h3>
                        <Badge variant="outline" className="ml-2">
                          {formatPrice(service.price)}
                        </Badge>
                      </div>
                      
                      <div className="mt-2 flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDuration(service.duration)}
                      </div>
                      
                      {service.description && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {service.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                
                {availableServices.length > 6 && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" onClick={() => toast.info("Ver todos os serviços")}>
                      Ver todos os serviços ({availableServices.length})
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Professionals Section */}
            {staff && staff.length > 0 && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Nossa Equipe
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {staff.slice(0, 6).map((person) => (
                      <div 
                        key={person.id} 
                        className="p-4 border rounded-lg text-center hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto flex items-center justify-center">
                          <span className="text-lg font-medium text-gray-600">
                            {person.name.charAt(0)}
                          </span>
                        </div>
                        
                        <h3 className="font-medium mt-2">{person.name}</h3>
                        <p className="text-sm text-muted-foreground">{person.role}</p>
                        
                        {person.specialties && person.specialties.length > 0 && (
                          <div className="mt-2 flex flex-wrap justify-center gap-1">
                            {person.specialties.slice(0, 2).map((specialty, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                            {person.specialties.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{person.specialties.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {staff.length > 6 && (
                    <div className="mt-4 text-center">
                      <Button variant="outline" onClick={() => toast.info("Ver todos os profissionais")}>
                        Ver todos os profissionais ({staff.length})
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Appointment Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Agendamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">Por que agendar conosco?</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Atendimento personalizado de alta qualidade</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Profissionais experientes e qualificados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Ambiente confortável e acolhedor</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Agendamento rápido e prático</span>
                    </li>
                  </ul>
                </div>
                
                <Button 
                  onClick={handleScheduleAppointment} 
                  className="w-full"
                  size="lg"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Agendar Serviço
                </Button>
                
                <p className="text-sm text-muted-foreground text-center">
                  Clique no botão acima para agendar seu serviço conosco. Você 
                  poderá escolher a data, horário e o serviço desejado.
                </p>
              </CardContent>
            </Card>
            
            {/* Payment Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pagamentos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Aceitamos diversas formas de pagamento para sua comodidade:
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="border rounded-md p-3 text-center">
                    <div className="text-2xl mb-1">💳</div>
                    <div className="text-sm">Cartão de Crédito</div>
                  </div>
                  <div className="border rounded-md p-3 text-center">
                    <div className="text-2xl mb-1">💸</div>
                    <div className="text-sm">Cartão de Débito</div>
                  </div>
                  <div className="border rounded-md p-3 text-center">
                    <div className="text-2xl mb-1">📱</div>
                    <div className="text-sm">PIX</div>
                  </div>
                  <div className="border rounded-md p-3 text-center">
                    <div className="text-2xl mb-1">💰</div>
                    <div className="text-sm">Dinheiro</div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Pagamentos online são processados de forma segura. Você também
                  pode pagar diretamente no estabelecimento após o serviço.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {businessData.name}. Todos os direitos reservados.</p>
          <p className="mt-1">
            Criado com <a href="/" className="text-primary hover:underline">unclic</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusinessWebsite;

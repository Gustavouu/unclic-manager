
import React, { useEffect } from "react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Phone, Mail, MapPin, Calendar, ExternalLink } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const BusinessWebsite = () => {
  const { businessData, loadProgress } = useOnboarding();
  const { businessName } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

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
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card>
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
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="font-medium">Redes Sociais</h3>
                <div className="flex gap-2">
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
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Agendamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Faça seu agendamento online e aproveite nossos serviços com conforto 
                e praticidade.
              </p>
              
              <Button 
                onClick={handleScheduleAppointment} 
                className="w-full"
                size="lg"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Agendar Serviço
              </Button>
              
              <p className="text-sm text-muted-foreground">
                Clique no botão acima para agendar seu serviço conosco. Você 
                poderá escolher a data, horário e o serviço desejado.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BusinessWebsite;

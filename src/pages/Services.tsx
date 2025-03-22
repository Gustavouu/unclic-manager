
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServicesHeader } from "@/components/services/ServicesHeader";
import { ServicesTable } from "@/components/services/ServicesTable";
import { services } from "@/components/services/servicesData";

const Services = () => {
  return (
    <div>
      <ServicesHeader />
      
      <Card className="shadow-sm border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Lista de Serviços</CardTitle>
        </CardHeader>
        <CardContent>
          <ServicesTable services={services} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Services;


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScissorsSquare, Clock, DollarSign, TrendingUp, LightbulbIcon, Star, Info } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/common/TablePagination";

// Sample services data
const services = [
  {
    id: "1",
    name: "Corte de Cabelo Feminino",
    duration: 60,
    price: 80.00,
    category: "Cabelo",
    isPopular: true,
    isFeatured: true,
  },
  {
    id: "2",
    name: "Corte de Cabelo Masculino",
    duration: 30,
    price: 50.00,
    category: "Cabelo",
    isPopular: true,
    isFeatured: false,
  },
  {
    id: "3",
    name: "Coloração",
    duration: 90,
    price: 120.00,
    category: "Cabelo",
    isPopular: false,
    isFeatured: true,
  },
  {
    id: "4",
    name: "Hidratação Profunda",
    duration: 45,
    price: 70.00,
    category: "Tratamento",
    isPopular: false,
    isFeatured: false,
  },
  {
    id: "5",
    name: "Manicure",
    duration: 40,
    price: 40.00,
    category: "Unhas",
    isPopular: true,
    isFeatured: false,
  },
  {
    id: "6",
    name: "Pedicure",
    duration: 50,
    price: 50.00,
    category: "Unhas",
    isPopular: false,
    isFeatured: false,
  },
  {
    id: "7",
    name: "Limpeza de Pele",
    duration: 60,
    price: 90.00,
    category: "Rosto",
    isPopular: false,
    isFeatured: true,
  },
  {
    id: "8",
    name: "Design de Sobrancelhas",
    duration: 30,
    price: 35.00,
    category: "Rosto",
    isPopular: true,
    isFeatured: false,
  },
];

const ServiceIndicator = ({ icon: Icon, label, color }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn("inline-flex items-center mr-2", color)}>
          <Icon className="h-4 w-4" />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const generalTips = [
  "Mantenha sua lista de serviços atualizada para refletir as últimas tendências",
  "Considere oferecer pacotes de serviços para aumentar o valor médio por cliente",
  "Revise os preços dos serviços pelo menos a cada seis meses",
  "Adicione fotos do antes e depois para serviços visuais",
  "Destaque os serviços mais rentáveis na sua comunicação",
  "Use descrições claras que explicam o que está incluído em cada serviço",
  "Treine sua equipe para fazer upselling de serviços complementares",
  "Monitore quais serviços são mais populares em diferentes épocas do ano"
];

const Services = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [tipsOpen, setTipsOpen] = useState(false);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentServices = services.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(services.length / itemsPerPage);

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-xl font-display font-medium">Gerenciamento de Serviços</h1>
        <div className="flex gap-2">
          <Dialog open={tipsOpen} onOpenChange={setTipsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Info size={16} />
                Dicas Gerais
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Dicas para Gestão de Serviços</DialogTitle>
                <DialogDescription>
                  Estratégias para otimizar sua oferta de serviços
                </DialogDescription>
              </DialogHeader>
              <ul className="mt-4 space-y-2">
                {generalTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <LightbulbIcon className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </DialogContent>
          </Dialog>
          
          <Button className="gap-2">
            <ScissorsSquare size={16} />
            Novo Serviço
          </Button>
        </div>
      </div>
      
      <Card className="shadow-sm border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Lista de Serviços</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serviço</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {service.name}
                      <div className="ml-2 flex">
                        {service.isPopular && (
                          <ServiceIndicator 
                            icon={TrendingUp} 
                            label="Serviço Popular" 
                            color="text-blue-500" 
                          />
                        )}
                        {service.isFeatured && (
                          <ServiceIndicator 
                            icon={Star} 
                            label="Serviço Destacado" 
                            color="text-amber-500" 
                          />
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/10">
                      {service.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                      {service.duration} min
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                      R$ {service.price.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-2">
            <TablePagination 
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={services.length}
              indexOfFirstItem={indexOfFirstItem}
              indexOfLastItem={indexOfLastItem}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(value) => {
                setItemsPerPage(value);
                setCurrentPage(1);
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Services;

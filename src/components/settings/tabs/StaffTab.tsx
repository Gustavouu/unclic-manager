
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Plus, UserMinus, Pencil, Calendar, FileText, DollarSign, Mail, Phone } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

// Mock data for professionals
const mockProfessionals = [
  {
    id: "1",
    name: "João da Silva",
    role: "Cabeleireiro",
    email: "joao@exemplo.com",
    phone: "(11) 99999-9999",
    photoUrl: "",
    active: true,
    specialties: ["Corte Masculino", "Barba"]
  },
  {
    id: "2",
    name: "Maria Santos",
    role: "Manicure",
    email: "maria@exemplo.com",
    phone: "(11) 98888-8888",
    photoUrl: "",
    active: true,
    specialties: ["Unhas", "Pedicure"]
  },
  {
    id: "3",
    name: "Pedro Lima",
    role: "Barbeiro",
    email: "pedro@exemplo.com",
    phone: "(11) 97777-7777",
    photoUrl: "",
    active: false,
    specialties: ["Barba", "Corte Degradê"]
  }
];

// Mock data for services
const mockServices = [
  { id: "1", name: "Corte Masculino", duration: 30, price: 50 },
  { id: "2", name: "Barba", duration: 20, price: 35 },
  { id: "3", name: "Corte Feminino", duration: 45, price: 70 },
  { id: "4", name: "Manicure", duration: 40, price: 45 },
  { id: "5", name: "Pedicure", duration: 50, price: 55 },
];

export const StaffTab = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  
  const handleEditProfessional = (professional: any) => {
    setSelectedProfessional(professional);
    setIsAddDialogOpen(true);
  };
  
  const handleAddNew = () => {
    setSelectedProfessional(null);
    setIsAddDialogOpen(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Gerenciamento de Profissionais</CardTitle>
            <CardDescription>
              Adicione e gerencie os profissionais do seu negócio
            </CardDescription>
          </div>
          <Button onClick={handleAddNew} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Profissional
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Profissionais Ativos</h3>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Nome</TableHead>
                  <TableHead>Especialidades</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockProfessionals.map((professional) => (
                  <TableRow key={professional.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={professional.photoUrl || ""} alt={professional.name} />
                          <AvatarFallback>{getInitials(professional.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{professional.name}</p>
                          <p className="text-sm text-muted-foreground">{professional.role}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {professional.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="bg-secondary/20">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                          {professional.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                          {professional.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {professional.active ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">Inativo</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditProfessional(professional)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Calendar className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <DollarSign className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
      
      {/* Dialog for adding/editing professionals */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProfessional ? `Editar Profissional: ${selectedProfessional.name}` : "Adicionar Novo Profissional"}</DialogTitle>
            <DialogDescription>
              {selectedProfessional 
                ? "Atualize as informações do profissional conforme necessário." 
                : "Preencha os dados para adicionar um novo profissional ao seu negócio."}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="info" className="mt-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="services">Serviços</TabsTrigger>
              <TabsTrigger value="schedule">Horários</TabsTrigger>
              <TabsTrigger value="commission">Comissões</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input 
                    id="name" 
                    defaultValue={selectedProfessional?.name || ""} 
                    placeholder="Ex: João da Silva"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Função</Label>
                  <Input 
                    id="role" 
                    defaultValue={selectedProfessional?.role || ""} 
                    placeholder="Ex: Cabeleireiro"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    defaultValue={selectedProfessional?.email || ""} 
                    placeholder="Ex: joao@exemplo.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input 
                    id="phone" 
                    defaultValue={selectedProfessional?.phone || ""} 
                    placeholder="Ex: (11) 99999-9999"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="bio">Biografia</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Uma breve descrição sobre o profissional" 
                  rows={4}
                />
              </div>
              
              <div>
                <Label>Status</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Switch 
                    id="status" 
                    defaultChecked={selectedProfessional?.active !== false}
                  />
                  <Label htmlFor="status">Profissional ativo</Label>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="services" className="space-y-4 mt-4">
              <div className="space-y-4">
                <Label>Serviços Oferecidos</Label>
                <div className="border rounded-md p-4 space-y-2 max-h-[300px] overflow-y-auto">
                  {mockServices.map((service) => (
                    <div key={service.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center space-x-2">
                        <Checkbox id={`service-${service.id}`} />
                        <Label 
                          htmlFor={`service-${service.id}`}
                          className="font-normal cursor-pointer"
                        >
                          {service.name}
                        </Label>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {service.duration} min | R$ {service.price.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm">
                    Selecione os serviços que este profissional pode realizar. Você pode 
                    customizar os preços e tempos para este profissional na próxima etapa.
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Personalização de Serviços</Label>
                
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Serviço</TableHead>
                        <TableHead>Preço Padrão</TableHead>
                        <TableHead>Preço Customizado</TableHead>
                        <TableHead>Tempo Padrão</TableHead>
                        <TableHead>Tempo Customizado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockServices.slice(0, 2).map((service) => (
                        <TableRow key={service.id}>
                          <TableCell>{service.name}</TableCell>
                          <TableCell>R$ {service.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <Input 
                              type="number" 
                              placeholder={service.price.toString()}
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>{service.duration} min</TableCell>
                          <TableCell>
                            <Input 
                              type="number" 
                              placeholder={service.duration.toString()}
                              className="w-24"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="schedule" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Horário de Trabalho</Label>
                <div className="border rounded-md p-4">
                  <div className="space-y-4">
                    {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map((day, index) => (
                      <div key={index} className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-3">
                          <div className="flex items-center space-x-2">
                            <Switch id={`day-${index}`} defaultChecked={index < 6} />
                            <Label htmlFor={`day-${index}`} className="font-normal">{day}</Label>
                          </div>
                        </div>
                        <div className="col-span-4">
                          <Input 
                            type="time" 
                            defaultValue={index < 6 ? "09:00" : ""}
                            disabled={index === 6}
                          />
                        </div>
                        <div className="col-span-1 text-center">até</div>
                        <div className="col-span-4">
                          <Input 
                            type="time" 
                            defaultValue={index < 6 ? "18:00" : ""}
                            disabled={index === 6}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Intervalos</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lunch-start" className="text-sm">Início do Almoço</Label>
                    <Input id="lunch-start" type="time" defaultValue="12:00" />
                  </div>
                  <div>
                    <Label htmlFor="lunch-end" className="text-sm">Fim do Almoço</Label>
                    <Input id="lunch-end" type="time" defaultValue="13:00" />
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Switch id="lunch-enabled" defaultChecked />
                  <Label htmlFor="lunch-enabled" className="text-sm">Intervalo de almoço ativo</Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Folgas e Férias</Label>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Nova Folga
                  </Button>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Início</TableHead>
                        <TableHead>Fim</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Motivo</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>12/06/2024</TableCell>
                        <TableCell>18/06/2024</TableCell>
                        <TableCell>Férias</TableCell>
                        <TableCell>Férias programadas</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="commission" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Modelo de Comissão</Label>
                <Select defaultValue="percentage">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de comissão" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentual sobre serviços</SelectItem>
                    <SelectItem value="fixed">Valor fixo por serviço</SelectItem>
                    <SelectItem value="mixed">Modelo misto</SelectItem>
                    <SelectItem value="salary">Salário fixo sem comissão</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Percentual de Comissão Padrão</Label>
                <div className="flex items-center gap-2">
                  <Input type="number" defaultValue="30" className="w-24" />
                  <span>%</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Este percentual será aplicado a todos os serviços realizados pelo profissional.
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Comissões por Serviço</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="service-specific-commission" />
                    <Label htmlFor="service-specific-commission" className="text-sm">Ativar comissões específicas</Label>
                  </div>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Serviço</TableHead>
                        <TableHead>Preço Base</TableHead>
                        <TableHead>Comissão Padrão</TableHead>
                        <TableHead>Comissão Específica</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockServices.slice(0, 3).map((service) => (
                        <TableRow key={service.id}>
                          <TableCell>{service.name}</TableCell>
                          <TableCell>R$ {service.price.toFixed(2)}</TableCell>
                          <TableCell>30%</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Input type="number" className="w-20" placeholder="30" disabled />
                              <span>%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Pagamento de Comissões</Label>
                <Select defaultValue="monthly">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="biweekly">Quinzenal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="auto-commission-calc" defaultChecked />
                <Label htmlFor="auto-commission-calc">
                  Calcular comissões automaticamente
                </Label>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
            <Button onClick={() => setIsAddDialogOpen(false)}>
              {selectedProfessional ? "Salvar Alterações" : "Adicionar Profissional"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};


import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Building2, 
  Scissors, 
  Users, 
  Clock, 
  Calendar, 
  DollarSign,
  Bell, 
  Link, 
  Lock, 
  Settings as SettingsIcon,
  HelpCircle,
  Save,
  Upload,
  MapPin,
  ChevronRight,
  Check,
  X,
  Mail,
  MessageSquare,
  Smartphone,
  BellRing,
  Fingerprint,
  UserPlus,
  UserCheck,
  ShieldCheck,
  UserMinus,
  KeyRound,
  AlertTriangle,
  AlertCircle,
  Download,
  UploadCloud,
  Cloud,
  Database,
  Cog,
  RefreshCcw,
  Trash2,
  CreditCard,
  Eye,
  EyeOff,
  Shield,
  UserCog,
  FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("business");
  
  const settingsTabs = [
    { id: "business", label: "Perfil do Negócio", icon: Building2 },
    { id: "services", label: "Serviços e Preços", icon: Scissors },
    { id: "staff", label: "Funcionários", icon: Users },
    { id: "hours", label: "Horários", icon: Clock },
    { id: "appointments", label: "Agendamentos", icon: Calendar },
    { id: "financial", label: "Financeiro", icon: DollarSign },
    { id: "notifications", label: "Notificações", icon: Bell },
    { id: "integrations", label: "Integrações", icon: Link },
    { id: "permissions", label: "Permissões", icon: Lock },
    { id: "other", label: "Outras", icon: SettingsIcon },
  ];

  return (
    <div className="container mx-auto space-y-6 pb-8">
      <div className="flex items-center justify-between py-4">
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline">
            <HelpCircle className="mr-2 h-4 w-4" />
            Tutorial de Configuração
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      <Tabs defaultValue="business" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="overflow-x-auto">
          <TabsList className="flex justify-start w-max p-1 mb-4 border rounded-lg">
            {settingsTabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id} 
                className="flex items-center gap-2 px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Business Profile Tab */}
        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Perfil do Negócio</CardTitle>
              <CardDescription>
                Informações básicas sobre o seu negócio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Informações Gerais</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="business-name">Nome do Negócio</Label>
                    <Input id="business-name" defaultValue="Salão de Beleza" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="business-email">Email de Contato</Label>
                    <Input id="business-email" type="email" defaultValue="contato@salaodebeleza.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="business-phone">Telefone</Label>
                    <Input id="business-phone" type="tel" defaultValue="(11) 99999-9999" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="business-address">Endereço</Label>
                    <div className="flex items-center gap-2">
                      <Input id="business-address" type="text" defaultValue="Rua Exemplo, 123" className="flex-1" />
                      <Button variant="outline" size="icon">
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Logotipo e Imagens</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="business-logo">Logotipo</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                        <Upload className="h-6 w-6 text-gray-500" />
                      </div>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Alterar Logotipo
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="business-cover">Imagem de Capa</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-48 h-24 rounded-md bg-gray-200 flex items-center justify-center">
                        <Upload className="h-6 w-6 text-gray-500" />
                      </div>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Alterar Imagem
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Redes Sociais</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facebook-link">Facebook</Label>
                    <Input id="facebook-link" type="url" placeholder="https://www.facebook.com/seunegocio" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="instagram-link">Instagram</Label>
                    <Input id="instagram-link" type="url" placeholder="https://www.instagram.com/seunegocio" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="linkedin-link">LinkedIn</Label>
                    <Input id="linkedin-link" type="url" placeholder="https://www.linkedin.com/company/seunegocio" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="twitter-link">Twitter</Label>
                    <Input id="twitter-link" type="url" placeholder="https://twitter.com/seunegocio" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancelar</Button>
              <Button>Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Hours Tab */}
        <TabsContent value="hours" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Horários de Funcionamento</CardTitle>
              <CardDescription>
                Defina os horários de funcionamento do seu negócio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Horários Regulares</h3>
                  
                  <div className="space-y-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Dia da Semana</TableHead>
                          <TableHead>Horário de Abertura</TableHead>
                          <TableHead>Horário de Fechamento</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Segunda-feira</TableCell>
                          <TableCell>08:00</TableCell>
                          <TableCell>18:00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Terça-feira</TableCell>
                          <TableCell>08:00</TableCell>
                          <TableCell>18:00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Quarta-feira</TableCell>
                          <TableCell>08:00</TableCell>
                          <TableCell>18:00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Quinta-feira</TableCell>
                          <TableCell>08:00</TableCell>
                          <TableCell>18:00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Sexta-feira</TableCell>
                          <TableCell>08:00</TableCell>
                          <TableCell>18:00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Sábado</TableCell>
                          <TableCell>09:00</TableCell>
                          <TableCell>13:00</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Domingo</TableCell>
                          <TableCell>Fechado</TableCell>
                          <TableCell>Fechado</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Horários Especiais</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="holiday-hours">Horários de Feriados</Label>
                      <Button variant="outline" size="sm">
                        Adicionar Feriado
                      </Button>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <p className="text-sm text-muted-foreground">
                        Nenhum horário especial definido.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="temporary-hours">Horários Temporários</Label>
                      <Button variant="outline" size="sm">
                        Adicionar Horário
                      </Button>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <p className="text-sm text-muted-foreground">
                        Nenhum horário temporário definido.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Ajustes Adicionais</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="break-time">Tempo de Intervalo</Label>
                    <Select defaultValue="0">
                      <SelectTrigger id="break-time">
                        <SelectValue placeholder="Selecione o tempo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Sem Intervalo</SelectItem>
                        <SelectItem value="15">15 minutos</SelectItem>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="45">45 minutos</SelectItem>
                        <SelectItem value="60">1 hora</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="buffer-time">Tempo de Preparação</Label>
                    <Select defaultValue="0">
                      <SelectTrigger id="buffer-time">
                        <SelectValue placeholder="Selecione o tempo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Sem Preparação</SelectItem>
                        <SelectItem value="5">5 minutos</SelectItem>
                        <SelectItem value="10">10 minutos</SelectItem>
                        <SelectItem value="15">15 minutos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancelar</Button>
              <Button>Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Serviços e Preços</CardTitle>
              <CardDescription>
                Gerencie os serviços oferecidos pelo seu negócio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Serviços Oferecidos</h3>
                
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Serviço</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Duração</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Corte de Cabelo</TableCell>
                        <TableCell>R$ 50,00</TableCell>
                        <TableCell>30 minutos</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Cog className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Manicure</TableCell>
                        <TableCell>R$ 30,00</TableCell>
                        <TableCell>45 minutos</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Cog className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Massagem Relaxante</TableCell>
                        <TableCell>R$ 90,00</TableCell>
                        <TableCell>60 minutos</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Cog className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Adicionar Novo Serviço</h3>
                  <Button variant="outline" size="sm">
                    Adicionar Serviço
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="service-name">Nome do Serviço</Label>
                    <Input id="service-name" placeholder="Ex: Limpeza de Pele" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="service-price">Preço</Label>
                    <Input id="service-price" type="number" placeholder="Ex: 75,00" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="service-duration">Duração</Label>
                    <Select defaultValue="30">
                      <SelectTrigger id="service-duration">
                        <SelectValue placeholder="Selecione a duração" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutos</SelectItem>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="45">45 minutos</SelectItem>
                        <SelectItem value="60">1 hora</SelectItem>
                        <SelectItem value="90">1 hora e 30 minutos</SelectItem>
                        <SelectItem value="120">2 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="service-description">Descrição</Label>
                    <Textarea id="service-description" placeholder="Descrição detalhada do serviço" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancelar</Button>
              <Button>Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Staff Tab */}
        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Funcionários</CardTitle>
              <CardDescription>
                Adicione e gerencie os funcionários do seu negócio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Funcionários Ativos</h3>
                
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>João da Silva</TableCell>
                        <TableCell>joao@exemplo.com</TableCell>
                        <TableCell>(11) 99999-9999</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Cog className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Maria Santos</TableCell>
                        <TableCell>maria@exemplo.com</TableCell>
                        <TableCell>(11) 99999-9999</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Cog className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Pedro Lima</TableCell>
                        <TableCell>pedro@exemplo.com</TableCell>
                        <TableCell>(11) 99999-9999</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Cog className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Adicionar Novo Funcionário</h3>
                  <Button variant="outline" size="sm">
                    Convidar Funcionário
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="staff-name">Nome Completo</Label>
                    <Input id="staff-name" placeholder="Ex: Ana Souza" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="staff-email">Email</Label>
                    <Input id="staff-email" type="email" placeholder="Ex: ana@exemplo.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="staff-phone">Telefone</Label>
                    <Input id="staff-phone" type="tel" placeholder="Ex: (11) 99999-9999" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="staff-role">Função</Label>
                    <Select defaultValue="professional">
                      <SelectTrigger id="staff-role">
                        <SelectValue placeholder="Selecione a função" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="administrator">Administrador</SelectItem>
                        <SelectItem value="manager">Gerente</SelectItem>
                        <SelectItem value="professional">Profissional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancelar</Button>
              <Button>Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Agendamentos</CardTitle>
              <CardDescription>
                Configure as regras e políticas para agendamentos de serviços
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Regras de Agendamento</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="allow-multiple">Permitir agendamentos simultâneos</Label>
                        <p className="text-sm text-muted-foreground">
                          Clientes podem agendar mais de um serviço ao mesmo tempo
                        </p>
                      </div>
                      <Switch id="allow-multiple" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="require-confirmation">Confirmação manual de agendamentos</Label>
                        <p className="text-sm text-muted-foreground">
                          Agendamentos precisam ser confirmados pela equipe
                        </p>
                      </div>
                      <Switch id="require-confirmation" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="block-no-shows">Bloquear clientes faltantes</Label>
                        <p className="text-sm text-muted-foreground">
                          Impedir novos agendamentos de clientes que faltaram
                        </p>
                      </div>
                      <Switch id="block-no-shows" />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="max-future-days">Limite de dias para agendamento futuro</Label>
                      <p className="text-sm text-muted-foreground">
                        Quantos dias no futuro os clientes podem agendar
                      </p>
                      <Select defaultValue="30">
                        <SelectTrigger id="max-future-days">
                          <SelectValue placeholder="Selecione o limite" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7 dias</SelectItem>
                          <SelectItem value="14">14 dias</SelectItem>
                          <SelectItem value="30">30 dias</SelectItem>
                          <SelectItem value="60">60 dias</SelectItem>
                          <SelectItem value="90">90 dias</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Lembretes e Confirmações</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="send-confirmation">Enviar confirmação</Label>
                        <p className="text-sm text-muted-foreground">
                          Enviar email de confirmação após agendamento
                        </p>
                      </div>
                      <Switch id="send-confirmation" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="send-reminder">Enviar lembretes</Label>
                        <p className="text-sm text-muted-foreground">
                          Enviar lembretes antes do agendamento
                        </p>
                      </div>
                      <Switch id="send-reminder" defaultChecked />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="reminder-time">Tempo do lembrete</Label>
                      <p className="text-sm text-muted-foreground">
                        Quando enviar o lembrete antes do agendamento
                      </p>
                      <Select defaultValue="24">
                        <SelectTrigger id="reminder-time">
                          <SelectValue placeholder="Selecione o tempo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 hora antes</SelectItem>
                          <SelectItem value="2">2 horas antes</SelectItem>
                          <SelectItem value="12">12 horas antes</SelectItem>
                          <SelectItem value="24">24 horas antes</SelectItem>
                          <SelectItem value="48">48 horas antes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="follow-up">Mensagem pós-atendimento</Label>
                      <p className="text-sm text-muted-foreground">
                        Enviar mensagem após o serviço para feedback
                      </p>
                      <Select defaultValue="2">
                        <SelectTrigger id="follow-up">
                          <SelectValue placeholder="Selecione o tempo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Não enviar</SelectItem>
                          <SelectItem value="1">1 hora depois</SelectItem>
                          <SelectItem value="2">2 horas depois</SelectItem>
                          <SelectItem value="24">24 horas depois</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Políticas de Cancelamento</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cancellation-policy">Política de cancelamento</Label>
                    <Select defaultValue="24">
                      <SelectTrigger id="cancellation-policy">
                        <SelectValue placeholder="Selecione a política" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Cancelamento a qualquer momento</SelectItem>
                        <SelectItem value="2">Até 2 horas antes</SelectItem>
                        <SelectItem value="12">Até 12 horas antes</SelectItem>
                        <SelectItem value="24">Até 24 horas antes</SelectItem>
                        <SelectItem value="48">Até 48 horas antes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="no-show-fee">Taxa por não comparecimento</Label>
                    <div className="flex items-center gap-2">
                      <div className="relative w-full">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">R$</span>
                        <Input id="no-show-fee" type="number" className="pl-8" defaultValue="0" />
                      </div>
                      <span className="text-sm text-muted-foreground">ou</span>
                      <div className="w-20">
                        <Input type="number" className="text-right" defaultValue="0" />
                      </div>
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cancellation-message">Mensagem de cancelamento</Label>
                  <Textarea 
                    id="cancellation-message" 
                    placeholder="Mensagem exibida quando um agendamento é cancelado"
                    defaultValue="Lamentamos informar que seu agendamento foi cancelado. Entre em contato conosco para mais informações."
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancelar</Button>
              <Button>Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Financeiras</CardTitle>
              <CardDescription>
                Defina as configurações financeiras do seu negócio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Formas de Pagamento</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border p-3 rounded-md">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Cartão de Crédito</p>
                          <span className="text-sm text-muted-foreground">Taxa: 2.99%</span>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border p-3 rounded-md">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Cartão de Débito</p>
                          <span className="text-sm text-muted-foreground">Taxa: 1.99%</span>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border p-3 rounded-md">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Dinheiro</p>
                          <span className="text-sm text-muted-foreground">Taxa: 0%</span>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border p-3 rounded-md">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Pix</p>
                          <span className="text-sm text-muted-foreground">Taxa: 0.99%</span>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Integração de Pagamentos</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border p-3 rounded-md">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Cielo</p>
                          <Badge variant="outline" className="ml-2">Não configurado</Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Configurar</Button>
                    </div>
                    
                    <div className="flex items-center justify-between border p-3 rounded-md">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">PagSeguro</p>
                          <Badge variant="outline" className="ml-2">Não configurado</Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Configurar</Button>
                    </div>
                    
                    <div className="flex items-center justify-between border p-3 rounded-md">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Mercado Pago</p>
                          <Badge variant="outline" className="ml-2">Não configurado</Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Configurar</Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Configurações Avançadas</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Moeda</Label>
                    <Select defaultValue="BRL">
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Selecione a moeda" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BRL">Real (BRL)</SelectItem>
                        <SelectItem value="USD">Dólar (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tax-rate">Taxa de impostos padrão</Label>
                    <div className="flex items-center gap-2">
                      <Input id="tax-rate" type="number" className="text-right" defaultValue="0" />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-receipt" />
                      <Label htmlFor="auto-receipt">Enviar recibos automaticamente</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enviar recibos por email automaticamente após cada pagamento
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancelar</Button>
              <Button>Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

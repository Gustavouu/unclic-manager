
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  ChevronRight
} from "lucide-react";

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

        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Perfil do Negócio</CardTitle>
              <CardDescription>
                Configure as informações básicas do seu estabelecimento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="business-name">Nome do Estabelecimento</Label>
                      <Input id="business-name" placeholder="Nome do seu negócio" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-cnpj">CNPJ</Label>
                      <Input id="business-cnpj" placeholder="00.000.000/0000-00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-phone">Telefone</Label>
                      <Input id="business-phone" type="tel" placeholder="(00) 00000-0000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-email">Email</Label>
                      <Input id="business-email" type="email" placeholder="seu@email.com" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="business-description">Descrição</Label>
                    <textarea 
                      id="business-description" 
                      rows={3}
                      className="w-full p-2 border rounded-md resize-none"
                      placeholder="Descreva seu negócio em poucas palavras..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Endereço</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input placeholder="CEP" />
                      <Input placeholder="Logradouro" />
                      <Input placeholder="Número" />
                      <Input placeholder="Complemento" />
                      <Input placeholder="Bairro" />
                      <Input placeholder="Cidade" />
                      <div className="space-y-2">
                        <Select defaultValue="SP">
                          <SelectTrigger>
                            <SelectValue placeholder="Estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AC">Acre</SelectItem>
                            <SelectItem value="AL">Alagoas</SelectItem>
                            <SelectItem value="AP">Amapá</SelectItem>
                            <SelectItem value="AM">Amazonas</SelectItem>
                            <SelectItem value="BA">Bahia</SelectItem>
                            <SelectItem value="CE">Ceará</SelectItem>
                            <SelectItem value="DF">Distrito Federal</SelectItem>
                            <SelectItem value="ES">Espírito Santo</SelectItem>
                            <SelectItem value="GO">Goiás</SelectItem>
                            <SelectItem value="MA">Maranhão</SelectItem>
                            <SelectItem value="MT">Mato Grosso</SelectItem>
                            <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                            <SelectItem value="MG">Minas Gerais</SelectItem>
                            <SelectItem value="PA">Pará</SelectItem>
                            <SelectItem value="PB">Paraíba</SelectItem>
                            <SelectItem value="PR">Paraná</SelectItem>
                            <SelectItem value="PE">Pernambuco</SelectItem>
                            <SelectItem value="PI">Piauí</SelectItem>
                            <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                            <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                            <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                            <SelectItem value="RO">Rondônia</SelectItem>
                            <SelectItem value="RR">Roraima</SelectItem>
                            <SelectItem value="SC">Santa Catarina</SelectItem>
                            <SelectItem value="SP">São Paulo</SelectItem>
                            <SelectItem value="SE">Sergipe</SelectItem>
                            <SelectItem value="TO">Tocantins</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-1/3 space-y-4">
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Logo da Empresa</Label>
                      <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 bg-muted/50">
                        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <Button variant="outline" size="sm">Enviar Logo</Button>
                        <p className="text-xs text-muted-foreground mt-2">PNG, JPG ou GIF até 2MB</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Localização no Mapa</Label>
                      <div className="border rounded-lg h-40 bg-muted/50 flex items-center justify-center">
                        <div className="text-center">
                          <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <Button variant="outline" size="sm">Configurar no Mapa</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-medium">Links Úteis</h3>
                    <ul className="space-y-2">
                      <li>
                        <a href="#" className="flex items-center justify-between text-sm hover:underline">
                          <span>Termos de Uso</span>
                          <ChevronRight className="h-4 w-4" />
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center justify-between text-sm hover:underline">
                          <span>Política de Privacidade</span>
                          <ChevronRight className="h-4 w-4" />
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center justify-between text-sm hover:underline">
                          <span>Central de Ajuda</span>
                          <ChevronRight className="h-4 w-4" />
                        </a>
                      </li>
                    </ul>
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

        <TabsContent value="hours" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Horários</CardTitle>
              <CardDescription>
                Configure horários de funcionamento do seu estabelecimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-medium text-lg mb-4">Dias e Horários de Funcionamento</h3>
                    <div className="space-y-4">
                      {[
                        { day: "Segunda-feira", open: true },
                        { day: "Terça-feira", open: true },
                        { day: "Quarta-feira", open: true },
                        { day: "Quinta-feira", open: true },
                        { day: "Sexta-feira", open: true },
                        { day: "Sábado", open: true },
                        { day: "Domingo", open: false }
                      ].map((dayItem, index) => (
                        <div key={index} className="grid grid-cols-[1fr_auto_1fr_1fr] gap-2 items-center">
                          <div className="font-medium">{dayItem.day}</div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`day-${index}`}
                              checked={dayItem.open}
                              className="mr-2"
                            />
                            <Label htmlFor={`day-${index}`} className="text-sm cursor-pointer">
                              Aberto
                            </Label>
                          </div>
                          <Select disabled={!dayItem.open} defaultValue="08:00">
                            <SelectTrigger>
                              <SelectValue placeholder="Abertura" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 24 }, (_, i) => (
                                <SelectItem 
                                  key={i} 
                                  value={`${i.toString().padStart(2, '0')}:00`}
                                >
                                  {`${i.toString().padStart(2, '0')}:00`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select disabled={!dayItem.open} defaultValue="18:00">
                            <SelectTrigger>
                              <SelectValue placeholder="Fechamento" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 24 }, (_, i) => (
                                <SelectItem 
                                  key={i} 
                                  value={`${i.toString().padStart(2, '0')}:00`}
                                >
                                  {`${i.toString().padStart(2, '0')}:00`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-medium text-lg mb-4">Configurações Adicionais</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="block-sundays" />
                        <Label htmlFor="block-sundays">Bloquear agendamentos aos domingos</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="block-holidays" />
                        <Label htmlFor="block-holidays">Bloquear agendamentos em feriados</Label>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-2">Intervalo mínimo entre agendamentos</h4>
                        <Select defaultValue="15min">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o intervalo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0min">Sem intervalo</SelectItem>
                            <SelectItem value="5min">5 minutos</SelectItem>
                            <SelectItem value="10min">10 minutos</SelectItem>
                            <SelectItem value="15min">15 minutos</SelectItem>
                            <SelectItem value="30min">30 minutos</SelectItem>
                            <SelectItem value="60min">1 hora</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-2">Antecedência mínima para agendamento</h4>
                        <Select defaultValue="1h">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione a antecedência" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0h">Sem antecedência</SelectItem>
                            <SelectItem value="1h">1 hora</SelectItem>
                            <SelectItem value="2h">2 horas</SelectItem>
                            <SelectItem value="12h">12 horas</SelectItem>
                            <SelectItem value="24h">1 dia</SelectItem>
                            <SelectItem value="48h">2 dias</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-2">Cancelamento de agendamentos</h4>
                        <Select defaultValue="24h">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Prazo para cancelamento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0h">A qualquer momento</SelectItem>
                            <SelectItem value="1h">Até 1 hora antes</SelectItem>
                            <SelectItem value="2h">Até 2 horas antes</SelectItem>
                            <SelectItem value="6h">Até 6 horas antes</SelectItem>
                            <SelectItem value="12h">Até 12 horas antes</SelectItem>
                            <SelectItem value="24h">Até 24 horas antes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
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

        {/* Conteúdo para as outras abas */}
        {["services", "staff", "appointments", "financial", "notifications", "integrations", "permissions", "other"].map((tabId) => (
          <TabsContent key={tabId} value={tabId} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{settingsTabs.find(tab => tab.id === tabId)?.label}</CardTitle>
                <CardDescription>
                  Configure as opções de {settingsTabs.find(tab => tab.id === tabId)?.label.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-6 text-center">
                  <div className="mb-4">
                    {(() => {
                      const TabIcon = settingsTabs.find(tab => tab.id === tabId)?.icon;
                      return TabIcon ? <TabIcon className="h-12 w-12 mx-auto text-muted-foreground" /> : null;
                    })()}
                  </div>
                  <h3 className="text-lg font-medium mb-2">Configurações de {settingsTabs.find(tab => tab.id === tabId)?.label}</h3>
                  <p className="text-muted-foreground mb-4">
                    Este módulo está em desenvolvimento e estará disponível em breve.
                  </p>
                  <Button variant="outline">Saiba mais</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Settings;

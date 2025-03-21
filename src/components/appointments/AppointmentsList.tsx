
import { useState } from "react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Check, 
  Clock, 
  MoreVertical, 
  Pencil, 
  Search, 
  Trash2, 
  X,
  CalendarRange,
  Filter,
  User,
  Sparkles
} from "lucide-react";
import { format, isAfter, isBefore, isToday, startOfDay, endOfDay, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// Sample data
const appointments = [
  {
    id: "1",
    clientName: "Maria Silva",
    serviceName: "Corte e Coloração",
    date: new Date(2024, 6, 12, 10, 0),
    status: "agendado",
    price: 180,
    serviceType: "hair"
  },
  {
    id: "2",
    clientName: "Carlos Santos",
    serviceName: "Barba e Cabelo",
    date: new Date(2024, 6, 12, 14, 30),
    status: "concluído",
    price: 95,
    serviceType: "barber"
  },
  {
    id: "3",
    clientName: "Ana Costa",
    serviceName: "Manicure",
    date: new Date(2024, 6, 15, 11, 0),
    status: "cancelado",
    price: 60,
    serviceType: "nails"
  },
  {
    id: "4",
    clientName: "Fernanda Lima",
    serviceName: "Maquiagem para Evento",
    date: new Date(2024, 6, 16, 15, 0),
    status: "agendado",
    price: 120,
    serviceType: "makeup"
  },
  {
    id: "5",
    clientName: "Paulo Mendes",
    serviceName: "Limpeza de Pele",
    date: new Date(2024, 6, 17, 9, 0),
    status: "agendado",
    price: 150,
    serviceType: "skincare"
  },
];

type AppointmentStatus = "agendado" | "concluído" | "cancelado";
type ServiceType = "all" | "hair" | "barber" | "nails" | "makeup" | "skincare";
type DateFilter = "all" | "today" | "tomorrow" | "thisWeek" | "custom";

// Map service types to display names
const SERVICE_TYPE_NAMES: Record<ServiceType, string> = {
  all: "Todos os Serviços",
  hair: "Cabelo",
  barber: "Barbearia",
  nails: "Manicure/Pedicure",
  makeup: "Maquiagem",
  skincare: "Estética Facial"
};

const getStatusBadge = (status: AppointmentStatus) => {
  switch (status) {
    case "agendado":
      return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Agendado</Badge>;
    case "concluído":
      return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Concluído</Badge>;
    case "cancelado":
      return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Cancelado</Badge>;
    default:
      return null;
  }
};

export const AppointmentsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all");
  const [serviceFilter, setServiceFilter] = useState<ServiceType>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [customDateRange, setCustomDateRange] = useState<{
    from?: Date,
    to?: Date
  }>({});
  const [showFilters, setShowFilters] = useState(false);
  
  const filterAppointments = () => {
    return appointments.filter(appointment => {
      // Search filter
      const matchesSearch = 
        appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = 
        statusFilter === "all" || 
        appointment.status === statusFilter;
      
      // Service filter
      const matchesService = 
        serviceFilter === "all" || 
        appointment.serviceType === serviceFilter;
      
      // Date filter
      let matchesDate = true;
      const today = startOfDay(new Date());
      const tomorrow = startOfDay(addDays(new Date(), 1));
      const nextWeek = startOfDay(addDays(new Date(), 7));
      
      switch(dateFilter) {
        case "today":
          matchesDate = isToday(appointment.date);
          break;
        case "tomorrow":
          matchesDate = isSameDay(appointment.date, tomorrow);
          break;
        case "thisWeek":
          matchesDate = isAfter(appointment.date, today) && isBefore(appointment.date, nextWeek);
          break;
        case "custom":
          if (customDateRange.from) {
            matchesDate = isAfter(appointment.date, startOfDay(customDateRange.from));
            
            if (customDateRange.to) {
              matchesDate = matchesDate && isBefore(appointment.date, endOfDay(customDateRange.to));
            }
          }
          break;
        default:
          matchesDate = true;
      }
      
      return matchesSearch && matchesStatus && matchesService && matchesDate;
    });
  };

  const filteredAppointments = filterAppointments();
  
  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setServiceFilter("all");
    setDateFilter("all");
    setCustomDateRange({});
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Buscar por cliente ou serviço..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filtros
            {(statusFilter !== "all" || serviceFilter !== "all" || dateFilter !== "all") && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                {(statusFilter !== "all" ? 1 : 0) + 
                 (serviceFilter !== "all" ? 1 : 0) + 
                 (dateFilter !== "all" ? 1 : 0)}
              </Badge>
            )}
          </Button>
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-muted/40 p-3 rounded-md border border-border/60">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <User size={16} className="text-muted-foreground" />
                Status
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as AppointmentStatus | "all")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="agendado">Agendado</SelectItem>
                  <SelectItem value="concluído">Concluído</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Sparkles size={16} className="text-muted-foreground" />
                Tipo de Serviço
              </div>
              <Select
                value={serviceFilter}
                onValueChange={(value) => setServiceFilter(value as ServiceType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filtrar por serviço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os serviços</SelectItem>
                  <SelectItem value="hair">Cabelo</SelectItem>
                  <SelectItem value="barber">Barbearia</SelectItem>
                  <SelectItem value="nails">Manicure/Pedicure</SelectItem>
                  <SelectItem value="makeup">Maquiagem</SelectItem>
                  <SelectItem value="skincare">Estética Facial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CalendarRange size={16} className="text-muted-foreground" />
                Data
              </div>
              <div className="flex gap-2">
                <Select
                  value={dateFilter}
                  onValueChange={(value) => setDateFilter(value as DateFilter)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filtrar por data" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as datas</SelectItem>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="tomorrow">Amanhã</SelectItem>
                    <SelectItem value="thisWeek">Esta semana</SelectItem>
                    <SelectItem value="custom">Período personalizado</SelectItem>
                  </SelectContent>
                </Select>
                
                {dateFilter === "custom" && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        <CalendarRange size={16} />
                        {customDateRange.from ? (
                          customDateRange.to ? (
                            <>
                              {format(customDateRange.from, "dd/MM")} - {format(customDateRange.to, "dd/MM")}
                            </>
                          ) : (
                            format(customDateRange.from, "dd/MM")
                          )
                        ) : (
                          "Selecionar"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={customDateRange}
                        onSelect={setCustomDateRange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
            
            <div className="md:col-span-3 flex justify-end border-t pt-2 mt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleResetFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={14} className="mr-1" />
                Limpar filtros
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Serviço</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Hora</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell className="font-medium">{appointment.clientName}</TableCell>
                <TableCell>{appointment.serviceName}</TableCell>
                <TableCell>{format(appointment.date, "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                <TableCell>{format(appointment.date, "HH:mm")}</TableCell>
                <TableCell>R$ {appointment.price.toFixed(2)}</TableCell>
                <TableCell>{getStatusBadge(appointment.status as AppointmentStatus)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Pencil className="h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        Marcar como concluído
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Remarcar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                        <X className="h-4 w-4" />
                        Cancelar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                        <Trash2 className="h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            
            {filteredAppointments.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum agendamento encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

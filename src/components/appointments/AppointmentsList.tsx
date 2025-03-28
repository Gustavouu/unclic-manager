
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, Calendar as CalendarIcon } from "lucide-react";
import { SearchBar } from "./list/SearchBar";
import { FiltersButton } from "./list/FiltersButton";
import { FiltersPanel } from "./list/FiltersPanel";
import { AppointmentsTable } from "./list/AppointmentsTable";
import { useAppointmentsFilter } from "./list/hooks/useAppointmentsFilter";
import { appointments } from "./data/appointmentsSampleData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const AppointmentsList = () => {
  const { 
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    serviceFilter,
    setServiceFilter,
    dateFilter,
    setDateFilter,
    customDateRange,
    setCustomDateRange,
    showFilters,
    setShowFilters,
    filteredAppointments,
    handleResetFilters
  } = useAppointmentsFilter(appointments);

  // Sort appointments chronologically
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Group appointments by date for better visualization
  const groupedAppointments = sortedAppointments.reduce((groups, appointment) => {
    const dateStr = format(new Date(appointment.date), 'yyyy-MM-dd');
    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(appointment);
    return groups;
  }, {} as Record<string, typeof sortedAppointments>);

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center gap-2">
          <SearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
          />
          <FiltersButton 
            showFilters={showFilters} 
            setShowFilters={setShowFilters} 
            statusFilter={statusFilter}
            serviceFilter={serviceFilter}
            dateFilter={dateFilter}
          />
        </div>
        
        {showFilters && (
          <FiltersPanel 
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            serviceFilter={serviceFilter}
            setServiceFilter={setServiceFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            customDateRange={customDateRange}
            setCustomDateRange={setCustomDateRange}
            handleResetFilters={handleResetFilters}
          />
        )}
      </div>
      
      {Object.keys(groupedAppointments).length > 0 ? (
        <div className="space-y-4">
          {Object.entries(groupedAppointments).map(([dateStr, dateAppointments]) => (
            <Card key={dateStr} className="overflow-hidden border border-blue-100">
              <CardHeader className="bg-blue-50 py-3 px-4 border-b border-blue-100">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 text-blue-700 mr-2" />
                  <CardTitle className="text-base font-medium text-blue-800">
                    {format(new Date(dateStr), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </CardTitle>
                  <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 border-blue-200">
                    {dateAppointments.length} {dateAppointments.length === 1 ? 'agendamento' : 'agendamentos'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {dateAppointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{appointment.clientName}</div>
                          <div className="text-sm text-gray-600">{appointment.serviceName}</div>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="text-xs text-gray-500">{appointment.serviceType} min</div>
                            <div className="text-xs text-gray-500">R$ {appointment.price.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-base font-semibold text-blue-700">
                          {format(new Date(appointment.date), "HH:mm")}
                        </div>
                        <div className="text-xs mt-1">
                          <Badge variant="outline" className={`
                            ${appointment.status === 'agendado' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                            ${appointment.status === 'pendente' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                            ${appointment.status === 'cancelado' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                          `}>
                            {appointment.status === 'agendado' ? 'Confirmado' : 
                             appointment.status === 'pendente' ? 'Pendente' : 
                             appointment.status === 'cancelado' ? 'Cancelado' : 
                             appointment.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border rounded-lg bg-gray-50">
          <p className="text-gray-500">Nenhum agendamento encontrado.</p>
        </div>
      )}
    </div>
  );
};

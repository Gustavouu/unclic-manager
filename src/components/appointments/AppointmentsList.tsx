
import { SearchBar } from "./list/SearchBar";
import { FiltersButton } from "./list/FiltersButton";
import { FiltersPanel } from "./list/FiltersPanel";
import { AppointmentsTable } from "./list/AppointmentsTable";
import { useAppointmentsFilter } from "./list/hooks/useAppointmentsFilter";
import { appointments } from "./data/appointmentsSampleData";

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
      
      <AppointmentsTable appointments={filteredAppointments} />
    </div>
  );
};

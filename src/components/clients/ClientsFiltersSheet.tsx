
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ClientsFilters } from "./ClientsFilters";
import type { Client } from "@/types/client";

interface ClientsFiltersSheetProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  onFilteredClientsChange: (clients: Client[]) => void;
}

export function ClientsFiltersSheet({
  isOpen,
  onClose,
  clients,
  onFilteredClientsChange,
}: ClientsFiltersSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <ClientsFilters
            clients={clients}
            onFilteredClientsChange={onFilteredClientsChange}
          />
          <div className="mt-4">
            <Button onClick={onClose} className="w-full">
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

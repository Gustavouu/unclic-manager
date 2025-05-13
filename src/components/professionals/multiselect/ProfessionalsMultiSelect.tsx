
import { useState, useEffect } from 'react';
import { useProfessionals } from '@/hooks/professionals/useProfessionals';
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export interface ProfessionalsMultiSelectProps {
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ProfessionalsMultiSelect({ 
  selectedIds,
  onChange,
  placeholder = "Selecionar profissionais...",
  disabled = false
}: ProfessionalsMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const { professionals, loading } = useProfessionals({ activeOnly: true });
  
  // Find a professional by ID
  const findProfessional = (id: string) => {
    return professionals.find(p => p.id === id);
  };

  // Toggle selection of a professional
  const toggleProfessional = (id: string) => {
    const isSelected = selectedIds.includes(id);
    
    if (isSelected) {
      onChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  // Remove a professional from selection
  const removeProfessional = (id: string) => {
    onChange(selectedIds.filter(selectedId => selectedId !== id));
  };
  
  // Selected professionals with their full data
  const selectedProfessionals = selectedIds
    .map(id => findProfessional(id))
    .filter(p => p !== undefined);

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between h-auto min-h-10 py-2",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            <div className="flex flex-wrap gap-1 mr-2">
              {selectedProfessionals.length > 0 ? (
                selectedProfessionals.map(prof => (
                  <Badge 
                    key={prof?.id} 
                    variant="secondary"
                    className="flex items-center gap-1 rounded-md px-2 py-1"
                  >
                    {prof?.name}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeProfessional(prof?.id || "");
                      }} 
                    />
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Buscar profissional..." />
            <CommandList>
              <CommandEmpty>Nenhum profissional encontrado.</CommandEmpty>
              <CommandGroup>
                {loading ? (
                  <CommandItem disabled className="flex items-center justify-center">
                    Carregando...
                  </CommandItem>
                ) : (
                  professionals.map((professional) => (
                    <CommandItem
                      key={professional.id}
                      value={professional.name}
                      onSelect={() => {
                        toggleProfessional(professional.id);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedIds.includes(professional.id) 
                            ? "opacity-100" 
                            : "opacity-0"
                        )}
                      />
                      {professional.name}
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

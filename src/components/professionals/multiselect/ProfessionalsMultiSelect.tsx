
import React, { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Option } from "./types";
import { useProfessionals } from "@/hooks/professionals";

interface ProfessionalsMultiSelectProps {
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export const ProfessionalsMultiSelect: React.FC<ProfessionalsMultiSelectProps> = ({
  selectedValues,
  onChange,
  placeholder = "Selecione os profissionais..."
}) => {
  const [open, setOpen] = useState(false);
  const { professionals, loading } = useProfessionals();
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (professionals.length > 0) {
      const mappedOptions = professionals.map(pro => ({
        label: pro.name,
        value: pro.id
      }));
      setOptions(mappedOptions);
    }
  }, [professionals]);

  const handleSelect = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const handleRemove = (value: string) => {
    onChange(selectedValues.filter(v => v !== value));
  };

  // Get display labels for selected values
  const getSelectedLabels = () => {
    return selectedValues.map(value => {
      const option = options.find(opt => opt.value === value);
      return option ? option.label : value;
    });
  };

  const selectedLabels = getSelectedLabels();

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedLabels.length > 0 
              ? `${selectedLabels.length} profissional(is) selecionado(s)` 
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Buscar profissional..." className="h-9" />
            <CommandEmpty>
              {loading 
                ? "Carregando profissionais..." 
                : "Nenhum profissional encontrado."}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    handleSelect(option.value);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValues.includes(option.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedLabels.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedLabels.map((label, i) => (
            <Badge 
              key={selectedValues[i]} 
              variant="secondary"
              className="h-7"
            >
              {label}
              <button
                type="button"
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => handleRemove(selectedValues[i])}
              >
                <span className="sr-only">Remove</span>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

// Missing X icon import
import { X } from "lucide-react";

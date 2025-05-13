
import React, { useState, useEffect } from 'react';
import { Option } from './types';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

export interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  emptyMessage?: string;
  disabled?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  placeholder = "Selecione itens...",
  className,
  emptyMessage = "Nenhuma opção encontrada.",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(selected || []);

  useEffect(() => {
    setSelectedValues(selected || []);
  }, [selected]);

  const handleSelect = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    
    setSelectedValues(newSelectedValues);
    onChange(newSelectedValues);
  };

  const handleRemove = (value: string) => {
    const newSelectedValues = selectedValues.filter(v => v !== value);
    setSelectedValues(newSelectedValues);
    onChange(newSelectedValues);
  };

  const selectedLabels = selectedValues
    .map(value => options.find(option => option.value === value)?.label || value);

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              selectedValues.length > 0 ? "h-full" : "h-10",
              className
            )}
            onClick={() => setOpen(!open)}
            disabled={disabled}
          >
            {selectedValues.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedValues.length <= 2 && selectedLabels.map((label, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="mr-1 mb-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(selectedValues[i]);
                    }}
                  >
                    {label}
                    <button
                      className="ml-1 rounded-full outline-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(selectedValues[i]);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {selectedValues.length > 2 && (
                  <Badge variant="secondary" className="mb-1">
                    {selectedValues.length} itens selecionados
                  </Badge>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Pesquisar..." />
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {options.map(option => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValues.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

// Re-export the MultiSelect component for compatibility
export { MultiSelect as ProfessionalsMultiSelect };


import { useState, useEffect } from 'react';
import { useProfessionals } from '@/hooks/professionals/useProfessionals';
import { Option } from './types';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Types for the inner components
interface SelectedItemProps {
  option: Option;
  onRemove: () => void;
}

interface DropdownListProps {
  isOpen: boolean;
  maxHeight: number;
  children: React.ReactNode;
}

interface ProfessionalsMultiSelectProps {
  selectedProfessionalIds: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  allowAll?: boolean;
}

// Inner components
const SelectedItem = ({ option, onRemove }: SelectedItemProps) => (
  <Badge 
    variant="secondary" 
    className="m-1 gap-1 pl-2 pr-1 py-1 flex items-center"
  >
    {option.label}
    <Button 
      variant="ghost" 
      size="sm" 
      className="h-4 w-4 p-0 ml-1 rounded-full" 
      onClick={onRemove}
    >
      <X className="h-3 w-3" />
    </Button>
  </Badge>
);

const DropdownList = ({ isOpen, maxHeight, children }: DropdownListProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="relative w-full">
      <div className="absolute z-50 mt-1 w-full rounded-md border border-input bg-popover shadow-md">
        <ScrollArea className="rounded-md p-1" style={{ maxHeight }}>
          {children}
        </ScrollArea>
      </div>
    </div>
  );
};

export const ProfessionalsMultiSelect: React.FC<ProfessionalsMultiSelectProps> = ({
  selectedProfessionalIds,
  onChange,
  placeholder = "Selecionar profissionais...",
  disabled = false,
  allowAll = false
}) => {
  const { professionals, isLoading } = useProfessionals();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  // Populate options when professionals data is loaded
  useEffect(() => {
    if (professionals && professionals.length > 0) {
      const newOptions = professionals.map(professional => ({
        label: professional.name || professional.nome || '',
        value: professional.id
      }));
      
      if (allowAll) {
        newOptions.unshift({ label: "Todos", value: "all" });
      }
      
      setOptions(newOptions);
    }
  }, [professionals, allowAll]);

  // Set selected options based on selectedProfessionalIds
  useEffect(() => {
    if (options.length > 0) {
      const selected = options.filter(opt => 
        selectedProfessionalIds.includes(opt.value)
      );
      setSelectedOptions(selected);
    }
  }, [selectedProfessionalIds, options]);

  // Filter options based on input value
  useEffect(() => {
    if (options.length > 0) {
      const filtered = options.filter(opt => 
        opt.label.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedOptions.some(selected => selected.value === opt.value)
      );
      setFilteredOptions(filtered);
    }
  }, [inputValue, options, selectedOptions]);

  const handleSelect = (option: Option) => {
    // Handle "All" option
    if (option.value === "all") {
      // If "All" is selected, select all except "All" itself
      const allProfessionalIds = options
        .filter(opt => opt.value !== "all")
        .map(opt => opt.value);
      onChange(allProfessionalIds);
    } else {
      const newSelectedIds = [...selectedProfessionalIds, option.value];
      onChange(newSelectedIds);
    }
    setInputValue("");
  };

  const handleRemove = (optionToRemove: Option) => {
    const newSelectedIds = selectedProfessionalIds.filter(
      id => id !== optionToRemove.value
    );
    onChange(newSelectedIds);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleClickOutside = () => {
    setIsOpen(false);
    setInputValue("");
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center rounded-md border border-input px-3 py-1 text-sm shadow-sm">
        {selectedOptions.map(option => (
          <SelectedItem
            key={option.value}
            option={option}
            onRemove={() => handleRemove(option)}
          />
        ))}
        
        <Input
          type="text"
          className="flex-grow border-0 bg-transparent p-1 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder={selectedOptions.length > 0 ? "" : placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          disabled={disabled || isLoading}
        />
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={handleClickOutside}
        />
      )}

      <DropdownList isOpen={isOpen} maxHeight={200}>
        {isLoading ? (
          <div className="px-2 py-3 text-center text-sm text-muted-foreground">
            Carregando...
          </div>
        ) : filteredOptions.length === 0 ? (
          <div className="px-2 py-3 text-center text-sm text-muted-foreground">
            Nenhum profissional encontrado
          </div>
        ) : (
          filteredOptions.map(option => (
            <div
              key={option.value}
              className={cn(
                "cursor-pointer px-2 py-1.5 text-sm rounded-sm",
                "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))
        )}
      </DropdownList>
    </div>
  );
};

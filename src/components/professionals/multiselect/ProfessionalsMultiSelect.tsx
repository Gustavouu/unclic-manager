import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";
import { Option } from "./types";
import { SelectableItem } from "./SelectableItem";
import { SelectedItem } from "./SelectedItem";
import { DropdownList } from "./DropdownList";

interface ProfessionalsMultiSelectProps {
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  maxHeight?: number;
}

export function ProfessionalsMultiSelect({
  selectedIds = [],
  onChange,
  placeholder = "Selecionar profissionais",
  disabled = false,
  maxHeight = 300
}: ProfessionalsMultiSelectProps) {
  const [options, setOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { businessId } = useCurrentBusiness();
  
  useEffect(() => {
    if (!businessId) return;
    
    const fetchProfessionals = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('funcionarios')
          .select('id, name')
          .eq('business_id', businessId)
          .order('name', { ascending: true });
        
        if (error) throw error;
        
        setOptions(
          data.map(prof => ({
            label: prof.name,
            value: prof.id
          }))
        );
      } catch (error) {
        console.error("Error loading professionals:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfessionals();
  }, [businessId]);
  
  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchText('');
      }
    }
  };

  const handleSelect = (optionValue: string) => {
    const newSelectedIds = selectedIds.includes(optionValue)
      ? selectedIds.filter(id => id !== optionValue)
      : [...selectedIds, optionValue];
    
    onChange(newSelectedIds);
  };
  
  const handleRemove = (optionValue: string) => {
    onChange(selectedIds.filter(id => id !== optionValue));
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };
  
  const filteredOptions = searchText 
    ? options.filter(opt => 
        opt.label.toLowerCase().includes(searchText.toLowerCase())
      )
    : options;
    
  const selectedOptions = options.filter(opt => 
    selectedIds.includes(opt.value)
  );
  
  return (
    <div className="relative">
      <button
        type="button"
        className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
        onClick={handleToggle}
        disabled={disabled}
      >
        <span className="block truncate">
          {selectedOptions.length > 0
            ? selectedOptions.map(opt => opt.label).join(", ")
            : placeholder}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <svg
            className="h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M7 7l3-3 3 3m0 6l-3 3-3-3"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      <DropdownList isOpen={isOpen} maxHeight={maxHeight}>
        <div className="p-2">
          <input
            type="search"
            className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
            placeholder="Buscar..."
            onChange={handleSearch}
            value={searchText}
          />
        </div>
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">Carregando...</div>
        ) : filteredOptions.length === 0 ? (
          <div className="p-4 text-center text-gray-500">Nenhum profissional encontrado.</div>
        ) : (
          filteredOptions.map((option) => (
            <SelectableItem
              key={option.value}
              option={option}
              isSelected={selectedIds.includes(option.value)}
              onSelect={handleSelect}
            />
          ))
        )}
      </DropdownList>
      <div className="absolute top-full left-0 mt-1 flex flex-wrap gap-1">
        {selectedOptions.map((option) => (
          <SelectedItem
            key={option.value}
            option={option}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  );
}

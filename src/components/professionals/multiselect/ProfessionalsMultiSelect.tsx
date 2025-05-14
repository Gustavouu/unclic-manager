
import { useState, useEffect } from "react";
import { Professional } from "@/hooks/professionals/types";
import { DropdownList } from "./DropdownList";
import { SelectedItem } from "./SelectedItem";
import { SelectableItem } from "./SelectableItem";
import { Option } from "./types";

interface MultiSelectProps {
  options: Option[];
  selectedValues?: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  emptyMessage?: string;
}

export const MultiSelect = ({
  options,
  selectedValues = [],
  onChange,
  placeholder = "Selecione...",
  disabled = false,
  className = "",
  emptyMessage = "Nenhuma opção disponível"
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  
  // Initialize selected options from values
  useEffect(() => {
    const selected = options.filter(option => selectedValues.includes(option.value));
    setSelectedOptions(selected);
  }, [options, selectedValues]);
  
  // Filter options based on input
  const filteredOptions = options.filter(option => {
    const alreadySelected = selectedOptions.some(selected => selected.value === option.value);
    const matchesInput = option.label.toLowerCase().includes(inputValue.toLowerCase());
    return !alreadySelected && matchesInput;
  });
  
  const handleSelect = (option: Option) => {
    const newSelected = [...selectedOptions, option];
    setSelectedOptions(newSelected);
    onChange(newSelected.map(opt => opt.value));
    setInputValue("");
  };
  
  const handleRemove = (option: Option) => {
    const newSelected = selectedOptions.filter(opt => opt.value !== option.value);
    setSelectedOptions(newSelected);
    onChange(newSelected.map(opt => opt.value));
  };
  
  return (
    <div className={`relative w-full ${className}`}>
      <div
        className="flex flex-wrap gap-1 p-2 border rounded-md min-h-[38px] cursor-text"
        onClick={() => !disabled && setIsOpen(true)}
      >
        {selectedOptions.map(option => (
          <SelectedItem key={option.value} option={option} onRemove={handleRemove} />
        ))}
        
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder={selectedOptions.length === 0 ? placeholder : ""}
          className="flex-grow outline-none min-w-[120px]"
          disabled={disabled}
        />
      </div>
      
      <DropdownList isOpen={isOpen}>
        {filteredOptions.length > 0 ? (
          filteredOptions.map(option => (
            <SelectableItem 
              key={option.value}
              option={option}
              onSelect={handleSelect}
              inputValue={inputValue}
            />
          ))
        ) : (
          <div className="p-2 text-center text-gray-500">
            {inputValue ? "Nenhum resultado encontrado" : emptyMessage}
          </div>
        )}
      </DropdownList>
    </div>
  );
};

export * from "./types";

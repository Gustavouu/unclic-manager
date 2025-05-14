
import React, { useState, useEffect, useRef } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
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
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter options based on search input
  const filteredOptions = inputValue 
    ? options.filter(option => 
        option.label.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedValues.includes(option.value)
      )
    : options.filter(option => !selectedValues.includes(option.value));

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle selection
  const handleSelect = (value: string) => {
    const newValues = [...selectedValues, value];
    onChange(newValues);
    setInputValue("");
  };

  // Handle removing a selected value
  const handleRemove = (valueToRemove: string) => {
    const newValues = selectedValues.filter(value => value !== valueToRemove);
    onChange(newValues);
  };

  const DropdownTrigger = ({ children }: { children: React.ReactNode }) => (
    <div 
      className={cn(
        "flex min-h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-default",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-accent-foreground",
        className
      )}
      onClick={() => !disabled && setIsOpen(!isOpen)}
    >
      {children}
      <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0" />
    </div>
  );

  const DropdownList = ({ children }: { children: React.ReactNode }) => (
    <div
      ref={containerRef}
      className={cn(
        "absolute z-50 w-full mt-1 rounded-md border border-input bg-popover shadow-md",
        !isOpen && "hidden"
      )}
    >
      <Command>
        <CommandInput 
          placeholder="Buscar..." 
          value={inputValue}
          onValueChange={setInputValue}
          className="h-9"
        />
        <CommandGroup className="max-h-64 overflow-auto">
          {children}
        </CommandGroup>
      </Command>
    </div>
  );

  return (
    <div className="relative">
      <DropdownTrigger>
        <div className="flex flex-wrap gap-1 grow">
          {selectedValues.length === 0 && (
            <div className="text-muted-foreground">{placeholder}</div>
          )}
          
          {selectedValues.length > 0 && selectedValues.map(value => {
            const option = options.find(opt => opt.value === value);
            return (
              <Badge 
                key={value} 
                variant="secondary" 
                className="flex items-center gap-1"
              >
                {option?.label || value}
                {!disabled && (
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(value);
                    }}
                  />
                )}
              </Badge>
            );
          })}
        </div>
      </DropdownTrigger>
      
      <DropdownList>
        {filteredOptions.length > 0 ? (
          filteredOptions.map(option => (
            <CommandItem
              key={option.value}
              onSelect={() => handleSelect(option.value)}
              className="flex items-center justify-between cursor-pointer hover:bg-accent"
            >
              <span>{option.label}</span>
              {selectedValues.includes(option.value) && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </CommandItem>
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

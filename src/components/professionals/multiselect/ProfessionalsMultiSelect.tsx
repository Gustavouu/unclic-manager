
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, X } from 'lucide-react';
import { Option } from './types';
import { SelectedItem } from './SelectedItem';
import { SelectableItem } from './SelectableItem';
import { DropdownList } from './DropdownList';

interface ProfessionalsMultiSelectProps {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
}

export const ProfessionalsMultiSelect = ({
  options,
  selectedValues,
  onChange,
  placeholder = "Select options...",
  disabled = false,
  label,
}: ProfessionalsMultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Create a map of selected options for quick lookup
  const selectedValuesSet = new Set(selectedValues);

  // Filter options based on search query and already selected options
  const filteredOptions = options.filter(option => {
    const matchesSearch = !searchQuery || 
      option.label.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Only show options that are not already selected
    const notAlreadySelected = !selectedValuesSet.has(option.value);
    
    return matchesSearch && notAlreadySelected;
  });

  // Get the full option objects for selected values
  const selectedOptions = options.filter(option => selectedValuesSet.has(option.value));

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    }
  };

  const handleSelectOption = (option: Option) => {
    onChange([...selectedValues, option.value]);
    setSearchQuery('');
  };

  const handleRemoveOption = (valueToRemove: string) => {
    onChange(selectedValues.filter(value => value !== valueToRemove));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <div className="mb-2 text-sm font-medium">{label}</div>
      )}
      
      <div 
        className={`
          border rounded-md w-full p-1 min-h-10 flex flex-wrap items-center gap-1
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'border-primary' : 'border-input'}
        `}
        onClick={toggleDropdown}
      >
        {/* Selected options */}
        {selectedOptions.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-1 p-1">
              {selectedOptions.map((option) => (
                <SelectedItem 
                  key={option.value}
                  option={option}
                  onRemove={() => handleRemoveOption(option.value)}
                />
              ))}
            </div>
            
            {/* Clear all button */}
            {selectedOptions.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-auto h-7 px-2 text-muted-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearAll();
                }}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </>
        ) : (
          <div className="px-2 py-1 text-muted-foreground">
            {placeholder}
          </div>
        )}
        
        <div className="ml-auto flex items-center self-stretch pl-1">
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <DropdownList maxHeight={300} isOpen={isOpen}>
          {/* Search input */}
          <div className="p-2 sticky top-0 bg-white z-10 border-b">
            <input
              ref={inputRef}
              className="border rounded p-2 w-full text-sm bg-background"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Options list */}
          <div className="py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <SelectableItem
                  key={option.value}
                  option={option}
                  onSelect={() => handleSelectOption(option)}
                />
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                No options found
              </div>
            )}
          </div>
        </DropdownList>
      )}
    </div>
  );
};

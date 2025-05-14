
import React, { useRef, useEffect } from 'react';
import { SelectableItem } from './SelectableItem';
import { Option } from './types';
import { Search } from 'lucide-react';

interface DropdownListProps {
  options: Option[];
  selectedValues: string[];
  onSelect: (option: Option) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClose: () => void;
}

export const DropdownList = ({
  options,
  selectedValues,
  onSelect,
  searchTerm,
  onSearchChange,
  onClose
}: DropdownListProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  
  return (
    <div 
      ref={dropdownRef}
      className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
    >
      <div className="sticky top-0 bg-white p-2 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            className="w-full pl-8 pr-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      
      <div className="py-1">
        {options.length === 0 ? (
          <div className="text-gray-500 text-sm px-3 py-2">Nenhum resultado encontrado</div>
        ) : (
          options.map(option => (
            <SelectableItem
              key={option.value}
              label={option.label}
              isSelected={selectedValues.includes(option.value)}
              onClick={() => onSelect(option)}
            />
          ))
        )}
      </div>
    </div>
  );
};

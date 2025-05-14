
import { useState } from 'react';
import { Option } from './types';
import { SelectableItem } from './SelectableItem';
import { SelectedItem } from './SelectedItem';
import { DropdownList } from './DropdownList';

interface ProfessionalsMultiSelectProps {
  options: Option[];
  selectedOptions?: Option[];
  selectedValues?: string[];
  onChange: (selectedOptions: Option[] | string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const ProfessionalsMultiSelect = ({
  options,
  selectedOptions = [],
  selectedValues = [],
  onChange,
  placeholder = 'Selecione...',
  disabled = false
}: ProfessionalsMultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Convert selectedValues array to selectedOptions if provided
  const effectiveSelectedOptions = selectedOptions.length > 0 
    ? selectedOptions 
    : selectedValues.map(value => {
        const option = options.find(opt => opt.value === value);
        return option || { value, label: value };
      });

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm('');
    }
  };

  const handleOptionSelect = (option: Option) => {
    const isSelected = effectiveSelectedOptions.some(item => item.value === option.value);
    
    let newSelection: Option[];
    if (isSelected) {
      newSelection = effectiveSelectedOptions.filter(item => item.value !== option.value);
    } else {
      newSelection = [...effectiveSelectedOptions, option];
    }
    
    // If the original input was string[], return string[]
    if (selectedValues.length > 0 && selectedOptions.length === 0) {
      onChange(newSelection.map(opt => opt.value));
    } else {
      onChange(newSelection);
    }
  };

  const handleRemoveOption = (optionValue: string) => {
    const newSelection = effectiveSelectedOptions.filter(item => item.value !== optionValue);
    
    // If the original input was string[], return string[]
    if (selectedValues.length > 0 && selectedOptions.length === 0) {
      onChange(newSelection.map(opt => opt.value));
    } else {
      onChange(newSelection);
    }
  };

  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <div 
        className={`border rounded-md px-2 py-1.5 flex flex-wrap gap-1 min-h-[38px] cursor-pointer ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
        }`}
        onClick={toggleDropdown}
      >
        {effectiveSelectedOptions.length === 0 && (
          <div className="text-gray-400 px-1 py-0.5">{placeholder}</div>
        )}
        
        {effectiveSelectedOptions.map(option => (
          <SelectedItem 
            key={option.value}
            label={option.label}
            onRemove={() => handleRemoveOption(option.value)}
            disabled={disabled}
          />
        ))}
      </div>

      {isOpen && (
        <DropdownList
          options={filteredOptions}
          selectedValues={effectiveSelectedOptions.map(o => o.value)}
          onSelect={handleOptionSelect}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

// Export as MultiSelect for backward compatibility
export const MultiSelect = ProfessionalsMultiSelect;

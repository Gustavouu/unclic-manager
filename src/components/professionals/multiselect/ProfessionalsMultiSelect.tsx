
import { useState } from 'react';
import { Option } from './types';
import { SelectableItem } from './SelectableItem';
import { SelectedItem } from './SelectedItem';
import { DropdownList } from './DropdownList';

interface ProfessionalsMultiSelectProps {
  options: Option[];
  selectedOptions: Option[];
  onChange: (selectedOptions: Option[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const ProfessionalsMultiSelect = ({
  options,
  selectedOptions,
  onChange,
  placeholder = 'Selecione...',
  disabled = false
}: ProfessionalsMultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm('');
    }
  };

  const handleOptionSelect = (option: Option) => {
    const isSelected = selectedOptions.some(item => item.value === option.value);
    
    if (isSelected) {
      onChange(selectedOptions.filter(item => item.value !== option.value));
    } else {
      onChange([...selectedOptions, option]);
    }
  };

  const handleRemoveOption = (optionValue: string) => {
    onChange(selectedOptions.filter(item => item.value !== optionValue));
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
        {selectedOptions.length === 0 && (
          <div className="text-gray-400 px-1 py-0.5">{placeholder}</div>
        )}
        
        {selectedOptions.map(option => (
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
          selectedValues={selectedOptions.map(o => o.value)}
          onSelect={handleOptionSelect}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

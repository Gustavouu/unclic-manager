
import React from 'react';
import { Check } from 'lucide-react';

interface SelectableItemProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export const SelectableItem = ({ label, isSelected, onClick }: SelectableItemProps) => {
  return (
    <div
      className={`px-3 py-1.5 flex items-center cursor-pointer hover:bg-gray-100 ${
        isSelected ? 'bg-gray-50' : ''
      }`}
      onClick={onClick}
    >
      <div className="mr-2 flex-shrink-0">
        <div className={`w-4 h-4 border rounded flex items-center justify-center ${
          isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
        }`}>
          {isSelected && <Check className="h-3 w-3 text-white" />}
        </div>
      </div>
      <div className="truncate">{label}</div>
    </div>
  );
};

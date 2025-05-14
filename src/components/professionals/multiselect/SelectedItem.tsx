
import React from 'react';
import { X } from 'lucide-react';

interface SelectedItemProps {
  label: string;
  onRemove: () => void;
  disabled?: boolean;
}

export const SelectedItem = ({ label, onRemove, disabled = false }: SelectedItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (!disabled) {
      e.stopPropagation();
      onRemove();
    }
  };

  return (
    <div className={`flex items-center bg-blue-50 text-blue-700 text-sm rounded px-2 py-0.5 ${
      disabled ? 'opacity-70' : ''
    }`}>
      <span className="truncate max-w-[150px]">{label}</span>
      {!disabled && (
        <button 
          onClick={handleClick}
          className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
          type="button"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};

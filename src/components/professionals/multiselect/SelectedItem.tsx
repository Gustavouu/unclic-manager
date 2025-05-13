
import React from 'react';
import { X } from 'lucide-react';
import { Option } from './types';

export interface SelectedItemProps {
  option: Option;
  onRemove: (optionValue: string) => void;
}

export const SelectedItem = ({ option, onRemove }: SelectedItemProps) => {
  return (
    <div 
      className="flex items-center gap-1 bg-primary/10 text-primary text-sm px-2 py-1 rounded-sm"
    >
      <span>{option.label}</span>
      <button
        type="button"
        className="text-primary hover:bg-primary/20 rounded-sm"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(option.value);
        }}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
};

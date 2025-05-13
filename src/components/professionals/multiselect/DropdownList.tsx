
import React from "react";
import { Option } from "./types";

export interface DropdownListProps {
  children?: React.ReactNode;
  maxHeight?: number;
  isOpen: boolean;
  
  // Add the additional props that are being passed from MultiSelect.tsx
  open?: boolean;
  options?: Option[];
  onSelect?: (selectedOption: Option) => void;
  inputValue?: string;
  emptyMessage?: string;
}

export const DropdownList = ({ 
  children,
  maxHeight = 200,
  isOpen,
  open, // Backward compatibility
  options, // May be used in future versions
  onSelect, // May be used in future versions
  inputValue, // May be used in future versions
  emptyMessage // May be used in future versions
}: DropdownListProps) => {
  // Use either isOpen or open for backward compatibility
  if (!isOpen && !open) return null;

  return (
    <div 
      className="absolute top-full left-0 right-0 mt-1 rounded-md border bg-popover shadow-md z-50"
      style={{ maxHeight: `${maxHeight}px`, overflowY: 'auto' }}
    >
      {children}
    </div>
  );
};


import React from "react";
import { Option } from "./types";

export interface DropdownListProps {
  children: React.ReactNode;
  maxHeight?: number;
  isOpen: boolean;
}

export const DropdownList = ({ 
  children,
  maxHeight = 200,
  isOpen
}: DropdownListProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="absolute top-full left-0 right-0 mt-1 rounded-md border bg-popover shadow-md z-50"
      style={{ maxHeight: `${maxHeight}px`, overflowY: 'auto' }}
    >
      {children}
    </div>
  );
};

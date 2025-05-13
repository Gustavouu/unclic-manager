
import React from 'react';

export interface DropdownListProps {
  maxHeight: number;
  isOpen: boolean;
  children: React.ReactNode;
}

export const DropdownList = ({ children, isOpen, maxHeight }: DropdownListProps) => {
  return (
    <div
      className={`
        absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg overflow-hidden
        ${isOpen ? 'opacity-100' : 'opacity-0 invisible'}
        transition-all duration-200
      `}
      style={{ maxHeight: `${maxHeight}px` }}
    >
      <div className="overflow-y-auto" style={{ maxHeight: `${maxHeight}px` }}>
        {children}
      </div>
    </div>
  );
};

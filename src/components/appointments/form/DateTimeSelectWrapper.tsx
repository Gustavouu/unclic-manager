
import React from 'react';
import { DateTimeSelect } from './DateTimeSelect';
import { cn } from '@/lib/utils';

interface DateTimeSelectWrapperProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  error?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function DateTimeSelectWrapper({
  value,
  onChange,
  className,
  error,
  label,
  placeholder,
  disabled
}: DateTimeSelectWrapperProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <DateTimeSelect
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

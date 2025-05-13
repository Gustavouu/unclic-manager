
import React, { ReactElement } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  startIcon?: string;
  required?: boolean;
  error?: string;
  type?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  touched?: boolean;
  rightElement?: ReactElement; // Add support for right element
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  startIcon,
  required = false,
  error,
  type = "text",
  onBlur,
  onFocus,
  touched,
  rightElement
}) => {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      <div className="relative">
        {startIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {/* Render icon based on name */}
            <span className="text-gray-500">{startIcon}</span>
          </div>
        )}
        
        <div className="relative">
          <Input
            id={id}
            className={`${startIcon ? "pl-10" : ""} ${
              error && touched ? "border-red-300 focus-visible:ring-red-500" : ""
            }`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            type={type}
            onBlur={onBlur}
            onFocus={onFocus}
          />
          
          {rightElement && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightElement}
            </div>
          )}
        </div>
      </div>
      
      {error && touched && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

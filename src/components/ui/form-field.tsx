
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | boolean | null;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
  maxLength?: number;
  description?: string;
  helper?: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  touched = false,
  required = false,
  disabled = false,
  placeholder = "",
  type = "text",
  className = "",
  maxLength,
  description,
  helper
}) => {
  const showError = error && touched;
  const errorMessage = typeof error === 'string' ? error : '';
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between">
        <Label 
          htmlFor={id}
          className={cn(showError ? "text-destructive" : "")}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </div>
      
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(showError ? "border-destructive" : "")}
        maxLength={maxLength}
      />
      
      {showError && errorMessage && (
        <p className="text-xs text-destructive">{errorMessage}</p>
      )}
      
      {helper && (
        <div className="text-xs text-muted-foreground">
          {helper}
        </div>
      )}
    </div>
  );
};

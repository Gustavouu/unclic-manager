
import React from "react";
import { Input } from "./input";
import { Label } from "./label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  id: string;
  label: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  touched?: boolean;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export const FormField = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  touched,
  required = false,
  className,
  disabled = false,
}: FormFieldProps) => {
  const hasError = touched && error;
  
  return (
    <div className={cn("space-y-2", className)}>
      <Label 
        htmlFor={id} 
        className={hasError ? "text-destructive" : ""}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={hasError ? "border-destructive" : ""}
        disabled={disabled}
      />
      
      {hasError && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}
    </div>
  );
};

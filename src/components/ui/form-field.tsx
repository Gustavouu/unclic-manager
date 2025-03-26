
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  touched?: boolean;
  required?: boolean;
  className?: string;
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
}: FormFieldProps) => {
  const showError = touched && error;
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between">
        <Label htmlFor={id} className={cn(showError && "text-destructive")}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      </div>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(showError && "border-destructive")}
      />
      {showError && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}
    </div>
  );
};

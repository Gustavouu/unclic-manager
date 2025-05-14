
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange?: (file: File) => void;
  onRemove?: () => void;
  disabled?: boolean;
  maxSize?: number;
  aspectRatio?: "square" | "16:9" | "4:3";
  className?: string;
  id?: string;
  imageUrl?: string | null;
  onImageChange?: (file: File | null, imageUrl: string | null) => void;
  icon?: React.ReactNode;
  label?: string;
  subLabel?: string;
  width?: string;
  height?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
  disabled = false,
  maxSize = 5, // 5MB
  aspectRatio = "square",
  className,
  id,
  imageUrl = null,
  onImageChange,
  icon = <Upload className="w-8 h-8 text-muted-foreground mb-2" />,
  label = "Clique para fazer upload",
  subLabel,
  width = "w-full",
  height,
}) => {
  // Use value or imageUrl
  const imageValue = value || imageUrl;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize * 1024 * 1024) {
      alert(`O arquivo deve ter no máximo ${maxSize}MB`);
      return;
    }

    // Use onImageChange if provided, otherwise use onChange
    if (onImageChange) {
      // Convert file to data URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        onImageChange(file, result);
      };
      reader.readAsDataURL(file);
    } else if (onChange) {
      onChange(file);
    }
    
    // Reset input value to allow selecting the same file again
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    if (disabled) return;
    if (onImageChange) {
      onImageChange(null, null);
    }
    if (onRemove) {
      onRemove();
    }
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "16:9":
        return "aspect-video";
      case "4:3":
        return "aspect-4/3";
      default:
        return "aspect-square";
    }
  };

  return (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled}
        id={id}
      />
      
      {!imageValue ? (
        <div 
          onClick={handleClick}
          className={cn(
            "flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4 cursor-pointer hover:border-primary/70 transition-colors",
            getAspectRatioClass(),
            width,
            height,
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {icon}
          <p className="text-sm text-center text-muted-foreground">
            {label}
            {subLabel && (
              <span className="block text-xs mt-1">
                {subLabel}
              </span>
            )}
          </p>
        </div>
      ) : (
        <div className={cn("relative", width)}>
          <img 
            src={imageValue} 
            alt="Preview" 
            className={cn("rounded-md object-cover w-full", height || getAspectRatioClass())}
          />
          {onRemove && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className={cn(
                "absolute top-2 right-2 bg-background rounded-full p-1 shadow hover:bg-accent transition-colors",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
      
      {imageValue && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClick}
          disabled={disabled}
          className="mt-2"
        >
          <Upload className="w-4 h-4 mr-2" />
          Alterar Imagem
        </Button>
      )}
    </div>
  );
};


import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (file: File) => void;
  onRemove?: () => void;
  disabled?: boolean;
  maxSize?: number;
  aspectRatio?: "square" | "16:9" | "4:3";
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
  disabled = false,
  maxSize = 5, // 5MB
  aspectRatio = "square",
  className,
}) => {
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

    onChange(file);
    
    // Reset input value to allow selecting the same file again
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    if (disabled) return;
    onRemove?.();
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
      />
      
      {!value ? (
        <div 
          onClick={handleClick}
          className={cn(
            "flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4 w-full cursor-pointer hover:border-primary/70 transition-colors",
            getAspectRatioClass(),
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
          <p className="text-sm text-center text-muted-foreground">
            Clique para fazer upload
            <span className="block text-xs">
              Máximo {maxSize}MB
            </span>
          </p>
        </div>
      ) : (
        <div className="relative w-full">
          <img 
            src={value} 
            alt="Preview" 
            className={cn("rounded-md object-cover w-full", getAspectRatioClass())}
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
      
      {value && (
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

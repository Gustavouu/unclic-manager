
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image } from "lucide-react";

interface ImageUploadFixedProps {
  id: string;
  imageUrl?: string | null;
  onChange: (imageUrl: string | null) => void;
  icon?: React.ReactNode;
  label?: string;
  subLabel?: string;
  width?: string;
  height?: string;
  className?: string;
}

export const ImageUploadFixed: React.FC<ImageUploadFixedProps> = ({
  id,
  imageUrl = null,
  onChange,
  icon,
  label,
  subLabel,
  width = "150px",
  height = "150px",
  className = ""
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    setLoading(true);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      onChange(result);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const styles = {
    width: width,
    height: height,
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        style={styles}
      >
        <input 
          ref={inputRef}
          type="file" 
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
          id={id}
        />
        
        {imageUrl ? (
          <div className="absolute inset-0 w-full h-full group">
            <img
              src={imageUrl}
              alt="Uploaded"
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleClick}
                  className="bg-white text-black hover:bg-gray-100"
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            {loading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            ) : (
              <>
                <div className="rounded-full bg-gray-100 p-2 mb-2">
                  {icon || <Image className="h-6 w-6 text-gray-500" />}
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {label || "Clique ou arraste uma imagem"}
                </p>
                {subLabel && (
                  <p className="text-xs text-gray-500 mt-1">
                    {subLabel}
                  </p>
                )}
                {!subLabel && (
                  <p className="text-xs text-gray-500 mt-1">
                    SVG, PNG ou JPG (max. 2MB)
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

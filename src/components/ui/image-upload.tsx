
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (file: File) => void;
  className?: string;
  loading?: boolean;
  id?: string;
  imageUrl?: string | null;
  onImageChange?: (file: File, imageUrl: string) => void;
  icon?: React.ReactNode;
  label?: string;
  subLabel?: string;
  width?: string;
  height?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  value, 
  onChange, 
  className = "", 
  loading = false,
  id,
  imageUrl = null,
  onImageChange,
  icon,
  label,
  subLabel,
  width = "150px",
  height = "150px"
}) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Use value or imageUrl (priority to value if both are provided)
  const displayUrl = value || imageUrl || "";
  
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
    if (onImageChange) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        onImageChange(file, result);
      };
      reader.readAsDataURL(file);
    }
    
    if (onChange) {
      onChange(file);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };
  
  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  
  const styles = {
    width: width,
    height: height,
  };
  
  return (
    <div
      id={id}
      className={`relative border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer ${
        dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
      } ${className}`}
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
        onChange={handleChange}
        className="hidden"
      />
      
      {displayUrl ? (
        <div className="absolute inset-0 w-full h-full">
          <img
            src={displayUrl}
            alt="Uploaded image"
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
            <span className="text-white text-sm">Clique para alterar</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-4 text-center">
          {loading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          ) : (
            <>
              <div className="rounded-full bg-gray-100 p-2 mb-2">
                {icon ? (
                  icon
                ) : (
                  <Upload className="h-6 w-6 text-gray-500" />
                )}
              </div>
              <p className="text-sm font-medium text-gray-700">
                {label || "Clique ou arraste e solte"}
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
  );
};

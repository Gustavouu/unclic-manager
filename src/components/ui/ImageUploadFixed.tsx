
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image, Loader2 } from "lucide-react";
import { uploadImageToStorage } from "@/utils/storageUtils";
import { toast } from "sonner";

interface ImageUploadFixedProps {
  value?: string;
  onChange: (url: string | null) => void;
  className?: string;
  loading?: boolean;
  id?: string;
  imageUrl?: string | null;
  icon?: React.ReactNode;
  label?: string;
  subLabel?: string;
  width?: string;
  height?: string;
}

export const ImageUploadFixed: React.FC<ImageUploadFixedProps> = ({ 
  value, 
  onChange, 
  className = "", 
  loading = false,
  id,
  imageUrl = null,
  icon,
  label,
  subLabel,
  width = "150px",
  height = "150px"
}) => {
  const [uploading, setUploading] = useState(false);
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
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('Arquivo muito grande. Máximo 10MB permitido');
      return;
    }

    setUploading(true);
    
    try {
      const imageUrl = await uploadImageToStorage(file);
      
      if (imageUrl) {
        onChange(imageUrl);
        toast.success('Imagem enviada com sucesso!');
      } else {
        toast.error('Erro ao enviar imagem');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Erro inesperado ao enviar imagem');
    } finally {
      setUploading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
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
        disabled={loading || uploading}
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
          {loading || uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
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
                  PNG, JPG ou GIF (max. 10MB)
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};


import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { revokeFilePreview, fileToBase64 } from "@/contexts/onboarding/utils";

interface ImageUploadProps {
  imageUrl: string | null;
  onImageChange: (file: File | null, previewUrl: string | null, base64Data?: string) => void;
  imageName?: string;
  height?: string;
  width?: string;
  icon: React.ReactNode;
  label: string;
  subLabel?: string;
  id: string;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  imageUrl,
  onImageChange,
  height = "h-32",
  width = "w-32",
  icon,
  label,
  subLabel,
  id,
  className = "",
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  
  // Initialize preview from imageUrl
  useEffect(() => {
    setPreview(imageUrl);
  }, [imageUrl]);
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      // Clean up old URL if exists
      if (preview && preview.startsWith('blob:')) {
        revokeFilePreview(preview);
      }
      
      // Create a preview URL
      const newPreviewUrl = URL.createObjectURL(file);
      setPreview(newPreviewUrl);
      
      // Convert to base64 for storage
      fileToBase64(file).then(base64Data => {
        onImageChange(file, newPreviewUrl, base64Data);
      }).catch(err => {
        console.error(`Error converting ${id} to base64:`, err);
        // Still update with the file even if base64 conversion fails
        onImageChange(file, newPreviewUrl);
      });
    }
  };
  
  const handleRemoveImage = () => {
    // Clean up URL if exists
    if (preview && preview.startsWith('blob:')) {
      revokeFilePreview(preview);
    }
    
    onImageChange(null, null);
    setPreview(null);
  };
  
  return (
    <div className={className}>
      {preview ? (
        <div className={`relative ${width} ${height} rounded-md overflow-hidden border border-border`}>
          <img 
            src={preview} 
            alt={`${label} Preview`} 
            className="w-full h-full object-cover"
          />
          <Button 
            variant="destructive" 
            size="sm" 
            className="absolute top-1 right-1 h-6 w-6 p-0"
            onClick={handleRemoveImage}
          >
            ✕
          </Button>
        </div>
      ) : (
        <label 
          htmlFor={id} 
          className={`flex items-center justify-center border border-dashed border-border rounded-md p-6 ${width} ${height} cursor-pointer`}
        >
          <div className="flex flex-col items-center">
            {icon}
            <span className="text-xs text-muted-foreground text-center">
              {label}
            </span>
            {subLabel && (
              <span className="text-xs text-muted-foreground text-center">
                {subLabel}
              </span>
            )}
          </div>
        </label>
      )}
      
      <Input 
        id={id} 
        type="file" 
        accept="image/*"
        className="hidden" 
        onChange={handleImageChange}
      />
    </div>
  );
};

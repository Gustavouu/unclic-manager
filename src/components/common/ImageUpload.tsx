
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { revokeFilePreview } from "@/contexts/onboarding/utils/fileUtils";

interface ImageUploadProps {
  imageUrl: string | null;
  onImageChange: (file: File | null, previewUrl: string | null) => void;
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
  const [preview, setPreview] = useState<string | null>(imageUrl);

  // Update preview when imageUrl changes
  useEffect(() => {
    // Only update preview if it's different from current to prevent unnecessary re-renders
    if (imageUrl !== preview) {
      setPreview(imageUrl);
    }
  }, [imageUrl]);
  
  // Cleanup preview URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:') && preview !== imageUrl) {
        revokeFilePreview(preview);
      }
    };
  }, [preview, imageUrl]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    
    // Clean up old preview URL if it exists and is different from imageUrl
    if (preview && preview.startsWith('blob:') && preview !== imageUrl) {
      revokeFilePreview(preview);
    }
    
    if (file) {
      // Create a new preview URL
      const newPreviewUrl = URL.createObjectURL(file);
      setPreview(newPreviewUrl);
      onImageChange(file, newPreviewUrl);
    } else {
      setPreview(null);
      onImageChange(null, null);
    }
  };
  
  const handleRemoveImage = () => {
    // Clean up URL if exists and is different from imageUrl
    if (preview && preview.startsWith('blob:') && preview !== imageUrl) {
      revokeFilePreview(preview);
    }
    
    setPreview(null);
    onImageChange(null, null);
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

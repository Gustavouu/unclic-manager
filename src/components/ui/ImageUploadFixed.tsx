
import React, { useRef } from 'react';
import { Button } from './button';
import { Card } from './card';
import { cn } from '@/lib/utils';
import { uploadImageToStorage } from '@/utils/storageUtils';

interface ImageUploadFixedProps {
  id: string;
  imageUrl?: string | null;
  onChange: (url: string | null) => void;
  icon: React.ReactNode;
  label: string;
  subLabel?: string;
  width: string;
  height: string;
  className?: string;
}

export const ImageUploadFixed: React.FC<ImageUploadFixedProps> = ({
  id,
  imageUrl,
  onChange,
  icon,
  label,
  subLabel,
  width,
  height,
  className
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImageToStorage(file);
      onChange(url);
    } catch (error) {
      console.error('Error uploading image:', error);
      onChange(null);
    }
  };

  const handleRemove = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card 
      className={cn("relative overflow-hidden", className)}
      style={{ width, height }}
    >
      {imageUrl ? (
        <div className="relative w-full h-full">
          <img
            src={imageUrl}
            alt={label}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Alterar
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
              >
                Remover
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
             onClick={() => fileInputRef.current?.click()}>
          {icon}
          <span className="mt-2 text-sm font-medium">{label}</span>
          {subLabel && (
            <span className="mt-1 text-xs text-muted-foreground text-center">{subLabel}</span>
          )}
        </div>
      )}
      
      <input
        ref={fileInputRef}
        id={id}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </Card>
  );
};

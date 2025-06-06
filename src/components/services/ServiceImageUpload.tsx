
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, ImageIcon } from 'lucide-react';
import { ServiceImageService } from '@/services/service/serviceImageService';
import { toast } from 'sonner';

interface ServiceImageUploadProps {
  currentImageUrl?: string;
  onImageChange: (imageUrl: string | null) => void;
  serviceId?: string;
  disabled?: boolean;
}

export const ServiceImageUpload: React.FC<ServiceImageUploadProps> = ({
  currentImageUrl,
  onImageChange,
  serviceId,
  disabled = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const serviceImageService = ServiceImageService.getInstance();

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const tempServiceId = serviceId || `temp-${Date.now()}`;
      const imageUrl = await serviceImageService.uploadImage(file, tempServiceId);
      onImageChange(imageUrl);
      toast.success('Imagem enviada com sucesso!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erro ao enviar imagem');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleRemoveImage = async () => {
    if (currentImageUrl) {
      try {
        await serviceImageService.deleteImage(currentImageUrl);
        onImageChange(null);
        toast.success('Imagem removida com sucesso!');
      } catch (error) {
        console.error('Error removing image:', error);
        toast.error('Erro ao remover imagem');
      }
    } else {
      onImageChange(null);
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="service-image">Imagem do Serviço</Label>
      
      {currentImageUrl ? (
        <div className="relative">
          <img
            src={currentImageUrl}
            alt="Imagem do serviço"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
            disabled={disabled || isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-gray-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Arraste uma imagem aqui ou clique para selecionar
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF até 5MB
            </p>
          </div>
          
          <Input
            id="service-image"
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            disabled={disabled || isUploading}
            className="hidden"
          />
          
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => document.getElementById('service-image')?.click()}
            disabled={disabled || isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Enviando...' : 'Selecionar Imagem'}
          </Button>
        </div>
      )}
    </div>
  );
};

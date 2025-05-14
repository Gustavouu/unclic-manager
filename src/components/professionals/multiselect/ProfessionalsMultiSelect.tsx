
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProfessionals } from '@/hooks/professionals';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckIcon, UserIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Professional } from '@/hooks/professionals/types';
import { ProfessionalsMultiSelectProps } from './types';

export const ProfessionalsMultiSelect: React.FC<ProfessionalsMultiSelectProps> = ({
  selectedProfessionals = [],
  onSelectProfessional,
  onRemoveProfessional,
  disabled = false,
  className,
}) => {
  const { professionals, loading } = useProfessionals({ activeOnly: true });

  if (loading) {
    return <Skeleton className="h-10 w-full" />;
  }

  const handleSelect = (professionalId: string) => {
    const professional = professionals.find(p => p.id === professionalId);
    if (professional && onSelectProfessional) {
      onSelectProfessional(professional);
    }
  };

  const handleRemove = (e: React.MouseEvent, professionalId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemoveProfessional) {
      onRemoveProfessional(professionalId);
    }
  };

  const availableProfessionals = professionals.filter(
    p => !selectedProfessionals.some(sp => sp.id === p.id)
  );

  return (
    <div className={cn("space-y-2", className)}>
      {selectedProfessionals.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedProfessionals.map((professional) => (
            <Badge 
              key={professional.id} 
              variant="secondary"
              className="flex items-center gap-1 py-1.5"
            >
              {professional.photo_url ? (
                <img 
                  src={professional.photo_url} 
                  alt={professional.name} 
                  className="w-4 h-4 rounded-full"
                />
              ) : (
                <UserIcon className="w-3 h-3" />
              )}
              {professional.name}
              {!disabled && (
                <button 
                  onClick={(e) => handleRemove(e, professional.id)} 
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  &times;
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}
      
      {availableProfessionals.length > 0 && (
        <Select
          disabled={disabled || availableProfessionals.length === 0}
          onValueChange={handleSelect}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecionar profissional" />
          </SelectTrigger>
          <SelectContent>
            {availableProfessionals.map((professional) => (
              <SelectItem 
                key={professional.id} 
                value={professional.id}
                className="flex items-center gap-2"
              >
                <div className="flex items-center gap-2">
                  {professional.photo_url ? (
                    <img 
                      src={professional.photo_url} 
                      alt={professional.name} 
                      className="w-5 h-5 rounded-full"
                    />
                  ) : (
                    <UserIcon className="w-4 h-4" />
                  )}
                  {professional.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

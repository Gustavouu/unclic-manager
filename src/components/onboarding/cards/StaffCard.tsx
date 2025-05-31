
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Mail, Phone } from 'lucide-react';
import { StaffData } from '@/contexts/onboarding/types';

interface StaffCardProps {
  staff: StaffData;
  onEdit: () => void;
  onRemove: () => void;
}

export const StaffCard: React.FC<StaffCardProps> = ({ staff, onEdit, onRemove }) => {
  const displayName = staff.nome || staff.name || 'Sem nome';
  const displayRole = staff.cargo || staff.role || 'Funcionário';
  const displaySpecialties = staff.especializacoes || staff.specialties || [];
  const displayEmail = staff.email || '';
  const displayPhone = staff.phone || '';

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={staff.foto_url || staff.photo_url} alt={displayName} />
              <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{displayName}</h3>
              <p className="text-sm text-muted-foreground">{displayRole}</p>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayEmail && (
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{displayEmail}</span>
          </div>
        )}
        
        {displayPhone && (
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{displayPhone}</span>
          </div>
        )}

        {displaySpecialties.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Especializações:</p>
            <div className="flex flex-wrap gap-1">
              {displaySpecialties.map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {staff.bio && (
          <div>
            <p className="text-sm font-medium mb-1">Biografia:</p>
            <p className="text-sm text-muted-foreground">{staff.bio}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

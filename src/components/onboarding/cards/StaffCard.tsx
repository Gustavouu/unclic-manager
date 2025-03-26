
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Mail, Phone, Edit, Trash2 } from "lucide-react";
import { StaffData } from "@/contexts/OnboardingContext";
import { Badge } from "@/components/ui/badge";

interface StaffCardProps {
  staff: StaffData;
  onEdit: () => void;
  onRemove: () => void;
}

export const StaffCard: React.FC<StaffCardProps> = ({ staff, onEdit, onRemove }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pt-6 flex-grow">
        <h3 className="font-medium text-lg mb-1">{staff.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{staff.role}</p>
        
        <div className="space-y-2">
          {staff.email && (
            <div className="flex items-center text-muted-foreground">
              <Mail className="h-4 w-4 mr-2" />
              <span className="text-sm truncate">{staff.email}</span>
            </div>
          )}
          
          {staff.phone && (
            <div className="flex items-center text-muted-foreground">
              <Phone className="h-4 w-4 mr-2" />
              <span className="text-sm">{staff.phone}</span>
            </div>
          )}
        </div>
        
        {staff.specialties && staff.specialties.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center mb-2">
              <BadgeCheck className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Especialidades</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {staff.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

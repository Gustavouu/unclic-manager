
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OnboardingOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  recommended?: boolean;
  comingSoon?: boolean;
}

export const OnboardingOption: React.FC<OnboardingOptionProps> = ({
  icon,
  title,
  description,
  onClick,
  recommended = false,
  comingSoon = false
}) => {
  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer border-2",
        recommended ? "border-primary" : "border-border"
      )}
      onClick={!comingSoon ? onClick : undefined}
    >
      {recommended && (
        <Badge className="absolute top-3 right-3 bg-primary text-white">
          Recomendado
        </Badge>
      )}
      
      {comingSoon && (
        <Badge className="absolute top-3 right-3 bg-amber-500 text-white">
          Em breve
        </Badge>
      )}
      
      <CardContent className="p-6 text-center">
        <div className={cn(
          "mx-auto mb-4 p-3 rounded-full w-16 h-16 flex items-center justify-center",
          recommended ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        )}>
          {icon}
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        
        <Button 
          variant={recommended ? "default" : "outline"} 
          className="w-full"
          disabled={comingSoon}
          onClick={(e) => {
            e.stopPropagation();
            if (!comingSoon) onClick();
          }}
        >
          {comingSoon ? "Em breve" : "Começar"}
        </Button>
      </CardContent>
    </Card>
  );
};

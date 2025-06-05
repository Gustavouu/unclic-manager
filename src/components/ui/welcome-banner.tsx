
import React from 'react';
import { Card, CardContent } from './card';
import { Button } from './button';
import { Sparkles, TrendingUp, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WelcomeBannerProps {
  userName?: string;
  businessName?: string;
  className?: string;
  onGetStarted?: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  userName = "Empreendedor",
  businessName = "seu negócio",
  className,
  onGetStarted
}) => {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Bom dia" : currentHour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <Card className={cn(
      "relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 border-primary/20",
      "hover:shadow-lg transition-all duration-500 hover:-translate-y-1",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {greeting}, {userName}! 👋
                </h2>
              </div>
              <p className="text-muted-foreground max-w-md">
                Acompanhe o crescimento de <span className="font-semibold text-foreground">{businessName}</span> e 
                descubra insights valiosos para impulsionar seus resultados.
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">Crescendo</span>
              </div>
              <div className="flex items-center gap-1 text-blue-600">
                <Users className="h-4 w-4" />
                <span className="font-medium">Conectado</span>
              </div>
            </div>

            {onGetStarted && (
              <Button 
                onClick={onGetStarted}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 
                          transform transition-all duration-200 hover:scale-105"
                size="sm"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Vamos começar
              </Button>
            )}
          </div>

          {/* Decorative elements */}
          <div className="hidden md:block relative">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl" />
            <div className="absolute -bottom-2 -right-8 w-16 h-16 bg-gradient-to-tl from-accent/30 to-primary/20 rounded-full blur-lg" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

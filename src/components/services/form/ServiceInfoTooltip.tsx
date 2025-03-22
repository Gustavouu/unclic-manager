
import React from "react";
import { InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ServiceInfoTooltipProps {
  title: string;
  description: string;
}

export function ServiceInfoTooltip({ title, description }: ServiceInfoTooltipProps) {
  return (
    <HoverCard>
      <Popover>
        <PopoverTrigger asChild>
          <HoverCardTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 p-0 rounded-full"
              aria-label={`Informações sobre ${title}`}
            >
              <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
            </Button>
          </HoverCardTrigger>
        </PopoverTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </HoverCardContent>
        <PopoverContent className="w-80">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </PopoverContent>
      </Popover>
    </HoverCard>
  );
}

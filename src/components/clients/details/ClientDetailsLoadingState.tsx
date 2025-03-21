
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { X } from "lucide-react";

interface ClientDetailsLoadingStateProps {
  onClose: () => void;
}

export const ClientDetailsLoadingState = ({ onClose }: ClientDetailsLoadingStateProps) => {
  return (
    <Card className="h-full shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="w-32 h-6 bg-muted animate-pulse rounded-md"></div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 bg-muted animate-pulse rounded-full"></div>
            <div className="space-y-2">
              <div className="w-24 h-4 bg-muted animate-pulse rounded-md"></div>
              <div className="w-32 h-3 bg-muted animate-pulse rounded-md"></div>
            </div>
          </div>
          <div className="w-full h-32 bg-muted animate-pulse rounded-md"></div>
          <div className="w-full h-48 bg-muted animate-pulse rounded-md"></div>
        </div>
      </CardContent>
    </Card>
  );
};

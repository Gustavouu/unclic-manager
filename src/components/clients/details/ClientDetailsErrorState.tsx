
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

interface ClientDetailsErrorStateProps {
  onClose: () => void;
}

export const ClientDetailsErrorState = ({ onClose }: ClientDetailsErrorStateProps) => {
  return (
    <Card className="h-full shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Cliente não encontrado</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p>Não foi possível encontrar os detalhes deste cliente.</p>
      </CardContent>
    </Card>
  );
};


import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

interface StatusFixButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  label?: string;
}

export function StatusFixButton({ 
  onClick, 
  isLoading = false, 
  label = "Atualizar dados" 
}: StatusFixButtonProps) {
  const handleClick = () => {
    onClick();
    toast.success("Dados sendo atualizados...");
  };

  return (
    <div className="flex justify-end my-4">
      <Button
        onClick={handleClick}
        disabled={isLoading}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <RefreshCw 
          size={16} 
          className={isLoading ? "animate-spin" : ""} 
        />
        {label}
      </Button>
    </div>
  );
}

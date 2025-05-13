
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface StatusFixButtonProps {
  onClick: () => void;
}

export function StatusFixButton({ onClick }: StatusFixButtonProps) {
  return (
    <div className="fixed bottom-4 right-4">
      <Button
        variant="outline"
        size="sm"
        className="bg-white shadow-md"
        onClick={onClick}
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Atualizar Dados
      </Button>
    </div>
  );
}

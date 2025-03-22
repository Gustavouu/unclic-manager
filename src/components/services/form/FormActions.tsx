
import React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
}

export function FormActions({ onCancel, isEditing }: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-3 pt-6">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit">
        {isEditing ? "Atualizar Serviço" : "Criar Serviço"}
      </Button>
    </div>
  );
}

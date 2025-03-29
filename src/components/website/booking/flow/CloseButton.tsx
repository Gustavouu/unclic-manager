
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { CloseButtonProps } from "../types";

export function CloseButton({ onClick }: CloseButtonProps) {
  return (
    <Button 
      size="icon" 
      variant="outline" 
      className="absolute right-6 top-6 z-10 bg-white hover:bg-gray-100"
      onClick={onClick}
    >
      <X className="h-4 w-4" />
    </Button>
  );
}

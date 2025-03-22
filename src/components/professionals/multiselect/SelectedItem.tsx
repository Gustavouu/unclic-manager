
import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Option } from "../multiselect/types";

interface SelectedItemProps {
  option: Option;
  onUnselect: (option: Option) => void;
}

export const SelectedItem = React.memo(({ 
  option, 
  onUnselect
}: SelectedItemProps) => (
  <Badge key={option.value} variant="secondary" className="rounded-sm">
    {option.label}
    <button
      className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onUnselect(option);
        }
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onClick={() => onUnselect(option)}
      aria-label={`Remove ${option.label}`}
      type="button"
    >
      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
    </button>
  </Badge>
));

SelectedItem.displayName = "SelectedItem";

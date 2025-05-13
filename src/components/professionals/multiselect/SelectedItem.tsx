
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Option } from "./types";

export interface SelectedItemProps {
  option: Option;
  onRemove?: (option: Option) => void;
  onUnselect?: (option: Option) => void; // Adding this to support legacy usage
}

export const SelectedItem = ({ option, onRemove, onUnselect }: SelectedItemProps) => {
  // Handle both onRemove and onUnselect for backwards compatibility
  const handleRemove = () => {
    if (onRemove) {
      onRemove(option);
    } else if (onUnselect) {
      onUnselect(option);
    }
  };

  return (
    <div className="flex items-center gap-1 bg-primary/10 text-primary border border-primary/30 rounded-sm px-1 py-0.5 text-xs group">
      <span>{option.label}</span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-4 w-4 p-0 opacity-70 group-hover:opacity-100"
        onClick={handleRemove}
      >
        <X className="h-2.5 w-2.5" />
      </Button>
    </div>
  );
};


import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Option } from "./types";

export interface SelectedItemProps {
  option: Option;
  onUnselect: (option: Option) => void;
}

export const SelectedItem = ({ option, onUnselect }: SelectedItemProps) => {
  return (
    <div className="flex items-center gap-1 bg-primary/10 text-primary border border-primary/30 rounded-sm px-1 py-0.5 text-xs group">
      <span>{option.label}</span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-4 w-4 p-0 opacity-70 group-hover:opacity-100"
        onClick={() => onUnselect(option)}
      >
        <X className="h-2.5 w-2.5" />
      </Button>
    </div>
  );
};


import * as React from "react";
import { Check } from "lucide-react";
import { CommandItem } from "@/components/ui/command";
import { Option } from "./types";
import { cn } from "@/lib/utils";

interface SelectableItemProps {
  option: Option;
  onSelect: (option: Option) => void;
  inputValue?: string;
}

export const SelectableItem = React.memo(({ 
  option, 
  onSelect,
  inputValue = ""
}: SelectableItemProps) => {
  // Highlight matching text when filtering
  const highlightLabel = () => {
    if (!inputValue.trim()) return <span>{option.label}</span>;
    
    const lowerLabel = option.label.toLowerCase();
    const lowerInput = inputValue.toLowerCase();
    const index = lowerLabel.indexOf(lowerInput);
    
    if (index === -1) return <span>{option.label}</span>;
    
    return (
      <span>
        {option.label.slice(0, index)}
        <span className="font-semibold bg-blue-100 rounded-sm px-0.5">
          {option.label.slice(index, index + inputValue.length)}
        </span>
        {option.label.slice(index + inputValue.length)}
      </span>
    );
  };

  return (
    <CommandItem
      key={option.value}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onSelect={() => onSelect(option)}
      className="cursor-pointer flex items-center justify-between hover:bg-slate-100"
      value={option.value}
    >
      {highlightLabel()}
      <Check className={cn(
        "h-4 w-4 opacity-0 transition-opacity duration-200",
        "group-data-[selected]:opacity-100"
      )} />
    </CommandItem>
  );
});

SelectableItem.displayName = "SelectableItem";

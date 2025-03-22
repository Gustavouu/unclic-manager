
import * as React from "react";
import { Check } from "lucide-react";
import { CommandItem } from "@/components/ui/command";
import { Option } from "./types";

interface SelectableItemProps {
  option: Option;
  onSelect: (option: Option) => void;
}

export const SelectableItem = React.memo(({ 
  option, 
  onSelect 
}: SelectableItemProps) => (
  <CommandItem
    key={option.value}
    onMouseDown={(e) => {
      e.preventDefault();
      e.stopPropagation();
    }}
    onSelect={() => onSelect(option)}
    className="cursor-pointer flex items-center justify-between"
    value={option.value}
  >
    <span>{option.label}</span>
    <Check className="h-4 w-4 opacity-0 group-data-[selected]:opacity-100" />
  </CommandItem>
));

SelectableItem.displayName = "SelectableItem";

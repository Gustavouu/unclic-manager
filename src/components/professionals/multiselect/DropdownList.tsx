
import * as React from "react";
import { CommandEmpty, CommandGroup, CommandList } from "@/components/ui/command";
import { SelectableItem } from "./SelectableItem";
import { Option } from "./types";

interface DropdownListProps {
  open: boolean;
  options: Option[];
  onSelect: (option: Option) => void;
  inputValue: string;
  emptyMessage?: string;
}

export const DropdownList = React.memo(({
  open,
  options,
  onSelect,
  inputValue,
  emptyMessage = "No options available"
}: DropdownListProps) => {
  if (!open) return null;

  return (
    <div className="absolute top-0 z-10 w-full bg-popover text-popover-foreground shadow-md rounded-md border animate-in fade-in-0 zoom-in-95">
      <CommandList>
        <CommandEmpty className="py-6 text-center text-sm">
          {emptyMessage}
        </CommandEmpty>
        <CommandGroup>
          {options.map((option) => (
            <SelectableItem 
              key={option.value} 
              option={option} 
              onSelect={onSelect}
              inputValue={inputValue}
            />
          ))}
        </CommandGroup>
      </CommandList>
    </div>
  );
});

DropdownList.displayName = "DropdownList";

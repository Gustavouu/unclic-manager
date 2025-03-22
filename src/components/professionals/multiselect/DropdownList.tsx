
import * as React from "react";
import { CommandGroup, CommandEmpty } from "@/components/ui/command";
import { SelectableItem } from "./SelectableItem";
import { Option } from "./types";

interface DropdownListProps {
  open: boolean;
  options: Option[];
  onSelect: (option: Option) => void;
  inputValue: string;
  emptyMessage: string;
}

export const DropdownList = React.memo(({
  open,
  options,
  onSelect,
  inputValue,
  emptyMessage
}: DropdownListProps) => {
  if (!open) return null;

  return (
    <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
      {options.length > 0 ? (
        <CommandGroup className="h-full overflow-auto max-h-60">
          {options.map((option) => (
            <SelectableItem 
              key={option.value} 
              option={option} 
              onSelect={onSelect} 
            />
          ))}
        </CommandGroup>
      ) : (
        <CommandEmpty className="py-3 px-4 text-sm text-center text-muted-foreground">
          {inputValue.length > 0 
            ? `Nenhum resultado para "${inputValue}"` 
            : emptyMessage}
        </CommandEmpty>
      )}
    </div>
  );
});

DropdownList.displayName = "DropdownList";

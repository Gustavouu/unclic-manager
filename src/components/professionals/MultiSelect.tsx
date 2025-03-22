
import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { Command, CommandPrimitive } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { SelectedItem } from "./multiselect/SelectedItem";
import { DropdownList } from "./multiselect/DropdownList";
import { Option } from "./multiselect/types";

interface MultiSelectProps {
  options: Option[];
  value: Option[];
  onChange: (value: Option[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  emptyMessage?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Selecione opções",
  className,
  disabled = false,
  emptyMessage = "Nenhuma opção disponível"
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  // Ensure arrays
  const safeOptions = React.useMemo(() => 
    Array.isArray(options) ? options : [], 
    [options]
  );
  
  const safeValue = React.useMemo(() => 
    Array.isArray(value) ? value : [], 
    [value]
  );

  // Memoize available options that haven't been selected
  const selectableOptions = React.useMemo(() => 
    safeOptions.filter(option => 
      !safeValue.some(item => item.value === option.value)
    ), 
    [safeOptions, safeValue]
  );

  // Handle removing an option
  const handleUnselect = React.useCallback((option: Option) => {
    onChange(safeValue.filter((item) => item.value !== option.value));
  }, [safeValue, onChange]);

  // Handle selecting a new option
  const handleSelect = React.useCallback((selectedOption: Option) => {
    onChange([...safeValue, selectedOption]);
    setInputValue("");
    inputRef.current?.focus();
  }, [safeValue, onChange]);

  // Handle keyboard interaction
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "" && safeValue.length > 0) {
          // Remove the last item when pressing backspace with empty input
          onChange(safeValue.slice(0, -1));
        }
      }
      if (e.key === "Escape") {
        input.blur();
        setOpen(false);
      }
      if (e.key === "ArrowDown") {
        setOpen(true);
      }
    }
  }, [safeValue, onChange]);

  return (
    <div 
      className={cn(
        "relative w-full", 
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      <Command
        onKeyDown={handleKeyDown}
        className="overflow-visible bg-transparent"
      >
        <div 
          className={cn(
            "group border border-input px-3 py-2 text-sm ring-offset-background rounded-md",
            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            "flex items-center"
          )}
          onClick={() => {
            inputRef.current?.focus();
            setOpen(true);
          }}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {safeValue.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {safeValue.map((option) => (
                  <SelectedItem 
                    key={option.value}
                    option={option}
                    onUnselect={handleUnselect}
                  />
                ))}
              </div>
            )}
            <CommandPrimitive.Input
              ref={inputRef}
              value={inputValue}
              onValueChange={setInputValue}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              placeholder={safeValue.length > 0 ? "" : placeholder}
              className="ml-1 bg-transparent outline-none placeholder:text-muted-foreground flex-1 pl-1 min-w-[120px]"
              disabled={disabled}
            />
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </div>
        
        <div className="relative mt-1">
          <DropdownList
            open={open}
            options={selectableOptions}
            onSelect={handleSelect}
            inputValue={inputValue}
            emptyMessage={emptyMessage}
          />
        </div>
      </Command>
    </div>
  );
}

// Re-export the Option type for convenience
export type { Option } from "./multiselect/types";

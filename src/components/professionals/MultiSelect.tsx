
import * as React from "react";
import { X, Check, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem, CommandEmpty } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@/lib/utils";

// Define types for our component
export type Option = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: Option[];
  value: Option[];
  onChange: (value: Option[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  emptyMessage?: string;
}

// Selected option badge component
const SelectedItem = React.memo(({ 
  option, 
  onUnselect
}: { 
  option: Option; 
  onUnselect: (option: Option) => void;
}) => (
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

// MultiSelect component
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
          {open && (
            <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              {selectableOptions.length > 0 ? (
                <CommandGroup className="h-full overflow-auto max-h-60">
                  {selectableOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => handleSelect(option)}
                      className="cursor-pointer flex items-center justify-between"
                      value={option.value}
                    >
                      <span>{option.label}</span>
                      <Check className="h-4 w-4 opacity-0 group-data-[selected]:opacity-100" />
                    </CommandItem>
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
          )}
        </div>
      </Command>
    </div>
  );
}


import { Option } from "./types";
import { SelectableItem } from "./SelectableItem";

export interface DropdownListProps {
  open: boolean;
  options: Option[];
  onSelect: (option: Option) => void;
  inputValue: string;
  emptyMessage: string;
  maxHeight?: number;
}

export const DropdownList = ({ 
  open, 
  options, 
  onSelect, 
  inputValue, 
  emptyMessage,
  maxHeight = 200 
}: DropdownListProps) => {
  if (!open) return null;

  return (
    <div 
      className="absolute top-full left-0 right-0 mt-1 rounded-md border bg-popover shadow-md z-50"
      style={{ maxHeight: `${maxHeight}px`, overflowY: 'auto' }}
    >
      {options.length > 0 ? (
        <div className="py-1">
          {options.map(option => (
            <SelectableItem 
              key={option.value} 
              option={option} 
              onSelect={() => onSelect(option)} 
            />
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-sm text-muted-foreground">
          {inputValue.length > 0 ? (
            <span>No options found</span>
          ) : (
            <span>{emptyMessage}</span>
          )}
        </div>
      )}
    </div>
  );
};

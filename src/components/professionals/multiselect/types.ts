
export interface ProfessionalsMultiSelectProps {
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export interface Option {
  label: string;
  value: string;
}

export interface MultiSelectProps {
  options: Option[];
  selected: Option[];
  onChange: (selected: Option[]) => void;
  placeholder?: string;
  disabled?: boolean;
  emptyMessage?: string;
}

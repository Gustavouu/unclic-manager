
export type Option = {
  label: string;
  value: string;
};

export interface MultiSelectProps {
  options: Option[];
  selected: Option[];
  onChange: (values: Option[]) => void;
  placeholder?: string;
  className?: string;
  emptyMessage?: string;
  disabled?: boolean;
}

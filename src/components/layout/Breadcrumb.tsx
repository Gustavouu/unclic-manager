
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <div className="flex items-center text-sm text-muted-foreground mb-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
          <span className={item.active ? "font-medium text-foreground" : ""}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};


import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

type CategoriesFilterProps = {
  categories: string[];
  selectedCategories: string[];
  onToggle: (category: string) => void;
};

export const CategoriesFilter = ({ 
  categories, 
  selectedCategories, 
  onToggle 
}: CategoriesFilterProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Categorias</Label>
      <div className="flex flex-wrap gap-2 mt-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category);
          let badgeVariant: "default" | "outline" = isSelected ? "default" : "outline";
          let badgeColor = "";
          
          if (isSelected) {
            switch(category) {
              case 'VIP':
                badgeColor = "bg-purple-500 hover:bg-purple-600";
                break;
              case 'Premium':
                badgeColor = "bg-amber-500 hover:bg-amber-600";
                break;
              case 'Regular':
                badgeColor = "bg-blue-500 hover:bg-blue-600";
                break;
              case 'Novo':
                badgeColor = "bg-green-500 hover:bg-green-600";
                break;
              default:
                badgeColor = "";
            }
          }
          
          return (
            <Badge 
              key={category}
              variant={badgeVariant}
              className={`cursor-pointer transition-colors ${badgeColor}`}
              onClick={() => onToggle(category)}
            >
              {category}
              {isSelected && (
                <X className="ml-1 h-3 w-3" />
              )}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

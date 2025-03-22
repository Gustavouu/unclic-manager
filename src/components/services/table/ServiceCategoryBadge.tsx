
import { Badge } from "@/components/ui/badge";

interface ServiceCategoryBadgeProps {
  category: string;
}

export const ServiceCategoryBadge = ({ category }: ServiceCategoryBadgeProps) => {
  return (
    <Badge variant="outline" className="bg-primary/10">
      {category}
    </Badge>
  );
};

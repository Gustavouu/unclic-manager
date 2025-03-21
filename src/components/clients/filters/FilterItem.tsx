
import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";

type FilterItemProps = {
  children: ReactNode;
  showSeparator?: boolean;
};

export const FilterItem = ({ children, showSeparator = true }: FilterItemProps) => {
  return (
    <>
      <div className="space-y-3">
        {children}
      </div>
      {showSeparator && <Separator className="my-4" />}
    </>
  );
};

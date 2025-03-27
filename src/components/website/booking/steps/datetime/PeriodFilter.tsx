
import { Button } from "@/components/ui/button";
import { Clock, Sun, Cloud, Moon } from "lucide-react";

type Period = "morning" | "afternoon" | "evening" | "all";

interface PeriodFilterProps {
  activePeriod: Period;
  handlePeriodClick: (period: Period) => void;
  morningSlots: any[];
  afternoonSlots: any[];
  eveningSlots: any[];
}

export function PeriodFilter({
  activePeriod,
  handlePeriodClick,
  morningSlots,
  afternoonSlots,
  eveningSlots
}: PeriodFilterProps) {
  return (
    <div className="flex gap-2 mb-4">
      <Button
        type="button"
        variant={activePeriod === "all" ? "default" : "outline"}
        className="flex items-center gap-1"
        onClick={() => handlePeriodClick("all")}
      >
        <Clock className="h-4 w-4" />
        Todos
      </Button>
      <Button
        type="button"
        variant={activePeriod === "morning" ? "default" : "outline"}
        className="flex items-center gap-1"
        onClick={() => handlePeriodClick("morning")}
        disabled={morningSlots.length === 0}
      >
        <Sun className="h-4 w-4" />
        Manhã
      </Button>
      <Button
        type="button"
        variant={activePeriod === "afternoon" ? "default" : "outline"}
        className="flex items-center gap-1"
        onClick={() => handlePeriodClick("afternoon")}
        disabled={afternoonSlots.length === 0}
      >
        <Cloud className="h-4 w-4" />
        Tarde
      </Button>
      <Button
        type="button"
        variant={activePeriod === "evening" ? "default" : "outline"}
        className="flex items-center gap-1"
        onClick={() => handlePeriodClick("evening")}
        disabled={eveningSlots.length === 0}
      >
        <Moon className="h-4 w-4" />
        Noite
      </Button>
    </div>
  );
}

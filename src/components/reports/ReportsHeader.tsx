
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";

export function ReportsHeader() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground">
          Análise detalhada das operações do seu negócio
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Printer className="h-4 w-4 mr-2" />
          Imprimir
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>
    </div>
  );
}

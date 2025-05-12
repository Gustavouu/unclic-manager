
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function DashboardFooter() {
  return (
    <div className="py-6 border-t border-border mt-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Dados atualizados em: {new Date().toLocaleString("pt-BR")}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="/reports">
              Ver relatórios completos <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

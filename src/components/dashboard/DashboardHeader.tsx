
import React from "react";

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-display font-bold">Painel de Controle</h1>
      <p className="text-muted-foreground">
        Bem-vindo ao seu dashboard. Aqui você encontra os dados mais importantes do seu negócio.
      </p>
    </div>
  );
}

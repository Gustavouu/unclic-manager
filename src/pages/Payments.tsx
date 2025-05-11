
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useQuery } from "@tanstack/react-query";

const Payments: React.FC = () => {
  const { data: payments, isLoading, error } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      // In a real app, this would fetch data from your API
      return [];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader size="lg" text="Carregando pagamentos..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-semibold">Erro ao carregar pagamentos</h2>
        <p className="text-muted-foreground">{String(error)}</p>
        <Button>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Pagamentos</h1>
        <Button>Novo Pagamento</Button>
      </div>

      <div className="border rounded-md">
        {payments && payments.length > 0 ? (
          <div className="p-4">Lista de pagamentos</div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <h3 className="text-lg font-medium">Nenhum pagamento encontrado</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Você ainda não tem nenhum pagamento registrado.
            </p>
            <Button className="mt-4">Registrar Pagamento</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;

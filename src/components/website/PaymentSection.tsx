
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export const PaymentSection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Pagamentos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          Aceitamos diversas formas de pagamento para sua comodidade:
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="border rounded-md p-3 text-center">
            <div className="text-2xl mb-1">💳</div>
            <div className="text-sm">Cartão de Crédito</div>
          </div>
          <div className="border rounded-md p-3 text-center">
            <div className="text-2xl mb-1">💸</div>
            <div className="text-sm">Cartão de Débito</div>
          </div>
          <div className="border rounded-md p-3 text-center">
            <div className="text-2xl mb-1">📱</div>
            <div className="text-sm">PIX</div>
          </div>
          <div className="border rounded-md p-3 text-center">
            <div className="text-2xl mb-1">💰</div>
            <div className="text-sm">Dinheiro</div>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Pagamentos online são processados de forma segura. Você também
          pode pagar diretamente no estabelecimento após o serviço.
        </p>
      </CardContent>
    </Card>
  );
};

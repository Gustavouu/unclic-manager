
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { TransactionDialog } from "./dialogs/TransactionDialog";

export function FinancialActions() {
  const [isOpen, setIsOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"receita" | "despesa" | null>(null);
  
  const openDialog = (type: "receita" | "despesa") => {
    setTransactionType(type);
    setIsOpen(true);
  };
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        className="gap-2 text-green-600"
        onClick={() => openDialog("receita")}
      >
        <ArrowUpCircle className="h-4 w-4" />
        Nova Receita
      </Button>
      
      <Button
        variant="outline"
        className="gap-2 text-red-600"
        onClick={() => openDialog("despesa")}
      >
        <ArrowDownCircle className="h-4 w-4" />
        Nova Despesa
      </Button>
      
      <Button variant="default" className="gap-2">
        <PlusCircle className="h-4 w-4" />
        Gerar Relatório
      </Button>
      
      <TransactionDialog 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        transactionType={transactionType} 
      />
    </div>
  );
}

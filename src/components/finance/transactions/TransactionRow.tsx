
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PaymentStatusBadge } from "@/components/payment/PaymentStatusBadge";
import { formatCurrency } from "@/lib/formatters";
import { Transaction } from "./types";
import { formatDate, getPaymentMethodLabel } from "./utils";

interface TransactionRowProps {
  transaction: Transaction;
}

export const TransactionRow = ({ transaction }: TransactionRowProps) => {
  return (
    <TableRow key={transaction.id}>
      <TableCell>
        {formatDate(transaction.criado_em)}
      </TableCell>
      <TableCell className="max-w-[200px] truncate" title={transaction.descricao}>
        {transaction.descricao || "—"}
      </TableCell>
      <TableCell>
        {transaction.cliente?.nome || "Cliente não identificado"}
      </TableCell>
      <TableCell>
        {getPaymentMethodLabel(transaction.metodo_pagamento)}
      </TableCell>
      <TableCell className={transaction.tipo === "receita" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
        {transaction.tipo === "despesa" ? "- " : ""}{formatCurrency(transaction.valor)}
      </TableCell>
      <TableCell>
        <PaymentStatusBadge status={transaction.status as any} />
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
            {transaction.status === "pendente" && (
              <DropdownMenuItem>Marcar como pago</DropdownMenuItem>
            )}
            <DropdownMenuItem>Exportar recibo</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

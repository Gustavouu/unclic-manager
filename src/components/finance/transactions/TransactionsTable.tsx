
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionsTableProps } from "./types";
import { useTransactions } from "./useTransactions";
import { TransactionSkeletonRows } from "./TransactionSkeletonRows";
import { TransactionRow } from "./TransactionRow";

export function TransactionsTable({ 
  isLoading, 
  filterType = "all", 
  period = "30days",
  currentPage,
  pageSize,
  setCurrentPage,
  setPageSize,
  searchTerm = "",
  dateRange,
  statusFilter = [],
  typeFilter = []
}: TransactionsTableProps) {
  
  const { transactions, loading } = useTransactions(
    isLoading,
    filterType,
    period,
    searchTerm,
    dateRange,
    statusFilter,
    typeFilter
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Transações</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || loading ? (
              <TransactionSkeletonRows />
            ) : transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TransactionRow key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  Nenhuma transação encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

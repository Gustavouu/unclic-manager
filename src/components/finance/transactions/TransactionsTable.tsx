
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionsTableProps } from "./types";
import { useTransactions } from "./useTransactions";
import { TransactionSkeletonRows } from "./TransactionSkeletonRows";
import { TransactionRow } from "./TransactionRow";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export function TransactionsTable({ 
  isLoading, 
  filterType = "all", 
  period = "30days",
  currentPage = 1,
  pageSize = 10,
  setCurrentPage = () => {},
  setPageSize = () => {},
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

  const totalPages = Math.ceil(transactions.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleTransactions = transactions.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    if (setCurrentPage && page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
            ) : visibleTransactions.length > 0 ? (
              visibleTransactions.map((transaction) => (
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

        {!isLoading && !loading && transactions.length > 0 && (
          <div className="mt-4 flex items-center justify-end">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      onClick={() => handlePageChange(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

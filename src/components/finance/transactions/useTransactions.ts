
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "./types";

export const useTransactions = (
  isLoading: boolean,
  filterType: "all" | "receita" | "despesa" = "all",
  period: string = "30days",
  searchTerm?: string,
  dateRange?: [Date | null, Date | null],
  statusFilter?: string[],
  typeFilter?: string[]
) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        
        let query = supabase
          .from('transacoes')
          .select(`
            id,
            tipo,
            valor,
            metodo_pagamento,
            status,
            descricao,
            criado_em,
            data_pagamento,
            clientes (
              nome
            ),
            servicos (
              nome
            )
          `)
          .order('criado_em', { ascending: false });
        
        if (filterType !== "all") {
          query = query.eq('tipo', filterType);
        }
        
        if (period === "7days") {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          query = query.gte('criado_em', sevenDaysAgo.toISOString());
        } else if (period === "30days") {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          query = query.gte('criado_em', thirtyDaysAgo.toISOString());
        }
        
        const { data, error } = await query.limit(50);

        if (error) throw error;
        
        setTransactions(data || []);
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!isLoading) {
      fetchTransactions();
    }
  }, [isLoading, filterType, period, searchTerm, dateRange, statusFilter, typeFilter]);

  return { transactions, loading };
};

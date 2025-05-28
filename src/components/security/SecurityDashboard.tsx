import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Download, FileText, Table as TableIcon } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { z } from 'zod';
import { xml2js } from 'xml-js';
import { marked } from 'marked';
import { useAuth } from '@/hooks/useAuth';

interface SecurityLog {
  id: string;
  action: string;
  email: string;
  ip: string;
  success: boolean;
  timestamp: string;
  details?: string;
}

interface BlockedIP {
  id: string;
  ip: string;
  blocked_at: string;
  reason: string;
  expires_at: string;
}

interface SecurityAlert {
  id: string;
  message: string;
  created_at: string;
  status: 'pending' | 'resolved' | 'investigating';
}

interface SecurityMetrics {
  totalAlerts: number;
  pendingAlerts: number;
  blockedIPs: number;
  failedLogins: number;
  suspiciousActivities: number;
}

interface TimeSeriesData {
  timestamp: string;
  failedLogins: number;
  suspiciousActivities: number;
  alerts: number;
}

interface ExportFilters {
  startDate: string;
  endDate: string;
  alertStatus: string;
  logSuccess: boolean | null;
  ipAddress: string;
  email: string;
}

interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

interface PreviewPagination {
  page: number;
  pageSize: number;
  total: number;
}

interface ExportTemplate {
  id: string;
  name: string;
  format: 'excel' | 'pdf' | 'csv' | 'json' | 'xml' | 'html';
  filters: ExportFilters;
  columns: string[];
  customStyles?: Record<string, any>;
}

interface ExportAudit {
  id: string;
  user_id: string;
  format: string;
  filters: ExportFilters;
  started_at: string;
  completed_at?: string;
  status: 'in_progress' | 'completed' | 'failed';
  error?: string;
  ip_address: string;
  user_agent: string;
}

const getStartDate = (range: string): Date => {
  const now = new Date();
  switch (range) {
    case '24h':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
  }
};

const exportFiltersSchema = z.object({
  startDate: z.string().refine((date) => {
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Data inicial inválida'),
  endDate: z.string().refine((date) => {
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Data final inválida'),
  alertStatus: z.enum(['all', 'pending', 'resolved', 'investigating']),
  logSuccess: z.union([z.boolean(), z.null()]),
  ipAddress: z.string().refine((ip) => {
    if (!ip) return true;
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    return ipRegex.test(ip);
  }, 'IP inválido'),
  email: z.string().refine((email) => {
    if (!email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, 'Email inválido'),
});

export function SecurityDashboard() {
  const { toast } = useToast();
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalAlerts: 0,
    pendingAlerts: 0,
    blockedIPs: 0,
    failedLogins: 0,
    suspiciousActivities: 0,
  });
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [exportFilters, setExportFilters] = useState<ExportFilters>({
    startDate: format(new Date(Date.now() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    alertStatus: 'all',
    logSuccess: null,
    ipAddress: '',
    email: '',
  });
  const [showExportFilters, setShowExportFilters] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [previewFormat, setPreviewFormat] = useState<'excel' | 'pdf' | 'csv' | 'json' | 'xml' | 'html'>('excel');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('24h');
  const [alertStatus, setAlertStatus] = useState('all');

  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const queryClient = useQueryClient();

  // Cache de consultas frequentes
  const { data: cachedSecurityData, isLoading } = useQuery({
    queryKey: ['securityData', pagination.page, pagination.pageSize, dateRange, alertStatus],
    queryFn: async () => {
      const startDate = getStartDate(dateRange);
      const offset = (pagination.page - 1) * pagination.pageSize;

      const [
        { data: alertsData, count: alertsCount },
        { data: logsData, count: logsCount },
        { data: blockedIPsData, count: blockedIPsCount },
      ] = await Promise.all([
        supabase
          .from('security_alerts')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range(offset, offset + pagination.pageSize - 1)
          .eq('status', alertStatus === 'all' ? undefined : alertStatus),
        supabase
          .from('security_logs')
          .select('*', { count: 'exact' })
          .order('timestamp', { ascending: false })
          .range(offset, offset + pagination.pageSize - 1)
          .gte('timestamp', startDate.toISOString()),
        supabase
          .from('blocked_ips')
          .select('*', { count: 'exact' })
          .order('blocked_at', { ascending: false })
          .range(offset, offset + pagination.pageSize - 1),
      ]);

      return {
        alerts: alertsData || [],
        logs: logsData || [],
        blockedIPs: blockedIPsData || [],
        counts: {
          alerts: alertsCount || 0,
          logs: logsCount || 0,
          blockedIPs: blockedIPsCount || 0,
        },
      };
    },
    staleTime: 30000, // Dados considerados frescos por 30 segundos
    gcTime: 5 * 60 * 1000, // Cache mantido por 5 minutos
  });

  // Pré-carregamento da próxima página
  useEffect(() => {
    if (pagination.page < Math.ceil(pagination.total / pagination.pageSize)) {
      queryClient.prefetchQuery({
        queryKey: ['securityData', pagination.page + 1, pagination.pageSize, dateRange, alertStatus],
        queryFn: async () => {
          const startDate = getStartDate(dateRange);
          const offset = pagination.page * pagination.pageSize;

          const [
            { data: alertsData, count: alertsCount },
            { data: logsData, count: logsCount },
            { data: blockedIPsData, count: blockedIPsCount },
          ] = await Promise.all([
            supabase
              .from('security_alerts')
              .select('*', { count: 'exact' })
              .order('created_at', { ascending: false })
              .range(offset, offset + pagination.pageSize - 1)
              .eq('status', alertStatus === 'all' ? undefined : alertStatus),
            supabase
              .from('security_logs')
              .select('*', { count: 'exact' })
              .order('timestamp', { ascending: false })
              .range(offset, offset + pagination.pageSize - 1)
              .gte('timestamp', startDate.toISOString()),
            supabase
              .from('blocked_ips')
              .select('*', { count: 'exact' })
              .order('blocked_at', { ascending: false })
              .range(offset, offset + pagination.pageSize - 1),
          ]);

          return {
            alerts: alertsData || [],
            logs: logsData || [],
            blockedIPs: blockedIPsData || [],
            counts: {
              alerts: alertsCount || 0,
              logs: logsCount || 0,
              blockedIPs: blockedIPsCount || 0,
            },
          };
        },
      });
    }
  }, [pagination.page, pagination.pageSize, dateRange, alertStatus]);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPagination(prev => ({ ...prev, pageSize: newPageSize, page: 1 }));
  };

  useEffect(() => {
    fetchSecurityData();
    fetchTimeSeriesData();
    setupRealtimeSubscriptions();
    const interval = setInterval(() => {
      fetchSecurityData();
      fetchTimeSeriesData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const setupRealtimeSubscriptions = () => {
    // Inscreve-se para atualizações em tempo real
    const securityLogsSubscription = supabase
      .channel('security_logs_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'security_logs' }, 
        (payload) => {
          const newLog = payload.new as SecurityLog;
          setSecurityLogs(prev => [newLog, ...prev].slice(0, 50));
          updateMetrics();
          if (!newLog.success) {
            toast({
              title: 'Tentativa de Login Falha',
              description: `IP: ${newLog.ip} - Email: ${newLog.email}`,
              variant: 'destructive',
            });
          }
        }
      )
      .subscribe();

    const alertsSubscription = supabase
      .channel('security_alerts_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'security_alerts' },
        (payload) => {
          const newAlert = payload.new as SecurityAlert;
          setSecurityAlerts(prev => [newAlert, ...prev].slice(0, 20));
          updateMetrics();
          toast({
            title: 'Novo Alerta de Segurança',
            description: newAlert.message,
            variant: 'destructive',
          });
        }
      )
      .subscribe();

    return () => {
      securityLogsSubscription.unsubscribe();
      alertsSubscription.unsubscribe();
    };
  };

  const updateMetrics = async () => {
    try {
      const now = new Date();
      const timeRanges = {
        '24h': new Date(now.getTime() - 24 * 60 * 60 * 1000),
        '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      };

      const startDate = timeRanges[dateRange as keyof typeof timeRanges] || timeRanges['24h'];

      const [
        { count: totalAlerts },
        { count: pendingAlerts },
        { count: blockedIPs },
        { count: failedLogins },
        { count: suspiciousActivities },
      ] = await Promise.all([
        supabase.from('security_alerts').select('*', { count: 'exact' }),
        supabase.from('security_alerts').select('*', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('blocked_ips').select('*', { count: 'exact' }),
        supabase.from('security_logs').select('*', { count: 'exact' })
          .eq('success', false)
          .gte('timestamp', startDate.toISOString()),
        supabase.from('security_logs').select('*', { count: 'exact' })
          .eq('action', 'suspicious_activity')
          .gte('timestamp', startDate.toISOString()),
      ]);

      setMetrics({
        totalAlerts: totalAlerts || 0,
        pendingAlerts: pendingAlerts || 0,
        blockedIPs: blockedIPs || 0,
        failedLogins: failedLogins || 0,
        suspiciousActivities: suspiciousActivities || 0,
      });
    } catch (error) {
      console.error('Erro ao atualizar métricas:', error);
    }
  };

  const fetchSecurityData = async () => {
    try {
      const now = new Date();
      const timeRanges = {
        '24h': new Date(now.getTime() - 24 * 60 * 60 * 1000),
        '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      };

      const startDate = timeRanges[dateRange as keyof typeof timeRanges] || timeRanges['24h'];

      // Busca logs de segurança com filtros
      const { data: logsData } = await supabase
        .from('security_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .gte('timestamp', startDate.toISOString())
        .limit(50);

      // Busca IPs bloqueados
      const { data: blockedIPsData } = await supabase
        .from('blocked_ips')
        .select('*')
        .order('blocked_at', { ascending: false });

      // Busca alertas de segurança com filtros
      const { data: alertsData } = await supabase
        .from('security_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      let filteredLogs = logsData || [];
      let filteredAlerts = alertsData || [];

      // Aplica filtro de busca
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredLogs = filteredLogs.filter(log => 
          log.email.toLowerCase().includes(searchLower) ||
          log.ip.toLowerCase().includes(searchLower) ||
          log.action.toLowerCase().includes(searchLower)
        );
        filteredAlerts = filteredAlerts.filter(alert =>
          alert.message.toLowerCase().includes(searchLower)
        );
      }

      // Aplica filtro de status de alerta
      if (alertStatus !== 'all') {
        filteredAlerts = filteredAlerts.filter(alert => alert.status === alertStatus);
      }

      setSecurityLogs(filteredLogs);
      setBlockedIPs(blockedIPsData || []);
      setSecurityAlerts(filteredAlerts);
      await updateMetrics();
    } catch (error) {
      console.error('Erro ao buscar dados de segurança:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeSeriesData = async () => {
    try {
      const now = new Date();
      const startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Últimas 24 horas
      const interval = 60 * 60 * 1000; // Intervalo de 1 hora

      const { data: logsData } = await supabase
        .from('security_logs')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: true });

      const { data: alertsData } = await supabase
        .from('security_alerts')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      // Agrupa dados por hora
      const timeSeries: TimeSeriesData[] = [];
      for (let time = startDate.getTime(); time <= now.getTime(); time += interval) {
        const hourStart = new Date(time);
        const hourEnd = new Date(time + interval);

        const hourLogs = logsData?.filter(log => {
          const logTime = new Date(log.timestamp);
          return logTime >= hourStart && logTime < hourEnd;
        }) || [];

        const hourAlerts = alertsData?.filter(alert => {
          const alertTime = new Date(alert.created_at);
          return alertTime >= hourStart && alertTime < hourEnd;
        }) || [];

        timeSeries.push({
          timestamp: format(hourStart, 'HH:mm'),
          failedLogins: hourLogs.filter(log => !log.success).length,
          suspiciousActivities: hourLogs.filter(log => log.action === 'suspicious_activity').length,
          alerts: hourAlerts.length,
        });
      }

      setTimeSeriesData(timeSeries);
    } catch (error) {
      console.error('Erro ao buscar dados de séries temporais:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      pending: { color: 'bg-yellow-500', label: 'Pendente' },
      resolved: { color: 'bg-green-500', label: 'Resolvido' },
      investigating: { color: 'bg-blue-500', label: 'Em Investigação' },
    };

    const { color, label } = statusMap[status] || { color: 'bg-gray-500', label: status };
    return <Badge className={color}>{label}</Badge>;
  };

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Planilha de Alertas
    const alertsData = securityAlerts.map(alert => ({
      Data: format(new Date(alert.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
      Mensagem: alert.message,
      Status: alert.status,
    }));
    const alertsSheet = XLSX.utils.json_to_sheet(alertsData);
    XLSX.utils.book_append_sheet(workbook, alertsSheet, 'Alertas');

    // Planilha de IPs Bloqueados
    const blockedIPsData = blockedIPs.map(ip => ({
      IP: ip.ip,
      Motivo: ip.reason,
      'Bloqueado em': format(new Date(ip.blocked_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
      'Expira em': format(new Date(ip.expires_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
    }));
    const blockedIPsSheet = XLSX.utils.json_to_sheet(blockedIPsData);
    XLSX.utils.book_append_sheet(workbook, blockedIPsSheet, 'IPs Bloqueados');

    // Planilha de Logs
    const logsData = securityLogs.map(log => ({
      Data: format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
      Ação: log.action,
      Email: log.email,
      IP: log.ip,
      Status: log.success ? 'Sucesso' : 'Falha',
    }));
    const logsSheet = XLSX.utils.json_to_sheet(logsData);
    XLSX.utils.book_append_sheet(workbook, logsSheet, 'Logs');

    // Salva o arquivo
    XLSX.writeFile(workbook, `relatorio_seguranca_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(20);
    doc.text('Relatório de Segurança', 14, 15);
    doc.setFontSize(12);
    doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, 14, 25);

    // Métricas
    doc.setFontSize(16);
    doc.text('Métricas', 14, 40);
    doc.setFontSize(12);
    doc.text(`Total de Alertas: ${metrics.totalAlerts}`, 14, 50);
    doc.text(`Alertas Pendentes: ${metrics.pendingAlerts}`, 14, 60);
    doc.text(`IPs Bloqueados: ${metrics.blockedIPs}`, 14, 70);
    doc.text(`Logins Falhos: ${metrics.failedLogins}`, 14, 80);
    doc.text(`Atividades Suspeitas: ${metrics.suspiciousActivities}`, 14, 90);

    // Alertas
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Alertas de Segurança', 14, 15);
    const alertsTableData = securityAlerts.map(alert => [
      format(new Date(alert.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
      alert.message,
      alert.status,
    ]);
    (doc as any).autoTable({
      head: [['Data', 'Mensagem', 'Status']],
      body: alertsTableData,
      startY: 25,
    });

    // IPs Bloqueados
    doc.addPage();
    doc.setFontSize(16);
    doc.text('IPs Bloqueados', 14, 15);
    const blockedIPsTableData = blockedIPs.map(ip => [
      ip.ip,
      ip.reason,
      format(new Date(ip.blocked_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
      format(new Date(ip.expires_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
    ]);
    (doc as any).autoTable({
      head: [['IP', 'Motivo', 'Bloqueado em', 'Expira em']],
      body: blockedIPsTableData,
      startY: 25,
    });

    // Salva o arquivo
    doc.save(`relatorio_seguranca_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.pdf`);
  };

  const exportToCSV = () => {
    const filteredData = filterDataForExport();
    const csvContent = convertToCSV(filteredData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_seguranca_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.csv`;
    link.click();
  };

  const exportToJSON = () => {
    const filteredData = filterDataForExport();
    const jsonContent = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_seguranca_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.json`;
    link.click();
  };

  const filterDataForExport = () => {
    const startDate = new Date(exportFilters.startDate);
    const endDate = new Date(exportFilters.endDate);
    endDate.setHours(23, 59, 59, 999);

    const filteredAlerts = securityAlerts.filter(alert => {
      const alertDate = new Date(alert.created_at);
      return (
        alertDate >= startDate &&
        alertDate <= endDate &&
        (exportFilters.alertStatus === 'all' || alert.status === exportFilters.alertStatus)
      );
    });

    const filteredLogs = securityLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      return (
        logDate >= startDate &&
        logDate <= endDate &&
        (exportFilters.logSuccess === null || log.success === exportFilters.logSuccess) &&
        (exportFilters.ipAddress === '' || log.ip.includes(exportFilters.ipAddress)) &&
        (exportFilters.email === '' || log.email.includes(exportFilters.email))
      );
    });

    const filteredBlockedIPs = blockedIPs.filter(ip => {
      const blockedDate = new Date(ip.blocked_at);
      return (
        blockedDate >= startDate &&
        blockedDate <= endDate &&
        (exportFilters.ipAddress === '' || ip.ip.includes(exportFilters.ipAddress))
      );
    });

    return {
      alerts: filteredAlerts,
      logs: filteredLogs,
      blockedIPs: filteredBlockedIPs,
      metrics: {
        totalAlerts: filteredAlerts.length,
        pendingAlerts: filteredAlerts.filter(a => a.status === 'pending').length,
        blockedIPs: filteredBlockedIPs.length,
        failedLogins: filteredLogs.filter(l => !l.success).length,
        suspiciousActivities: filteredLogs.filter(l => l.action === 'suspicious_activity').length,
      },
    };
  };

  const convertToCSV = (data: any) => {
    const headers = {
      alerts: ['Data', 'Mensagem', 'Status'],
      logs: ['Data', 'Ação', 'Email', 'IP', 'Status'],
      blockedIPs: ['IP', 'Motivo', 'Bloqueado em', 'Expira em'],
    };

    const rows = [
      ['=== ALERTAS ==='],
      headers.alerts,
      ...data.alerts.map((alert: any) => [
        format(new Date(alert.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
        alert.message,
        alert.status,
      ]),
      [''],
      ['=== LOGS ==='],
      headers.logs,
      ...data.logs.map((log: any) => [
        format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
        log.action,
        log.email,
        log.ip,
        log.success ? 'Sucesso' : 'Falha',
      ]),
      [''],
      ['=== IPs BLOQUEADOS ==='],
      headers.blockedIPs,
      ...data.blockedIPs.map((ip: any) => [
        ip.ip,
        ip.reason,
        format(new Date(ip.blocked_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
        format(new Date(ip.expires_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
      ]),
    ];

    return rows.map(row => row.join(',')).join('\n');
  };

  const handleAlertAction = async (alertId: string, action: 'resolve' | 'investigate') => {
    try {
      const newStatus = action === 'resolve' ? 'resolved' : 'investigating';
      const { error } = await supabase
        .from('security_alerts')
        .update({ status: newStatus })
        .eq('id', alertId);

      if (error) throw error;

      setSecurityAlerts(prev =>
        prev.map(alert =>
          alert.id === alertId ? { ...alert, status: newStatus } : alert
        )
      );

      toast({
        title: 'Status do Alerta Atualizado',
        description: `Alerta ${action === 'resolve' ? 'resolvido' : 'em investigação'}`,
      });
    } catch (error) {
      console.error('Erro ao atualizar status do alerta:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status do alerta',
        variant: 'destructive',
      });
    }
  };

  const [previewPagination, setPreviewPagination] = useState<PreviewPagination>({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [recentExports, setRecentExports] = useState<any[]>([]);
  const [templates, setTemplates] = useState<ExportTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { user } = useAuth();
  const [exportCount, setExportCount] = useState(0);
  const [lastExportTime, setLastExportTime] = useState<Date | null>(null);
  const RATE_LIMIT = 5; // Máximo de exportações por minuto
  const RATE_LIMIT_WINDOW = 60 * 1000; // Janela de tempo em milissegundos (1 minuto)

  // Carregar histórico de exportações recentes
  useEffect(() => {
    const loadRecentExports = async () => {
      const { data } = await supabase
        .from('export_logs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(5);
      setRecentExports(data || []);
    };
    loadRecentExports();
  }, []);

  // Carregar templates salvos
  useEffect(() => {
    const loadTemplates = async () => {
      const { data } = await supabase
        .from('export_templates')
        .select('*')
        .order('name');
      setTemplates(data || []);
    };
    loadTemplates();
  }, []);

  const handlePreview = async (format: 'excel' | 'pdf' | 'csv' | 'json' | 'xml' | 'html') => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      const filteredData = await filterDataForExport();
      const totalItems = filteredData.alerts.length + filteredData.logs.length + filteredData.blockedIPs.length;
      const pageSize = previewPagination.pageSize;
      const totalPages = Math.ceil(totalItems / pageSize);
      
      setPreviewPagination(prev => ({
        ...prev,
        total: totalItems,
      }));

      // Simula progresso de carregamento
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      setPreviewData(filteredData);
      setPreviewFormat(format);
      setShowPreview(true);
      
      clearInterval(progressInterval);
      setExportProgress(100);
    } catch (error) {
      console.error('Erro ao gerar preview:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível gerar o preview do relatório',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const checkRateLimit = (): boolean => {
    const now = new Date();
    if (!lastExportTime || now.getTime() - lastExportTime.getTime() > RATE_LIMIT_WINDOW) {
      setExportCount(1);
      setLastExportTime(now);
      return true;
    }

    if (exportCount >= RATE_LIMIT) {
      toast({
        title: 'Limite de Exportação Excedido',
        description: `Você pode exportar no máximo ${RATE_LIMIT} relatórios por minuto.`,
        variant: 'destructive',
      });
      return false;
    }

    setExportCount(prev => prev + 1);
    return true;
  };

  const logExportAudit = async (exportId: string, status: 'in_progress' | 'completed' | 'failed', error?: string) => {
    try {
      const audit: ExportAudit = {
        id: exportId,
        user_id: user?.id || 'anonymous',
        format: previewFormat,
        filters: exportFilters,
        started_at: new Date().toISOString(),
        completed_at: status !== 'in_progress' ? new Date().toISOString() : undefined,
        status,
        error,
        ip_address: window.location.hostname,
        user_agent: navigator.userAgent,
      };

      await supabase.from('export_audit_logs').insert(audit);
    } catch (error) {
      console.error('Erro ao registrar auditoria:', error);
    }
  };

  const handleExport = async (format: 'excel' | 'pdf' | 'csv' | 'json' | 'xml' | 'html') => {
    if (!user) {
      toast({
        title: 'Acesso Negado',
        description: 'Você precisa estar autenticado para exportar relatórios.',
        variant: 'destructive',
      });
      return;
    }

    if (!checkRateLimit()) {
      return;
    }

    if (!validateFilters(exportFilters)) {
      toast({
        title: 'Erro de Validação',
        description: 'Por favor, corrija os erros nos filtros antes de exportar.',
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    try {
      // Registra o início da exportação
      const exportId = crypto.randomUUID();
      await logExportAudit(exportId, 'in_progress');

      // Simula progresso de exportação
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      // Realiza a exportação
      switch (format) {
        case 'excel':
          await exportToExcel();
          break;
        case 'pdf':
          await exportToPDF();
          break;
        case 'csv':
          await exportToCSV();
          break;
        case 'json':
          await exportToJSON();
          break;
        case 'xml':
          await exportToXML(filteredData);
          break;
        case 'html':
          await exportToHTML(filteredData);
          break;
      }

      // Registra o sucesso da exportação
      await logExportAudit(exportId, 'completed');

      // Atualiza o histórico de exportações
      const { data: newExport } = await supabase
        .from('export_logs')
        .select('*')
        .eq('id', exportId)
        .single();

      if (newExport) {
        setRecentExports(prev => [newExport, ...prev].slice(0, 5));
      }

      clearInterval(progressInterval);
      setExportProgress(100);

      toast({
        title: 'Exportação Concluída',
        description: `Relatório exportado com sucesso em ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      await logExportAudit(exportId, 'failed', error instanceof Error ? error.message : 'Erro desconhecido');
      toast({
        title: 'Erro na Exportação',
        description: 'Ocorreu um erro ao exportar o relatório.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const validateFilters = (filters: ExportFilters): boolean => {
    try {
      exportFiltersSchema.parse(filters);
      setValidationErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0].toString()] = err.message;
          }
        });
        setValidationErrors(errors);
      }
      return false;
    }
  };

  const exportToXML = (data: any) => {
    const xmlData = {
      _declaration: { _attributes: { version: '1.0', encoding: 'UTF-8' } },
      relatorio: {
        _attributes: {
          data: format(new Date(), 'yyyy-MM-dd HH:mm:ss', { locale: ptBR }),
        },
        alertas: {
          alerta: data.alerts.map((alert: any) => ({
            _attributes: {
              id: alert.id,
              data: format(new Date(alert.created_at), 'yyyy-MM-dd HH:mm:ss', { locale: ptBR }),
              status: alert.status,
            },
            _text: alert.message,
          })),
        },
        logs: {
          log: data.logs.map((log: any) => ({
            _attributes: {
              id: log.id,
              data: format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss', { locale: ptBR }),
              acao: log.action,
              email: log.email,
              ip: log.ip,
              status: log.success ? 'sucesso' : 'falha',
            },
          })),
        },
        ipsBloqueados: {
          ip: data.blockedIPs.map((ip: any) => ({
            _attributes: {
              id: ip.id,
              ip: ip.ip,
              motivo: ip.reason,
              bloqueadoEm: format(new Date(ip.blocked_at), 'yyyy-MM-dd HH:mm:ss', { locale: ptBR }),
              expiraEm: format(new Date(ip.expires_at), 'yyyy-MM-dd HH:mm:ss', { locale: ptBR }),
            },
          })),
        },
      },
    };

    const xmlString = xml2js.js2xml(xmlData, { compact: true, spaces: 2 });
    const blob = new Blob([xmlString], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_seguranca_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.xml`;
    link.click();
  };

  const exportToHTML = (data: any, template?: ExportTemplate) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <title>Relatório de Segurança</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              margin: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
            }
            .badge {
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
            }
            .success { background-color: #d4edda; color: #155724; }
            .failure { background-color: #f8d7da; color: #721c24; }
            .pending { background-color: #fff3cd; color: #856404; }
            .resolved { background-color: #d1ecf1; color: #0c5460; }
            .investigating { background-color: #e2e3e5; color: #383d41; }
          </style>
        </head>
        <body>
          <h1>Relatório de Segurança</h1>
          <p>Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>

          <h2>Alertas de Segurança</h2>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Mensagem</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${data.alerts.map((alert: any) => `
                <tr>
                  <td>${format(new Date(alert.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</td>
                  <td>${alert.message}</td>
                  <td><span class="badge ${alert.status}">${alert.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <h2>Logs de Segurança</h2>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Ação</th>
                <th>Email</th>
                <th>IP</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${data.logs.map((log: any) => `
                <tr>
                  <td>${format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</td>
                  <td>${log.action}</td>
                  <td>${log.email}</td>
                  <td>${log.ip}</td>
                  <td><span class="badge ${log.success ? 'success' : 'failure'}">${log.success ? 'Sucesso' : 'Falha'}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <h2>IPs Bloqueados</h2>
          <table>
            <thead>
              <tr>
                <th>IP</th>
                <th>Motivo</th>
                <th>Bloqueado em</th>
                <th>Expira em</th>
              </tr>
            </thead>
            <tbody>
              ${data.blockedIPs.map((ip: any) => `
                <tr>
                  <td>${ip.ip}</td>
                  <td>${ip.reason}</td>
                  <td>${format(new Date(ip.blocked_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</td>
                  <td>${format(new Date(ip.expires_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_seguranca_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.html`;
    link.click();
  };

  const saveTemplate = async () => {
    try {
      const template: ExportTemplate = {
        id: crypto.randomUUID(),
        name: `Template ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`,
        format: previewFormat,
        filters: exportFilters,
        columns: ['data', 'mensagem', 'status', 'acao', 'email', 'ip'],
      };

      const { error } = await supabase
        .from('export_templates')
        .insert(template);

      if (error) throw error;

      setTemplates(prev => [...prev, template]);
      toast({
        title: 'Template Salvo',
        description: 'Template salvo com sucesso',
      });
    } catch (error) {
      console.error('Erro ao salvar template:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o template',
        variant: 'destructive',
      });
    }
  };

  const applyTemplate = (template: ExportTemplate) => {
    setExportFilters(template.filters);
    setPreviewFormat(template.format);
    setSelectedTemplate(template.id);
  };

  // Função para renderizar o preview dos dados exportáveis
  function renderPreview() {
    if (!previewData) return <div>Nenhum dado para pré-visualizar.</div>;
    switch (previewFormat) {
      case 'excel':
      case 'csv':
        return (
          <div>
            <h4 className="font-semibold mb-2">Alertas</h4>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-48">{JSON.stringify(previewData.alerts, null, 2)}</pre>
            <h4 className="font-semibold mb-2 mt-4">Logs</h4>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-48">{JSON.stringify(previewData.logs, null, 2)}</pre>
            <h4 className="font-semibold mb-2 mt-4">IPs Bloqueados</h4>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-48">{JSON.stringify(previewData.blockedIPs, null, 2)}</pre>
          </div>
        );
      case 'json':
        return <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-96">{JSON.stringify(previewData, null, 2)}</pre>;
      case 'xml':
        return <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-96">{xml2js.js2xml({ relatorio: previewData }, { compact: true, spaces: 2 })}</pre>;
      case 'html':
        return <div className="bg-white border p-2 rounded text-xs overflow-x-auto max-h-96"><div dangerouslySetInnerHTML={{ __html: '<b>Preview HTML não disponível no modal.</b>' }} /></div>;
      case 'pdf':
        return <div className="text-sm text-gray-500">Pré-visualização de PDF não suportada no modal.</div>;
      default:
        return <div>Nenhum preview disponível para este formato.</div>;
    }
  }

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard de Segurança</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowExportFilters(!showExportFilters)} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {showExportFilters && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros de Exportação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Data Inicial</label>
                <Input
                  type="date"
                  value={exportFilters.startDate}
                  onChange={(e) => setExportFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  className={validationErrors.startDate ? 'border-red-500' : ''}
                />
                {validationErrors.startDate && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.startDate}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Data Final</label>
                <Input
                  type="date"
                  value={exportFilters.endDate}
                  onChange={(e) => setExportFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  className={validationErrors.endDate ? 'border-red-500' : ''}
                />
                {validationErrors.endDate && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.endDate}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Status do Alerta</label>
                <Select
                  value={exportFilters.alertStatus}
                  onValueChange={(value) => setExportFilters(prev => ({ ...prev, alertStatus: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status do Alerta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="resolved">Resolvidos</SelectItem>
                    <SelectItem value="investigating">Em Investigação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Status do Log</label>
                <Select
                  value={exportFilters.logSuccess === null ? 'all' : exportFilters.logSuccess ? 'success' : 'failure'}
                  onValueChange={(value) => setExportFilters(prev => ({
                    ...prev,
                    logSuccess: value === 'all' ? null : value === 'success',
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status do Log" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="success">Sucesso</SelectItem>
                    <SelectItem value="failure">Falha</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">IP</label>
                <Input
                  placeholder="Filtrar por IP"
                  value={exportFilters.ipAddress}
                  onChange={(e) => setExportFilters(prev => ({ ...prev, ipAddress: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  placeholder="Filtrar por email"
                  value={exportFilters.email}
                  onChange={(e) => setExportFilters(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            {/* Templates */}
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Templates</h3>
              <div className="flex gap-2">
                <Select
                  value={selectedTemplate || ''}
                  onValueChange={(value) => {
                    const template = templates.find(t => t.id === value);
                    if (template) {
                      applyTemplate(template);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={saveTemplate} variant="outline">
                  Salvar Template
                </Button>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button onClick={() => handlePreview('excel')} variant="outline">
                <TableIcon className="w-4 h-4 mr-2" />
                Preview Excel
              </Button>
              <Button onClick={() => handlePreview('pdf')} variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Preview PDF
              </Button>
              <Button onClick={() => handlePreview('csv')} variant="outline">
                <TableIcon className="w-4 h-4 mr-2" />
                Preview CSV
              </Button>
              <Button onClick={() => handlePreview('json')} variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Preview JSON
              </Button>
              <Button onClick={() => handlePreview('xml')} variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Preview XML
              </Button>
              <Button onClick={() => handlePreview('html')} variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Preview HTML
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Preview do Relatório</DialogTitle>
            <DialogDescription>
              Visualize os dados antes de exportar em {previewFormat.toUpperCase()}
            </DialogDescription>
          </DialogHeader>
          {renderPreview()}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Cancelar
            </Button>
            <Button onClick={() => handleExport(previewFormat)}>
              Exportar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total de Alertas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalAlerts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Alertas Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pendingAlerts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">IPs Bloqueados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.blockedIPs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Logins Falhos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.failedLogins}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Atividades Suspeitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.suspiciousActivities}</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Séries Temporais */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades de Segurança ao Longo do Tempo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="failedLogins"
                  stroke="#ef4444"
                  name="Logins Falhos"
                />
                <Line
                  type="monotone"
                  dataKey="suspiciousActivities"
                  stroke="#f59e0b"
                  name="Atividades Suspeitas"
                />
                <Line
                  type="monotone"
                  dataKey="alerts"
                  stroke="#3b82f6"
                  name="Alertas"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Buscar por email, IP ou ação..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Últimas 24 horas</SelectItem>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
          </SelectContent>
        </Select>
        <Select value={alertStatus} onValueChange={setAlertStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status do Alerta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="resolved">Resolvidos</SelectItem>
            <SelectItem value="investigating">Em Investigação</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={fetchSecurityData}>Atualizar</Button>
      </div>

      {/* Alertas de Segurança */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas de Segurança</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Mensagem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {securityAlerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>
                    {format(new Date(alert.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </TableCell>
                  <TableCell>{alert.message}</TableCell>
                  <TableCell>{getStatusBadge(alert.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {alert.status === 'pending' && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleAlertAction(alert.id, 'resolve')}
                            >
                              Resolver
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAlertAction(alert.id, 'investigate')}
                            >
                              Investigar
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* IPs Bloqueados */}
      <Card>
        <CardHeader>
          <CardTitle>IPs Bloqueados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>IP</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Bloqueado em</TableHead>
                <TableHead>Expira em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blockedIPs.map((ip) => (
                <TableRow key={ip.id}>
                  <TableCell>{ip.ip}</TableCell>
                  <TableCell>{ip.reason}</TableCell>
                  <TableCell>
                    {format(new Date(ip.blocked_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    {format(new Date(ip.expires_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Logs de Segurança */}
      <Card>
        <CardHeader>
          <CardTitle>Logs de Segurança</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {securityLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.email}</TableCell>
                  <TableCell>{log.ip}</TableCell>
                  <TableCell>
                    <Badge className={log.success ? 'bg-green-500' : 'bg-red-500'}>
                      {log.success ? 'Sucesso' : 'Falha'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Paginação */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-700">
            Mostrando {((pagination.page - 1) * pagination.pageSize) + 1} a{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} de{' '}
            {pagination.total} registros
          </p>
          <Select
            value={pagination.pageSize.toString()}
            onValueChange={(value) => handlePageSizeChange(Number(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
          >
            Próxima
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Histórico de Exportações Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Exportações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Formato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Filtros</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentExports.map((exportItem) => (
                <TableRow key={exportItem.id}>
                  <TableCell>
                    {format(new Date(exportItem.started_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </TableCell>
                  <TableCell>{exportItem.user_id}</TableCell>
                  <TableCell>{exportItem.format.toUpperCase()}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        exportItem.status === 'completed'
                          ? 'bg-green-500'
                          : exportItem.status === 'in_progress'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }
                    >
                      {exportItem.status === 'completed'
                        ? 'Concluído'
                        : exportItem.status === 'in_progress'
                        ? 'Em Progresso'
                        : 'Falhou'}
                    </Badge>
                  </TableCell>
                  <TableCell>{exportItem.ip_address}</TableCell>
                  <TableCell>
                    <pre className="text-xs">
                      {JSON.stringify(exportItem.filters, null, 2)}
                    </pre>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Progresso da Exportação */}
      {isExporting && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
            <span>Exportando relatório...</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${exportProgress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
} 
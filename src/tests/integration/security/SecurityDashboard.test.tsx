import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SecurityDashboard } from '@/components/security/SecurityDashboard';
import { supabase } from '@/lib/supabase';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

// Mock das dependências
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
    })),
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(),
      unsubscribe: vi.fn(),
    })),
  },
}));

vi.mock('xlsx', () => ({
  utils: {
    book_new: vi.fn(),
    json_to_sheet: vi.fn(),
    book_append_sheet: vi.fn(),
  },
  writeFile: vi.fn(),
}));

vi.mock('jspdf', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      setFontSize: vi.fn().mockReturnThis(),
      text: vi.fn().mockReturnThis(),
      addPage: vi.fn().mockReturnThis(),
      save: vi.fn(),
      autoTable: vi.fn(),
    })),
  };
});

describe('SecurityDashboard', () => {
  const mockSecurityAlerts = [
    {
      id: '1',
      message: 'Tentativa de login suspeita',
      created_at: '2024-03-20T10:00:00Z',
      status: 'pending',
    },
  ];

  const mockBlockedIPs = [
    {
      id: '1',
      ip: '192.168.1.1',
      blocked_at: '2024-03-20T10:00:00Z',
      reason: 'Múltiplas tentativas de login',
      expires_at: '2024-03-21T10:00:00Z',
    },
  ];

  const mockSecurityLogs = [
    {
      id: '1',
      action: 'login_attempt',
      email: 'test@example.com',
      ip: '192.168.1.1',
      success: false,
      timestamp: '2024-03-20T10:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.from as any).mockImplementation((table) => ({
      select: () => ({
        data: table === 'security_alerts' ? mockSecurityAlerts :
              table === 'blocked_ips' ? mockBlockedIPs :
              mockSecurityLogs,
        error: null,
      }),
    }));
  });

  it('deve renderizar o dashboard corretamente', async () => {
    render(<SecurityDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard de Segurança')).toBeInTheDocument();
      expect(screen.getByText('Alertas de Segurança')).toBeInTheDocument();
      expect(screen.getByText('IPs Bloqueados')).toBeInTheDocument();
      expect(screen.getByText('Logs de Segurança')).toBeInTheDocument();
    });
  });

  it('deve exportar relatório em Excel', async () => {
    render(<SecurityDashboard />);
    
    const excelButton = screen.getByText('Exportar Excel');
    fireEvent.click(excelButton);

    await waitFor(() => {
      expect(XLSX.utils.book_new).toHaveBeenCalled();
      expect(XLSX.utils.json_to_sheet).toHaveBeenCalledTimes(3); // Alertas, IPs e Logs
      expect(XLSX.writeFile).toHaveBeenCalled();
    });
  });

  it('deve exportar relatório em PDF', async () => {
    render(<SecurityDashboard />);
    
    const pdfButton = screen.getByText('Exportar PDF');
    fireEvent.click(pdfButton);

    await waitFor(() => {
      expect(jsPDF).toHaveBeenCalled();
      const pdfInstance = (jsPDF as any).mock.results[0].value;
      expect(pdfInstance.setFontSize).toHaveBeenCalled();
      expect(pdfInstance.text).toHaveBeenCalled();
      expect(pdfInstance.save).toHaveBeenCalled();
    });
  });

  it('deve atualizar status do alerta ao resolver', async () => {
    render(<SecurityDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Tentativa de login suspeita')).toBeInTheDocument();
    });

    const actionButton = screen.getByRole('button', { name: /ações/i });
    fireEvent.click(actionButton);

    const resolveButton = screen.getByText('Resolver');
    fireEvent.click(resolveButton);

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('security_alerts');
      expect(supabase.from('security_alerts').update).toHaveBeenCalledWith({
        status: 'resolved',
      });
    });
  });

  it('deve atualizar status do alerta ao investigar', async () => {
    render(<SecurityDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Tentativa de login suspeita')).toBeInTheDocument();
    });

    const actionButton = screen.getByRole('button', { name: /ações/i });
    fireEvent.click(actionButton);

    const investigateButton = screen.getByText('Investigar');
    fireEvent.click(investigateButton);

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('security_alerts');
      expect(supabase.from('security_alerts').update).toHaveBeenCalledWith({
        status: 'investigating',
      });
    });
  });

  it('deve filtrar alertas por status', async () => {
    render(<SecurityDashboard />);
    
    const statusSelect = screen.getByRole('combobox', { name: /status do alerta/i });
    fireEvent.change(statusSelect, { target: { value: 'pending' } });

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('security_alerts');
      expect(supabase.from('security_alerts').select).toHaveBeenCalled();
    });
  });

  it('deve filtrar por período', async () => {
    render(<SecurityDashboard />);
    
    const periodSelect = screen.getByRole('combobox', { name: /período/i });
    fireEvent.change(periodSelect, { target: { value: '7d' } });

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('security_logs');
      expect(supabase.from('security_logs').select).toHaveBeenCalled();
    });
  });

  it('deve exportar relatório em CSV', async () => {
    render(<SecurityDashboard />);
    
    const exportButton = screen.getByText('Exportar Relatório');
    fireEvent.click(exportButton);

    const csvButton = screen.getByText('Exportar CSV');
    fireEvent.click(csvButton);

    await waitFor(() => {
      const link = document.createElement('a');
      expect(link.download).toContain('relatorio_seguranca_');
      expect(link.download).toContain('.csv');
    });
  });

  it('deve exportar relatório em JSON', async () => {
    render(<SecurityDashboard />);
    
    const exportButton = screen.getByText('Exportar Relatório');
    fireEvent.click(exportButton);

    const jsonButton = screen.getByText('Exportar JSON');
    fireEvent.click(jsonButton);

    await waitFor(() => {
      const link = document.createElement('a');
      expect(link.download).toContain('relatorio_seguranca_');
      expect(link.download).toContain('.json');
    });
  });

  it('deve aplicar filtros de exportação', async () => {
    render(<SecurityDashboard />);
    
    const exportButton = screen.getByText('Exportar Relatório');
    fireEvent.click(exportButton);

    // Preenche os filtros
    const startDateInput = screen.getByLabelText('Data Inicial');
    const endDateInput = screen.getByLabelText('Data Final');
    const statusSelect = screen.getByLabelText('Status do Alerta');
    const logStatusSelect = screen.getByLabelText('Status do Log');
    const ipInput = screen.getByLabelText('IP');
    const emailInput = screen.getByLabelText('Email');

    fireEvent.change(startDateInput, { target: { value: '2024-03-01' } });
    fireEvent.change(endDateInput, { target: { value: '2024-03-20' } });
    fireEvent.change(statusSelect, { target: { value: 'pending' } });
    fireEvent.change(logStatusSelect, { target: { value: 'failure' } });
    fireEvent.change(ipInput, { target: { value: '192.168.1.1' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Exporta em JSON para verificar os filtros
    const jsonButton = screen.getByText('Exportar JSON');
    fireEvent.click(jsonButton);

    await waitFor(() => {
      const link = document.createElement('a');
      expect(link.download).toContain('relatorio_seguranca_');
      expect(link.download).toContain('.json');
    });
  });

  it('deve mostrar/esconder painel de filtros de exportação', async () => {
    render(<SecurityDashboard />);
    
    // Inicialmente não deve mostrar os filtros
    expect(screen.queryByText('Filtros de Exportação')).not.toBeInTheDocument();

    // Clica no botão de exportar
    const exportButton = screen.getByText('Exportar Relatório');
    fireEvent.click(exportButton);

    // Deve mostrar os filtros
    expect(screen.getByText('Filtros de Exportação')).toBeInTheDocument();

    // Clica novamente para esconder
    fireEvent.click(exportButton);

    // Deve esconder os filtros
    expect(screen.queryByText('Filtros de Exportação')).not.toBeInTheDocument();
  });
}); 
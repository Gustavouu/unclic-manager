import { renderHook, act } from '@testing-library/react-hooks';
import { useDashboardData } from '@/hooks/useDashboardData';

// Mock para o cliente Supabase
jest.mock('@/utils/supabaseClient', () => ({
  supabase: {
    rpc: jest.fn(),
  },
}));

// Mock para o componente de toast
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe('useDashboardData', () => {
  // Preparar um mock para a função localStorage.getItem
  const mockGetItem = jest.fn();
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: mockGetItem,
    },
    writable: true,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockReturnValue('test-tenant-id');
  });

  it('deve inicializar com valores default', () => {
    const { result } = renderHook(() => useDashboardData());
    
    expect(result.current.metrics).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    
    // Verificar se o dateRange está configurado para os últimos 30 dias
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString().split('T')[0];
    
    expect(result.current.dateRange.to).toBe(today);
    expect(result.current.dateRange.from).toBe(thirtyDaysAgo);
  });

  it('deve atualizar o range de datas', () => {
    const { result } = renderHook(() => useDashboardData());
    
    const newDateRange = {
      from: '2023-01-01',
      to: '2023-01-31',
    };
    
    act(() => {
      result.current.updateDateRange(newDateRange);
    });
    
    expect(result.current.dateRange).toEqual(newDateRange);
  });

  it('deve buscar dados do dashboard quando montado', async () => {
    const mockRpc = require('@/utils/supabaseClient').supabase.rpc;
    mockRpc.mockResolvedValue({
      data: [
        {
          data_referencia: '2023-01-01',
          total_agendamentos: 10,
          total_vendas: 1000,
          ticket_medio: 100,
          taxa_cancelamento: 5,
          novos_clientes: 3,
          servicos_populares: [
            { servico: 'Corte', total: 5 },
            { servico: 'Coloração', total: 3 },
          ],
          horarios_pico: [
            { hora: 14, total: 4 },
            { hora: 15, total: 3 },
          ],
        },
      ],
      error: null,
    });
    
    const { result, waitForNextUpdate } = renderHook(() => useDashboardData());
    
    // Esperar pela atualização do state após a chamada do useEffect
    await waitForNextUpdate();
    
    // Verificar se a função RPC do Supabase foi chamada com os parâmetros corretos
    expect(mockRpc).toHaveBeenCalledWith('obter_metricas_periodo', {
      p_tenant_id: 'test-tenant-id',
      p_data_inicio: result.current.dateRange.from,
      p_data_fim: result.current.dateRange.to,
    });
    
    // Verificar se os dados foram processados corretamente
    expect(result.current.metrics).toEqual({
      total_agendamentos: 10,
      total_vendas: 1000,
      ticket_medio: 100,
      taxa_cancelamento: 5,
      novos_clientes: 3,
      servicos_populares: [
        { servico: 'Corte', total: 5 },
        { servico: 'Coloração', total: 3 },
      ],
      horarios_pico: [
        { hora: 14, total: 4 },
        { hora: 15, total: 3 },
      ],
    });
  });

  it('deve tratar erros ao buscar dados', async () => {
    const mockRpc = require('@/utils/supabaseClient').supabase.rpc;
    mockRpc.mockResolvedValue({
      data: null,
      error: { message: 'Erro ao buscar dados' },
    });
    
    const { result, waitForNextUpdate } = renderHook(() => useDashboardData());
    
    // Esperar pela atualização do state após a chamada do useEffect
    await waitForNextUpdate();
    
    // Verificar se o erro foi capturado corretamente
    expect(result.current.error).toBe('Erro ao buscar dados');
    expect(result.current.metrics).toBeNull();
  });
});

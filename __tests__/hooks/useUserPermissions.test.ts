import { renderHook, act } from '@testing-library/react-hooks';
import { useUserPermissions } from '@/hooks/useUserPermissions';

// Mock para o cliente Supabase
jest.mock('@/utils/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn(),
  },
}));

describe('useUserPermissions', () => {
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

  it('deve buscar papel e permissões do usuário', async () => {
    // Configurar mocks para auth.getUser
    const mockGetUser = require('@/utils/supabaseClient').supabase.auth.getUser;
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
    });
    
    // Configurar mocks para consulta de tenant_users
    const mockSingle = require('@/utils/supabaseClient').supabase.from().select().eq().eq().single;
    mockSingle.mockResolvedValue({
      data: { role: 'admin' },
      error: null,
    });
    
    // Configurar mocks para consulta de role_permissions
    const mockOrder = require('@/utils/supabaseClient').supabase.from().select().eq().order;
    mockOrder.mockResolvedValue({
      data: [
        {
          permissions: {
            id: 'perm-1',
            name: 'dashboard:view',
            description: 'Ver dashboard',
          },
        },
        {
          permissions: {
            id: 'perm-2',
            name: 'users:manage',
            description: 'Gerenciar usuários',
          },
        },
      ],
      error: null,
    });
    
    const { result, waitForNextUpdate } = renderHook(() => useUserPermissions());
    
    // Esperar pela atualização do state após a chamada do useEffect
    await waitForNextUpdate();
    
    // Verificar se o papel foi definido corretamente
    expect(result.current.role).toBe('admin');
    
    // Verificar se as permissões foram carregadas corretamente
    expect(result.current.permissions).toEqual([
      {
        id: 'perm-1',
        name: 'dashboard:view',
        description: 'Ver dashboard',
      },
      {
        id: 'perm-2',
        name: 'users:manage',
        description: 'Gerenciar usuários',
      },
    ]);
    
    // Verificar se o administrador tem permissão para ver o dashboard
    expect(result.current.hasPermission('dashboard:view')).toBe(true);
    
    // Verificar se o administrador pode acessar seções protegidas
    expect(result.current.canAccess(['dashboard:view'])).toBe(true);
    expect(result.current.canAccess(['nonexistent:permission'])).toBe(true); // Admin tem acesso a tudo
    
    // Verificar se é admin
    expect(result.current.isAdmin()).toBe(true);
    
    // Verificar se é gerente
    expect(result.current.isManager()).toBe(true);
  });

  it('deve definir erro se o usuário não estiver autenticado', async () => {
    // Configurar mocks para auth.getUser
    const mockGetUser = require('@/utils/supabaseClient').supabase.auth.getUser;
    mockGetUser.mockResolvedValue({
      data: { user: null },
    });
    
    const { result, waitForNextUpdate } = renderHook(() => useUserPermissions());
    
    // Esperar pela atualização do state após a chamada do useEffect
    await waitForNextUpdate();
    
    // Verificar se o erro foi definido corretamente
    expect(result.current.error).toBe('Usuário não autenticado');
    expect(result.current.role).toBeNull();
    expect(result.current.permissions).toEqual([]);
  });

  it('deve definir erro se o tenant não estiver selecionado', async () => {
    // Configurar mocks para auth.getUser
    const mockGetUser = require('@/utils/supabaseClient').supabase.auth.getUser;
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
    });
    
    // Configurar mock para localStorage.getItem retornar null
    mockGetItem.mockReturnValue(null);
    
    const { result, waitForNextUpdate } = renderHook(() => useUserPermissions());
    
    // Esperar pela atualização do state após a chamada do useEffect
    await waitForNextUpdate();
    
    // Verificar se o erro foi definido corretamente
    expect(result.current.error).toBe('Tenant não selecionado');
    expect(result.current.role).toBeNull();
    expect(result.current.permissions).toEqual([]);
  });

  it('deve atualizar papel e permissões ao chamar refreshPermissions', async () => {
    // Configurar mocks para auth.getUser
    const mockGetUser = require('@/utils/supabaseClient').supabase.auth.getUser;
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
    });
    
    // Configurar mocks para consulta de tenant_users
    const mockSingle = require('@/utils/supabaseClient').supabase.from().select().eq().eq().single;
    mockSingle.mockResolvedValueOnce({
      data: { role: 'staff' },
      error: null,
    }).mockResolvedValueOnce({
      data: { role: 'manager' },
      error: null,
    });
    
    // Configurar mocks para consulta de role_permissions
    const mockOrder = require('@/utils/supabaseClient').supabase.from().select().eq().order;
    mockOrder.mockResolvedValueOnce({
      data: [
        {
          permissions: {
            id: 'perm-1',
            name: 'dashboard:view',
            description: 'Ver dashboard',
          },
        },
      ],
      error: null,
    }).mockResolvedValueOnce({
      data: [
        {
          permissions: {
            id: 'perm-1',
            name: 'dashboard:view',
            description: 'Ver dashboard',
          },
        },
        {
          permissions: {
            id: 'perm-3',
            name: 'reports:view',
            description: 'Ver relatórios',
          },
        },
      ],
      error: null,
    });
    
    const { result, waitForNextUpdate } = renderHook(() => useUserPermissions());
    
    // Esperar pela atualização do state após a chamada do useEffect
    await waitForNextUpdate();
    
    // Verificar se o papel inicial foi definido corretamente
    expect(result.current.role).toBe('staff');
    expect(result.current.permissions.length).toBe(1);
    
    // Chamar refreshPermissions para atualizar os dados
    act(() => {
      result.current.refreshPermissions();
    });
    
    // Esperar pela atualização do state após a chamada de refreshPermissions
    await waitForNextUpdate();
    
    // Verificar se o papel foi atualizado corretamente
    expect(result.current.role).toBe('manager');
    expect(result.current.permissions.length).toBe(2);
    expect(result.current.isManager()).toBe(true);
    expect(result.current.isAdmin()).toBe(false);
  });
});

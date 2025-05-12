
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/utils';
import { StatusFixButton } from './StatusFixButton';
import { useTenant } from '@/contexts/TenantContext';
import { useNeedsOnboarding } from '@/hooks/useNeedsOnboarding';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('@/contexts/TenantContext', () => ({
  useTenant: vi.fn(),
}));

vi.mock('@/hooks/useNeedsOnboarding', () => ({
  useNeedsOnboarding: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    loading: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('StatusFixButton', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Setup default mocks
    (useTenant as any).mockReturnValue({
      currentBusiness: { id: 'test-id', status: 'pendente' },
      updateBusinessStatus: vi.fn().mockResolvedValue(true),
    });
    
    (useNeedsOnboarding as any).mockReturnValue({
      refreshOnboardingStatus: vi.fn().mockResolvedValue(undefined),
    });
  });
  
  it('renders correctly when business status is pending', () => {
    render(<StatusFixButton />);
    expect(screen.getByRole('button', { name: /corrigir status/i })).toBeInTheDocument();
  });
  
  it('does not render when business status is not pending', () => {
    (useTenant as any).mockReturnValue({
      currentBusiness: { id: 'test-id', status: 'ativo' },
      updateBusinessStatus: vi.fn(),
    });
    
    const { container } = render(<StatusFixButton />);
    expect(container).toBeEmptyDOMElement();
  });
  
  it('calls updateBusinessStatus when clicked', async () => {
    const mockUpdateBusinessStatus = vi.fn().mockResolvedValue(true);
    const mockRefreshOnboardingStatus = vi.fn().mockResolvedValue(undefined);
    
    (useTenant as any).mockReturnValue({
      currentBusiness: { id: 'test-id', status: 'pendente' },
      updateBusinessStatus: mockUpdateBusinessStatus,
    });
    
    (useNeedsOnboarding as any).mockReturnValue({
      refreshOnboardingStatus: mockRefreshOnboardingStatus,
    });
    
    render(<StatusFixButton />);
    
    // Mock localStorage.removeItem
    const localStorageRemoveItemSpy = vi.spyOn(Storage.prototype, 'removeItem');
    
    // Click the button
    fireEvent.click(screen.getByRole('button', { name: /corrigir status/i }));
    
    // Verify loading toast was shown
    expect(toast.loading).toHaveBeenCalledWith(
      expect.stringContaining('Corrigindo status'),
      expect.anything()
    );
    
    // Wait for the operation to complete
    await waitFor(() => {
      expect(mockUpdateBusinessStatus).toHaveBeenCalledWith('test-id', 'ativo');
      expect(localStorageRemoveItemSpy).toHaveBeenCalledTimes(2);
      expect(mockRefreshOnboardingStatus).toHaveBeenCalledWith(true);
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringContaining('Status do negócio corrigido'),
        expect.anything()
      );
    });
  });
});

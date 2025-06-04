
export interface TenantContextType {
  businessId: string | null;
  businessName: string | null;
  currentBusiness: { id: string; name: string } | null;
  tenantId: string | null;
  loading: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  refreshBusinessData: () => Promise<void>;
}

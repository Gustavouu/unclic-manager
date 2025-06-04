
export interface TenantContextType {
  businessId: string | null;
  tenantId: string | null;
  loading: boolean;
  error: string | null;
  refreshBusinessData: () => Promise<void>;
}

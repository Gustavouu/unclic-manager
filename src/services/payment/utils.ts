
import { PaymentResponse } from "./types";

/**
 * Maps Efi Bank status to internal application status
 */
export function mapEfiBankStatus(efiBankStatus: string): PaymentResponse['status'] {
  switch (efiBankStatus) {
    case 'completed':
    case 'approved':
      return 'approved';
    case 'failed':
    case 'rejected':
      return 'rejected';
    case 'canceled':
    case 'cancelled':
      return 'cancelled';
    case 'processing':
      return 'processing';
    case 'pending':
    default:
      return 'pending';
  }
}

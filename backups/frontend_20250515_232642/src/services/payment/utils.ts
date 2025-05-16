
/**
 * Maps EFI Bank payment status to our internal payment status
 */
export const mapEfiBankStatus = (status: string): string => {
  switch (status) {
    case 'approved':
    case 'confirmed':
    case 'paid':
      return 'aprovado';
    case 'pending':
    case 'created':
    case 'waiting':
      return 'pendente';
    case 'processing':
    case 'in_process':
      return 'processando';
    case 'rejected':
    case 'cancelled':
    case 'failed':
      return 'rejeitado';
    default:
      return 'pendente';
  }
};

/**
 * Maps our internal payment status to EFI Bank payment status
 */
export const mapToEfiBankStatus = (status: string): string => {
  switch (status) {
    case 'aprovado':
      return 'approved';
    case 'pendente':
      return 'pending';
    case 'processando':
      return 'processing';
    case 'rejeitado':
      return 'rejected';
    case 'cancelado':
      return 'cancelled';
    default:
      return 'pending';
  }
};


export interface BookingFlowProps {
  businessName: string;
  closeFlow: () => void;
}

export interface ClientData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

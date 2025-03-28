import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CreditCard, Wallet, Timer, ArrowRight } from "lucide-react";
import { formatPrice } from "@/components/website/WebsiteUtils";
import { BookingData } from "../types";
import { usePaymentStep } from "./payment/usePaymentStep";
import { Appointment } from "@/components/appointments/types";
import { v4 as uuidv4 } from "uuid";
import { DEFAULT_UUID } from "@/hooks/appointments/utils";

interface StepPaymentProps {
  bookingData: BookingData;
  nextStep: () => void;
  createAppointment?: (appointment: Omit<Appointment, 'id'>) => Promise<string>;
}

export function StepPayment({ bookingData, nextStep, createAppointment }: StepPaymentProps) {
  const { 
    paymentMethod, 
    isProcessing, 
    paymentError, 
    handlePaymentMethodSelect, 
    handlePayment 
  } = usePaymentStep({ bookingData, nextStep });

  const handlePaymentSubmit = async () => {
    if (createAppointment && bookingData.date) {
      try {
        // Build appointment date from booking data
        const appointmentDate = new Date(bookingData.date);
        const [hours, minutes] = bookingData.time.split(':').map(Number);
        appointmentDate.setHours(hours, minutes, 0, 0);
        
        // Generate valid UUIDs if missing
        const serviceId = bookingData.serviceId || uuidv4();
        const professionalId = bookingData.professionalId || uuidv4();
        
        // Create appointment using the provided function
        await createAppointment({
          clientName: "Cliente do site", // This could be improved with actual user data
          serviceName: bookingData.serviceName,
          date: appointmentDate,
          status: "agendado",
          price: bookingData.servicePrice,
          serviceType: "haircut", // This could be improved with actual categories
          duration: bookingData.serviceDuration,
          notes: bookingData.notes,
          serviceId: serviceId,
          clientId: uuidv4(), // Generate a valid client ID for website bookings
          professionalId: professionalId,
          businessId: DEFAULT_UUID,
          paymentMethod: paymentMethod
        });
        
        // Proceed to next step
        nextStep();
      } catch (error) {
        console.error("Error creating appointment:", error);
        // Continue with regular payment flow as fallback
        handlePayment();
      }
    } else {
      // Use the original payment flow if createAppointment not available
      handlePayment();
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Dados do Agendamento</CardTitle>
              <CardDescription>Confirme os detalhes do seu agendamento</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Serviço</p>
                <p className="font-medium">{bookingData.serviceName}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Profissional</p>
                <p className="font-medium">{bookingData.professionalName}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Data e Hora</p>
                <p className="font-medium">
                  {bookingData.date && (
                    <>
                      {format(bookingData.date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      {" às "}
                      {bookingData.time}
                    </>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Forma de Pagamento</CardTitle>
              <CardDescription>Escolha como deseja pagar</CardDescription>
            </CardHeader>
            
            <CardContent>
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={handlePaymentMethodSelect}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2 border p-3 rounded-md">
                  <RadioGroupItem value="credit_card" id="credit_card" />
                  <Label htmlFor="credit_card" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Cartão de Crédito</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 border p-3 rounded-md">
                  <RadioGroupItem value="pix" id="pix" />
                  <Label htmlFor="pix" className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hash">
                      <line x1="4" x2="4" y1="9" y2="15" />
                      <line x1="12" x2="12" y1="9" y2="15" />
                      <line x1="1" x2="7" y1="4" y2="4" />
                      <line x1="9" x2="15" y1="4" y2="4" />
                      <line x1="1" x2="7" y1="12" y2="12" />
                      <line x1="9" x2="15" y1="12" y2="12" />
                    </svg>
                    <span>Pix</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 border p-3 rounded-md">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    <span>Dinheiro no Local</span>
                  </Label>
                </div>
              </RadioGroup>

              {paymentError && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
                  {paymentError}
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex-col items-start">
              <Separator className="mb-4" />
              <div className="w-full flex justify-between mb-4">
                <span className="text-muted-foreground">Valor:</span>
                <span className="font-bold text-lg">{formatPrice(bookingData.servicePrice)}</span>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handlePaymentSubmit}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <Timer className="animate-spin mr-2 h-4 w-4" />
                    Processando...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Finalizar Agendamento
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

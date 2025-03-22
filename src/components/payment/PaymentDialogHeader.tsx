
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PaymentDialogHeaderProps {
  step: "form" | "processing" | "result";
}

const PaymentDialogHeader = ({ step }: PaymentDialogHeaderProps) => {
  return (
    <DialogHeader>
      <DialogTitle>
        {step === "form" && "Realizar Pagamento"}
        {step === "processing" && "Processando Pagamento"}
        {step === "result" && "Resultado do Pagamento"}
      </DialogTitle>
      <DialogDescription>
        {step === "form" && "Preencha os dados para concluir o pagamento do serviço."}
        {step === "processing" && "Aguarde enquanto processamos seu pagamento..."}
        {step === "result" && "Confira o resultado do seu pagamento abaixo."}
      </DialogDescription>
    </DialogHeader>
  );
};

export default PaymentDialogHeader;

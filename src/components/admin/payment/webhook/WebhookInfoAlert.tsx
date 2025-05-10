
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function WebhookInfoAlert() {
  return (
    <Alert variant="info" className="bg-blue-50 text-blue-800 border-blue-200">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Informação sobre Webhooks</AlertTitle>
      <AlertDescription>
        Os webhooks permitem que sua aplicação receba notificações de eventos que ocorrem em nosso sistema, como
        pagamentos confirmados, assinaturas canceladas ou falhas de cobrança. Configure um URL para onde enviaremos
        as notificações em formato JSON.
      </AlertDescription>
    </Alert>
  );
}

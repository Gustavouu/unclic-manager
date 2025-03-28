
import { AlertCircle } from "lucide-react";

export function WebhookInfoAlert() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start gap-3">
      <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
      <div>
        <p className="font-medium text-blue-800">Importante</p>
        <p className="text-sm text-blue-700">
          Você precisará configurar seu sistema para receber as notificações de webhook.{" "}
          <a href="#" className="text-blue-600 underline hover:text-blue-800">
            Ver documentação
          </a>
        </p>
      </div>
    </div>
  );
}

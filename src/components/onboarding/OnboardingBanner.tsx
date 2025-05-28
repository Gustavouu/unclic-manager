
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface OnboardingBannerProps {
  onDismiss: () => void;
}

export function OnboardingBanner({ onDismiss }: OnboardingBannerProps) {
  return (
    <Alert className="mb-6 bg-blue-50 border-blue-200">
      <div className="flex items-center justify-between">
        <AlertDescription className="text-blue-800">
          Complete seu onboarding para aproveitar todas as funcionalidades do sistema.
        </AlertDescription>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="h-auto p-1 text-blue-800 hover:bg-blue-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
}

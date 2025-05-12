
import { WebhookIntegration } from "./webhook/WebhookIntegration";
import { LoyaltySystem } from "./loyalty/LoyaltySystem";

// Import the LoadingContext - this will be created programmatically when the app runs
let setLoadingStage: (stage: string) => void;
let setLoadingProgress: (progress: number) => void;
let setLoadingError: (error: any) => void;

export class InitializationService {
  public static initialize(): void {
    console.log("Initializing application services...");
    
    try {
      // Set initial loading stage
      if (setLoadingStage && setLoadingProgress) {
        setLoadingStage("initializing");
        setLoadingProgress(10);
      }
      
      // Initialize webhook integrations
      try {
        WebhookIntegration.initializeIntegrations();
        console.log("Webhook integrations initialized");
        
        if (setLoadingProgress) {
          setLoadingProgress(40);
        }
      } catch (error) {
        console.error("Error initializing webhook integrations:", error);
        if (setLoadingError) {
          setLoadingError({
            code: "WEBHOOK_ERROR",
            message: "Falha ao inicializar integrações de webhook",
            details: error
          });
        }
        throw error;
      }
      
      // Set loading stage to the next step
      if (setLoadingStage && setLoadingProgress) {
        setLoadingStage("config");
        setLoadingProgress(60);
      }
      
      // Initialize loyalty system
      try {
        LoyaltySystem.initialize();
        console.log("Loyalty system initialized");
        
        if (setLoadingProgress) {
          setLoadingProgress(90);
        }
      } catch (error) {
        console.error("Error initializing loyalty system:", error);
        if (setLoadingError) {
          setLoadingError({
            code: "LOYALTY_ERROR",
            message: "Falha ao inicializar sistema de fidelidade",
            details: error
          });
        }
        throw error;
      }
      
      // Complete initialization
      if (setLoadingStage && setLoadingProgress) {
        setLoadingStage("complete");
        setLoadingProgress(100);
      }
    } catch (error) {
      console.error("Initialization failed:", error);
      if (setLoadingError && !setLoadingError["called"]) {
        setLoadingError["called"] = true;
        setLoadingError({
          code: "INIT_ERROR",
          message: "Falha ao inicializar a aplicação",
          details: error
        });
      }
    }
  }
  
  public static setLoadingHandlers(
    stageHandler: (stage: string) => void,
    progressHandler: (progress: number) => void,
    errorHandler: (error: any) => void
  ): void {
    setLoadingStage = stageHandler;
    setLoadingProgress = progressHandler;
    setLoadingError = errorHandler;
  }
}

// Initialize all services
// We'll move this to the Index component to be able to use the loading context
// InitializationService.initialize();

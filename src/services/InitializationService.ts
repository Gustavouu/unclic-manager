
import { WebhookIntegration } from "./webhook/WebhookIntegration";
import { LoyaltySystem } from "./loyalty/LoyaltySystem";

export class InitializationService {
  public static initialize(): void {
    console.log("Initializing application services...");
    
    // Initialize webhook integrations
    WebhookIntegration.initializeIntegrations();
    console.log("Webhook integrations initialized");
    
    // Initialize loyalty system
    LoyaltySystem.initialize();
    console.log("Loyalty system initialized");
  }
}

// Initialize all services
InitializationService.initialize();

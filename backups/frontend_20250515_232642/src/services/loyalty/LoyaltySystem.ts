
import { supabase } from "@/integrations/supabase/client";
import { WebhookIntegration } from "../webhook/WebhookIntegration";

interface LoyaltyRule {
  id: string;
  name: string;
  action: string;
  pointsValue: number;
  minTransactionValue: number | null;
}

export class LoyaltySystem {
  /**
   * Initialize the loyalty system
   */
  public static initialize(): void {
    // Register webhook handlers for loyalty events
    WebhookIntegration.on('payment.completed', async (data) => {
      if (data.customerId && data.amount) {
        await this.processTransactionPoints(
          data.customerId, 
          data.tenantId, 
          Number(data.amount),
          data.appointmentId
        );
      }
    });
    
    WebhookIntegration.on('appointment.completed', async (data) => {
      if (data.customerId) {
        await this.processAppointmentPoints(
          data.customerId,
          data.tenantId,
          data.appointmentId
        );
      }
    });
  }
  
  /**
   * Process points for a completed transaction
   */
  public static async processTransactionPoints(
    customerId: string,
    tenantId: string,
    amount: number,
    appointmentId?: string
  ): Promise<void> {
    try {
      // First check if there's an active loyalty program
      const { data: programs } = await supabase
        .from('loyalty_programs')
        .select('id')
        .eq('tenantId', tenantId)
        .eq('isActive', true)
        .limit(1);
        
      if (!programs || programs.length === 0) return;
      
      const programId = programs[0].id;
      
      // Check if customer has a loyalty card
      let { data: cards } = await supabase
        .from('loyalty_cards')
        .select('id')
        .eq('loyaltyProgramId', programId)
        .eq('customerId', customerId)
        .eq('isActive', true);
        
      // If no card exists, create one
      let cardId: string;
      if (!cards || cards.length === 0) {
        const { data: newCard } = await supabase
          .from('loyalty_cards')
          .insert({
            id: crypto.randomUUID(),
            loyaltyProgramId: programId,
            customerId: customerId,
            isActive: true,
            currentPoints: 0,
            totalEarnedPoints: 0,
            totalRedeemedPoints: 0
          })
          .select('id')
          .single();
          
        if (!newCard) throw new Error("Failed to create loyalty card");
        cardId = newCard.id;
      } else {
        cardId = cards[0].id;
      }
      
      // Get applicable rules for transactions
      const { data: rules } = await supabase
        .from('loyalty_rules')
        .select('id, name, pointsValue, minTransactionValue')
        .eq('loyaltyProgramId', programId)
        .eq('action', 'PURCHASE')
        .eq('isActive', true);
        
      if (!rules || rules.length === 0) return;
      
      // Apply matching rules
      for (const rule of rules) {
        if (!rule.minTransactionValue || amount >= rule.minTransactionValue) {
          // Calculate points - can be fixed or percentage
          let pointsEarned;
          if (rule.name.toLowerCase().includes('percent')) {
            // Percentage based rule
            const percentage = rule.pointsValue;
            pointsEarned = Math.floor(amount * (percentage / 100));
          } else {
            // Fixed points rule
            pointsEarned = rule.pointsValue;
          }
          
          if (pointsEarned > 0) {
            // Add loyalty transaction
            await supabase.from('loyalty_transactions').insert({
              id: crypto.randomUUID(),
              tenantId: tenantId,
              loyaltyCardId: cardId,
              points: pointsEarned,
              type: 'EARN',
              description: `Pontos por compra de ${amount.toFixed(2)}`,
              financialTransactionId: appointmentId, // Using appointmentId as transaction ID for demo
            });
          }
        }
      }
    } catch (error) {
      console.error("Error processing loyalty points for transaction:", error);
    }
  }
  
  /**
   * Process points for a completed appointment
   */
  public static async processAppointmentPoints(
    customerId: string,
    tenantId: string,
    appointmentId: string
  ): Promise<void> {
    try {
      // First check if there's an active loyalty program
      const { data: programs } = await supabase
        .from('loyalty_programs')
        .select('id')
        .eq('tenantId', tenantId)
        .eq('isActive', true)
        .limit(1);
        
      if (!programs || programs.length === 0) return;
      
      const programId = programs[0].id;
      
      // Check if customer has a loyalty card
      let { data: cards } = await supabase
        .from('loyalty_cards')
        .select('id')
        .eq('loyaltyProgramId', programId)
        .eq('customerId', customerId)
        .eq('isActive', true);
        
      // If no card exists, create one
      let cardId: string;
      if (!cards || cards.length === 0) {
        const { data: newCard } = await supabase
          .from('loyalty_cards')
          .insert({
            id: crypto.randomUUID(),
            loyaltyProgramId: programId,
            customerId: customerId,
            isActive: true,
            currentPoints: 0,
            totalEarnedPoints: 0,
            totalRedeemedPoints: 0
          })
          .select('id')
          .single();
          
        if (!newCard) throw new Error("Failed to create loyalty card");
        cardId = newCard.id;
      } else {
        cardId = cards[0].id;
      }
      
      // Get applicable rules for visit
      const { data: rules } = await supabase
        .from('loyalty_rules')
        .select('id, name, pointsValue')
        .eq('loyaltyProgramId', programId)
        .eq('action', 'VISIT')
        .eq('isActive', true);
        
      if (!rules || rules.length === 0) return;
      
      // Apply the first matching rule
      const rule = rules[0];
      const pointsEarned = rule.pointsValue;
      
      if (pointsEarned > 0) {
        // Add loyalty transaction
        await supabase.from('loyalty_transactions').insert({
          id: crypto.randomUUID(),
          tenantId: tenantId,
          loyaltyCardId: cardId,
          points: pointsEarned,
          type: 'EARN',
          description: `Pontos por visita`,
          appointmentId: appointmentId
        });
      }
    } catch (error) {
      console.error("Error processing loyalty points for appointment:", error);
    }
  }
  
  /**
   * Redeem points for a customer
   */
  public static async redeemPoints(
    customerId: string,
    tenantId: string,
    points: number,
    description: string
  ): Promise<boolean> {
    try {
      // Get loyalty card
      const { data: cards } = await supabase
        .from('loyalty_cards')
        .select('id, currentPoints')
        .eq('tenantId', tenantId)
        .eq('customerId', customerId)
        .eq('isActive', true);
        
      if (!cards || cards.length === 0) {
        throw new Error("Customer does not have an active loyalty card");
      }
      
      const card = cards[0];
      
      // Check if customer has enough points
      if (card.currentPoints < points) {
        throw new Error("Insufficient loyalty points");
      }
      
      // Add redemption transaction
      await supabase.from('loyalty_transactions').insert({
        id: crypto.randomUUID(),
        tenantId: tenantId,
        loyaltyCardId: card.id,
        points: -points,
        type: 'REDEEM',
        description: description
      });
      
      return true;
    } catch (error) {
      console.error("Error redeeming loyalty points:", error);
      return false;
    }
  }
}

// Initialize the loyalty system
LoyaltySystem.initialize();

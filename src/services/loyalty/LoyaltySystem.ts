
export interface LoyaltyLevel {
  id: string;
  name: string;
  pointsRequired: number;
  benefits: string[];
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  tenantId: string;
}

export interface LoyaltyCard {
  id: string;
  customerId: string;
  loyaltyProgramId: string;
  currentPoints: number;
  totalEarnedPoints: number;
  totalRedeemedPoints: number;
  loyaltyLevelId?: string;
  isActive: boolean;
}

import { supabase } from '@/lib/supabase';

export class LoyaltySystem {
  static async createProgram(data: Partial<LoyaltyProgram>): Promise<LoyaltyProgram | null> {
    const { data: program, error } = await supabase
      .from('loyalty_programs')
      .insert({
        name: data.name,
        description: data.description,
        is_active: data.isActive,
        tenant_id: data.tenantId,
      })
      .select()
      .single();

    if (error) throw error;
    return program as LoyaltyProgram;
  }

  static async addPoints(cardId: string, points: number, description?: string): Promise<boolean> {
    const { error } = await supabase.rpc('add_loyalty_points', {
      p_card_id: cardId,
      p_points: points,
      p_description: description,
    });
    if (error) throw error;
    return true;
  }

  static async redeemPoints(cardId: string, points: number, description?: string): Promise<boolean> {
    const { error } = await supabase.rpc('redeem_loyalty_points', {
      p_card_id: cardId,
      p_points: points,
      p_description: description,
    });
    if (error) throw error;
    return true;
  }

  static async getCustomerCard(customerId: string, programId: string): Promise<LoyaltyCard | null> {
    const { data, error } = await supabase
      .from('loyalty_cards')
      .select('*')
      .eq('customer_id', customerId)
      .eq('loyalty_program_id', programId)
      .single();

    if (error) return null;
    return data as LoyaltyCard;
  }
}


import { supabase } from '@/integrations/supabase/client';
import { GlobalErrorHandler } from '@/services/error/GlobalErrorHandler';

const errorHandler = GlobalErrorHandler.getInstance();
const isProduction = import.meta.env.PROD;

export async function ensureUserBusinessAccess(): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if user already has business access
    const { data: existingBusinessUser, error: checkError } = await supabase
      .from('business_users')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .limit(1);

    if (checkError) {
      throw checkError;
    }

    // If user already has access, return
    if (existingBusinessUser && existingBusinessUser.length > 0) {
      if (!isProduction) {
        console.log('User already has business access');
      }
      return;
    }

    // Check if user has a business as admin
    const { data: ownedBusiness, error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('admin_email', user.email)
      .limit(1);

    if (businessError) {
      throw businessError;
    }

    if (ownedBusiness && ownedBusiness.length > 0) {
      // Create business_user relationship
      const { error: insertError } = await supabase
        .from('business_users')
        .insert({
          user_id: user.id,
          business_id: ownedBusiness[0].id,
          role: 'admin',
          status: 'active'
        });

      if (insertError) {
        throw insertError;
      }

      if (!isProduction) {
        console.log('Created business access for existing business owner');
      }
      return;
    }

    // Create default business for new user
    const businessName = user.user_metadata?.full_name 
      ? `Negócio de ${user.user_metadata.full_name}`
      : 'Meu Negócio';

    const { data: newBusiness, error: createBusinessError } = await supabase
      .from('businesses')
      .insert({
        name: businessName,
        admin_email: user.email!,
        status: 'active'
      })
      .select()
      .single();

    if (createBusinessError) {
      throw createBusinessError;
    }

    // Create business_user relationship
    const { error: linkError } = await supabase
      .from('business_users')
      .insert({
        user_id: user.id,
        business_id: newBusiness.id,
        role: 'admin',
        status: 'active'
      });

    if (linkError) {
      throw linkError;
    }

    if (!isProduction) {
      console.log('Created default business and access for new user');
    }

  } catch (error) {
    errorHandler.handleError(
      error instanceof Error ? error : new Error(String(error)),
      'high',
      {
        component: 'BusinessAccess',
        action: 'ensureUserBusinessAccess',
        additionalData: { isProduction }
      }
    );
    throw error;
  }
}

export async function checkUserBusinessAccess(businessId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;

    const { data, error } = await supabase
      .rpc('user_has_business_access_secure', { business_id_param: businessId });

    if (error) {
      throw error;
    }

    return data || false;
  } catch (error) {
    errorHandler.handleError(
      error instanceof Error ? error : new Error(String(error)),
      'medium',
      {
        component: 'BusinessAccess',
        action: 'checkUserBusinessAccess',
        additionalData: { businessId }
      }
    );
    return false;
  }
}


import { supabase } from '@/integrations/supabase/client';

export async function ensureUserBusinessAccess(): Promise<boolean> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('No authenticated user found:', userError);
      return false;
    }

    // Check if user has a profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return false;
    }

    // If no profile exists, create one
    if (!profile) {
      console.log('Creating profile for user:', user.id);
      const { error: createProfileError } = await supabase
        .from('profiles')
        .insert([{
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
        }]);

      if (createProfileError) {
        console.error('Error creating profile:', createProfileError);
        return false;
      }
    }

    // Check if user has business access
    const { data: businessUser, error: businessUserError } = await supabase
      .from('business_users')
      .select('*, businesses(*)')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    if (businessUserError) {
      console.error('Error checking business access:', businessUserError);
      return false;
    }

    // If no business access, create a default business and access
    if (!businessUser) {
      console.log('Creating default business for user:', user.id);
      
      // Create a default business
      const { data: newBusiness, error: businessError } = await supabase
        .from('businesses')
        .insert([{
          name: 'Meu Negócio',
          slug: `business-${user.id.slice(0, 8)}`,
          admin_email: user.email!,
          status: 'active'
        }])
        .select()
        .single();

      if (businessError || !newBusiness) {
        console.error('Error creating business:', businessError);
        return false;
      }

      // Create business user relationship
      const { error: businessUserCreateError } = await supabase
        .from('business_users')
        .insert([{
          user_id: user.id,
          business_id: newBusiness.id,
          role: 'owner',
          status: 'active'
        }]);

      if (businessUserCreateError) {
        console.error('Error creating business user relationship:', businessUserCreateError);
        return false;
      }

      // Update profile with business_id
      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({ business_id: newBusiness.id })
        .eq('id', user.id);

      if (updateProfileError) {
        console.error('Error updating profile with business_id:', updateProfileError);
      }
    }

    console.log('User business access ensured successfully');
    return true;
  } catch (error) {
    console.error('Exception in ensureUserBusinessAccess:', error);
    return false;
  }
}

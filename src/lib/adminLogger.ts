import { supabase } from "@/integrations/supabase/client";

export const logAdminAction = async (action: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('Cannot log action: No authenticated user');
      return;
    }

    const { error } = await supabase
      .from('admin_logs')
      .insert({
        user_id: user.id,
        email: user.email || 'unknown',
        action: action,
      });

    if (error) {
      console.error('Failed to log admin action:', error);
    }
  } catch (error) {
    console.error('Error logging admin action:', error);
  }
};

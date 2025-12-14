import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Birthday {
  id: string;
  name: string;
  birthday: string;
}

interface WeddingAnniversary {
  id: string;
  name: string;
  anniversary_date: string;
}

export const useCelebrations = () => {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [anniversaries, setAnniversaries] = useState<WeddingAnniversary[]>([]);
  const [loading, setLoading] = useState(true);
  const currentMonth = new Date().getMonth() + 1;

  useEffect(() => {
    loadCelebrations();
  }, []);

  const loadCelebrations = async () => {
    try {
      setLoading(true);

      // Fetch birthdays and anniversaries in parallel with server-side filtering
      const [birthdaysResponse, anniversariesResponse] = await Promise.all([
        supabase
          .from('birthdays')
          .select('*')
          .filter('birthday', 'gte', `${new Date().getFullYear()}-${currentMonth.toString().padStart(2, '0')}-01`)
          .filter('birthday', 'lt', `${new Date().getFullYear()}-${(currentMonth + 1).toString().padStart(2, '0')}-01`)
          .order('birthday', { ascending: true }),
        
        supabase
          .from('wedding_anniversaries')
          .select('*')
          .filter('anniversary_date', 'gte', `${new Date().getFullYear()}-${currentMonth.toString().padStart(2, '0')}-01`)
          .filter('anniversary_date', 'lt', `${new Date().getFullYear()}-${(currentMonth + 1).toString().padStart(2, '0')}-01`)
          .order('anniversary_date', { ascending: true })
      ]);

      if (birthdaysResponse.error) {
        console.error('Error loading birthdays:', birthdaysResponse.error);
      } else {
        setBirthdays(birthdaysResponse.data || []);
      }

      if (anniversariesResponse.error) {
        console.error('Error loading anniversaries:', anniversariesResponse.error);
      } else {
        setAnniversaries(anniversariesResponse.data || []);
      }
    } catch (error) {
      console.error('Failed to load celebrations:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    birthdays,
    anniversaries,
    loading,
    reload: loadCelebrations
  };
};
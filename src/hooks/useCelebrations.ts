import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getChicagoDate } from "@/lib/dateUtils";

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
  const currentMonth = getChicagoDate().getMonth() + 1;

  useEffect(() => {
    loadCelebrations();
  }, []);

  const loadCelebrations = async () => {
    try {
      setLoading(true);

      const now = getChicagoDate();
      const currentYear = now.getFullYear();
      const startDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`;
      const nextMonthYear = currentMonth === 12 ? currentYear + 1 : currentYear;
      const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
      const endDate = `${nextMonthYear}-${nextMonth.toString().padStart(2, '0')}-01`;

      // Fetch birthdays and anniversaries in parallel with server-side filtering
      const [birthdaysResponse, anniversariesResponse] = await Promise.all([
        supabase
          .from('birthdays')
          .select('*')
          .filter('birthday', 'gte', startDate)
          .filter('birthday', 'lt', endDate)
          .order('birthday', { ascending: true }),
        
        supabase
          .from('wedding_anniversaries')
          .select('*')
          .filter('anniversary_date', 'gte', startDate)
          .filter('anniversary_date', 'lt', endDate)
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
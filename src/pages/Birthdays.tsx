import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Gift, Calendar } from "lucide-react";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";

interface Birthday {
  id: string;
  name: string;
  birthday: string;
}

const Birthdays = () => {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [loading, setLoading] = useState(true);
  const currentMonth = new Date().getMonth() + 1;
  const currentMonthName = format(new Date(), "MMMM yyyy");

  useEffect(() => {
    loadCurrentMonthBirthdays();
  }, []);

  const loadCurrentMonthBirthdays = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('birthdays')
        .select('*')
        .order('birthday', { ascending: true });

      if (error) {
        console.error('Error loading birthdays:', error);
        return;
      }

      // Filter birthdays for current month
      const currentMonthBirthdays = (data || []).filter(birthday => {
        const birthdayDate = new Date(birthday.birthday + 'T00:00:00');
        return birthdayDate.getMonth() + 1 === currentMonth;
      });

      setBirthdays(currentMonthBirthdays);
    } catch (error) {
      console.error('Failed to load birthdays:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="church-card mb-8">
          <div className="flex items-center justify-center mb-6">
            <Gift className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold">Birthday Celebrations</h1>
          </div>
          <p className="text-center church-text text-muted-foreground">
            Celebrating our church family in {currentMonthName}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading birthdays...</p>
          </div>
        ) : birthdays.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No birthdays this month.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:gap-6">
            {birthdays.map((birthday) => (
              <div key={birthday.id} className="church-card">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-1">
                      {birthday.name}
                    </h3>
                  </div>
                  <div className="text-4xl">🎂</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="church-card mt-8 text-center">
          <h3 className="text-xl font-semibold mb-4">Birthday Prayer</h3>
          <p className="church-text italic text-muted-foreground leading-relaxed">
            "Lord, we thank you for another year of life for each of these precious members of our church family. 
            Bless them with health, joy, and your continued presence in the year ahead. Amen."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Birthdays;
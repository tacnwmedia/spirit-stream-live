import { useState, useEffect } from "react";
import { Gift, Calendar } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Birthday {
  id: string;
  name: string;
  birthday: string;
}

const BirthdayDisplayLive = () => {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [loading, setLoading] = useState(true);
  const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-11, we need 1-12
  const currentMonthName = new Date().toLocaleDateString('en-US', { month: 'long' });

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

  if (loading) {
    return (
      <div className="church-card">
        <h3 className="text-xl font-semibold mb-4 text-center">
          {currentMonthName} Birthdays
        </h3>
        <div className="text-center py-4">
          <p className="text-muted-foreground">Loading birthdays...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="church-card">
      <h3 className="text-xl font-semibold mb-4 text-center">
        {currentMonthName} Birthdays
      </h3>
      
      {birthdays.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-muted-foreground">No birthdays this month.</p>
        </div>
      ) : (
        <div className="space-y-3 mb-4">
          {birthdays.slice(0, 3).map((birthday) => (
            <div key={birthday.id} className="flex items-center space-x-3 bg-accent rounded-lg p-3">
              <div className="text-2xl">🎂</div>
              <div className="flex-1">
                <div className="font-medium text-foreground">{birthday.name}</div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(birthday.birthday + 'T00:00:00'), "MMMM do")}
                </div>
              </div>
            </div>
          ))}
          {birthdays.length > 3 && (
            <div className="text-center">
              <Link 
                to="/birthdays"
                className="text-primary hover:text-primary-hover text-sm font-medium"
              >
                View all {birthdays.length} birthdays →
              </Link>
            </div>
          )}
        </div>
      )}
      
      {birthdays.length > 0 && (
        <div className="text-center mt-4">
          <Link 
            to="/birthdays" 
            className="church-button inline-flex items-center space-x-2 px-4 py-2"
          >
            <Gift className="w-4 h-4" />
            <span>View All {currentMonthName} Birthdays</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default BirthdayDisplayLive;
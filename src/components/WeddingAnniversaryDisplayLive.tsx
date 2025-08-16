import { useState, useEffect } from "react";
import { Calendar, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface WeddingAnniversary {
  id: string;
  name: string;
  anniversary_date: string;
}

const WeddingAnniversaryDisplayLive = () => {
  const [anniversaries, setAnniversaries] = useState<WeddingAnniversary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentMonthAnniversaries();
  }, []);

  const loadCurrentMonthAnniversaries = async () => {
    try {
      const { data, error } = await supabase
        .from('wedding_anniversaries')
        .select('*')
        .order('anniversary_date');

      if (error) throw error;

      if (data) {
        // Filter for current month
        const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-indexed
        const currentMonthAnniversaries = data.filter(anniversary => {
          const anniversaryMonth = new Date(anniversary.anniversary_date).getMonth() + 1;
          return anniversaryMonth === currentMonth;
        });

        setAnniversaries(currentMonthAnniversaries);
      }
    } catch (error) {
      console.error('Error loading wedding anniversaries:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="church-card">
        <div className="flex items-center space-x-3 mb-4">
          <Heart className="w-6 h-6 text-pink-500" />
          <h2 className="text-xl font-semibold">Wedding Anniversaries</h2>
        </div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="church-card">
      <div className="flex items-center space-x-3 mb-4">
        <Heart className="w-6 h-6 text-pink-500" />
        <h2 className="text-xl font-semibold">Wedding Anniversaries</h2>
      </div>
      
      {anniversaries.length > 0 ? (
        <div className="space-y-3">
          <div className="space-y-2">
            {anniversaries.slice(0, 3).map((anniversary) => (
              <div key={anniversary.id} className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{anniversary.name}</span>
              </div>
            ))}
          </div>
          
          <Link 
            to="/wedding-anniversaries" 
            className="inline-flex items-center text-sm text-primary hover:underline"
          >
            View All Wedding Anniversaries
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-muted-foreground text-sm">
            No wedding anniversaries this month
          </p>
          
          <Link 
            to="/wedding-anniversaries" 
            className="inline-flex items-center text-sm text-primary hover:underline"
          >
            View All Wedding Anniversaries
          </Link>
        </div>
      )}
    </div>
  );
};

export default WeddingAnniversaryDisplayLive;
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
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
  const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-11, we need 1-12
  const currentMonthName = new Date().toLocaleDateString('en-US', { month: 'long' });

  useEffect(() => {
    loadCurrentMonthAnniversaries();
  }, []);

  const loadCurrentMonthAnniversaries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wedding_anniversaries')
        .select('*')
        .order('anniversary_date', { ascending: true });

      if (error) {
        console.error('Error loading wedding anniversaries:', error);
        return;
      }

      // Filter anniversaries for current month
      const currentMonthAnniversaries = (data || []).filter(anniversary => {
        const anniversaryDate = new Date(anniversary.anniversary_date + 'T00:00:00');
        return anniversaryDate.getMonth() + 1 === currentMonth;
      });

      setAnniversaries(currentMonthAnniversaries);
    } catch (error) {
      console.error('Failed to load wedding anniversaries:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="church-card">
        <h3 className="text-xl font-semibold mb-4 text-center">
          {currentMonthName} Wedding Anniversaries
        </h3>
        <div className="text-center py-4">
          <p className="text-muted-foreground">Loading anniversaries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="church-card">
      <h3 className="text-xl font-semibold mb-4 text-center">
        {currentMonthName} Wedding Anniversaries
      </h3>
      
      {anniversaries.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-muted-foreground">No wedding anniversaries this month.</p>
        </div>
      ) : (
        <div className="space-y-3 mb-4">
          {anniversaries.slice(0, 3).map((anniversary) => (
            <div key={anniversary.id} className="flex items-center space-x-3 bg-accent rounded-lg p-3">
              <div className="text-2xl">💍</div>
              <div className="flex-1">
                <div className="font-medium text-foreground">{anniversary.name}</div>
              </div>
            </div>
          ))}
          {anniversaries.length > 3 && (
            <div className="text-center">
              <Link 
                to="/wedding-anniversaries"
                className="text-primary hover:text-primary-hover text-sm font-medium"
              >
                View all {anniversaries.length} anniversaries →
              </Link>
            </div>
          )}
        </div>
      )}
      
      {anniversaries.length > 0 && (
        <div className="text-center mt-4">
          <Link 
            to="/wedding-anniversaries" 
            className="church-button inline-flex items-center space-x-2 px-4 py-2"
          >
            <Heart className="w-4 h-4" />
            <span>View All {currentMonthName} Wedding Anniversaries</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default WeddingAnniversaryDisplayLive;
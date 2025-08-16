import { useState, useEffect } from "react";
import { Calendar, Heart } from "lucide-react";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";

interface WeddingAnniversary {
  id: string;
  name: string;
  anniversary_date: string;
}

const WeddingAnniversaries = () => {
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
        const currentMonth = new Date().getMonth() + 1;
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

  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="church-card">
          <div className="flex items-center space-x-3 mb-6">
            <Heart className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl font-bold">
              {currentMonthName} Wedding Anniversaries
            </h1>
          </div>
          
          {loading ? (
            <p className="text-muted-foreground">Loading wedding anniversaries...</p>
          ) : anniversaries.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {anniversaries.map((anniversary) => (
                <div key={anniversary.id} className="church-card p-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">{anniversary.name}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                No Wedding Anniversaries This Month
              </h2>
              <p className="text-muted-foreground">
                There are no wedding anniversaries to celebrate in {currentMonthName}.
              </p>
            </div>
          )}
          
          <div className="mt-12 p-6 bg-muted/50 rounded-lg">
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-pink-500" />
              Anniversary Prayer
            </h2>
            <p className="text-muted-foreground italic">
              "Heavenly Father, we thank You for the gift of marriage and the love that binds couples together. 
              We celebrate those who are marking wedding anniversaries this month and pray for Your continued 
              blessings upon their unions. May their love continue to grow stronger with each passing year, 
              reflecting Your perfect love for us. Grant them joy, patience, and understanding as they journey 
              together. In Jesus' name, Amen."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeddingAnniversaries;
import Navigation from "@/components/Navigation";
import TodayInfo from "@/components/TodayInfo";
import HymnDisplay from "@/components/HymnDisplay";
import WatchwordDisplay from "@/components/WatchwordDisplay";
import WeatherWidget from "@/components/WeatherWidget";
import EventCalendarLive from "@/components/EventCalendarLive";
import BirthdayDisplayLive from "@/components/BirthdayDisplayLive";
import WeddingAnniversaryDisplayLive from "@/components/WeddingAnniversaryDisplayLive";
import { Link } from "react-router-dom";
import { Gift, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useHymns } from "@/hooks/useHymns";

const Index = () => {
  const [dailyHymns, setDailyHymns] = useState<{
    opening_hymn_number: number | null;
    closing_hymn_number: number | null;
  }>({
    opening_hymn_number: null,
    closing_hymn_number: null,
  });
  const { getHymnByNumber } = useHymns();

  useEffect(() => {
    loadDailyHymns();
  }, []);

  const loadDailyHymns = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('daily_hymns')
        .select('*')
        .eq('hymn_date', today)
        .single();

      if (data) {
        setDailyHymns({
          opening_hymn_number: data.opening_hymn_number,
          closing_hymn_number: data.closing_hymn_number,
        });
      }
    } catch (error) {
      console.error('Failed to load daily hymns:', error);
    }
  };

  const openingHymn = dailyHymns.opening_hymn_number ? getHymnByNumber(dailyHymns.opening_hymn_number) : null;
  const closingHymn = dailyHymns.closing_hymn_number ? getHymnByNumber(dailyHymns.closing_hymn_number) : null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <TodayInfo />
        
        {/* Main Content Grid */}
        <div className="grid gap-6 md:gap-8 mt-8">
          {/* Hymns Row */}
          <div className="grid md:grid-cols-2 gap-6">
            <HymnDisplay 
              title="Opening Hymn" 
              hymnNumber={dailyHymns.opening_hymn_number || 25} 
              hymnTitle={openingHymn?.title || "Amazing Grace"} 
            />
            <HymnDisplay 
              title="Closing Hymn" 
              hymnNumber={dailyHymns.closing_hymn_number || 134} 
              hymnTitle={closingHymn?.title || "Be Thou My Vision"} 
            />
          </div>
          
          {/* Watchword and Weather Row */}
          <div className="grid md:grid-cols-2 gap-6">
            <WatchwordDisplay />
            <WeatherWidget />
          </div>
          
          {/* Birthdays and Wedding Anniversaries */}
          <div className="grid md:grid-cols-2 gap-6">
            <BirthdayDisplayLive />
            <WeddingAnniversaryDisplayLive />
          </div>
          
          {/* Search Links */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="church-card">
              <Link 
                to="/hymn-search" 
                className="flex items-center justify-center space-x-3 church-button w-full"
              >
                <Search className="w-6 h-6" />
                <span>Search Hymns</span>
              </Link>
            </div>
            <div className="church-card">
              <Link 
                to="/give" 
                className="flex items-center justify-center space-x-3 church-button w-full"
              >
                <Gift className="w-6 h-6" />
                <span>Give Online</span>
              </Link>
            </div>
          </div>
          
          {/* Events Calendar */}
          <EventCalendarLive />
        </div>
      </div>
    </div>
  );
};

export default Index;

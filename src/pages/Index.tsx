import Navigation from "@/components/Navigation";
import TodayInfo from "@/components/TodayInfo";
import HymnDisplay from "@/components/HymnDisplay";
import WatchwordDisplay from "@/components/WatchwordDisplay";
import WeatherWidget from "@/components/WeatherWidget";
import EventCalendarLive from "@/components/EventCalendarLive";
import BirthdayDisplayLive from "@/components/BirthdayDisplayLive";
import WeddingAnniversaryDisplayLive from "@/components/WeddingAnniversaryDisplayLive";
import SocialFooter from "@/components/SocialFooter";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import SnowEffect from "@/components/SnowEffect";
import { Link } from "react-router-dom";
import { Gift, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useHymns } from "@/hooks/useHymns";
import { useWeather } from "@/contexts/WeatherContext";

interface OtherHymn {
  id: string;
  hymn_number: number;
  label: string;
  display_order: number;
}

const Index = () => {
  const [dailyHymns, setDailyHymns] = useState<{
    opening_hymn_number: number | null;
    closing_hymn_number: number | null;
  }>({
    opening_hymn_number: null,
    closing_hymn_number: null,
  });
  const [otherHymns, setOtherHymns] = useState<OtherHymn[]>([]);
  const [todaysTopic, setTodaysTopic] = useState<{
    topic: string;
    scriptures: string;
  } | null>(null);
  const { getHymnByNumber } = useHymns();
  const { weather } = useWeather();

  useEffect(() => {
    loadDailyHymns();
    loadOtherHymns();
    loadTodaysTopic();
  }, []);

  const loadDailyHymns = async () => {
    try {
      const { data } = await supabase
        .from('daily_hymns')
        .select('*')
        .order('hymn_date', { ascending: false })
        .limit(1)
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

  const loadOtherHymns = async () => {
    try {
      // Get today's date in YYYY-MM-DD format
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayString = `${year}-${month}-${day}`;

      const { data } = await supabase
        .from('daily_other_hymns')
        .select('*')
        .eq('hymn_date', todayString)
        .order('display_order');

      if (data && data.length > 0) {
        setOtherHymns(data.map(h => ({
          id: h.id,
          hymn_number: h.hymn_number,
          label: h.label || 'Other Hymn',
          display_order: h.display_order,
        })));
      }
    } catch (error) {
      console.error('Failed to load other hymns:', error);
    }
  };

  const loadTodaysTopic = async () => {
    try {
      // Get today's date in YYYY-MM-DD format in local timezone
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayString = `${year}-${month}-${day}`;
      
      const { data } = await supabase
        .from('topics')
        .select('topic, scriptures')
        .eq('topic_date', todayString)
        .maybeSingle();

      if (data) {
        setTodaysTopic({
          topic: data.topic,
          scriptures: data.scriptures,
        });
      }
    } catch (error) {
      console.error('Failed to load today\'s topic:', error);
    }
  };

  const openingHymn = dailyHymns.opening_hymn_number ? getHymnByNumber(dailyHymns.opening_hymn_number) : null;
  const closingHymn = dailyHymns.closing_hymn_number ? getHymnByNumber(dailyHymns.closing_hymn_number) : null;
  
  // Check if today is the first Sunday of the month
  const today = new Date();
  const isFirstSunday = today.getDay() === 0 && today.getDate() <= 7;
  const communionHymn = isFirstSunday ? getHymnByNumber(333) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Snow Effect - Only shows when weather is snowy */}
      {weather.isSnowing && <SnowEffect />}
      
      {/* Announcement Banner */}
      <AnnouncementBanner />
      
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <TodayInfo />
        
        {/* Weather Widget - Compact */}
        <div className="mt-4 max-w-md mx-auto">
          <WeatherWidget />
        </div>
        
        {/* Topic for the Day */}
        {todaysTopic && (
          <div className="church-card text-center mt-6">
            <h3 className="text-2xl font-bold text-primary mb-2">
              Topic: {todaysTopic.topic}
            </h3>
            <p className="text-muted-foreground text-lg">
              Scriptures: {todaysTopic.scriptures}
            </p>
          </div>
        )}
        
        {/* Main Content Grid */}
        <div className="grid gap-6 md:gap-8 mt-8">
          {/* Opening Hymn - Always First */}
          {dailyHymns.opening_hymn_number && (
            <HymnDisplay 
              title="Opening Hymn" 
              hymnNumber={dailyHymns.opening_hymn_number} 
              hymnTitle={openingHymn?.title || "Loading..."} 
            />
          )}

          {/* Other Hymns - In order they were added (between Opening and Closing) */}
          {otherHymns.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              {otherHymns.map((hymn) => {
                const hymnData = getHymnByNumber(hymn.hymn_number);
                return (
                  <HymnDisplay 
                    key={hymn.id}
                    title={hymn.label} 
                    hymnNumber={hymn.hymn_number} 
                    hymnTitle={hymnData?.title || "Loading..."} 
                  />
                );
              })}
            </div>
          )}

          {/* Closing Hymn - Always Last (before Communion if applicable) */}
          {dailyHymns.closing_hymn_number && (
            <HymnDisplay 
              title="Closing Hymn" 
              hymnNumber={dailyHymns.closing_hymn_number} 
              hymnTitle={closingHymn?.title || "Loading..."} 
            />
          )}
          
          {/* Communion Hymn - Only on First Sunday (after Closing) */}
          {communionHymn && (
            <HymnDisplay 
              title="Communion Hymn" 
              hymnNumber={333} 
              hymnTitle={communionHymn.title} 
            />
          )}
          
          {/* Watchword Row */}
          <div>
            <WatchwordDisplay />
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
        
        <SocialFooter />
      </div>
    </div>
  );
};

export default Index;

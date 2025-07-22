import Navigation from "@/components/Navigation";
import TodayInfo from "@/components/TodayInfo";
import HymnDisplay from "@/components/HymnDisplay";
import WatchwordDisplay from "@/components/WatchwordDisplay";
import WeatherWidget from "@/components/WeatherWidget";
import EventCalendar from "@/components/EventCalendar";
import { Link } from "react-router-dom";
import { Gift } from "lucide-react";

const Index = () => {
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
              hymnNumber={25} 
              hymnTitle="Amazing Grace" 
            />
            <HymnDisplay 
              title="Closing Hymn" 
              hymnNumber={134} 
              hymnTitle="Be Thou My Vision" 
            />
          </div>
          
          {/* Watchword and Weather Row */}
          <div className="grid md:grid-cols-2 gap-6">
            <WatchwordDisplay />
            <WeatherWidget />
          </div>
          
          {/* Birthday Link */}
          <div className="church-card">
            <Link 
              to="/birthdays" 
              className="flex items-center justify-center space-x-3 church-button w-full"
            >
              <Gift className="w-6 h-6" />
              <span>View March Birthdays</span>
            </Link>
          </div>
          
          {/* Events Calendar */}
          <EventCalendar />
        </div>
      </div>
    </div>
  );
};

export default Index;

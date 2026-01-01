import { Cloud, Sun, CloudRain, CloudSnow, Loader2 } from "lucide-react";
import { useWeather } from "@/contexts/WeatherContext";

const WeatherWidget = () => {
  const { weather, loading, error } = useWeather();

  const getWeatherIcon = (condition: string) => {
    if (loading) return <Loader2 className="w-5 h-5 animate-spin" />;
    if (error) return <Cloud className="w-5 h-5 opacity-50" />;
    
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes("rain")) return <CloudRain className="w-5 h-5" />;
    if (lowerCondition.includes("snow")) return <CloudSnow className="w-5 h-5" />;
    if (lowerCondition.includes("cloud")) return <Cloud className="w-5 h-5" />;
    if (lowerCondition.includes("clear")) return <Sun className="w-5 h-5" />;
    return <Sun className="w-5 h-5" />;
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border px-4 py-2">
      {loading && (
        <div className="flex justify-center items-center">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      )}
      
      {error && (
        <p className="text-xs text-muted-foreground text-center">{error}</p>
      )}
      
      {weather && !loading && (
        <div className="flex items-center justify-center gap-2">
          <div className="flex-shrink-0 text-primary">
            {getWeatherIcon(weather.condition)}
          </div>
          <p className="text-2xl font-bold text-primary">
            {weather.temperature}
          </p>
          <p className="text-sm text-muted-foreground capitalize">
            {weather.condition}
          </p>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;

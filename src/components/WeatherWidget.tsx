import { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, Snowflake, CloudSnow, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const WeatherWidget = () => {
  const [weather, setWeather] = useState({
    temperature: "Loading...",
    condition: "Loading weather...",
    location: "Elgin, IL"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: functionError } = await supabase.functions.invoke('get-weather');
      
      if (functionError) {
        console.error('Weather function error:', functionError);
        throw new Error(functionError.message || 'Failed to fetch weather');
      }
      
      if (data && !data.error) {
        setWeather({
          temperature: data.temperature,
          condition: data.condition,
          location: data.location
        });
      } else {
        throw new Error(data?.error || 'Invalid weather data received');
      }
    } catch (err) {
      console.error('Failed to fetch weather:', err);
      setError('Unable to load weather');
      setWeather({
        temperature: "--°F",
        condition: "Weather unavailable",
        location: "Elgin, IL"
      });
    } finally {
      setLoading(false);
    }
  };

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
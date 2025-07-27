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
    if (loading) return <Loader2 className="w-8 h-8 animate-spin" />;
    if (error) return <Cloud className="w-8 h-8 opacity-50" />;
    
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes("rain")) return <CloudRain className="w-8 h-8" />;
    if (lowerCondition.includes("snow")) return <CloudSnow className="w-8 h-8" />;
    if (lowerCondition.includes("cloud")) return <Cloud className="w-8 h-8" />;
    if (lowerCondition.includes("clear")) return <Sun className="w-8 h-8" />;
    return <Sun className="w-8 h-8" />;
  };

  return (
    <div className="church-card">
      <h3 className="text-xl font-semibold mb-4 text-center">Today's Weather</h3>
      <div className="flex items-center justify-center space-x-4">
        <div className="text-primary">
          {getWeatherIcon(weather.condition)}
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-foreground">{weather.temperature}</div>
          <div className="text-muted-foreground">{weather.condition}</div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
import { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, Snowflake, CloudSnow } from "lucide-react";

const WeatherWidget = () => {
  const [weather, setWeather] = useState({
    temperature: "72°F",
    condition: "Partly Cloudy",
    location: "Your City"
  });

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes("rain")) return <CloudRain className="w-8 h-8" />;
    if (lowerCondition.includes("snow")) return <CloudSnow className="w-8 h-8" />;
    if (lowerCondition.includes("cloud")) return <Cloud className="w-8 h-8" />;
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
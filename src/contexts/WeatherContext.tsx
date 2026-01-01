import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WeatherData {
  temperature: string;
  condition: string;
  location: string;
  isSnowing: boolean;
}

interface WeatherContextType {
  weather: WeatherData;
  loading: boolean;
  error: string | null;
}

const defaultWeather: WeatherData = {
  temperature: '--°F',
  condition: 'Loading...',
  location: 'Elgin, IL',
  isSnowing: false,
};

const WeatherContext = createContext<WeatherContextType>({
  weather: defaultWeather,
  loading: true,
  error: null,
});

export const useWeather = () => useContext(WeatherContext);

export const WeatherProvider = ({ children }: { children: ReactNode }) => {
  const [weather, setWeather] = useState<WeatherData>(defaultWeather);
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
        const condition = data.condition || '';
        const lowerCondition = condition.toLowerCase();
        const isSnowing = lowerCondition.includes('snow');
        
        setWeather({
          temperature: data.temperature,
          condition: data.condition,
          location: data.location,
          isSnowing,
        });
      } else {
        throw new Error(data?.error || 'Invalid weather data received');
      }
    } catch (err) {
      console.error('Failed to fetch weather:', err);
      setError('Unable to load weather');
      setWeather({
        temperature: '--°F',
        condition: 'Weather unavailable',
        location: 'Elgin, IL',
        isSnowing: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <WeatherContext.Provider value={{ weather, loading, error }}>
      {children}
    </WeatherContext.Provider>
  );
};


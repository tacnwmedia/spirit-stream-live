import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('OPENWEATHER_API_KEY');
    
    if (!apiKey) {
      console.error('OPENWEATHER_API_KEY not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'Weather service configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Fetch weather for Elgin, IL (ZIP: 60120)
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?zip=60120,US&units=imperial&appid=${apiKey}`;
    
    console.log('Fetching weather data for Elgin, IL...');
    const weatherResponse = await fetch(weatherUrl);
    
    if (!weatherResponse.ok) {
      console.error('Weather API response not ok:', weatherResponse.status, weatherResponse.statusText);
      throw new Error(`Weather API error: ${weatherResponse.status}`);
    }
    
    const weatherData = await weatherResponse.json();
    console.log('Weather data received:', JSON.stringify(weatherData, null, 2));
    
    // Extract and format the weather information
    const formattedWeather = {
      temperature: `${Math.round(weatherData.main.temp)}°F`,
      condition: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      location: weatherData.name,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind?.speed || 0
    };

    return new Response(
      JSON.stringify(formattedWeather),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error fetching weather:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch weather data',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
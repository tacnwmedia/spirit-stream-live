import { useState } from 'react';
import Navigation from '@/components/Navigation';
import SnowEffect from '@/components/SnowEffect';
import { Button } from '@/components/ui/button';
import { Snowflake, CloudSnow } from 'lucide-react';

const SnowDemo = () => {
  const [showSnow, setShowSnow] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      {/* Snow Effect */}
      {showSnow && <SnowEffect />}
      
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="church-card text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CloudSnow className="w-10 h-10 text-blue-400" />
            <h1 className="text-4xl font-bold text-primary">Snow Effect Demo</h1>
          </div>
          <p className="text-muted-foreground text-lg mb-6">
            This demo shows the snow effect that appears on the main page when the weather is snowy.
          </p>
          
          <Button 
            onClick={() => setShowSnow(!showSnow)}
            variant={showSnow ? "destructive" : "default"}
            size="lg"
            className="gap-2"
          >
            <Snowflake className="w-5 h-5" />
            {showSnow ? "Stop Snow" : "Start Snow"}
          </Button>
        </div>

        <div className="church-card">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              <strong className="text-foreground">Automatic Trigger:</strong> The snow effect automatically appears on the main page when the weather API reports snowy conditions (snow, snowing, light snow, heavy snow, etc.).
            </p>
            <p>
              <strong className="text-foreground">Main Page Only:</strong> The snow only shows on the homepage. When you navigate to other pages (hymn view, events, etc.), the snow stops.
            </p>
            <p>
              <strong className="text-foreground">Performance:</strong> The effect uses CSS animations for smooth performance without impacting page responsiveness.
            </p>
          </div>
        </div>

        <div className="church-card mt-6">
          <h2 className="text-2xl font-semibold mb-4">Snow Statistics</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
              <div className="text-3xl font-bold text-blue-500">50</div>
              <div className="text-sm text-muted-foreground">Snowflakes</div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
              <div className="text-3xl font-bold text-blue-500">5-15s</div>
              <div className="text-sm text-muted-foreground">Fall Duration</div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
              <div className="text-3xl font-bold text-blue-500">4-12px</div>
              <div className="text-sm text-muted-foreground">Flake Size</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnowDemo;


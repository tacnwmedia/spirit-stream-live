import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const WatchwordDisplay = () => {
  const [watchword, setWatchword] = useState({
    text: "The Lord is my shepherd; I shall not want.",
    reference: "Psalm 23:1"
  });

  useEffect(() => {
    loadWatchword();
  }, []);

  const loadWatchword = async () => {
    try {
      const { data } = await supabase
        .from('church_settings')
        .select('setting_value')
        .eq('setting_key', 'watchword')
        .maybeSingle();

      if (data?.setting_value) {
        // Try to parse if it's JSON with text and reference
        try {
          const parsed = JSON.parse(data.setting_value);
          if (parsed.text && parsed.reference) {
            setWatchword(parsed);
          } else {
            setWatchword({
              text: data.setting_value,
              reference: "Scripture"
            });
          }
        } catch {
          // If not JSON, treat as plain text
          setWatchword({
            text: data.setting_value,
            reference: "Scripture"
          });
        }
      }
    } catch (error) {
      console.error('Failed to load watchword:', error);
    }
  };

  return (
    <div className="church-card">
      <div className="flex items-center justify-center mb-4">
        <BookOpen className="w-6 h-6 text-primary mr-2" />
        <h3 className="text-xl font-semibold">Watchword</h3>
      </div>
      <div className="text-center">
        <blockquote className="church-text italic text-foreground mb-3 leading-relaxed">
          "{watchword.text}"
        </blockquote>
        <cite className="text-muted-foreground font-medium">
          — {watchword.reference}
        </cite>
      </div>
    </div>
  );
};

export default WatchwordDisplay;
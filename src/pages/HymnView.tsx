import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Music, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { useHymns } from "@/hooks/useHymns";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const HymnView = () => {
  const { number } = useParams();
  const navigate = useNavigate();
  const hymnNumber = number ? parseInt(number) : 0;
  const { getHymnByNumber, loading } = useHymns();
  const hymn = getHymnByNumber(hymnNumber);
  
  const [dailyHymns, setDailyHymns] = useState<{
    opening_hymn_number: number | null;
    closing_hymn_number: number | null;
  }>({
    opening_hymn_number: null,
    closing_hymn_number: null,
  });

  useEffect(() => {
    loadDailyHymns();
  }, []);

  const loadDailyHymns = async () => {
    try {
      const { data } = await supabase
        .from('daily_hymns')
        .select('*')
        .order('hymn_date', { ascending: false })
        .limit(1)
        .maybeSingle();

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

  const handleHymnNavigation = (hymnNumber: number) => {
    navigate(`/hymn/${hymnNumber}`);
    window.scrollTo(0, 0);
  };

  const isOpeningHymn = dailyHymns.opening_hymn_number === hymnNumber;
  const isClosingHymn = dailyHymns.closing_hymn_number === hymnNumber;
  const otherHymnNumber = isOpeningHymn ? dailyHymns.closing_hymn_number : 
                         isClosingHymn ? dailyHymns.opening_hymn_number : null;
  const otherHymnType = isOpeningHymn ? "Closing Hymn" : "Opening Hymn";

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading hymn...</p>
        </div>
      </div>
    );
  }

  if (!hymn) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="church-card text-center">
            <h2 className="text-2xl font-semibold mb-4">Hymn Not Found</h2>
            <p className="church-text mb-6">
              Sorry, we couldn't find hymn #{hymnNumber}.
            </p>
            <Button onClick={() => navigate("/")} className="church-button">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="church-card mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button 
              onClick={() => navigate("/")} 
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Button>
          </div>
          
          <div className="text-center animate-fade-in">
            {(isOpeningHymn || isClosingHymn) && (
              <div className="text-lg font-medium text-muted-foreground mb-2">
                {isOpeningHymn ? "Opening Hymn" : "Closing Hymn"}
              </div>
            )}
            <div className="flex items-center justify-center mb-4">
              <Music className="w-8 h-8 text-primary mr-3" />
              <h1 className="text-4xl font-bold text-primary">#{hymn.number}</h1>
            </div>
            <h2 className="text-3xl font-semibold">{hymn.title}</h2>
          </div>
        </div>

        {/* Hymn Content */}
        <div className="church-card">
          <div className="space-y-8">
            {hymn.verses.map((verse, index) => (
              <div key={`verse-${verse.number}`}>
                <div className="border-l-4 border-primary pl-6">
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    Verse {verse.number}
                  </div>
                  <div className="church-text leading-loose">
                    {verse.lines.map((line, lineIndex) => (
                      <div key={lineIndex} className="mb-1">{line}</div>
                    ))}
                  </div>
                </div>
                
                {/* Show chorus after verse 1 if it exists */}
                {verse.number === 1 && hymn.chorus && (
                  <div className="border-l-4 border-accent pl-6 bg-accent/20 p-4 rounded-r-lg mt-8">
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      Chorus
                    </div>
                    <div className="church-text leading-loose font-medium">
                      {hymn.chorus.map((line, lineIndex) => (
                        <div key={lineIndex} className="mb-1">{line}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="church-card mt-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors w-full sm:w-auto text-sm sm:text-base"
            >
              <span className="hidden xs:inline">Return to Homepage</span>
              <span className="xs:hidden">Home</span>
            </a>
            {otherHymnNumber && (
              <Button 
                onClick={() => handleHymnNavigation(otherHymnNumber)}
                variant="outline"
                className="flex items-center space-x-2 w-full sm:w-auto text-xs sm:text-sm"
              >
                <span>View {otherHymnType}</span>
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HymnView;
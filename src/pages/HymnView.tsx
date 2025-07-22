import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { getHymnByNumber } from "@/data/hymns";

const HymnView = () => {
  const { number } = useParams();
  const navigate = useNavigate();
  const hymnNumber = number ? parseInt(number) : 0;
  const hymn = getHymnByNumber(hymnNumber);

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
          
          <div className="text-center">
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
              <div key={index} className="border-l-4 border-primary pl-6">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Verse {index + 1}
                </div>
                <div className="church-text leading-loose whitespace-pre-line">
                  {verse}
                </div>
              </div>
            ))}
            
            {hymn.chorus && (
              <div className="border-l-4 border-accent pl-6 bg-accent/20 p-4 rounded-r-lg">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Chorus
                </div>
                <div className="church-text leading-loose whitespace-pre-line font-medium">
                  {hymn.chorus}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HymnView;
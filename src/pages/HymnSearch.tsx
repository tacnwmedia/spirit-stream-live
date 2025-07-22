import { useState } from "react";
import { Search, Music } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

const HymnSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Sample hymn database
  const hymns = [
    { number: 1, title: "Holy, Holy, Holy", firstLine: "Holy, holy, holy! Lord God Almighty!" },
    { number: 25, title: "Amazing Grace", firstLine: "Amazing grace! How sweet the sound" },
    { number: 46, title: "How Great Thou Art", firstLine: "O Lord my God, when I in awesome wonder" },
    { number: 78, title: "Great Is Thy Faithfulness", firstLine: "Great is thy faithfulness, O God my Father" },
    { number: 102, title: "Blessed Assurance", firstLine: "Blessed assurance, Jesus is mine!" },
    { number: 134, title: "Be Thou My Vision", firstLine: "Be thou my vision, O Lord of my heart" },
    { number: 156, title: "Rock of Ages", firstLine: "Rock of Ages, cleft for me" },
    { number: 189, title: "What a Friend We Have in Jesus", firstLine: "What a friend we have in Jesus" },
    { number: 234, title: "Crown Him with Many Crowns", firstLine: "Crown him with many crowns" },
    { number: 267, title: "Just As I Am", firstLine: "Just as I am, without one plea" }
  ];

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const results = hymns.filter(hymn => 
      hymn.number.toString().includes(searchTerm) ||
      hymn.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hymn.firstLine.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResults(results);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="church-card mb-8">
          <div className="flex items-center justify-center mb-6">
            <Music className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold">Search Hymns</h1>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="flex space-x-3">
              <Input
                type="text"
                placeholder="Enter hymn number, title, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="text-lg h-14"
              />
              <Button onClick={handleSearch} className="church-button h-14 px-6">
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center mb-6">
              Found {searchResults.length} hymn{searchResults.length !== 1 ? 's' : ''}
            </h2>
            
            {searchResults.map((hymn) => (
              <div key={hymn.number} className="church-card">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                    {hymn.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {hymn.title}
                    </h3>
                    <p className="church-text text-muted-foreground italic">
                      "{hymn.firstLine}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {searchTerm && searchResults.length === 0 && (
          <div className="church-card text-center">
            <p className="church-text text-muted-foreground">
              No hymns found matching "{searchTerm}". Try searching by number, title, or keyword.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HymnSearch;
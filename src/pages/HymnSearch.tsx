
import { useState, useEffect } from "react";
import { Search, Music, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import { useHymns } from "@/hooks/useHymns";

const HymnSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { hymns, loading, searchHymns, forceReload } = useHymns();

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    console.log(`Searching for "${searchTerm}" in ${hymns.length} hymns`);
    const results = searchHymns(searchTerm);
    console.log(`Search returned ${results.length} results`);
    setSearchResults(results);
  };

  const handleRefresh = () => {
    console.log('Refreshing hymns data...');
    forceReload();
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
              <Button 
                onClick={handleRefresh} 
                variant="outline" 
                className="h-14 px-4"
                disabled={loading}
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Total hymns: {hymns.length} | Click refresh to load new hymns
            </p>
          </div>
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center mb-6">
              Found {searchResults.length} hymn{searchResults.length !== 1 ? 's' : ''}
            </h2>
            
            {searchResults.map((hymn) => (
              <Link key={hymn.number} to={`/hymn/${hymn.number}`}>
                <div className="church-card hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                      {hymn.number}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {hymn.title}
                      </h3>
                      <p className="church-text text-muted-foreground italic">
                        {hymn.content.split('\n')[0].substring(0, 100)}...
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {searchTerm && searchResults.length === 0 && !loading && (
          <div className="church-card text-center">
            <p className="church-text text-muted-foreground">
              No hymns found matching "{searchTerm}". Try searching by number, title, or keyword, or click refresh to load new hymns.
            </p>
          </div>
        )}

        {loading && (
          <div className="church-card text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="church-text text-muted-foreground">Loading hymns...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HymnSearch;

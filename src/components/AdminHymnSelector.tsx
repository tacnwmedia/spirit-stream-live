import { useState, useEffect } from "react";
import { Search, Music, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHymns, Hymn } from "@/hooks/useHymns";
import AdminHymnEntry from "./AdminHymnEntry";

interface AdminHymnSelectorProps {
  value: number | null;
  onChange: (hymnNumber: number) => void;
  label: string;
  placeholder: string;
}

const AdminHymnSelector = ({ value, onChange, label, placeholder }: AdminHymnSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showHymnEntry, setShowHymnEntry] = useState(false);
  const { hymns, loading, searchHymns, reload } = useHymns();
  const [searchResults, setSearchResults] = useState<Hymn[]>([]);
  const [selectedHymn, setSelectedHymn] = useState<Hymn | null>(null);

  useEffect(() => {
    if (value) {
      const hymn = hymns.find(h => h.number === value);
      setSelectedHymn(hymn || null);
    }
  }, [value, hymns]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      const results = searchHymns(term).slice(0, 10); // Limit results
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const selectHymn = (hymn: Hymn) => {
    setSelectedHymn(hymn);
    onChange(hymn.number);
    setIsOpen(false);
    setShowHymnEntry(false);
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleHymnCreated = async (hymnNumber: number) => {
    await reload(); // Reload hymns to include the new one
    setShowHymnEntry(false);
    // Set the hymn selection directly since reload is async
    onChange(hymnNumber);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedHymn ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Music className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-semibold">#{selectedHymn.number}</div>
                  <div className="text-sm text-muted-foreground">{selectedHymn.title}</div>
                </div>
              </div>
              <Button onClick={() => setIsOpen(!isOpen)} variant="outline" size="sm">
                Change
              </Button>
            </div>
          </div>
        ) : (
          <Button onClick={() => setIsOpen(!isOpen)} variant="outline" className="w-full">
            <Search className="w-4 h-4 mr-2" />
            {placeholder}
          </Button>
        )}

        {isOpen && !showHymnEntry && (
          <div className="space-y-3">
            <div className="flex space-x-2">
              <Input
                placeholder="Search hymns by number, title, or lyrics..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={() => setShowHymnEntry(true)}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                New
              </Button>
            </div>
            
            {searchResults.length > 0 && (
              <div className="max-h-60 overflow-y-auto space-y-2 border rounded-md p-2">
                {searchResults.map((hymn) => (
                  <div
                    key={hymn.number}
                    onClick={() => selectHymn(hymn)}
                    className="flex items-center space-x-3 p-2 hover:bg-accent/20 rounded cursor-pointer"
                  >
                    <Music className="w-4 h-4 text-primary" />
                    <div className="flex-1">
                      <div className="font-medium">#{hymn.number}</div>
                      <div className="text-sm text-muted-foreground">{hymn.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {searchTerm && searchResults.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                <p>No hymns found. Try a different search or create a new hymn.</p>
              </div>
            )}
          </div>
        )}

        {showHymnEntry && (
          <AdminHymnEntry
            onHymnCreated={handleHymnCreated}
            onCancel={() => setShowHymnEntry(false)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AdminHymnSelector;
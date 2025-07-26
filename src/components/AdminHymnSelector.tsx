import { useState, useEffect } from "react";
import { Search, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHymns, Hymn } from "@/hooks/useHymns";

interface AdminHymnSelectorProps {
  value: number | null;
  onChange: (hymnNumber: number) => void;
  label: string;
  placeholder: string;
}

const AdminHymnSelector = ({ value, onChange, label, placeholder }: AdminHymnSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { hymns, loading, searchHymns } = useHymns();
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
    setSearchTerm("");
    setSearchResults([]);
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

        {isOpen && (
          <div className="space-y-3">
            <Input
              placeholder="Search hymns by number, title, or lyrics..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full"
            />
            
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminHymnSelector;
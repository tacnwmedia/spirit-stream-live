
import { useState, useEffect } from "react";
import { Search, Music, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHymns, Hymn } from "@/hooks/useHymns";
import AdminHymnEntry from "./AdminHymnEntry";
import { supabase } from "@/integrations/supabase/client";

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
  const { hymns, loading, searchHymns, forceReload } = useHymns();
  const [searchResults, setSearchResults] = useState<Hymn[]>([]);
  const [selectedHymn, setSelectedHymn] = useState<Hymn | null>(null);
  const [hymnList, setHymnList] = useState<Array<{ hymn_number: number; title: string | null }>>([]);
  const [listLoading, setListLoading] = useState(false);

  useEffect(() => {
    if (value) {
      const hymn = hymns.find(h => h.number === value);
      setSelectedHymn(hymn || null);
    }
  }, [value, hymns]);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    // Always fetch fresh list from RPC when starting a search or list is empty
    if (hymnList.length === 0 && !listLoading) {
      try {
        setListLoading(true);
        const { data, error } = await supabase.rpc('get_all_hymns');
        if (error) {
          console.error('Failed to load hymn list via RPC:', error);
        } else {
          setHymnList(data || []);
        }
      } finally {
        setListLoading(false);
      }
    }

    if (term.trim()) {
      const lower = term.toLowerCase();
      const results = (hymnList.length ? hymnList : [])
        .filter(h =>
          h.hymn_number.toString().includes(lower) ||
          (h.title || '').toLowerCase().includes(lower)
        )
        .map(h => ({
          number: h.hymn_number,
          title: h.title || `Hymn ${h.hymn_number}`,
          verses: [],
          fullContent: ''
        } as Hymn));
      console.log(`Admin search for "${term}" returned:`, results.length, 'results');
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const selectHymn = (hymn: Hymn) => {
    console.log('Selected hymn:', hymn.number, hymn.title);
    setSelectedHymn(hymn);
    onChange(hymn.number);
    setIsOpen(false);
    setShowHymnEntry(false);
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleHymnCreated = async (hymnNumber: number) => {
    console.log('Hymn created, reloading data...');
    // Force reload hymns to include the new one
    await forceReload();
    setShowHymnEntry(false);
    // Set the hymn selection directly
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
            <div className="mt-2">
              <div
                onClick={() => {
                  const manual = window.prompt('Enter hymn number:');
                  const num = manual ? parseInt(manual, 10) : NaN;
                  if (!isNaN(num)) {
                    onChange(num);
                    setIsOpen(false);
                    setShowHymnEntry(false);
                    setSearchTerm("");
                    setSearchResults([]);
                  }
                }}
                className="text-sm text-primary hover:underline cursor-pointer text-center"
              >
                Enter number manually
              </div>
            </div>
            
            {searchTerm && searchResults.length === 0 && !loading && (
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

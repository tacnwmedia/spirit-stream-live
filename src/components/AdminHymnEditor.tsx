import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, Plus, Trash2, Save, X } from "lucide-react";
import { logAdminAction } from "@/lib/adminLogger";

interface HymnLine {
  id?: number;
  verse_number: number;
  line_number: number;
  text: string;
  chorus: boolean;
}

interface AdminHymnEditorProps {
  onCancel: () => void;
}

const AdminHymnEditor = ({ onCancel }: AdminHymnEditorProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ hymn_number: number; title: string }>>([]);
  const [selectedHymnNumber, setSelectedHymnNumber] = useState<number | null>(null);
  const [hymnTitle, setHymnTitle] = useState("");
  const [lines, setLines] = useState<HymnLine[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchHymns = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('hymn_lines')
        .select('hymn_number, text')
        .or(`hymn_number.eq.${parseInt(searchTerm)},text.ilike.%${searchTerm}%`)
        .eq('verse_number', 1)
        .eq('line_number', 1)
        .order('hymn_number');

      if (error) throw error;

      const uniqueHymns = Array.from(
        new Map(data?.map(h => [h.hymn_number, { hymn_number: h.hymn_number, title: h.text }])).values()
      );

      setSearchResults(uniqueHymns);
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: "Search Failed",
        description: "Unable to search hymns",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadHymn = async (hymnNumber: number) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('hymn_lines')
        .select('*')
        .eq('hymn_number', hymnNumber)
        .order('verse_number')
        .order('line_number');

      if (error) throw error;

      if (data && data.length > 0) {
        setSelectedHymnNumber(hymnNumber);
        setHymnTitle(data[0].text);
        setLines(data.map(line => ({
          id: line.id,
          verse_number: line.verse_number,
          line_number: line.line_number,
          text: line.text,
          chorus: line.chorus,
        })));
        setSearchResults([]);
        setSearchTerm("");
      }
    } catch (error) {
      console.error('Load hymn failed:', error);
      toast({
        title: "Load Failed",
        description: "Unable to load hymn",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addLine = () => {
    const lastLine = lines[lines.length - 1];
    const newLine: HymnLine = {
      verse_number: lastLine ? lastLine.verse_number : 1,
      line_number: lastLine ? lastLine.line_number + 1 : 1,
      text: "",
      chorus: false,
    };
    setLines([...lines, newLine]);
  };

  const removeLine = (index: number) => {
    setLines(lines.filter((_, i) => i !== index));
  };

  const updateLine = (index: number, field: keyof HymnLine, value: any) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [field]: value };
    setLines(newLines);
  };

  const saveChanges = async () => {
    if (!selectedHymnNumber) return;

    if (lines.some(line => !line.text.trim())) {
      toast({
        title: "Validation Error",
        description: "All lines must have text",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Delete existing lines for this hymn
      const { error: deleteError } = await supabase
        .from('hymn_lines')
        .delete()
        .eq('hymn_number', selectedHymnNumber);

      if (deleteError) throw deleteError;

      // Insert updated lines
      const { error: insertError } = await supabase
        .from('hymn_lines')
        .insert(
          lines.map(line => ({
            hymn_number: selectedHymnNumber,
            verse_number: line.verse_number,
            line_number: line.line_number,
            text: line.text,
            chorus: line.chorus,
          }))
        );

      if (insertError) throw insertError;

      await logAdminAction(`Edited Hymn ${selectedHymnNumber}: ${hymnTitle}`);

      toast({
        title: "Hymn Updated",
        description: `Hymn #${selectedHymnNumber} has been updated successfully`,
      });

      // Reset form
      setSelectedHymnNumber(null);
      setHymnTitle("");
      setLines([]);
    } catch (error) {
      console.error('Save failed:', error);
      toast({
        title: "Save Failed",
        description: "Unable to save hymn changes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setSelectedHymnNumber(null);
    setHymnTitle("");
    setLines([]);
    setSearchResults([]);
    setSearchTerm("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Edit Hymn</span>
          <Button onClick={onCancel} variant="ghost" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedHymnNumber ? (
          <>
            {/* Search Section */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search by hymn number or title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchHymns()}
                />
                <Button onClick={searchHymns} disabled={isLoading}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="border rounded-md max-h-60 overflow-y-auto">
                  {searchResults.map((hymn) => (
                    <button
                      key={hymn.hymn_number}
                      onClick={() => loadHymn(hymn.hymn_number)}
                      className="w-full text-left px-4 py-2 hover:bg-accent transition-colors border-b last:border-b-0"
                    >
                      <div className="font-semibold">Hymn #{hymn.hymn_number}</div>
                      <div className="text-sm text-muted-foreground">{hymn.title}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Edit Section */}
            <div className="space-y-4">
              <div>
                <Label>Hymn Number: {selectedHymnNumber}</Label>
                <p className="text-sm text-muted-foreground mt-1">{hymnTitle}</p>
              </div>

              {/* Lines Editor */}
              <div className="space-y-4 max-h-96 overflow-y-auto border rounded-md p-4">
                {lines.map((line, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-2">
                      <Label className="text-xs">Verse</Label>
                      <Input
                        type="number"
                        min="1"
                        value={line.verse_number}
                        onChange={(e) => updateLine(index, 'verse_number', parseInt(e.target.value) || 1)}
                        className="text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs">Line</Label>
                      <Input
                        type="number"
                        min="1"
                        value={line.line_number}
                        onChange={(e) => updateLine(index, 'line_number', parseInt(e.target.value) || 1)}
                        className="text-sm"
                      />
                    </div>
                    <div className="col-span-5">
                      <Label className="text-xs">Text</Label>
                      <Input
                        value={line.text}
                        onChange={(e) => updateLine(index, 'text', e.target.value)}
                        placeholder="Line text..."
                        className="text-sm"
                      />
                    </div>
                    <div className="col-span-2 flex items-center gap-2 pt-5">
                      <Switch
                        checked={line.chorus}
                        onCheckedChange={(checked) => updateLine(index, 'chorus', checked)}
                      />
                      <Label className="text-xs">Chorus</Label>
                    </div>
                    <div className="col-span-1 pt-5">
                      <Button
                        onClick={() => removeLine(index)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button onClick={addLine} variant="outline" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Line
                </Button>
                <Button onClick={saveChanges} disabled={isLoading} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
                <Button onClick={cancelEdit} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminHymnEditor;

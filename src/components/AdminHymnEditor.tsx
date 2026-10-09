import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, Plus, Trash2, Save, X, ArrowUp, ArrowDown, ListOrdered, PlusCircle } from "lucide-react";
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

const autoRenumberLines = (lineList: HymnLine[]): HymnLine[] => {
  const verseCounts: Record<number, number> = {};
  return lineList.map((line) => {
    const v = line.verse_number || 1;
    verseCounts[v] = (verseCounts[v] || 0) + 1;
    return {
      ...line,
      line_number: verseCounts[v],
    };
  });
};

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
      line_number: 1,
      text: "",
      chorus: lastLine ? lastLine.chorus : false,
    };
    setLines(autoRenumberLines([...lines, newLine]));
  };

  const insertLine = (index: number, position: 'above' | 'below') => {
    const targetIndex = position === 'above' ? index : index + 1;
    const refLine = lines[index];
    const newLine: HymnLine = {
      verse_number: refLine ? refLine.verse_number : 1,
      line_number: 1,
      text: "",
      chorus: refLine ? refLine.chorus : false,
    };
    const updated = [...lines];
    updated.splice(targetIndex, 0, newLine);
    setLines(autoRenumberLines(updated));
  };

  const moveLine = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= lines.length) return;
    const updated = [...lines];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);
    setLines(autoRenumberLines(updated));
  };

  const removeLine = (index: number) => {
    const updated = lines.filter((_, i) => i !== index);
    setLines(autoRenumberLines(updated));
  };

  const handleRenumberAll = () => {
    setLines(autoRenumberLines(lines));
    toast({
      title: "Lines Renumbered",
      description: "All line numbers updated sequentially per verse.",
    });
  };

  const updateLine = (index: number, field: keyof HymnLine, value: any) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [field]: value };
    if (field === 'verse_number') {
      setLines(autoRenumberLines(newLines));
    } else {
      setLines(newLines);
    }
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
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-semibold">Hymn #{selectedHymnNumber}</Label>
                  <p className="text-sm text-muted-foreground">{hymnTitle}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRenumberAll}
                  className="flex items-center gap-1.5 text-xs"
                  title="Auto-sequence line numbers per verse"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                  Auto-Renumber
                </Button>
              </div>

              {/* Lines Editor */}
              <div className="space-y-3 max-h-[450px] overflow-y-auto border rounded-md p-3 bg-muted/20">
                {lines.map((line, index) => (
                  <div key={index} className="flex flex-wrap md:flex-nowrap items-center gap-2 p-3 border rounded-lg bg-card hover:border-primary/40 transition-colors shadow-sm">
                    {/* Reorder Buttons */}
                    <div className="flex flex-col gap-0.5">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-5 w-5 hover:bg-accent"
                        title="Move line up"
                        disabled={index === 0}
                        onClick={() => moveLine(index, 'up')}
                      >
                        <ArrowUp className="w-3 h-3" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-5 w-5 hover:bg-accent"
                        title="Move line down"
                        disabled={index === lines.length - 1}
                        onClick={() => moveLine(index, 'down')}
                      >
                        <ArrowDown className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Verse & Line inputs */}
                    <div className="w-16">
                      <Label className="text-[10px] text-muted-foreground uppercase font-semibold">Verse</Label>
                      <Input
                        type="number"
                        min="1"
                        value={line.verse_number}
                        onChange={(e) => updateLine(index, 'verse_number', parseInt(e.target.value) || 1)}
                        className="h-8 text-xs px-2 text-center"
                      />
                    </div>

                    <div className="w-16">
                      <Label className="text-[10px] text-muted-foreground uppercase font-semibold">Line</Label>
                      <Input
                        type="number"
                        min="1"
                        value={line.line_number}
                        onChange={(e) => updateLine(index, 'line_number', parseInt(e.target.value) || 1)}
                        className="h-8 text-xs px-2 text-center"
                      />
                    </div>

                    {/* Text input */}
                    <div className="flex-1 min-w-[180px]">
                      <Label className="text-[10px] text-muted-foreground uppercase font-semibold">Lyric Text</Label>
                      <Input
                        value={line.text}
                        onChange={(e) => updateLine(index, 'text', e.target.value)}
                        placeholder="Line text..."
                        className="h-8 text-sm"
                      />
                    </div>

                    {/* Chorus Toggle */}
                    <div className="flex items-center gap-1.5 pt-4">
                      <Switch
                        checked={line.chorus}
                        onCheckedChange={(checked) => updateLine(index, 'chorus', checked)}
                        id={`editor-chorus-${index}`}
                      />
                      <Label htmlFor={`editor-chorus-${index}`} className="text-xs cursor-pointer select-none">Chorus</Label>
                    </div>

                    {/* Action Buttons: Insert Above / Insert Below / Delete */}
                    <div className="flex items-center gap-1 pt-4 ml-auto">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8 px-2 text-xs flex items-center gap-1 hover:bg-primary/10 hover:text-primary"
                        title="Insert blank line directly below this line"
                        onClick={() => insertLine(index, 'below')}
                      >
                        <PlusCircle className="w-3.5 h-3.5 text-primary" />
                        <span>Insert Below</span>
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="Delete line"
                        onClick={() => removeLine(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Button onClick={addLine} variant="outline" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Line to Bottom
                </Button>
                <Button onClick={saveChanges} disabled={isLoading} className="flex items-center gap-2 ml-auto">
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

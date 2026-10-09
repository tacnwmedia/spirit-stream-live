import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Music, Plus, X, Trash2, ArrowUp, ArrowDown, ListOrdered, PlusCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminHymnEntryProps {
  onHymnCreated: (hymnNumber: number) => void;
  onCancel: () => void;
}

interface HymnLine {
  verse_number: number;
  line_number: number;
  text: string;
  chorus: boolean;
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

const AdminHymnEntry = ({ onHymnCreated, onCancel }: AdminHymnEntryProps) => {
  const [hymnNumber, setHymnNumber] = useState("");
  const [hymnTitle, setHymnTitle] = useState("");
  const [lines, setLines] = useState<HymnLine[]>([
    { verse_number: 1, line_number: 1, text: "", chorus: false }
  ]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
    if (lines.length > 1) {
      const updated = lines.filter((_, i) => i !== index);
      setLines(autoRenumberLines(updated));
    }
  };

  const handleRenumberAll = () => {
    setLines(autoRenumberLines(lines));
    toast({
      title: "Lines Renumbered",
      description: "All line numbers updated sequentially per verse.",
    });
  };

  const updateLine = (index: number, field: keyof HymnLine, value: any) => {
    const updatedLines = [...lines];
    updatedLines[index] = { ...updatedLines[index], [field]: value };
    if (field === 'verse_number') {
      setLines(autoRenumberLines(updatedLines));
    } else {
      setLines(updatedLines);
    }
  };

  const handleSubmit = async () => {
    if (!hymnNumber || !hymnTitle || lines.some(line => !line.text.trim())) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const number = parseInt(hymnNumber);
    if (isNaN(number) || number <= 0) {
      toast({
        title: "Invalid Hymn Number",
        description: "Please enter a valid hymn number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log(`Creating hymn ${number}: ${hymnTitle}`);
      
      // Check if hymn number already exists
      const { data: existingHymn } = await supabase
        .from('hymn_lines')
        .select('hymn_number')
        .eq('hymn_number', number)
        .limit(1)
        .maybeSingle();

      if (existingHymn) {
        toast({
          title: "Hymn Already Exists",
          description: `Hymn #${number} already exists in the database`,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Prepare hymn line data for database
      const hymnLineData = lines.map((line) => ({
        hymn_number: number,
        verse_number: line.verse_number,
        line_number: line.line_number,
        text: line.text.trim(),
        chorus: line.chorus
      }));

      console.log('Inserting hymn line data:', hymnLineData);

      const { error } = await supabase
        .from('hymn_lines')
        .insert(hymnLineData);

      if (error) {
        console.error('Error inserting hymn lines:', error);
        throw error;
      }

      console.log(`Successfully created hymn ${number}`);

      toast({
        title: "Hymn Created",
        description: `Hymn #${number} "${hymnTitle}" has been added successfully`,
      });

      // Reset form first
      setHymnNumber("");
      setHymnTitle("");
      setLines([{ verse_number: 1, line_number: 1, text: "", chorus: false }]);

      // Wait a moment for the database to be consistent
      setTimeout(() => {
        onHymnCreated(number);
      }, 500);
    } catch (error) {
      console.error('Error creating hymn:', error);
      toast({
        title: "Error",
        description: "Failed to create hymn. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Add New Hymn
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="hymnNumber">Hymn Number *</Label>
            <Input
              id="hymnNumber"
              type="number"
              placeholder="e.g., 123"
              value={hymnNumber}
              onChange={(e) => setHymnNumber(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="hymnTitle">Hymn Title *</Label>
            <Input
              id="hymnTitle"
              placeholder="e.g., Amazing Grace"
              value={hymnTitle}
              onChange={(e) => setHymnTitle(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-base font-semibold">Hymn Lines</Label>
            <div className="flex items-center gap-2">
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
              <Button 
                type="button" 
                onClick={addLine} 
                size="sm" 
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Line to Bottom</span>
              </Button>
            </div>
          </div>

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
                  <Label className="text-[10px] text-muted-foreground uppercase font-semibold">Lyric Text *</Label>
                  <Input
                    placeholder="Enter lyric line..."
                    value={line.text}
                    onChange={(e) => updateLine(index, 'text', e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>

                {/* Chorus Toggle */}
                <div className="flex items-center gap-1.5 pt-4">
                  <Switch
                    checked={line.chorus}
                    onCheckedChange={(checked) => updateLine(index, 'chorus', checked)}
                    id={`entry-chorus-${index}`}
                  />
                  <Label htmlFor={`entry-chorus-${index}`} className="text-xs cursor-pointer select-none">Chorus</Label>
                </div>

                {/* Action Buttons: Insert Below / Delete */}
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
                    disabled={lines.length <= 1}
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
          
          <p className="text-sm text-muted-foreground mt-2">
            Use "Insert Below" on any line to insert a line in between existing lyrics. Use Up/Down arrows to reorder lines.
          </p>
        </div>

        <div className="flex space-x-3">
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="flex-1"
          >
            <Music className="w-4 h-4 mr-2" />
            {loading ? "Creating..." : "Create Hymn"}
          </Button>
          <Button 
            onClick={onCancel} 
            variant="outline"
            disabled={loading}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminHymnEntry;
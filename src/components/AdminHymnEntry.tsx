import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Music, Plus, X, Trash2 } from "lucide-react";
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

const AdminHymnEntry = ({ onHymnCreated, onCancel }: AdminHymnEntryProps) => {
  const [hymnNumber, setHymnNumber] = useState("");
  const [hymnTitle, setHymnTitle] = useState("");
  const [lines, setLines] = useState<HymnLine[]>([
    { verse_number: 1, line_number: 1, text: "", chorus: false }
  ]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addLine = () => {
    const newLine: HymnLine = {
      verse_number: lines.length > 0 ? lines[lines.length - 1].verse_number : 1,
      line_number: lines.length > 0 ? lines[lines.length - 1].line_number + 1 : 1,
      text: "",
      chorus: false
    };
    setLines([...lines, newLine]);
  };

  const removeLine = (index: number) => {
    if (lines.length > 1) {
      setLines(lines.filter((_, i) => i !== index));
    }
  };

  const updateLine = (index: number, field: keyof HymnLine, value: any) => {
    const updatedLines = [...lines];
    updatedLines[index] = { ...updatedLines[index], [field]: value };
    setLines(updatedLines);
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
            <Label>Hymn Lines</Label>
            <Button 
              type="button" 
              onClick={addLine} 
              size="sm" 
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Line</span>
            </Button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {lines.map((line, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 border rounded-lg bg-muted/50">
                <div className="grid grid-cols-2 gap-2 w-32">
                  <div>
                    <Label className="text-xs">Verse</Label>
                    <Input
                      type="number"
                      placeholder="1"
                      min="1"
                      value={line.verse_number}
                      onChange={(e) => updateLine(index, 'verse_number', parseInt(e.target.value) || 1)}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Line</Label>
                    <Input
                      type="number"
                      placeholder="1"
                      min="1"
                      value={line.line_number}
                      onChange={(e) => updateLine(index, 'line_number', parseInt(e.target.value) || 1)}
                      className="h-8"
                    />
                  </div>
                </div>
                
                <div className="flex-1">
                  <Label className="text-xs">Lyric Text *</Label>
                  <Input
                    placeholder="Enter lyric line..."
                    value={line.text}
                    onChange={(e) => updateLine(index, 'text', e.target.value)}
                    className="h-8"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Label className="text-xs whitespace-nowrap">Chorus</Label>
                  <Switch
                    checked={line.chorus}
                    onCheckedChange={(checked) => updateLine(index, 'chorus', checked)}
                  />
                </div>
                
                <Button
                  type="button"
                  onClick={() => removeLine(index)}
                  size="sm"
                  variant="ghost"
                  disabled={lines.length <= 1}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <p className="text-sm text-muted-foreground mt-2">
            Add each line of the hymn separately. Use the verse and line numbers to organize the structure.
            Toggle "Chorus" for lines that are part of the chorus/refrain.
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
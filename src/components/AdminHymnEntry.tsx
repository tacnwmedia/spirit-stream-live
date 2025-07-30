import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminHymnEntryProps {
  onHymnCreated: (hymnNumber: number) => void;
  onCancel: () => void;
}

const AdminHymnEntry = ({ onHymnCreated, onCancel }: AdminHymnEntryProps) => {
  const [hymnNumber, setHymnNumber] = useState("");
  const [hymnTitle, setHymnTitle] = useState("");
  const [hymnContent, setHymnContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!hymnNumber || !hymnTitle || !hymnContent) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
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
      // Check if hymn number already exists
      const { data: existingHymn } = await supabase
        .from('hymns')
        .select('hymn_number')
        .eq('hymn_number', number)
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

      // Split content into lines and save each line
      const lines = hymnContent.split('\n').filter(line => line.trim());
      const hymnData = lines.map((line, index) => ({
        hymn_number: number,
        line_number: index + 1,
        line_content: index === 0 ? `${number} ${hymnTitle} ${line}` : line
      }));

      const { error } = await supabase
        .from('hymns')
        .insert(hymnData);

      if (error) throw error;

      toast({
        title: "Hymn Created",
        description: `Hymn #${number} has been added successfully`,
      });

      onHymnCreated(number);
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
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="hymnNumber">Hymn Number</Label>
            <Input
              id="hymnNumber"
              type="number"
              placeholder="e.g., 123"
              value={hymnNumber}
              onChange={(e) => setHymnNumber(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="hymnTitle">Hymn Title</Label>
            <Input
              id="hymnTitle"
              placeholder="e.g., Amazing Grace"
              value={hymnTitle}
              onChange={(e) => setHymnTitle(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="hymnContent">Hymn Lyrics</Label>
          <Textarea
            id="hymnContent"
            placeholder="Enter the full hymn lyrics, one line per line..."
            value={hymnContent}
            onChange={(e) => setHymnContent(e.target.value)}
            rows={8}
            className="min-h-[200px]"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Enter each line of the hymn on a separate line. The title will be automatically added to the first line.
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
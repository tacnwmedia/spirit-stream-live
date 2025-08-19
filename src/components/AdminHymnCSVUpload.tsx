import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminHymnCSVUploadProps {
  onHymnsUploaded: () => void;
  onCancel: () => void;
}

const AdminHymnCSVUpload = ({ onHymnsUploaded, onCancel }: AdminHymnCSVUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a CSV file",
        variant: "destructive",
      });
    }
  };

  const parseCSV = (csvText: string) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    // Expected headers: hymn_number, verse_number, line_number, text, chorus
    const expectedHeaders = ['hymn_number', 'verse_number', 'line_number', 'text', 'chorus'];
    const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
    }

    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // Skip empty lines
      
      const values = line.split(',').map(v => v.trim());
      const row: any = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      // Validate and convert data types
      const hymnNumber = parseInt(row.hymn_number);
      const verseNumber = parseInt(row.verse_number);
      const lineNumber = parseInt(row.line_number);
      const text = row.text.replace(/"/g, '').trim(); // Remove quotes
      const chorus = row.chorus.toLowerCase() === 'true' || row.chorus === '1';
      
      if (isNaN(hymnNumber) || isNaN(verseNumber) || isNaN(lineNumber) || !text) {
        console.warn(`Skipping invalid row ${i + 1}:`, row);
        continue;
      }
      
      data.push({
        hymn_number: hymnNumber,
        verse_number: verseNumber,
        line_number: lineNumber,
        text: text,
        chorus: chorus
      });
    }
    
    return data;
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a CSV file to upload",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const csvText = await file.text();
      const hymnData = parseCSV(csvText);
      
      if (hymnData.length === 0) {
        toast({
          title: "No Valid Data",
          description: "No valid hymn data found in the CSV file",
          variant: "destructive",
        });
        return;
      }

      // Get unique hymn numbers to check for conflicts
      const hymnNumbers = [...new Set(hymnData.map(d => d.hymn_number))];
      
      // Check for existing hymns
      const { data: existingHymns } = await supabase
        .from('hymn_lines')
        .select('hymn_number')
        .in('hymn_number', hymnNumbers);

      if (existingHymns && existingHymns.length > 0) {
        const existingNumbers = [...new Set(existingHymns.map(h => h.hymn_number))];
        
        // Delete existing hymn lines for these numbers (overwrite behavior)
        for (const hymnNumber of existingNumbers) {
          await supabase
            .from('hymn_lines')
            .delete()
            .eq('hymn_number', hymnNumber);
        }
        
        toast({
          title: "Overwriting Existing Hymns",
          description: `Replaced ${existingNumbers.length} existing hymn(s)`,
        });
      }

      console.log(`Uploading ${hymnData.length} hymn lines for ${hymnNumbers.length} hymns`);

      // Insert new data
      const { error } = await supabase
        .from('hymn_lines')
        .insert(hymnData);

      if (error) {
        console.error('Error uploading hymns:', error);
        throw error;
      }

      toast({
        title: "Upload Successful",
        description: `Successfully uploaded ${hymnNumbers.length} hymns with ${hymnData.length} total lines`,
      });

      setFile(null);
      setTimeout(() => {
        onHymnsUploaded();
      }, 500);
    } catch (error: any) {
      console.error('Error uploading CSV:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload CSV file",
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
          <Upload className="w-5 h-5 mr-2" />
          Upload Hymns from CSV
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="csvFile">CSV File</Label>
          <Input
            id="csvFile"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="mt-2"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Upload a CSV file with columns: hymn_number, verse_number, line_number, text, chorus
          </p>
        </div>

        {file && (
          <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">{file.name}</span>
            <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
          </div>
        )}

        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">CSV Format Example:</h4>
          <pre className="text-xs text-muted-foreground">
{`hymn_number,verse_number,line_number,text,chorus
25,1,1,"Amazing grace! how sweet the sound",false
25,1,2,"That saved a wretch like me",false
25,2,1,"'Twas grace that taught my heart to fear",false
25,2,2,"And grace my fears relieved",false`}
          </pre>
        </div>

        <div className="flex space-x-3">
          <Button 
            onClick={handleUpload} 
            disabled={loading || !file}
            className="flex-1"
          >
            <Upload className="w-4 h-4 mr-2" />
            {loading ? "Uploading..." : "Upload CSV"}
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

export default AdminHymnCSVUpload;
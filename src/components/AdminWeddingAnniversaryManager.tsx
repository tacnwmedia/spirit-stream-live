import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit, Upload, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { logAdminAction } from "@/lib/adminLogger";
import { useToast } from "@/hooks/use-toast";

interface WeddingAnniversary {
  id: string;
  name: string;
  anniversary_date: string;
}

const AdminWeddingAnniversaryManager = () => {
  const [anniversaries, setAnniversaries] = useState<WeddingAnniversary[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", anniversary_date: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadAnniversaries();
  }, []);

  const loadAnniversaries = async () => {
    try {
      const { data, error } = await supabase
        .from('wedding_anniversaries')
        .select('*')
        .order('name');

      if (error) throw error;
      setAnniversaries(data || []);
    } catch (error) {
      console.error('Failed to load wedding anniversaries:', error);
      toast({
        title: "Error",
        description: "Failed to load wedding anniversaries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.anniversary_date) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('wedding_anniversaries')
          .update({
            name: formData.name.trim(),
            anniversary_date: formData.anniversary_date,
          })
          .eq('id', editingId);

        if (error) throw error;
        
        await logAdminAction(`Updated Anniversary: ${formData.name}`);
        toast({
          title: "Success",
          description: "Wedding anniversary updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('wedding_anniversaries')
          .insert({
            name: formData.name.trim(),
            anniversary_date: formData.anniversary_date,
          });

        if (error) throw error;
        
        await logAdminAction(`Added Anniversary: ${formData.name}`);
        toast({
          title: "Success",
          description: "Wedding anniversary added successfully",
        });
      }

      resetForm();
      loadAnniversaries();
    } catch (error) {
      console.error('Failed to save wedding anniversary:', error);
      toast({
        title: "Error",
        description: "Failed to save wedding anniversary",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this wedding anniversary?')) return;

    try {
      const anniversaryToDelete = anniversaries.find(a => a.id === id);
      const { error } = await supabase
        .from('wedding_anniversaries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await logAdminAction(`Deleted Anniversary: ${anniversaryToDelete?.name || 'Unknown'}`);
      toast({
        title: "Success",
        description: "Wedding anniversary deleted successfully",
      });
      
      loadAnniversaries();
    } catch (error) {
      console.error('Failed to delete wedding anniversary:', error);
      toast({
        title: "Error",
        description: "Failed to delete wedding anniversary",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({ name: "", anniversary_date: "" });
    setEditingId(null);
  };

  const handleEdit = (anniversary: WeddingAnniversary) => {
    setFormData({
      name: anniversary.name,
      anniversary_date: anniversary.anniversary_date,
    });
    setEditingId(anniversary.id);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      const anniversariesData = lines.map(line => {
        const [name, anniversary_date] = line.split(',').map(item => item.trim());
        return { name, anniversary_date };
      }).filter(item => item.name && item.anniversary_date);

      if (anniversariesData.length === 0) {
        toast({
          title: "Error",
          description: "No valid wedding anniversary data found in CSV",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('wedding_anniversaries')
        .insert(anniversariesData);

      if (error) throw error;

      await logAdminAction(`Imported ${anniversariesData.length} Anniversaries from CSV`);
      toast({
        title: "Success",
        description: `Successfully imported ${anniversariesData.length} wedding anniversaries`,
      });

      loadAnniversaries();
    } catch (error) {
      console.error('Failed to import wedding anniversaries:', error);
      toast({
        title: "Error",
        description: "Failed to import wedding anniversaries",
        variant: "destructive",
      });
    }

    // Reset file input
    event.target.value = '';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-pink-500" />
            <span>Manage Wedding Anniversaries</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading wedding anniversaries...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-pink-500" />
          <span>Manage Wedding Anniversaries</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add/Edit Form */}
        <div className="grid gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter couple names"
            />
          </div>
          <div>
            <Label htmlFor="anniversary_date">Anniversary Date</Label>
            <Input
              id="anniversary_date"
              type="date"
              value={formData.anniversary_date}
              onChange={(e) => setFormData(prev => ({ ...prev, anniversary_date: e.target.value }))}
            />
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleSave}>
              {editingId ? "Update Anniversary" : "Add Anniversary"}
            </Button>
            {editingId && (
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* CSV Upload */}
        <div>
          <Label htmlFor="csv-upload">Import from CSV</Label>
          <div className="flex items-center space-x-2 mt-1">
            <Input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
            />
            <Upload className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            CSV format: name, anniversary_date (YYYY-MM-DD)
          </p>
        </div>

        {/* Anniversaries List */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Current Wedding Anniversaries ({anniversaries.length})</h3>
          {anniversaries.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {anniversaries.map((anniversary) => (
                <div key={anniversary.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{anniversary.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(anniversary.anniversary_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(anniversary)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(anniversary.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No wedding anniversaries found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminWeddingAnniversaryManager;
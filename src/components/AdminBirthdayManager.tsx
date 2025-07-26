import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Users, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Birthday {
  id: string;
  name: string;
  birthday: string;
}

const AdminBirthdayManager = () => {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBirthday, setEditingBirthday] = useState<Birthday | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    birthday: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadBirthdays();
  }, []);

  const loadBirthdays = async () => {
    try {
      const { data, error } = await supabase
        .from('birthdays')
        .select('*')
        .order('birthday', { ascending: true });

      if (error) throw error;
      setBirthdays(data || []);
    } catch (error) {
      console.error('Failed to load birthdays:', error);
      toast({
        title: "Error",
        description: "Failed to load birthdays",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      birthday: "",
    });
    setEditingBirthday(null);
    setShowForm(false);
  };

  const handleEdit = (birthday: Birthday) => {
    setEditingBirthday(birthday);
    setFormData({
      name: birthday.name,
      birthday: birthday.birthday,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      if (!formData.name || !formData.birthday) {
        toast({
          title: "Error",
          description: "Name and birthday are required",
          variant: "destructive",
        });
        return;
      }

      const birthdayData = {
        name: formData.name,
        birthday: formData.birthday,
      };

      if (editingBirthday) {
        const { error } = await supabase
          .from('birthdays')
          .update(birthdayData)
          .eq('id', editingBirthday.id);

        if (error) throw error;
        toast({ title: "Success", description: "Birthday updated successfully" });
      } else {
        const { error } = await supabase
          .from('birthdays')
          .insert([birthdayData]);

        if (error) throw error;
        toast({ title: "Success", description: "Birthday added successfully" });
      }

      resetForm();
      loadBirthdays();
    } catch (error) {
      console.error('Failed to save birthday:', error);
      toast({
        title: "Error",
        description: "Failed to save birthday",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this birthday?')) return;

    try {
      const { error } = await supabase
        .from('birthdays')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "Birthday deleted successfully" });
      loadBirthdays();
    } catch (error) {
      console.error('Failed to delete birthday:', error);
      toast({
        title: "Error",
        description: "Failed to delete birthday",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Basic CSV parsing (for simple CSV files)
    const text = await file.text();
    const lines = text.split('\n');
    const data: { name: string; birthday: string }[] = [];

    for (let i = 1; i < lines.length; i++) { // Skip header
      const line = lines[i].trim();
      if (!line) continue;
      
      const [name, birthday] = line.split(',').map(s => s.trim().replace(/"/g, ''));
      if (name && birthday) {
        data.push({ name, birthday });
      }
    }

    if (data.length === 0) {
      toast({
        title: "Error",
        description: "No valid data found in file",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('birthdays')
        .insert(data);

      if (error) throw error;
      toast({ 
        title: "Success", 
        description: `${data.length} birthdays imported successfully` 
      });
      loadBirthdays();
    } catch (error) {
      console.error('Failed to import birthdays:', error);
      toast({
        title: "Error",
        description: "Failed to import birthdays",
        variant: "destructive",
      });
    }

    // Reset file input
    event.target.value = '';
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading birthdays...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Manage Birthdays</h3>
        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
          </div>
          <Button onClick={() => setShowForm(true)} className="church-button">
            <Plus className="w-4 h-4 mr-2" />
            Add Birthday
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingBirthday ? 'Edit Birthday' : 'Add New Birthday'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter person's name"
              />
            </div>
            
            <div>
              <Label htmlFor="birthday">Birthday *</Label>
              <Input
                id="birthday"
                type="date"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleSave} className="church-button">
                {editingBirthday ? 'Update' : 'Add'} Birthday
              </Button>
              <Button onClick={resetForm} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {birthdays.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">No birthdays found</p>
            <p className="text-sm text-muted-foreground">Add birthdays manually or import a CSV file</p>
          </div>
        ) : (
          birthdays.map((birthday) => (
            <Card key={birthday.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{birthday.name}</h4>
                    <p className="text-muted-foreground">
                      {format(new Date(birthday.birthday + 'T00:00:00'), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleEdit(birthday)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(birthday.id)}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminBirthdayManager;
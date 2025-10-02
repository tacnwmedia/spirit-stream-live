import { useState, useEffect } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { logAdminAction } from "@/lib/adminLogger";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Upload, Plus, AlertTriangle, Eraser } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Topic {
  id: string;
  topic_date: string;
  topic: string;
  scriptures: string;
}

const AdminTopicManager = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTopic, setNewTopic] = useState({
    topic_date: format(new Date(), "yyyy-MM-dd"),
    topic: "",
    scriptures: "",
  });
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .order('topic_date', { ascending: false });

      if (error) throw error;
      setTopics(data || []);
    } catch (error) {
      console.error('Failed to load topics:', error);
      toast({
        title: "Error",
        description: "Failed to load topics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTopic.topic) {
      toast({
        title: "Error",
        description: "Please enter a topic title",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('topics')
        .insert([newTopic]);

      if (error) throw error;

      await logAdminAction(`Created Topic: ${newTopic.topic}`);
      toast({
        title: "Success",
        description: "Topic created successfully",
      });

      setNewTopic({
        topic_date: format(new Date(), "yyyy-MM-dd"),
        topic: "",
        scriptures: "",
      });
      
      loadTopics();
    } catch (error) {
      console.error('Failed to create topic:', error);
      toast({
        title: "Error",
        description: "Failed to create topic",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTopic = async (id: string) => {
    try {
      const topicToDelete = topics.find(t => t.id === id);
      const { error } = await supabase
        .from('topics')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await logAdminAction(`Deleted Topic: ${topicToDelete?.topic || 'Unknown'}`);
      toast({
        title: "Success",
        description: "Topic deleted successfully",
      });

      loadTopics();
    } catch (error) {
      console.error('Failed to delete topic:', error);
      toast({
        title: "Error",
        description: "Failed to delete topic",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAllTopics = async () => {
    if (!confirm('Are you sure you want to delete ALL topics? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase.rpc('delete_all_topics');

      if (error) throw error;

      await logAdminAction('Deleted All Topics');
      toast({
        title: "Success",
        description: "All topics deleted successfully",
      });

      loadTopics();
    } catch (error) {
      console.error('Failed to delete all topics:', error);
      toast({
        title: "Error",
        description: "Failed to delete all topics",
        variant: "destructive",
      });
    }
  };

  const handleCleanupOldRecords = async () => {
    try {
      const { data, error } = await supabase.rpc('cleanup_old_records');

      if (error) throw error;

      const result = data[0];
      toast({
        title: "Cleanup Complete",
        description: `Deleted ${result.deleted_topics} old topics and ${result.deleted_events} old events (older than 90 days)`,
      });

      loadTopics();
    } catch (error) {
      console.error('Failed to cleanup old records:', error);
      toast({
        title: "Error",
        description: "Failed to cleanup old records",
        variant: "destructive",
      });
    }
  };

  const handleCsvUpload = async () => {
    if (!csvFile) {
      toast({
        title: "Error",
        description: "Please select a CSV file",
        variant: "destructive",
      });
      return;
    }

    try {
      const text = await csvFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      const topics = [];

      for (let i = 1; i < lines.length; i++) { // Skip header
        const [date, topic, scriptures] = lines[i].split(',').map(item => item.trim());
        
        if (date && topic && scriptures) {
          // Convert MM/DD/YYYY to YYYY-MM-DD
          const dateParts = date.split('/');
          if (dateParts.length === 3) {
            const formattedDate = `${dateParts[2]}-${dateParts[0].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}`;
            topics.push({
              topic_date: formattedDate,
              topic: topic.replace(/"/g, ''),
              scriptures: scriptures.replace(/"/g, ''),
            });
          }
        }
      }

      if (topics.length === 0) {
        toast({
          title: "Error",
          description: "No valid topics found in CSV file",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('topics')
        .insert(topics);

      if (error) throw error;

      await logAdminAction(`Uploaded ${topics.length} Topics from CSV`);
      toast({
        title: "Success",
        description: `${topics.length} topics uploaded successfully`,
      });

      setCsvFile(null);
      loadTopics();
    } catch (error) {
      console.error('Failed to upload CSV:', error);
      toast({
        title: "Error",
        description: "Failed to upload CSV file",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center">Loading topics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Create New Topic */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Topic
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateTopic} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="topic_date">Date</Label>
                <Input
                  id="topic_date"
                  type="date"
                  value={newTopic.topic_date}
                  onChange={(e) => setNewTopic({ ...newTopic, topic_date: e.target.value })}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="topic">Topic Title</Label>
                <Input
                  id="topic"
                  type="text"
                  placeholder="Enter topic title"
                  value={newTopic.topic}
                  onChange={(e) => setNewTopic({ ...newTopic, topic: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="scriptures">Scriptures</Label>
                <Textarea
                  id="scriptures"
                  placeholder="Enter comma-separated Bible references (e.g., 1 Corinthians 4:1-2, Colossians 3:23-25)"
                  value={newTopic.scriptures}
                  onChange={(e) => setNewTopic({ ...newTopic, scriptures: e.target.value })}
                  rows={3}
                />
            </div>
            <Button type="submit" className="w-full">
              Create Topic
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* CSV Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Topics via CSV
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="csv-file">CSV File</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
              />
              <p className="text-sm text-muted-foreground mt-2">
                CSV format: date (MM/DD/YYYY), topic, scriptures
              </p>
            </div>
            <Button onClick={handleCsvUpload} disabled={!csvFile} className="w-full">
              Upload CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Existing Topics */}
      <div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <h3 className="text-lg font-semibold">Existing Topics ({topics.length})</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={handleCleanupOldRecords}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm"
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span className="hidden xs:inline">Cleanup Old (90+ days)</span>
              <span className="xs:hidden">Cleanup</span>
            </Button>
            <Button 
              onClick={handleDeleteAllTopics}
              variant="destructive"
              size="sm"
              className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm"
            >
              <Eraser className="w-4 h-4 flex-shrink-0" />
              <span className="hidden xs:inline">Delete All</span>
              <span className="xs:hidden">Delete</span>
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          {topics.map((topic) => (
            <Card key={topic.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        {format(new Date(topic.topic_date + 'T00:00:00'), "EEEE, MMMM do, yyyy")}
                      </span>
                    </div>
                    <h4 className="font-semibold text-lg mb-2">{topic.topic}</h4>
                    <p className="text-muted-foreground">{topic.scriptures}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTopic(topic.id)}
                    className="ml-4"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {topics.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No topics found. Create your first topic above.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTopicManager;

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Calendar, AlertTriangle, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { logAdminAction } from "@/lib/adminLogger";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  event_date: string;
  event_time: string | null;
  description: string | null;
}

const AdminEventManager = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    event_date: "",
    event_time: "",
    description: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Failed to load events:', error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      event_date: "",
      event_time: "",
      description: "",
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      event_date: event.event_date,
      event_time: event.event_time || "",
      description: event.description || "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      if (!formData.title || !formData.event_date) {
        toast({
          title: "Error",
          description: "Title and date are required",
          variant: "destructive",
        });
        return;
      }

      const eventData = {
        title: formData.title,
        event_date: formData.event_date,
        event_time: formData.event_time || null,
        description: formData.description || null,
      };

      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id);

        if (error) throw error;
        await logAdminAction(`Updated Event: ${formData.title}`);
        toast({ title: "Success", description: "Event updated successfully" });
      } else {
        const { error } = await supabase
          .from('events')
          .insert([eventData]);

        if (error) throw error;
        await logAdminAction(`Created Event: ${formData.title}`);
        toast({ title: "Success", description: "Event created successfully" });
      }

      resetForm();
      loadEvents();
    } catch (error) {
      console.error('Failed to save event:', error);
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const eventToDelete = events.find(e => e.id === id);
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await logAdminAction(`Deleted Event: ${eventToDelete?.title || 'Unknown'}`);
      toast({ title: "Success", description: "Event deleted successfully" });
      loadEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAllEvents = async () => {
    if (!confirm('Are you sure you want to delete ALL events? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase.rpc('delete_all_events');

      if (error) throw error;

      await logAdminAction('Deleted All Events');
      toast({
        title: "Success",
        description: "All events deleted successfully",
      });

      loadEvents();
    } catch (error) {
      console.error('Failed to delete all events:', error);
      toast({
        title: "Error",
        description: "Failed to delete all events",
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

      loadEvents();
    } catch (error) {
      console.error('Failed to cleanup old records:', error);
      toast({
        title: "Error",
        description: "Failed to cleanup old records",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h3 className="text-lg font-semibold">Manage Events</h3>
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
            onClick={handleDeleteAllEvents}
            variant="destructive"
            size="sm"
            className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm"
          >
            <Eraser className="w-4 h-4 flex-shrink-0" />
            <span className="hidden xs:inline">Delete All</span>
            <span className="xs:hidden">Delete</span>
          </Button>
          <Button onClick={() => setShowForm(true)} className="church-button w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2 flex-shrink-0" />
            Add Event
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter event title"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.event_time}
                  onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter event description"
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleSave} className="church-button">
                {editingEvent ? 'Update' : 'Create'} Event
              </Button>
              <Button onClick={resetForm} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">No events found</p>
            <p className="text-sm text-muted-foreground">Create your first event above</p>
          </div>
        ) : (
          events.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{event.title}</h4>
                    <p className="text-muted-foreground">
                      {format(new Date(event.event_date), 'MMMM d, yyyy')}
                      {event.event_time && ` at ${event.event_time}`}
                    </p>
                    {event.description && (
                      <p className="mt-2 text-sm">{event.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleEdit(event)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(event.id)}
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

export default AdminEventManager;
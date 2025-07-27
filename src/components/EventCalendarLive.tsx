import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface Event {
  id: string;
  title: string;
  event_date: string;
  event_time: string | null;
  description: string | null;
}

const EventCalendarLive = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true })
        .limit(4);

      if (error) {
        console.error('Error loading events:', error);
        return;
      }

      setEvents(data || []);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="church-card">
        <div className="flex items-center justify-center mb-6">
          <Calendar className="w-6 h-6 text-primary mr-2" />
          <h3 className="text-2xl font-semibold">Upcoming Events</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="church-card">
      <div className="flex items-center justify-center mb-6">
        <Calendar className="w-6 h-6 text-primary mr-2" />
        <h3 className="text-2xl font-semibold">Upcoming Events</h3>
      </div>
      
      {events.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No upcoming events scheduled.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="bg-accent rounded-lg p-4 border border-border">
              <h4 className="font-semibold text-lg text-foreground mb-2">
                {event.title}
              </h4>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="church-text">
                    {format(new Date(event.event_date), "EEEE, MMMM do")}
                  </span>
                </div>
                {event.event_time && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="church-text">{event.event_time}</span>
                  </div>
                )}
                {event.description && (
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                    <span className="church-text">{event.description}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventCalendarLive;
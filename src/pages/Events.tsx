import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";

interface Event {
  id: string;
  title: string;
  event_date: string;
  event_time: string | null;
  description: string | null;
}

const Events = () => {
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
        .order('event_date', { ascending: true });

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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="church-card mb-8">
          <div className="flex items-center justify-center mb-6">
            <Calendar className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold">Church Events</h1>
          </div>
          <p className="text-center church-text text-muted-foreground">
            Stay connected with all the ways to grow in faith and fellowship
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No upcoming events scheduled.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {events.map((event) => (
              <div key={event.id} className="church-card">
                <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
                  <div className="flex-shrink-0">
                    <div className="text-center">
                      <div className="bg-primary text-primary-foreground rounded-lg p-3 mb-2">
                        <div className="text-2xl font-bold">
                          {format(new Date(event.event_date), "dd")}
                        </div>
                        <div className="text-sm">
                          {format(new Date(event.event_date), "MMM")}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="church-text">
                          {format(new Date(event.event_date), "EEEE, MMMM do, yyyy")}
                        </span>
                      </div>
                      {event.event_time && (
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="church-text">{event.event_time}</span>
                        </div>
                      )}
                    </div>
                    
                    {event.description && (
                      <p className="church-text text-muted-foreground leading-relaxed">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="church-card mt-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-primary mr-2" />
            <h3 className="text-xl font-semibold">Join Us</h3>
          </div>
          <p className="church-text text-muted-foreground leading-relaxed">
            All are welcome at The Apostolic Church North West! Come as you are and experience 
            the love and grace of our church family. For questions about any event, 
            please contact our church office.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Events;
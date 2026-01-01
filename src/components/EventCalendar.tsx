import { Calendar, Clock, MapPin } from "lucide-react";
import { format, addDays } from "date-fns";

const EventCalendar = () => {
  const today = new Date();
  
  const events = [
    {
      id: 1,
      title: "Sunday Worship Service",
      date: today,
      time: "10:00 AM",
      location: "Main Sanctuary"
    },
    {
      id: 2,
      title: "Bible Study",
      date: addDays(today, 3),
      time: "7:00 PM",
      location: "Fellowship Hall"
    },
    {
      id: 3,
      title: "Prayer Meeting",
      date: addDays(today, 5),
      time: "6:30 PM",
      location: "Chapel"
    },
    {
      id: 4,
      title: "Community Outreach",
      date: addDays(today, 7),
      time: "9:00 AM",
      location: "Community Center"
    }
  ];

  return (
    <div className="church-card">
      <div className="flex items-center justify-center mb-6">
        <Calendar className="w-6 h-6 text-primary mr-2" />
        <h3 className="text-2xl font-semibold">Upcoming Events</h3>
      </div>
      
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
                  {format(event.date, "EEEE, MMMM do")}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span className="church-text">{event.time}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="church-text">{event.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCalendar;
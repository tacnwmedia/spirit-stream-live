import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { format, addDays, addWeeks } from "date-fns";
import Navigation from "@/components/Navigation";

const Events = () => {
  const today = new Date();
  
  const events = [
    {
      id: 1,
      title: "Sunday Worship Service",
      date: today,
      time: "10:00 AM - 11:30 AM",
      location: "Main Sanctuary",
      description: "Join us for worship, prayer, and fellowship as we gather to praise God together.",
      category: "worship"
    },
    {
      id: 2,
      title: "Wednesday Bible Study",
      date: addDays(today, 3),
      time: "7:00 PM - 8:30 PM",
      location: "Fellowship Hall",
      description: "Deep dive into Scripture with guided discussion and prayer.",
      category: "study"
    },
    {
      id: 3,
      title: "Friday Prayer Meeting",
      date: addDays(today, 5),
      time: "6:30 PM - 7:30 PM",
      location: "Chapel",
      description: "A time of corporate prayer for our church, community, and world.",
      category: "prayer"
    },
    {
      id: 4,
      title: "Community Outreach",
      date: addDays(today, 7),
      time: "9:00 AM - 2:00 PM",
      location: "Community Center",
      description: "Serving meals and providing support to families in need.",
      category: "outreach"
    },
    {
      id: 5,
      title: "Youth Group",
      date: addWeeks(today, 1),
      time: "6:00 PM - 8:00 PM",
      location: "Youth Room",
      description: "Fun, fellowship, and faith-building activities for teens.",
      category: "youth"
    },
    {
      id: 6,
      title: "Women's Fellowship",
      date: addWeeks(today, 1),
      time: "10:00 AM - 12:00 PM",
      location: "Fellowship Hall",
      description: "Monthly gathering for prayer, study, and Christian sisterhood.",
      category: "fellowship"
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "worship": return "bg-primary text-primary-foreground";
      case "study": return "bg-accent text-accent-foreground";
      case "prayer": return "bg-secondary text-secondary-foreground";
      case "outreach": return "bg-muted text-muted-foreground";
      case "youth": return "bg-primary text-primary-foreground";
      case "fellowship": return "bg-accent text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
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

        <div className="space-y-6">
          {events.map((event) => (
            <div key={event.id} className="church-card">
              <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <div className="flex-shrink-0">
                  <div className="text-center">
                    <div className="bg-primary text-primary-foreground rounded-lg p-3 mb-2">
                      <div className="text-2xl font-bold">
                        {format(event.date, "dd")}
                      </div>
                      <div className="text-sm">
                        {format(event.date, "MMM")}
                      </div>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(event.category)}`}>
                      {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                    </span>
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
                        {format(event.date, "EEEE, MMMM do, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="church-text">{event.time}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="church-text">{event.location}</span>
                    </div>
                  </div>
                  
                  <p className="church-text text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="church-card mt-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-primary mr-2" />
            <h3 className="text-xl font-semibold">Join Us</h3>
          </div>
          <p className="church-text text-muted-foreground leading-relaxed">
            All are welcome at Grace Fellowship! Come as you are and experience 
            the love and grace of our church family. For questions about any event, 
            please contact our church office.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Events;
import { format } from "date-fns";
import { Gift, Calendar } from "lucide-react";
import Navigation from "@/components/Navigation";

const Birthdays = () => {
  const currentMonth = format(new Date(), "MMMM yyyy");
  
  const birthdays = [
    { name: "Mary Johnson", date: "March 3", age: 75 },
    { name: "Robert Wilson", date: "March 8", age: 68 },
    { name: "Sarah Davis", date: "March 15", age: 72 },
    { name: "James Miller", date: "March 22", age: 80 },
    { name: "Elizabeth Brown", date: "March 28", age: 69 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="church-card mb-8">
          <div className="flex items-center justify-center mb-6">
            <Gift className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold">Birthday Celebrations</h1>
          </div>
          <p className="text-center church-text text-muted-foreground">
            Celebrating our church family in {currentMonth}
          </p>
        </div>

        <div className="grid gap-4 md:gap-6">
          {birthdays.map((birthday, index) => (
            <div key={index} className="church-card">
              <div className="flex items-center space-x-4">
                <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center">
                  <Calendar className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-1">
                    {birthday.name}
                  </h3>
                  <p className="church-text text-muted-foreground">
                    {birthday.date} • {birthday.age} years young
                  </p>
                </div>
                <div className="text-4xl">🎂</div>
              </div>
            </div>
          ))}
        </div>

        <div className="church-card mt-8 text-center">
          <h3 className="text-xl font-semibold mb-4">Birthday Prayer</h3>
          <p className="church-text italic text-muted-foreground leading-relaxed">
            "Lord, we thank you for another year of life for each of these precious members of our church family. 
            Bless them with health, joy, and your continued presence in the year ahead. Amen."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Birthdays;
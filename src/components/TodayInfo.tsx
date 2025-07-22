import { format } from "date-fns";

const TodayInfo = () => {
  const today = new Date();
  
  return (
    <div className="church-card text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">
        {format(today, "EEEE, MMMM do, yyyy")}
      </h2>
      <p className="text-muted-foreground text-lg">
        Welcome to The Apostolic Church North West
      </p>
    </div>
  );
};

export default TodayInfo;
import { format } from "date-fns";

const TodayInfo = () => {
  const today = new Date();
  
  return (
    <div className="church-card text-center py-4 md:py-5">
      <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
        {format(today, "EEEE, MMMM do, yyyy")}
      </h2>
    </div>
  );
};

export default TodayInfo;
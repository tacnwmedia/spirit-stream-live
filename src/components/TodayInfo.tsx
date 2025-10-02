import { format } from "date-fns";

const TodayInfo = () => {
  const today = new Date();
  
  return (
    <div className="church-card text-center py-3">
      <h2 className="text-2xl md:text-3xl font-bold text-primary">
        {format(today, "EEEE, MMMM do, yyyy")}
      </h2>
    </div>
  );
};

export default TodayInfo;
import { Music } from "lucide-react";
import { Link } from "react-router-dom";

interface HymnDisplayProps {
  title: string;
  hymnNumber: number;
  hymnTitle: string;
}

const HymnDisplay = ({ title, hymnNumber, hymnTitle }: HymnDisplayProps) => {
  return (
    <Link to={`/hymn/${hymnNumber}`} className="block">
      <div className="church-card hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-center justify-center mb-4">
          <Music className="w-6 h-6 text-primary mr-2" />
          <h3 className="text-xl font-semibold text-center">{title}</h3>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-2">#{hymnNumber}</div>
          <div className="church-text font-medium">{hymnTitle}</div>
        </div>
      </div>
    </Link>
  );
};

export default HymnDisplay;
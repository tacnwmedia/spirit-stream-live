import { Music } from "lucide-react";

interface HymnDisplayProps {
  title: string;
  hymnNumber: number;
  hymnTitle: string;
}

const HymnDisplay = ({ title, hymnNumber, hymnTitle }: HymnDisplayProps) => {
  return (
    <div className="church-card">
      <div className="flex items-center justify-center mb-4">
        <Music className="w-6 h-6 text-primary mr-2" />
        <h3 className="text-xl font-semibold text-center">{title}</h3>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-primary mb-2">#{hymnNumber}</div>
        <div className="church-text font-medium">{hymnTitle}</div>
      </div>
    </div>
  );
};

export default HymnDisplay;
import { Music } from "lucide-react";
import { Link } from "react-router-dom";

interface HymnDisplayProps {
  title: string;
  hymnNumber: number;
  hymnTitle: string;
}

const HymnDisplay = ({ title, hymnNumber, hymnTitle }: HymnDisplayProps) => {
  return (
    <Link to={`/hymn/${hymnNumber}`} className="block group">
      <div className="church-card cursor-pointer">
        <div className="flex items-center justify-center mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mr-3 shadow-inner">
            <Music className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-center">{title}</h3>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 px-6 py-3 mb-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.05)]">
            <span className="text-4xl font-bold text-primary tabular-nums">#{hymnNumber}</span>
          </div>
          <div className="church-text font-medium mb-3">{hymnTitle}</div>
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-accent/50 px-4 py-2 rounded-full backdrop-blur-sm border border-border/50 group-hover:bg-accent transition-colors">
            <span className="inline-block w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-primary border-b-[5px] border-b-transparent"></span>
            Tap to View Hymn
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HymnDisplay;
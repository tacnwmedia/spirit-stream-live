import { BookOpen } from "lucide-react";

const WatchwordDisplay = () => {
  const watchword = {
    text: "The Lord is my shepherd; I shall not want.",
    reference: "Psalm 23:1"
  };

  return (
    <div className="church-card">
      <div className="flex items-center justify-center mb-4">
        <BookOpen className="w-6 h-6 text-primary mr-2" />
        <h3 className="text-xl font-semibold">Today's Watchword</h3>
      </div>
      <div className="text-center">
        <blockquote className="church-text italic text-foreground mb-3 leading-relaxed">
          "{watchword.text}"
        </blockquote>
        <cite className="text-muted-foreground font-medium">
          — {watchword.reference}
        </cite>
      </div>
    </div>
  );
};

export default WatchwordDisplay;
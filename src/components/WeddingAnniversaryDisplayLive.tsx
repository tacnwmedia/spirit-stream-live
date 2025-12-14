import { Heart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useOptimizedCelebrations } from "@/hooks/useOptimizedCelebrations";
import { Skeleton } from "@/components/ui/skeleton";

const WeddingAnniversaryDisplayLive = () => {
  const { anniversaries, loading, isRefreshing } = useOptimizedCelebrations();
  const currentMonthName = new Date().toLocaleDateString('en-US', { month: 'long' });
  
  console.log('[WeddingAnniversaryDisplayLive] Component state:', { 
    anniversariesCount: anniversaries.length, 
    loading, 
    isRefreshing,
    currentMonthName,
    anniversaries: anniversaries.slice(0, 3) 
  });

  if (loading) {
    return (
      <div className="church-card">
        <div className="flex items-center justify-center mb-4">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <h3 className="text-xl font-semibold text-center">
            Loading {currentMonthName} Wedding Anniversaries...
          </h3>
        </div>
        <div className="space-y-3 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3 bg-accent rounded-lg p-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="church-card">
      <div className="flex items-center justify-center mb-4">
        <h3 className="text-xl font-semibold text-center">
          {currentMonthName} Wedding Anniversaries
        </h3>
        {isRefreshing && (
          <Loader2 className="w-4 h-4 animate-spin ml-2 text-muted-foreground" />
        )}
      </div>
      
      {anniversaries.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-muted-foreground">No wedding anniversaries this month.</p>
        </div>
      ) : (
        <div className="space-y-3 mb-4">
          {anniversaries.slice(0, 3).map((anniversary) => (
            <div key={anniversary.id} className="flex items-center space-x-3 rounded-xl bg-gradient-to-r from-accent/80 to-accent/40 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-sm border border-border/30 transition-transform hover:scale-[1.02] active:scale-[0.98]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-rose-50 shadow-inner text-xl">💍</div>
              <div className="flex-1">
                <div className="font-medium text-foreground">{anniversary.name}</div>
              </div>
            </div>
          ))}
          {anniversaries.length > 3 && (
            <div className="text-center">
              <Link 
                to="/wedding-anniversaries"
                className="text-primary hover:text-primary-hover text-sm font-medium"
              >
                View all {anniversaries.length} anniversaries →
              </Link>
            </div>
          )}
        </div>
      )}
      
      {anniversaries.length > 0 && (
        <div className="text-center mt-4">
          <Link 
            to="/wedding-anniversaries" 
            className="church-button inline-flex items-center space-x-2 px-4 py-2"
          >
            <Heart className="w-4 h-4" />
            <span>View All {currentMonthName} Wedding Anniversaries</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default WeddingAnniversaryDisplayLive;
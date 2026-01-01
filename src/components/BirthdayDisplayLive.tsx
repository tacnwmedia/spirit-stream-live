import { Gift, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useOptimizedCelebrations } from "@/hooks/useOptimizedCelebrations";
import { Skeleton } from "@/components/ui/skeleton";

const BirthdayDisplayLive = () => {
  const { birthdays, loading, isRefreshing } = useOptimizedCelebrations();
  const currentMonthName = new Date().toLocaleDateString('en-US', { month: 'long' });
  
  console.log('[BirthdayDisplayLive] Component state:', { 
    birthdaysCount: birthdays.length, 
    loading, 
    isRefreshing,
    currentMonthName,
    birthdays: birthdays.slice(0, 3) 
  });

  if (loading) {
    return (
      <div className="church-card">
        <div className="flex items-center justify-center mb-4">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <h3 className="text-xl font-semibold text-center">
            Loading {currentMonthName} Birthdays...
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
          {currentMonthName} Birthdays
        </h3>
        {isRefreshing && (
          <Loader2 className="w-4 h-4 animate-spin ml-2 text-muted-foreground" />
        )}
      </div>
      
      {birthdays.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-muted-foreground">No birthdays this month.</p>
        </div>
      ) : (
        <div className="space-y-3 mb-4">
          {birthdays.slice(0, 3).map((birthday) => (
            <div key={birthday.id} className="flex items-center space-x-3 rounded-xl bg-gradient-to-r from-accent/80 to-accent/40 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-sm border border-border/30 transition-transform hover:scale-[1.02] active:scale-[0.98]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-pink-50 shadow-inner text-xl">🎂</div>
              <div className="flex-1">
                <div className="font-medium text-foreground">{birthday.name}</div>
              </div>
            </div>
          ))}
          {birthdays.length > 3 && (
            <div className="text-center">
              <Link 
                to="/birthdays"
                className="text-primary hover:text-primary-hover text-sm font-medium"
              >
                View all {birthdays.length} birthdays →
              </Link>
            </div>
          )}
        </div>
      )}
      
      {birthdays.length > 0 && (
        <div className="text-center mt-4">
          <Link 
            to="/birthdays" 
            className="church-button inline-flex items-center space-x-2 px-4 py-2"
          >
            <Gift className="w-4 h-4" />
            <span>View All {currentMonthName} Birthdays</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default BirthdayDisplayLive;
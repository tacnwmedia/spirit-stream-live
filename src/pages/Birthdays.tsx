import { useState, useEffect, useRef, useCallback } from "react";
import { format } from "date-fns";
import { Gift, Calendar } from "lucide-react";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";

interface Birthday {
  id: string;
  name: string;
  birthday: string;
}

const Birthdays = () => {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const currentMonth = new Date().getMonth() + 1;
  const currentMonthName = format(new Date(), "MMMM yyyy");

  useEffect(() => {
    loadCurrentMonthBirthdays();
  }, []);

  // Intersection Observer to track which card is most visible
  useEffect(() => {
    if (birthdays.length === 0) return;

    const options = {
      root: null,
      rootMargin: '-35% 0px -35% 0px',
      threshold: [0, 0.5, 1],
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          const index = cardRefs.current.findIndex((ref) => ref === entry.target);
          if (index !== -1) {
            setActiveIndex(index);
          }
        }
      });
    }, options);

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [birthdays]);

  // 3D deck of cards style - cards overlap and stack
  const getCardStyle = useCallback((index: number) => {
    const diff = index - activeIndex;
    
    if (diff === 0) {
      // Active card - front and center, fully expanded
      return {
        transform: 'perspective(1000px) rotateX(0deg) translateZ(0px) scale(1)',
        opacity: 1,
        zIndex: 50,
        marginTop: index === 0 ? '0px' : '-20px',
        filter: 'blur(0px)',
      };
    } else if (diff < 0) {
      // Previous cards - collapsed upward, stacked behind
      const distance = Math.abs(diff);
      return {
        transform: `perspective(1000px) rotateX(${Math.min(distance * 20, 60)}deg) translateZ(${-distance * 40}px) translateY(${-distance * 5}px) scale(${Math.max(1 - distance * 0.05, 0.8)})`,
        opacity: Math.max(1 - distance * 0.25, 0.2),
        zIndex: 50 - distance,
        marginTop: '-60px', // Overlap cards like a deck
        filter: `blur(${Math.min(distance * 1, 3)}px)`,
      };
    } else {
      // Next cards - tilted forward, ready to open
      const distance = Math.abs(diff);
      return {
        transform: `perspective(1000px) rotateX(${Math.max(-distance * 20, -60)}deg) translateZ(${-distance * 40}px) translateY(${distance * 5}px) scale(${Math.max(1 - distance * 0.05, 0.8)})`,
        opacity: Math.max(1 - distance * 0.25, 0.2),
        zIndex: 50 - distance,
        marginTop: '-60px', // Overlap cards like a deck
        filter: `blur(${Math.min(distance * 1, 3)}px)`,
      };
    }
  }, [activeIndex]);

  const loadCurrentMonthBirthdays = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('birthdays')
        .select('*')
        .order('birthday', { ascending: true });

      if (error) {
        console.error('Error loading birthdays:', error);
        return;
      }

      // Filter birthdays for current month
      const currentMonthBirthdays = (data || []).filter(birthday => {
        const birthdayDate = new Date(birthday.birthday + 'T00:00:00');
        return birthdayDate.getMonth() + 1 === currentMonth;
      });

      setBirthdays(currentMonthBirthdays);
    } catch (error) {
      console.error('Failed to load birthdays:', error);
    } finally {
      setLoading(false);
    }
  };

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
            Celebrating our church family in {currentMonthName}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading birthdays...</p>
          </div>
        ) : birthdays.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No birthdays this month.</p>
          </div>
        ) : (
          <div 
            ref={containerRef}
            className="verse-3d-container relative pt-4 pb-20"
          >
            {birthdays.map((birthday, index) => (
              <div 
                key={birthday.id} 
                ref={(el) => (cardRefs.current[index] = el)}
                className="church-card verse-card-3d transition-all duration-500 ease-out origin-center"
                style={getCardStyle(index)}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-semibold text-foreground truncate">
                        {birthday.name}
                      </h3>
                      {index === activeIndex && (
                        <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full flex-shrink-0">
                          ✨
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(birthday.birthday + 'T00:00:00'), 'MMMM d')}
                    </p>
                  </div>
                  <div className="text-4xl flex-shrink-0">🎂</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="church-card mt-8 text-center">
          <h3 className="text-xl font-semibold mb-4">Birthday Prayer</h3>
          <p className="church-text italic text-muted-foreground leading-relaxed mb-6">
            "Lord, we thank you for another year of life for each of these precious members of our church family. 
            Bless them with health, joy, and your continued presence in the year ahead. Amen."
          </p>
          <a 
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors w-full sm:w-auto text-sm sm:text-base"
          >
            <span className="hidden xs:inline">Return to Homepage</span>
            <span className="xs:hidden">Home</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Birthdays;
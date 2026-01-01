import { useState, useEffect } from 'react';
import { X, Megaphone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Announcement {
  id: string;
  message: string;
  expires_at: string;
}

const AnnouncementBanner = () => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    loadActiveAnnouncement();
  }, []);

  const loadActiveAnnouncement = async () => {
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('announcements')
        .select('id, message, expires_at')
        .eq('is_active', true)
        .gt('expires_at', now)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error loading announcement:', error);
        return;
      }

      if (data) {
        // Check if this announcement was previously dismissed
        const dismissedId = sessionStorage.getItem('dismissedAnnouncementId');
        if (dismissedId !== data.id) {
          setAnnouncement(data);
          setIsVisible(true);
        }
      }
    } catch (error) {
      console.error('Failed to load announcement:', error);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    if (announcement) {
      sessionStorage.setItem('dismissedAnnouncementId', announcement.id);
    }
  };

  if (!announcement || isDismissed || !isVisible) {
    return null;
  }

  return (
    <div className="fixed top-20 left-0 right-0 z-50 animate-slide-up px-2 sm:px-4 md:px-6">
      <div className="mx-auto max-w-2xl">
        {/* Glass container with 3D effect - styled like NewYearCountdown */}
        <div 
          className="relative overflow-hidden rounded-2xl border border-white/[0.15] bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md dark:border-white/[0.08] dark:bg-black/[0.03] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]"
          style={{
            transform: 'perspective(1000px) rotateX(2deg)',
            transformOrigin: 'top center',
          }}
        >
          {/* Glass shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.03] dark:from-white/[0.05] dark:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/[0.05]" />
          
          <div className="relative px-4 py-3 sm:px-6 sm:py-4">
            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className="absolute right-2 top-2 rounded-full bg-white/[0.05] p-1.5 text-foreground/40 backdrop-blur-sm transition-all hover:bg-white/[0.15] hover:text-foreground active:scale-95 sm:right-3 sm:top-3 sm:p-2"
              aria-label="Dismiss announcement"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <div className="flex items-start gap-3 pr-8 sm:pr-10">
              {/* Icon */}
              <div className="flex-shrink-0 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/10 p-2 sm:p-2.5">
                <Megaphone className="h-5 w-5 text-amber-500 sm:h-6 sm:w-6" />
              </div>
              
              {/* Message */}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold uppercase tracking-wider text-amber-500/80 mb-1">
                  Announcement
                </div>
                <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                  {announcement.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBanner;


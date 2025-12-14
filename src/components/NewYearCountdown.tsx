import { useState, useEffect, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import { Confetti, ConfettiRef } from '@/components/ui/confetti';

const CHICAGO_TIMEZONE = 'America/Chicago';

// Demo modes:
// URL param: ?demo=countdown OR path: /demo/newyear?mode=countdown
// - countdown: Normal countdown (auto-hides after 6s)
// - lastminute: Simulates the last minute before midnight (stays visible)
// - newyear: Shows "Happy New Year" with confetti
const getDemoMode = (): 'countdown' | 'lastminute' | 'newyear' | null => {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  
  // Check for ?mode= (from demo page) or ?demo= (legacy)
  const mode = params.get('mode') || params.get('demo');
  
  // Also check if we're on the demo page path
  const isOnDemoPage = window.location.pathname.includes('/demo/newyear');
  
  if (mode === 'countdown' || mode === 'lastminute' || mode === 'newyear') {
    return mode;
  }
  
  // Default to countdown if on demo page without mode
  if (isOnDemoPage) {
    return 'countdown';
  }
  
  return null;
};

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

const NewYearCountdown = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [isNewYear, setIsNewYear] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const demoMode = useRef(getDemoMode()).current;
  const confettiRef = useRef<ConfettiRef>(null);
  const confettiFiredRef = useRef(false);
  const autoHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInitializedRef = useRef(false);

  // Get current time in Chicago timezone
  const getChicagoTime = useCallback(() => {
    return new Date(new Date().toLocaleString('en-US', { timeZone: CHICAGO_TIMEZONE }));
  }, []);

  // Get New Year's midnight target in Chicago time
  const getNewYearTarget = useCallback(() => {
    const chicagoNow = getChicagoTime();
    const year = chicagoNow.getMonth() === 11 ? chicagoNow.getFullYear() + 1 : chicagoNow.getFullYear();
    return new Date(year, 0, 1, 0, 0, 0, 0);
  }, [getChicagoTime]);

  // Check if we're in the countdown window (Dec 31st 9 PM - Jan 1st 12 AM Chicago time)
  const isInCountdownWindow = useCallback(() => {
    if (demoMode) return true;

    const chicagoNow = getChicagoTime();
    const month = chicagoNow.getMonth();
    const date = chicagoNow.getDate();
    const hours = chicagoNow.getHours();

    return month === 11 && date === 31 && hours >= 21;
  }, [getChicagoTime, demoMode]);

  // Calculate time remaining until midnight
  const calculateTimeRemaining = useCallback((): TimeRemaining | null => {
    if (demoMode === 'countdown') {
      const now = new Date();
      const seconds = 59 - (now.getSeconds() % 60);
      return { hours: 2, minutes: 30, seconds, total: 2 * 60 * 60 * 1000 };
    }

    if (demoMode === 'lastminute') {
      const now = new Date();
      const seconds = 30 - (now.getSeconds() % 31);
      if (seconds <= 0) {
        return { hours: 0, minutes: 0, seconds: 0, total: 0 };
      }
      return { hours: 0, minutes: 0, seconds, total: seconds * 1000 };
    }

    if (demoMode === 'newyear') {
      return { hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    if (!isInCountdownWindow()) {
      return null;
    }

    const now = new Date();
    const target = getNewYearTarget();
    const chicagoNow = getChicagoTime();
    const localNow = new Date();
    const offset = localNow.getTime() - chicagoNow.getTime();
    const adjustedTarget = new Date(target.getTime() + offset);
    const diff = adjustedTarget.getTime() - now.getTime();

    if (diff <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds, total: diff };
  }, [getChicagoTime, getNewYearTarget, isInCountdownWindow, demoMode]);

  // Check if in last minute
  const isInLastMinute = useCallback((remaining: TimeRemaining | null): boolean => {
    if (demoMode === 'lastminute') return true;
    if (!remaining) return false;
    return remaining.total > 0 && remaining.total <= 60 * 1000;
  }, [demoMode]);

  // Fire confetti
  const fireConfetti = useCallback(() => {
    if (confettiFiredRef.current && !demoMode) return;
    confettiFiredRef.current = true;
    setShowConfetti(true);

    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#FF69B4', '#00CED1'];

    setTimeout(() => {
      if (!confettiRef.current) return;

      // Initial burst
      confettiRef.current.fire({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6, x: 0.5 },
        colors,
      });

      // Multiple bursts
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          confettiRef.current?.fire({
            particleCount: 50,
            spread: 360,
            startVelocity: 30,
            ticks: 60,
            origin: { x: Math.random() * 0.6 + 0.2, y: Math.random() * 0.4 + 0.1 },
            colors,
          });
        }, i * 400);
      }

      // Side cannons
      let count = 0;
      const cannonInterval = setInterval(() => {
        if (!confettiRef.current || count >= 50) {
          clearInterval(cannonInterval);
          return;
        }
        count++;
        confettiRef.current.fire({
          particleCount: 5,
          angle: 60,
          spread: 55,
          startVelocity: 60,
          origin: { x: 0, y: 0.65 },
          colors,
        });
        confettiRef.current.fire({
          particleCount: 5,
          angle: 120,
          spread: 55,
          startVelocity: 60,
          origin: { x: 1, y: 0.65 },
          colors,
        });
      }, 60);

      // Stars
      [500, 1500, 2500].forEach((delay) => {
        setTimeout(() => {
          confettiRef.current?.fire({
            particleCount: 40,
            spread: 360,
            gravity: 0.1,
            decay: 0.94,
            startVelocity: 25,
            origin: { x: Math.random() * 0.6 + 0.2, y: Math.random() * 0.4 + 0.2 },
            colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8'],
            shapes: ['star', 'circle'],
          });
        }, delay);
      });
    }, 100);

    setTimeout(() => setShowConfetti(false), 7000);
  }, [demoMode]);

  // Timer functions
  const startAutoHideTimer = useCallback((duration: number) => {
    if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current);
    autoHideTimerRef.current = setTimeout(() => setIsVisible(false), duration);
  }, []);

  const clearAutoHideTimer = useCallback(() => {
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
      autoHideTimerRef.current = null;
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    if (!isInCountdownWindow()) return;

    setIsVisible(true);
    const remaining = calculateTimeRemaining();
    setTimeRemaining(remaining);

    if (demoMode === 'newyear') {
      setIsNewYear(true);
      setTimeout(() => fireConfetti(), 300);
      startAutoHideTimer(10000);
      return;
    }

    if (demoMode === 'lastminute') return;

    if (!isInLastMinute(remaining)) {
      startAutoHideTimer(6000);
    }

    return () => clearAutoHideTimer();
  }, [isInCountdownWindow, calculateTimeRemaining, demoMode, fireConfetti, isInLastMinute, startAutoHideTimer, clearAutoHideTimer]);

  // Update countdown
  useEffect(() => {
    if (!isInCountdownWindow()) return;
    if (demoMode === 'newyear') return;

    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);

      if (isInLastMinute(remaining) && !isDismissed) {
        if (!isVisible) setIsVisible(true);
        clearAutoHideTimer();
      }

      if (remaining && remaining.total <= 0 && !isNewYear) {
        setIsNewYear(true);
        setIsVisible(true);
        setIsDismissed(false);
        clearAutoHideTimer();

        const confettiShown = sessionStorage.getItem('newYearConfettiShown');
        if (!confettiShown || demoMode) {
          if (!demoMode) sessionStorage.setItem('newYearConfettiShown', 'true');
          setTimeout(() => fireConfetti(), 300);
        }

        startAutoHideTimer(10000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isInCountdownWindow, calculateTimeRemaining, demoMode, isVisible, isDismissed, isNewYear, isInLastMinute, fireConfetti, clearAutoHideTimer, startAutoHideTimer]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    clearAutoHideTimer();
  };

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  if (!isInCountdownWindow()) return null;

  return (
    <>
      {/* Full-screen confetti canvas */}
      {showConfetti && (
        <Confetti
          ref={confettiRef}
          className="pointer-events-none fixed inset-0 z-[99999] h-full w-full"
          manualstart={true}
        />
      )}

      {/* Banner */}
      {!isDismissed && isVisible && (
        <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up px-2 pb-2 sm:px-4 sm:pb-4 md:px-6 md:pb-5">
          <div className="mx-auto max-w-lg sm:max-w-xl lg:max-w-2xl">
            {/* Glass container with 3D effect */}
            <div 
              className="relative overflow-hidden rounded-2xl border border-white/[0.15] bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md dark:border-white/[0.08] dark:bg-black/[0.03] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]"
              style={{
                transform: 'perspective(1000px) rotateX(2deg)',
                transformOrigin: 'bottom center',
              }}
            >
              {/* Glass shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.03] dark:from-white/[0.05] dark:to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/[0.05]" />
              
              <div className="relative px-3 py-2.5 sm:px-5 sm:py-3.5 md:px-6 md:py-4">
                {/* Demo indicator */}
                {demoMode && (
                  <div className="absolute left-2 top-1 rounded-md bg-amber-400/90 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-amber-900 shadow-sm sm:left-3 sm:top-1.5 sm:text-[9px]">
                    Demo
                  </div>
                )}
                
                {/* Dismiss button */}
                <button
                  onClick={handleDismiss}
                  className="absolute right-1.5 top-1.5 rounded-full bg-white/[0.05] p-1.5 text-foreground/40 backdrop-blur-sm transition-all hover:bg-white/[0.15] hover:text-foreground active:scale-95 sm:right-2.5 sm:top-2.5 sm:p-2"
                  aria-label="Dismiss"
                >
                  <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </button>

                <div className="flex flex-col items-center justify-center gap-1.5 sm:flex-row sm:gap-4 md:gap-5">
                  {isNewYear ? (
                    <div className="pr-6 text-center sm:pr-8">
                      <div className="bg-gradient-to-r from-amber-300 via-rose-400 to-purple-400 bg-clip-text text-lg font-extrabold text-transparent sm:text-2xl md:text-3xl">
                        Happy New Year {new Date().getFullYear() + (demoMode ? 1 : 0)}!
                      </div>
                      <p className="mt-0.5 text-[10px] text-muted-foreground/80 sm:text-xs">
                        Wishing you a blessed year ahead
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Desktop label */}
                      <div className="hidden text-center sm:block">
                        <span className="block text-[9px] uppercase tracking-widest text-muted-foreground/60">Countdown to</span>
                        <span className="text-xs font-semibold text-foreground/90 sm:text-sm">
                          {getNewYearTarget().getFullYear()}
                        </span>
                      </div>
                      
                      {/* Mobile label */}
                      <div className="text-center sm:hidden">
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60">
                          New Year {getNewYearTarget().getFullYear()}
                        </span>
                      </div>
                      
                      {/* Timer tiles with 3D effect */}
                      <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                        {/* Hours */}
                        <div 
                          className="group relative min-w-[36px] overflow-hidden rounded-lg bg-gradient-to-b from-white/[0.08] to-white/[0.02] px-2 py-1.5 text-center shadow-[0_4px_12px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.1)] backdrop-blur-sm transition-transform active:scale-95 sm:min-w-[44px] sm:rounded-xl sm:px-2.5 sm:py-2 md:min-w-[50px] md:px-3"
                          style={{ transform: 'perspective(500px) rotateX(-3deg)' }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.1] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                          <span className="relative block font-mono text-base font-bold tabular-nums text-foreground/95 sm:text-lg md:text-2xl">
                            {timeRemaining ? formatNumber(timeRemaining.hours) : '--'}
                          </span>
                          <span className="relative block text-[6px] uppercase tracking-widest text-muted-foreground/50 sm:text-[8px]">
                            hrs
                          </span>
                        </div>
                        
                        <span className="text-sm font-light text-muted-foreground/40 sm:text-base md:text-lg">:</span>
                        
                        {/* Minutes */}
                        <div 
                          className="group relative min-w-[36px] overflow-hidden rounded-lg bg-gradient-to-b from-white/[0.08] to-white/[0.02] px-2 py-1.5 text-center shadow-[0_4px_12px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.1)] backdrop-blur-sm transition-transform active:scale-95 sm:min-w-[44px] sm:rounded-xl sm:px-2.5 sm:py-2 md:min-w-[50px] md:px-3"
                          style={{ transform: 'perspective(500px) rotateX(-3deg)' }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.1] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                          <span className="relative block font-mono text-base font-bold tabular-nums text-foreground/95 sm:text-lg md:text-2xl">
                            {timeRemaining ? formatNumber(timeRemaining.minutes) : '--'}
                          </span>
                          <span className="relative block text-[6px] uppercase tracking-widest text-muted-foreground/50 sm:text-[8px]">
                            min
                          </span>
                        </div>
                        
                        <span className="text-sm font-light text-muted-foreground/40 sm:text-base md:text-lg">:</span>
                        
                        {/* Seconds */}
                        <div 
                          className="group relative min-w-[36px] overflow-hidden rounded-lg bg-gradient-to-b from-white/[0.08] to-white/[0.02] px-2 py-1.5 text-center shadow-[0_4px_12px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.1)] backdrop-blur-sm transition-transform active:scale-95 sm:min-w-[44px] sm:rounded-xl sm:px-2.5 sm:py-2 md:min-w-[50px] md:px-3"
                          style={{ transform: 'perspective(500px) rotateX(-3deg)' }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.1] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                          <span className="relative block font-mono text-base font-bold tabular-nums text-foreground/95 sm:text-lg md:text-2xl">
                            {timeRemaining ? formatNumber(timeRemaining.seconds) : '--'}
                          </span>
                          <span className="relative block text-[6px] uppercase tracking-widest text-muted-foreground/50 sm:text-[8px]">
                            sec
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewYearCountdown;

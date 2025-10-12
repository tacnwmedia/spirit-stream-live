import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Birthday {
  id: string;
  name: string;
  birthday: string;
}

interface WeddingAnniversary {
  id: string;
  name: string;
  anniversary_date: string;
}

interface CelebrationCache {
  birthdays: Birthday[];
  anniversaries: WeddingAnniversary[];
  month: number;
  year: number;
  timestamp: number;
}

const CACHE_KEY = 'celebrations_cache';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour in milliseconds

export const useOptimizedCelebrations = () => {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [anniversaries, setAnniversaries] = useState<WeddingAnniversary[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Check if we have valid cached data for current month
  const getCachedData = useCallback((): CelebrationCache | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      
      const data: CelebrationCache = JSON.parse(cached);
      
      // Check if cache is for current month/year and not expired
      if (
        data.month === currentMonth &&
        data.year === currentYear &&
        Date.now() - data.timestamp < CACHE_DURATION
      ) {
        return data;
      }
      
      // Remove stale cache
      localStorage.removeItem(CACHE_KEY);
      return null;
    } catch (error) {
      console.error('Error reading celebrations cache:', error);
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  }, [currentMonth, currentYear]);

  // Save data to cache
  const setCacheData = useCallback((birthdays: Birthday[], anniversaries: WeddingAnniversary[]) => {
    try {
      const cacheData: CelebrationCache = {
        birthdays,
        anniversaries,
        month: currentMonth,
        year: currentYear,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error saving celebrations cache:', error);
    }
  }, [currentMonth, currentYear]);

  // Optimized Supabase query using RPC functions that filter by month only (ignoring year)
  const fetchFromSupabase = useCallback(async (): Promise<{ birthdays: Birthday[], anniversaries: WeddingAnniversary[] }> => {
    console.log(`[useOptimizedCelebrations] Fetching celebrations for current month using RPC functions`);
    
    const [birthdaysResponse, anniversariesResponse] = await Promise.all([
      // Use RPC to get current month birthdays (ignoring year)
      supabase.rpc('get_current_month_birthdays'),
      
      // Use RPC to get current month anniversaries (ignoring year)
      supabase.rpc('get_current_month_anniversaries')
    ]);

    console.log('[useOptimizedCelebrations] Birthdays RPC response:', birthdaysResponse);
    console.log('[useOptimizedCelebrations] Anniversaries RPC response:', anniversariesResponse);

    if (birthdaysResponse.error) {
      console.error('Error loading birthdays via RPC:', birthdaysResponse.error);
      throw birthdaysResponse.error;
    }

    if (anniversariesResponse.error) {
      console.error('Error loading anniversaries via RPC:', anniversariesResponse.error);
      throw anniversariesResponse.error;
    }

    const birthdays = birthdaysResponse.data || [];
    const anniversaries = anniversariesResponse.data || [];
    
    console.log(`[useOptimizedCelebrations] Successfully fetched ${birthdays.length} birthdays and ${anniversaries.length} anniversaries via RPC`);
    
    return { birthdays, anniversaries };
  }, []);

  // Load celebrations with caching strategy
  const loadCelebrations = useCallback(async (useCache = true) => {
    try {
      setLoading(true);
      
      // First, try to load from cache if requested
      if (useCache) {
        const cachedData = getCachedData();
        if (cachedData) {
          setBirthdays(cachedData.birthdays);
          setAnniversaries(cachedData.anniversaries);
          setLoading(false);
          
          // Background refresh - don't show loading to user
          setIsRefreshing(true);
          try {
            const freshData = await fetchFromSupabase();
            setBirthdays(freshData.birthdays);
            setAnniversaries(freshData.anniversaries);
            setCacheData(freshData.birthdays, freshData.anniversaries);
          } catch (error) {
            console.error('Background refresh failed:', error);
          } finally {
            setIsRefreshing(false);
          }
          return;
        }
      }

      // No cache available, fetch fresh data
      const data = await fetchFromSupabase();
      setBirthdays(data.birthdays);
      setAnniversaries(data.anniversaries);
      setCacheData(data.birthdays, data.anniversaries);
      
    } catch (error) {
      console.error('Failed to load celebrations:', error);
      // On error, still try to show cached data if available
      const cachedData = getCachedData();
      if (cachedData) {
        setBirthdays(cachedData.birthdays);
        setAnniversaries(cachedData.anniversaries);
      }
    } finally {
      setLoading(false);
    }
  }, [getCachedData, fetchFromSupabase, setCacheData]);

  // Force refresh (bypass cache)
  const forceRefresh = useCallback(() => {
    localStorage.removeItem(CACHE_KEY);
    loadCelebrations(false);
  }, [loadCelebrations]);

  useEffect(() => {
    loadCelebrations(true);
  }, [loadCelebrations]);

  return {
    birthdays,
    anniversaries,
    loading,
    isRefreshing,
    reload: forceRefresh,
    refreshInBackground: () => loadCelebrations(false)
  };
};
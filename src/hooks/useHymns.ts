
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Updated Hymn structure to support verse/chorus organization
export interface Hymn {
  number: number;
  title: string;
  verses: Array<{
    number: number;
    lines: string[];
  }>;
  chorus?: string[];
  fullContent: string; // For search purposes
}

interface HymnLine {
  id: number;
  hymn_number: number;
  verse_number: number;
  line_number: number;
  text: string;
  chorus: boolean;
}

export const useHymns = () => {
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHymns();
  }, []);

  const loadHymns = async () => {
    try {
      setLoading(true);
      
      // Fetch all hymn lines using pagination to overcome Supabase's 1000 row limit
      let allLines: HymnLine[] = [];
      let from = 0;
      const pageSize = 1000;

      while (true) {
        const { data, error } = await supabase
          .from('hymn_lines')
          .select('*')
          .order('hymn_number', { ascending: true })
          .order('verse_number', { ascending: true })
          .order('line_number', { ascending: true })
          .range(from, from + pageSize - 1);

        if (error) {
          console.error('Error loading hymn lines:', error);
          break;
        }

        if (!data || data.length === 0) {
          break;
        }

        allLines = allLines.concat(data as any);
        from += pageSize;

        // If we got less than pageSize, we've reached the end
        if (data.length < pageSize) {
          break;
        }
      }

      console.log(`Loaded ${allLines.length} hymn lines from database`);


      // Group lines by hymn number and organize by verses
      const hymnMap = new Map<number, Hymn>();
      
      allLines.forEach((line: HymnLine) => {
        if (!hymnMap.has(line.hymn_number)) {
          hymnMap.set(line.hymn_number, {
            number: line.hymn_number,
            title: '', // Will be extracted from first line
            verses: [],
            fullContent: ''
          });
        }

        const hymn = hymnMap.get(line.hymn_number)!;
        
        if (line.chorus) {
          // Handle chorus lines
          if (!hymn.chorus) {
            hymn.chorus = [];
          }
          hymn.chorus.push(line.text);
        } else {
          // Handle verse lines
          let verse = hymn.verses.find(v => v.number === line.verse_number);
          if (!verse) {
            verse = { number: line.verse_number, lines: [] };
            hymn.verses.push(verse);
          }
          verse.lines.push(line.text);
          
          // Extract title from first line of first verse if not set
          if (hymn.title === '' && line.verse_number === 1 && line.line_number === 1) {
            // Try to extract title from first line (format might be "25 Amazing Grace Amazing grace! how sweet the sound")
            const titleMatch = line.text.match(/^\d+\s+(.+?)\s+(.+)$/);
            if (titleMatch) {
              hymn.title = titleMatch[1];
            } else {
              // Fallback: use first few words
              hymn.title = line.text.split(' ').slice(0, 3).join(' ');
            }
          }
        }
        
        hymn.fullContent += ' ' + line.text;
      });

      // Sort verses by number
      hymnMap.forEach(hymn => {
        hymn.verses.sort((a, b) => a.number - b.number);
        hymn.fullContent = hymn.fullContent.trim();
      });

      const processedHymns = Array.from(hymnMap.values()).sort((a, b) => a.number - b.number);
      setHymns(processedHymns);
    } catch (error) {
      console.error('Error processing hymns:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHymnByNumber = (number: number): Hymn | undefined => {
    const hymn = hymns.find(hymn => hymn.number === number);
    console.log(`Looking for hymn ${number}, found:`, hymn ? `${hymn.title}` : 'not found');
    return hymn;
  };

  const searchHymns = (query: string): Hymn[] => {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return hymns.filter(hymn => 
      hymn.number.toString().includes(searchTerm) ||
      hymn.title.toLowerCase().includes(searchTerm) ||
      hymn.fullContent.toLowerCase().includes(searchTerm)
    );
  };

  const forceReload = async () => {
    console.log('Force reloading hymns...');
    setLoading(true);
    await loadHymns();
  };

  return {
    hymns,
    loading,
    getHymnByNumber,
    searchHymns,
    reload: loadHymns,
    forceReload
  };
};

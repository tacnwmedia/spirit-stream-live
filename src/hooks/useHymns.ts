import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Hymn {
  number: number;
  title: string;
  content: string;
  verses: string[];
  chorus?: string;
}

export const useHymns = () => {
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHymns();
  }, []);

  const loadHymns = async () => {
    try {
      const { data, error } = await supabase
        .from('hymns')
        .select('hymn_number, line_number, line_content')
        .order('hymn_number')
        .order('line_number');

      if (error) throw error;

      // Group lines by hymn number
      const hymnGroups: { [key: number]: { line_number: number; line_content: string }[] } = {};
      
      data?.forEach(row => {
        if (!hymnGroups[row.hymn_number]) {
          hymnGroups[row.hymn_number] = [];
        }
        hymnGroups[row.hymn_number].push({
          line_number: row.line_number,
          line_content: row.line_content
        });
      });

      // Convert to hymn objects
      const hymnList: Hymn[] = Object.entries(hymnGroups).map(([numberStr, lines]) => {
        const number = parseInt(numberStr);
        const sortedLines = lines.sort((a, b) => a.line_number - b.line_number);
        const content = sortedLines.map(line => line.line_content).join('\n');
        
        // Extract title from first line
        const title = sortedLines[0]?.line_content || `Hymn ${number}`;
        
        // Group lines into verses (every 4-6 lines typically)
        const verses: string[] = [];
        let currentVerse: string[] = [];
        
        sortedLines.forEach((line, index) => {
          currentVerse.push(line.line_content);
          
          // Start new verse every 4 lines or at natural breaks
          if (currentVerse.length >= 4 || index === sortedLines.length - 1) {
            verses.push(currentVerse.join('\n'));
            currentVerse = [];
          }
        });

        return {
          number,
          title,
          content,
          verses: verses.length > 0 ? verses : [content]
        };
      });

      setHymns(hymnList);
    } catch (error) {
      console.error('Failed to load hymns:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHymnByNumber = (number: number): Hymn | undefined => {
    return hymns.find(hymn => hymn.number === number);
  };

  const searchHymns = (query: string): Hymn[] => {
    if (!query.trim()) return hymns;
    
    const searchTerm = query.toLowerCase();
    return hymns.filter(hymn => 
      hymn.number.toString().includes(searchTerm) ||
      hymn.title.toLowerCase().includes(searchTerm) ||
      hymn.content.toLowerCase().includes(searchTerm)
    );
  };

  return {
    hymns,
    loading,
    getHymnByNumber,
    searchHymns,
    reload: loadHymns
  };
};
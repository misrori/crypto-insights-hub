import { useState, useEffect, useMemo } from 'react';
import { VideoSummary } from '@/types/video';
import { fetchAllVideos } from '@/services/githubDataService';

interface UseVideoDataReturn {
  videos: Record<string, Record<string, VideoSummary[]>>;
  availableDates: string[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  youtubers: Array<{ id: string; displayName: string }>;
}

export function useVideoData(daysToFetch: number = 30): UseVideoDataReturn {
  const [videos, setVideos] = useState<Record<string, Record<string, VideoSummary[]>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchAllVideos(daysToFetch);
        
        if (mounted) {
          setVideos(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load video data');
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [daysToFetch, fetchTrigger]);

  const availableDates = useMemo(() => {
    return Object.keys(videos).sort((a, b) => b.localeCompare(a));
  }, [videos]);

  // Dynamically extract YouTuber names from the data
  const youtubers = useMemo(() => {
    const youtuberSet = new Set<string>();
    
    Object.values(videos).forEach(dateData => {
      Object.keys(dateData).forEach(ytName => {
        youtuberSet.add(ytName);
      });
    });

    return Array.from(youtuberSet)
      .sort()
      .map(name => ({
        id: name,
        displayName: formatYouTuberName(name),
      }));
  }, [videos]);

  const refetch = () => {
    setFetchTrigger(prev => prev + 1);
  };

  return {
    videos,
    availableDates,
    isLoading,
    error,
    refetch,
    youtubers,
  };
}

// Helper function to format YouTuber names for display
function formatYouTuberName(name: string): string {
  // Handle common patterns
  const nameMap: Record<string, string> = {
    'CoinBureau': 'Coin Bureau',
    'IvanOnTech': 'Ivan on Tech',
    'TomNashTV': 'Tom Nash TV',
    'DataDispatch': 'Data Dispatch',
    'CTOLARSSON': 'CTO Larsson',
    'DavidCarbutt': 'David Carbutt',
    'coingecko': 'CoinGecko',
    'elliotrades_official': 'EllioTrades',
  };

  return nameMap[name] || name.replace(/_/g, ' ');
}

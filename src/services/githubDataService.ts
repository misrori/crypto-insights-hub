import { VideoSummary } from '@/types/video';

const GITHUB_REPO = 'misrori/daily_news';
const GITHUB_BRANCH = 'main';
const DATA_PATH = 'data';

// Only fetch data from this date onwards
const MIN_DATE = '2026-02-01';

// Known YouTubers to check for each date
const KNOWN_YOUTUBERS = [
  'CoinBureau',
  'IvanOnTech',
  'DataDispatch',
  'FelixFriends',
  'TomNashTV',
  'elliotrades_official',
  'CTOLARSSON',
  'DavidCarbutt',
  'coingecko',
  'AltcoinDaily',
  'BitBoy',
  'CryptoWendyO',
];

// GitHub raw content URL (no rate limit)
const getRawUrl = (path: string) => 
  `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${path}`;

interface RawVideoData {
  video_id: string;
  title: string;
  published_at: string;
  sort_date: string;
  url: string;
  transcript?: string;
  summary_hu?: string;
  summary_en?: string;
  crypto_sentiment?: 'Bullish' | 'Bearish' | 'Neutral';
  sentiment_score?: number;
  key_points_hu?: string[];
  key_points_en?: string[];
  main_topics?: string[];
}

// Check if a video has a valid summary
function hasValidSummary(video: RawVideoData): boolean {
  return !!(video.summary_hu && video.summary_hu.trim() !== '') || 
         !!(video.summary_en && video.summary_en.trim() !== '');
}

// Cache for fetched data
let dataCache: Record<string, Record<string, VideoSummary[]>> | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Generate date range from MIN_DATE to today
function generateDateRange(): string[] {
  const dates: string[] = [];
  const today = new Date();
  const minDate = new Date(MIN_DATE);
  
  // Start from today and go backwards to MIN_DATE
  const current = new Date(today);
  while (current >= minDate) {
    const dateStr = current.toISOString().split('T')[0];
    dates.push(dateStr);
    current.setDate(current.getDate() - 1);
  }
  
  return dates;
}

export async function getVideoDataForDate(
  date: string, 
  youtuber: string
): Promise<VideoSummary[]> {
  try {
    const url = getRawUrl(`${DATA_PATH}/${date}/${youtuber}.json`);
    const response = await fetch(url);
    
    if (!response.ok) {
      // 404 is expected if the YouTuber didn't post that day
      if (response.status !== 404) {
        console.error(`Failed to fetch ${youtuber} data for ${date}:`, response.status);
      }
      return [];
    }
    
    const data = await response.json();
    
    // Handle both single video object and array of videos
    const videos: RawVideoData[] = Array.isArray(data) ? data : [data];
    
    // Filter only videos that have a valid summary
    return videos
      .filter(hasValidSummary)
      .map(video => ({
        video_id: video.video_id,
        title: video.title,
        published_at: video.published_at,
        sort_date: video.sort_date || date,
        url: video.url,
        transcript: video.transcript,
        summary_hu: video.summary_hu || '',
        summary_en: video.summary_en || '',
        crypto_sentiment: video.crypto_sentiment || 'Neutral',
        sentiment_score: video.sentiment_score || 50,
        key_points_hu: video.key_points_hu || [],
        key_points_en: video.key_points_en || [],
        main_topics: video.main_topics || [],
      }));
  } catch (error) {
    // Silent fail for network errors on individual files
    return [];
  }
}

export async function fetchAllVideos(
  daysToFetch: number = 14
): Promise<Record<string, Record<string, VideoSummary[]>>> {
  // Check cache
  if (dataCache && Date.now() - lastFetchTime < CACHE_DURATION) {
    return dataCache;
  }
  
  const result: Record<string, Record<string, VideoSummary[]>> = {};
  
  try {
    // Generate dates from today backwards to MIN_DATE
    const allDates = generateDateRange();
    const dates = allDates.slice(0, daysToFetch);
    
    console.log(`Fetching videos for ${dates.length} dates...`);
    
    // Fetch data for each date in parallel
    const datePromises = dates.map(async (date) => {
      // Try all known YouTubers for this date in parallel
      const videoPromises = KNOWN_YOUTUBERS.map(async (youtuber) => {
        const videos = await getVideoDataForDate(date, youtuber);
        return { youtuber, videos };
      });
      
      const results = await Promise.all(videoPromises);
      
      const dateData: Record<string, VideoSummary[]> = {};
      results.forEach(({ youtuber, videos }) => {
        if (videos.length > 0) {
          dateData[youtuber] = videos;
        }
      });
      
      return { date, data: dateData };
    });
    
    const allResults = await Promise.all(datePromises);
    
    allResults.forEach(({ date, data }) => {
      if (Object.keys(data).length > 0) {
        result[date] = data;
      }
    });
    
    console.log(`Loaded ${Object.keys(result).length} dates with videos`);
    
    // Update cache
    dataCache = result;
    lastFetchTime = Date.now();
    
    return result;
  } catch (error) {
    console.error('Error fetching all videos:', error);
    return result;
  }
}

// Helper function to get videos by date from cached data
export function getVideosByDateFromCache(
  allVideos: Record<string, Record<string, VideoSummary[]>>,
  date: string
): Record<string, VideoSummary[]> {
  return allVideos[date] || {};
}

// Clear cache if needed
export function clearCache(): void {
  dataCache = null;
  lastFetchTime = 0;
}

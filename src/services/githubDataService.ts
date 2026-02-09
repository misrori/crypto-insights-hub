import { VideoSummary } from '@/types/video';

const GITHUB_REPO = 'misrori/daily_news';
const GITHUB_BRANCH = 'main';
const DATA_PATH = 'data';

// GitHub raw content URL
const getRawUrl = (path: string) => 
  `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${path}`;

// GitHub API URL for directory listing
const getApiUrl = (path: string) => 
  `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`;

interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
}

interface RawVideoData {
  video_id: string;
  title: string;
  published_at: string;
  sort_date: string;
  url: string;
  transcript?: string;
  summary_hu: string;
  summary_en: string;
  crypto_sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  sentiment_score: number;
  key_points_hu: string[];
  key_points_en: string[];
  main_topics: string[];
}

// Cache for fetched data
let dataCache: Record<string, Record<string, VideoSummary[]>> | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getAvailableDates(): Promise<string[]> {
  try {
    const response = await fetch(getApiUrl(DATA_PATH));
    if (!response.ok) {
      console.error('Failed to fetch dates from GitHub:', response.status);
      return [];
    }
    
    const files: GitHubFile[] = await response.json();
    
    // Filter only directories (dates) and sort descending (newest first)
    const dates = files
      .filter(f => f.type === 'dir' && /^\d{4}-\d{2}-\d{2}$/.test(f.name))
      .map(f => f.name)
      .sort((a, b) => b.localeCompare(a));
    
    return dates;
  } catch (error) {
    console.error('Error fetching available dates:', error);
    return [];
  }
}

export async function getYouTuberFilesForDate(date: string): Promise<string[]> {
  try {
    const response = await fetch(getApiUrl(`${DATA_PATH}/${date}`));
    if (!response.ok) {
      console.error(`Failed to fetch files for ${date}:`, response.status);
      return [];
    }
    
    const files: GitHubFile[] = await response.json();
    
    // Filter only JSON files
    return files
      .filter(f => f.type === 'file' && f.name.endsWith('.json'))
      .map(f => f.name.replace('.json', ''));
  } catch (error) {
    console.error(`Error fetching files for ${date}:`, error);
    return [];
  }
}

export async function getVideoDataForDate(
  date: string, 
  youtuber: string
): Promise<VideoSummary[]> {
  try {
    const url = getRawUrl(`${DATA_PATH}/${date}/${youtuber}.json`);
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch ${youtuber} data for ${date}:`, response.status);
      return [];
    }
    
    const data = await response.json();
    
    // Handle both single video object and array of videos
    const videos: RawVideoData[] = Array.isArray(data) ? data : [data];
    
    return videos.map(video => ({
      video_id: video.video_id,
      title: video.title,
      published_at: video.published_at,
      sort_date: video.sort_date || date,
      url: video.url,
      transcript: video.transcript,
      summary_hu: video.summary_hu,
      summary_en: video.summary_en,
      crypto_sentiment: video.crypto_sentiment,
      sentiment_score: video.sentiment_score,
      key_points_hu: video.key_points_hu || [],
      key_points_en: video.key_points_en || [],
      main_topics: video.main_topics || [],
    }));
  } catch (error) {
    console.error(`Error fetching video data for ${date}/${youtuber}:`, error);
    return [];
  }
}

export async function fetchAllVideos(
  daysToFetch: number = 30
): Promise<Record<string, Record<string, VideoSummary[]>>> {
  // Check cache
  if (dataCache && Date.now() - lastFetchTime < CACHE_DURATION) {
    return dataCache;
  }
  
  const result: Record<string, Record<string, VideoSummary[]>> = {};
  
  try {
    // Get available dates
    const allDates = await getAvailableDates();
    const dates = allDates.slice(0, daysToFetch);
    
    // Fetch data for each date in parallel
    const datePromises = dates.map(async (date) => {
      const youtubers = await getYouTuberFilesForDate(date);
      
      // Fetch all YouTuber data for this date in parallel
      const videoPromises = youtubers.map(async (youtuber) => {
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

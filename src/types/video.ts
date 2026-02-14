export interface VideoSummary {
  channel_name: string;
  channel_id: string;
  channel_handle: string;
  video_id: string;
  title: string;
  published_at: string;
  sort_data: string;
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

export interface YouTuber {
  id: string;
  name: string;
  displayName: string;
  avatar?: string;
}

export const YOUTUBERS: YouTuber[] = [
  { id: 'coinbureau', name: 'coinbureau', displayName: 'Coin Bureau' },
  { id: 'CTOLARSSON', name: 'CTOLARSSON', displayName: 'CTO Larsson' },
  { id: 'DataDispatch', name: 'DataDispatch', displayName: 'Data Dispatch' },
  { id: 'DavidCarbutt', name: 'DavidCarbutt', displayName: 'David Carbutt' },
  { id: 'IvanOnTech', name: 'IvanOnTech', displayName: 'Ivan on Tech' },
  { id: 'coingecko', name: 'coingecko', displayName: 'CoinGecko' },
  { id: 'elliotrades_official', name: 'elliotrades_official', displayName: 'EllioTrades' },
];

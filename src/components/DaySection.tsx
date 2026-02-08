import { VideoSummary, YOUTUBERS } from '@/types/video';
import { VideoCard } from '@/components/VideoCard';
import { Calendar } from 'lucide-react';

interface DaySectionProps {
  date: string;
  videos: Array<VideoSummary & { _youtuberName: string }>;
  language: 'hu' | 'en';
  isFirst?: boolean;
}

export const DaySection = ({ date, videos, language, isFirst }: DaySectionProps) => {
  const formatDate = (dateString: string) => {
    const dateObj = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isToday = dateObj.toDateString() === today.toDateString();
    const isYesterday = dateObj.toDateString() === yesterday.toDateString();
    
    if (language === 'hu') {
      if (isToday) return 'Ma';
      if (isYesterday) return 'Tegnap';
      return dateObj.toLocaleDateString('hu-HU', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
      });
    } else {
      if (isToday) return 'Today';
      if (isYesterday) return 'Yesterday';
      return dateObj.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
      });
    }
  };

  const getStats = () => {
    const bullish = videos.filter(v => v.crypto_sentiment === 'Bullish').length;
    const bearish = videos.filter(v => v.crypto_sentiment === 'Bearish').length;
    const avgScore = videos.length > 0 
      ? Math.round(videos.reduce((sum, v) => sum + v.sentiment_score, 0) / videos.length)
      : 0;
    
    return { bullish, bearish, avgScore };
  };

  const stats = getStats();

  return (
    <div className={`relative ${isFirst ? '' : 'mt-12'}`}>
      {/* Date Header */}
      <div className="sticky top-16 z-30 -mx-4 px-4 py-3 bg-background/80 backdrop-blur-lg border-b border-border/50 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">
                {formatDate(date)}
              </h2>
              <p className="text-sm text-muted-foreground">
                {videos.length} {language === 'hu' ? 'videó' : 'videos'}
              </p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-crypto-green" />
              <span className="text-muted-foreground">{stats.bullish}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-crypto-red" />
              <span className="text-muted-foreground">{stats.bearish}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-secondary/50">
              <span className="text-muted-foreground">{language === 'hu' ? 'Átlag' : 'Avg'}:</span>
              <span className="font-medium text-foreground">{stats.avgScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {videos.map((video, index) => (
          <VideoCard 
            key={`${video.video_id}-${index}`} 
            video={video} 
            language={language}
            youtuberName={video._youtuberName}
          />
        ))}
      </div>
    </div>
  );
};

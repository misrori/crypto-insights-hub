import { TrendingUp, TrendingDown, Minus, Video, Users } from 'lucide-react';
import { VideoSummary } from '@/types/video';

interface StatsOverviewProps {
  videos: VideoSummary[];
}

export const StatsOverview = ({ videos }: StatsOverviewProps) => {
  const bullishCount = videos.filter(v => v.crypto_sentiment === 'Bullish').length;
  const bearishCount = videos.filter(v => v.crypto_sentiment === 'Bearish').length;
  const neutralCount = videos.filter(v => v.crypto_sentiment === 'Neutral').length;
  
  const avgSentiment = videos.length > 0 
    ? Math.round(videos.reduce((acc, v) => acc + v.sentiment_score, 0) / videos.length)
    : 0;

  const uniqueYouTubers = new Set(videos.map(v => v.url.split('watch?v=')[0])).size;

  const stats = [
    {
      label: 'Összes videó',
      value: videos.length,
      icon: Video,
      color: 'text-crypto-cyan',
      bgColor: 'bg-crypto-cyan/10',
    },
    {
      label: 'Bullish',
      value: bullishCount,
      icon: TrendingUp,
      color: 'text-crypto-green',
      bgColor: 'bg-crypto-green/10',
    },
    {
      label: 'Bearish',
      value: bearishCount,
      icon: TrendingDown,
      color: 'text-crypto-red',
      bgColor: 'bg-crypto-red/10',
    },
    {
      label: 'Átlag sentiment',
      value: `${avgSentiment}%`,
      icon: avgSentiment >= 50 ? TrendingUp : TrendingDown,
      color: avgSentiment >= 50 ? 'text-crypto-green' : 'text-crypto-red',
      bgColor: avgSentiment >= 50 ? 'bg-crypto-green/10' : 'bg-crypto-red/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div 
          key={stat.label}
          className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4 transition-all hover:border-primary/30"
        >
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">
                {stat.label}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

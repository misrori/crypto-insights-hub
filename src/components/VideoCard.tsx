import { useState } from 'react';
import { ExternalLink, TrendingUp, TrendingDown, Minus, User, MessageSquare } from 'lucide-react';
import { VideoSummary } from '@/types/video';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { VideoAIChat } from './VideoAIChat';

interface VideoCardProps {
  video: VideoSummary;
  language?: 'hu' | 'en';
  youtuberName?: string;
}

export const VideoCard = ({ video, language = 'hu', youtuberName }: VideoCardProps) => {
  const [showAIChat, setShowAIChat] = useState(false);

  const getSentimentIcon = () => {
    switch (video.crypto_sentiment) {
      case 'Bullish':
        return <TrendingUp className="h-4 w-4" />;
      case 'Bearish':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getSentimentColor = () => {
    switch (video.crypto_sentiment) {
      case 'Bullish':
        return 'bg-crypto-green/20 text-crypto-green border-crypto-green/30';
      case 'Bearish':
        return 'bg-crypto-red/20 text-crypto-red border-crypto-red/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const summary = language === 'hu' ? video.summary_hu : video.summary_en;
  const keyPoints = language === 'hu' ? video.key_points_hu : video.key_points_en;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <div className="group relative rounded-xl border border-border bg-card/50 backdrop-blur-sm p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 animate-slide-up">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h3 className="font-display font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {video.title}
              </h3>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{formatTime(video.published_at)}</span>
                {youtuberName && (
                  <>
                    <span className="text-border">•</span>
                    <span className="flex items-center gap-1.5 text-primary/80">
                      <User className="h-3.5 w-3.5" />
                      {youtuberName}
                    </span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 shrink-0">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowAIChat(true)}
                className="h-10 w-10 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                title={language === 'hu' ? 'Kérdezz a videóról' : 'Ask about the video'}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-10 w-10 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                title="Megnyitás YouTube-on"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Sentiment & Topics */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge 
              variant="outline" 
              className={cn('flex items-center gap-1.5 px-3 py-1', getSentimentColor())}
            >
              {getSentimentIcon()}
              {video.crypto_sentiment}
              <span className="ml-1 opacity-75">({video.sentiment_score}%)</span>
            </Badge>
            
            {video.main_topics.slice(0, 2).map((topic, index) => (
              <Badge 
                key={index} 
                variant="outline"
                className="bg-secondary/50 text-secondary-foreground border-border px-3 py-1"
              >
                {topic}
              </Badge>
            ))}
          </div>

          {/* Summary */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            {summary}
          </p>

          {/* Key Points */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {language === 'hu' ? 'Főbb pontok' : 'Key Points'}
            </h4>
            <ul className="space-y-1.5">
              {keyPoints.map((point, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-2 text-sm text-foreground/80"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* AI Chat Modal */}
      {showAIChat && (
        <VideoAIChat
          videoTitle={video.title}
          transcript={video.transcript}
          summary={summary}
          keyPoints={keyPoints}
          language={language}
          onClose={() => setShowAIChat(false)}
        />
      )}
    </>
  );
};

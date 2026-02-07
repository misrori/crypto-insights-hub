import { User, CheckCircle2 } from 'lucide-react';
import { YouTuber, YOUTUBERS } from '@/types/video';
import { cn } from '@/lib/utils';

interface YouTuberSidebarProps {
  selectedYouTuber: string | null;
  onYouTuberSelect: (youtuberId: string | null) => void;
  videoCounts?: Record<string, number>;
}

export const YouTuberSidebar = ({ 
  selectedYouTuber, 
  onYouTuberSelect,
  videoCounts = {}
}: YouTuberSidebarProps) => {
  return (
    <div className="space-y-2">
      {/* All YouTubers option */}
      <button
        onClick={() => onYouTuberSelect(null)}
        className={cn(
          'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
          selectedYouTuber === null
            ? 'bg-primary/10 border border-primary/30 text-primary'
            : 'bg-secondary/30 hover:bg-secondary/50 border border-transparent'
        )}
      >
        <div className={cn(
          'h-10 w-10 rounded-lg flex items-center justify-center',
          selectedYouTuber === null 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-muted-foreground'
        )}>
          <User className="h-5 w-5" />
        </div>
        <div className="flex-1 text-left">
          <span className="font-medium">Összes YouTuber</span>
        </div>
        {selectedYouTuber === null && (
          <CheckCircle2 className="h-5 w-5 text-primary" />
        )}
      </button>

      {/* Individual YouTubers */}
      {YOUTUBERS.map((youtuber) => {
        const videoCount = videoCounts[youtuber.id] || 0;
        const isSelected = selectedYouTuber === youtuber.id;
        
        return (
          <button
            key={youtuber.id}
            onClick={() => onYouTuberSelect(youtuber.id)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
              isSelected
                ? 'bg-primary/10 border border-primary/30 text-primary'
                : 'bg-secondary/30 hover:bg-secondary/50 border border-transparent'
            )}
          >
            <div className={cn(
              'h-10 w-10 rounded-lg flex items-center justify-center font-display font-bold text-sm',
              isSelected 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-gradient-to-br from-crypto-cyan/20 to-crypto-purple/20 text-foreground'
            )}>
              {youtuber.displayName.charAt(0)}
            </div>
            <div className="flex-1 text-left">
              <span className="font-medium block">{youtuber.displayName}</span>
              {videoCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  {videoCount} videó
                </span>
              )}
            </div>
            {isSelected && (
              <CheckCircle2 className="h-5 w-5 text-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
};

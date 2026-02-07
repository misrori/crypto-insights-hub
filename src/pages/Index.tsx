import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { YouTuberSidebar } from '@/components/YouTuberSidebar';
import { DatePicker } from '@/components/DatePicker';
import { VideoCard } from '@/components/VideoCard';
import { StatsOverview } from '@/components/StatsOverview';
import { YOUTUBERS, VideoSummary } from '@/types/video';
import { getAvailableDates, getVideosByDate, getAllVideosForDate } from '@/data/mockData';
import { Video, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Index = () => {
  const [language, setLanguage] = useState<'hu' | 'en'>('hu');
  const [selectedDate, setSelectedDate] = useState<string | null>(() => {
    const dates = getAvailableDates();
    return dates.length > 0 ? dates[0] : null;
  });
  const [selectedYouTuber, setSelectedYouTuber] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const availableDates = useMemo(() => getAvailableDates(), []);

  const videos = useMemo(() => {
    if (!selectedDate) return [];
    
    const videosByYouTuber = getVideosByDate(selectedDate);
    
    if (selectedYouTuber) {
      return videosByYouTuber[selectedYouTuber] || [];
    }
    
    return Object.values(videosByYouTuber).flat();
  }, [selectedDate, selectedYouTuber]);

  const videoCounts = useMemo(() => {
    if (!selectedDate) return {};
    
    const videosByYouTuber = getVideosByDate(selectedDate);
    const counts: Record<string, number> = {};
    
    YOUTUBERS.forEach(yt => {
      counts[yt.id] = (videosByYouTuber[yt.id] || []).length;
    });
    
    return counts;
  }, [selectedDate]);

  const getYouTuberName = (url: string, videoTitle: string) => {
    // Find which YouTuber this video belongs to
    for (const yt of YOUTUBERS) {
      const videosByDate = getVideosByDate(selectedDate || '');
      const ytVideos = videosByDate[yt.id] || [];
      if (ytVideos.some(v => v.url === url)) {
        return yt.displayName;
      }
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <Header language={language} onLanguageChange={setLanguage} />

      <div className="flex">
        {/* Sidebar */}
        <aside 
          className={cn(
            'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card/50 backdrop-blur-xl border-r border-border transition-all duration-300 z-40',
            sidebarOpen ? 'w-72' : 'w-0'
          )}
        >
          {sidebarOpen && (
            <div className="p-4 h-full overflow-y-auto">
              <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">YouTuberek</span>
              </div>
              <YouTuberSidebar
                selectedYouTuber={selectedYouTuber}
                onYouTuberSelect={setSelectedYouTuber}
                videoCounts={videoCounts}
              />
            </div>
          )}
        </aside>

        {/* Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={cn(
            'fixed top-20 z-50 h-8 w-8 rounded-r-lg bg-card border border-l-0 border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-300',
            sidebarOpen ? 'left-72' : 'left-0'
          )}
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        {/* Main Content */}
        <main 
          className={cn(
            'flex-1 transition-all duration-300',
            sidebarOpen ? 'ml-72' : 'ml-0'
          )}
        >
          <div className="container mx-auto px-4 py-6 max-w-6xl">
            {/* Date Picker */}
            <div className="mb-6">
              <DatePicker
                dates={availableDates}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </div>

            {/* Stats Overview */}
            <div className="mb-8">
              <StatsOverview videos={videos} />
            </div>

            {/* Content Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  {selectedYouTuber 
                    ? YOUTUBERS.find(yt => yt.id === selectedYouTuber)?.displayName 
                    : 'Összes videó'
                  }
                </h2>
                <p className="text-muted-foreground text-sm">
                  {videos.length} videó {selectedDate && `• ${new Date(selectedDate).toLocaleDateString('hu-HU', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}`}
                </p>
              </div>
            </div>

            {/* Video Grid */}
            {videos.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {videos.map((video, index) => (
                  <VideoCard 
                    key={`${video.video_id}-${index}`} 
                    video={video} 
                    language={language}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Video className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  Nincs videó
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  {language === 'hu' 
                    ? 'Erre a napra vagy YouTuberre nincs elérhető videó összefoglaló.'
                    : 'No video summaries available for this date or YouTuber.'
                  }
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;

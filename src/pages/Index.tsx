import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { YouTuberSidebar } from '@/components/YouTuberSidebar';
import { DaySection } from '@/components/DaySection';
import { SentimentChart } from '@/components/SentimentChart';
import { VideoSummary } from '@/types/video';
import { useVideoData } from '@/hooks/useVideoData';
import { Filter, ChevronLeft, ChevronRight, BarChart3, RefreshCw, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const [language, setLanguage] = useState<'hu' | 'en'>('hu');
  const [selectedYouTuber, setSelectedYouTuber] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showChart, setShowChart] = useState(true);

  const { videos, availableDates, isLoading, error, refetch, youtubers } = useVideoData(30);

  const videosByDay = useMemo(() => {
    const result: Record<string, Array<VideoSummary & { _youtuberName: string }>> = {};
    
    availableDates.forEach(date => {
      const videosByYouTuber = videos[date] || {};
      const dayVideos: Array<VideoSummary & { _youtuberName: string }> = [];
      
      Object.entries(videosByYouTuber).forEach(([ytId, vids]) => {
        if (selectedYouTuber && ytId !== selectedYouTuber) return;
        
        const youtuber = youtubers.find(yt => yt.id === ytId);
        vids.forEach(v => {
          dayVideos.push({
            ...v,
            _youtuberName: youtuber?.displayName || ytId
          });
        });
      });
      
      if (dayVideos.length > 0) {
        // Sort by published time (newest first)
        dayVideos.sort((a, b) => 
          new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
        );
        result[date] = dayVideos;
      }
    });
    
    return result;
  }, [availableDates, selectedYouTuber, videos, youtubers]);

  const videoCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    youtubers.forEach(yt => {
      let total = 0;
      availableDates.forEach(date => {
        const videosByYouTuber = videos[date] || {};
        total += (videosByYouTuber[yt.id] || []).length;
      });
      counts[yt.id] = total;
    });
    
    return counts;
  }, [availableDates, videos, youtubers]);

  const totalVideos = useMemo(() => {
    return Object.values(videosByDay).reduce((sum, vids) => sum + vids.length, 0);
  }, [videosByDay]);

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
                youtubers={youtubers}
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
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground">
                  {selectedYouTuber 
                    ? youtubers.find(yt => yt.id === selectedYouTuber)?.displayName 
                    : language === 'hu' ? 'Összes videó' : 'All Videos'
                  }
                </h1>
                <p className="text-muted-foreground">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {language === 'hu' ? 'Adatok betöltése...' : 'Loading data...'}
                    </span>
                  ) : (
                    <>
                      {totalVideos} {language === 'hu' ? 'videó' : 'videos'} • {Object.keys(videosByDay).length} {language === 'hu' ? 'nap' : 'days'}
                    </>
                  )}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={refetch}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-secondary border-border text-muted-foreground hover:text-foreground transition-all disabled:opacity-50"
                  title={language === 'hu' ? 'Frissítés' : 'Refresh'}
                >
                  <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                </button>
                
                <button
                  onClick={() => setShowChart(!showChart)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg border transition-all',
                    showChart 
                      ? 'bg-primary/10 border-primary/30 text-primary' 
                      : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
                  )}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {language === 'hu' ? 'Grafikon' : 'Chart'}
                  </span>
                </button>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive">
                <p className="font-medium">{language === 'hu' ? 'Hiba történt' : 'Error occurred'}</p>
                <p className="text-sm opacity-80">{error}</p>
              </div>
            )}

            {/* Sentiment Chart */}
            {showChart && !isLoading && Object.keys(videos).length > 0 && (
              <div className="mb-8">
                <SentimentChart data={videos} language={language} youtubers={youtubers} />
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">
                  {language === 'hu' ? 'Adatok betöltése a GitHub-ról...' : 'Loading data from GitHub...'}
                </p>
              </div>
            )}

            {/* Daily Sections */}
            {!isLoading && (
              <div className="space-y-0">
                {Object.entries(videosByDay).map(([date, vids], index) => (
                  <DaySection
                    key={date}
                    date={date}
                    videos={vids}
                    language={language}
                    isFirst={index === 0}
                  />
                ))}
              </div>
            )}

            {!isLoading && Object.keys(videosByDay).length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Filter className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {language === 'hu' ? 'Nincs videó' : 'No videos'}
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  {language === 'hu' 
                    ? 'Erre a YouTuberre nincs elérhető videó összefoglaló.'
                    : 'No video summaries available for this YouTuber.'
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

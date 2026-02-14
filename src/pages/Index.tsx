import { useState, useMemo, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { DaySection } from '@/components/DaySection';
import { SentimentChart } from '@/components/SentimentChart';
import { YOUTUBERS, VideoSummary, YouTuber } from '@/types/video';
import { fetchDateFolders, fetchVideosForDate } from '@/lib/githubService';
import { Filter, BarChart3, Loader2, User } from 'lucide-react';
import { cn, decodeHtmlEntities } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

const INITIAL_DAYS = 5;

const Index = () => {
  const [language, setLanguage] = useState<'hu' | 'en'>('hu');
  const [selectedYouTubers, setSelectedYouTubers] = useState<string[]>([]);
  const [showChart, setShowChart] = useState(true);

  // State for loaded videos and dates
  const [allVideos, setAllVideos] = useState<VideoSummary[]>([]);
  const [visibleDaysCount, setVisibleDaysCount] = useState(INITIAL_DAYS);
  const [isFetchingDay, setIsFetchingDay] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);

  // 1. Fetch available date folders
  const { data: dateFolders = [], isLoading: isLoadingDates } = useQuery({
    queryKey: ['dateFolders'],
    queryFn: fetchDateFolders,
  });

  // 2. Fetch videos for date folders as we expand
  useEffect(() => {
    const fetchNextDays = async () => {
      if (dateFolders.length === 0 || isFetchingDay) return;

      const currentLoadedDates = Array.from(new Set(allVideos.map(v => v.sort_data)));
      const targetCount = Math.min(visibleDaysCount, dateFolders.length);

      const missingDates = dateFolders
        .slice(0, targetCount)
        .filter(date => !currentLoadedDates.includes(date));

      if (missingDates.length > 0) {
        setIsFetchingDay(true);
        const newVideoBatches = await Promise.all(
          missingDates.map(date => fetchVideosForDate(date))
        );
        const newVideos = newVideoBatches.flat();
        setAllVideos(prev => {
          // Merge and avoid duplicates
          const existingIds = new Set(prev.map(v => v.video_id));
          const filteredNew = newVideos.filter(v => !existingIds.has(v.video_id));
          return [...prev, ...filteredNew].sort((a, b) =>
            new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
          );
        });
        setIsFetchingDay(false);
      }
    };

    fetchNextDays();
  }, [dateFolders, visibleDaysCount, allVideos, isFetchingDay]);

  // 3. Intersection Observer for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingDay && visibleDaysCount < dateFolders.length) {
          setVisibleDaysCount(prev => prev + 3); // Load 3 more days each time
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [dateFolders.length, isFetchingDay, visibleDaysCount]);

  // Dynamic YouTubers derived from CURRENTLY loaded videos
  const dynamicYouTubers = useMemo(() => {
    const map = new Map<string, YouTuber>();
    allVideos.forEach(v => {
      const id = v.channel_handle;
      if (!map.has(id)) {
        const hardcoded = YOUTUBERS.find(yt => yt.id === id);
        map.set(id, {
          id,
          name: id,
          displayName: decodeHtmlEntities(hardcoded?.displayName || v.channel_name || id),
          avatar: hardcoded?.avatar
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [allVideos]);

  const loadedDates = useMemo(() => {
    const dates = new Set(allVideos.map(v => v.sort_data));
    return Array.from(dates).sort((a, b) => b.localeCompare(a));
  }, [allVideos]);

  const videosByDay = useMemo(() => {
    const result: Record<string, Array<VideoSummary & { _youtuberName: string }>> = {};

    loadedDates.forEach(date => {
      const dayVideos: Array<VideoSummary & { _youtuberName: string }> = [];

      allVideos.filter(v => v.sort_data === date).forEach(v => {
        if (selectedYouTubers.length > 0 && !selectedYouTubers.includes(v.channel_handle)) return;

        const youtuber = dynamicYouTubers.find(yt => yt.id === v.channel_handle);
        dayVideos.push({
          ...v,
          _youtuberName: youtuber?.displayName || v.channel_name || ''
        });
      });

      if (dayVideos.length > 0) {
        result[date] = dayVideos;
      }
    });

    return result;
  }, [loadedDates, allVideos, selectedYouTubers, dynamicYouTubers]);

  const totalVideosShown = useMemo(() => {
    return Object.values(videosByDay).reduce((sum, videos) => sum + videos.length, 0);
  }, [videosByDay]);

  const isLoadingInitial = isLoadingDates || (allVideos.length === 0 && isFetchingDay);

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />

      <Header language={language} onLanguageChange={setLanguage} />

      <main className="flex-1 transition-all duration-300">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Page Header */}
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground">
                  {selectedYouTubers.length === 1
                    ? dynamicYouTubers.find(yt => yt.id === selectedYouTubers[0])?.displayName
                    : language === 'hu' ? 'Kriptó Hírek' : 'Crypto Insights'
                  }
                </h1>
                <p className="text-muted-foreground">
                  {totalVideosShown} {language === 'hu' ? 'videó megjelenítve' : 'videos displayed'} • {Object.keys(videosByDay).length} {language === 'hu' ? 'nap' : 'days'}
                </p>
              </div>

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

            {/* Horizontal YouTuber Filter Bar */}
            {!isLoadingInitial && dynamicYouTubers.length > 0 && (
              <div className="flex flex-wrap gap-2 pb-2">
                <button
                  onClick={() => setSelectedYouTubers([])}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm font-medium',
                    selectedYouTubers.length === 0
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-secondary/50 text-muted-foreground border-border hover:border-primary/50'
                  )}
                >
                  <User className="h-4 w-4" />
                  {language === 'hu' ? 'Összes' : 'All'}
                </button>
                {dynamicYouTubers.map(yt => {
                  const isSelected = selectedYouTubers.includes(yt.id);
                  return (
                    <button
                      key={yt.id}
                      onClick={() => {
                        setSelectedYouTubers(prev =>
                          isSelected
                            ? prev.filter(id => id !== yt.id)
                            : [...prev, yt.id]
                        );
                      }}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm font-medium',
                        isSelected
                          ? 'bg-primary/20 text-primary border-primary/50'
                          : 'bg-secondary/50 text-muted-foreground border-border hover:border-primary/50'
                      )}
                    >
                      <div className={cn(
                        'h-4 w-4 rounded-full flex items-center justify-center text-[10px]',
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-primary/20'
                      )}>
                        {yt.displayName.charAt(0)}
                      </div>
                      {yt.displayName}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sentiment Chart */}
          {isLoadingInitial ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : showChart && (
            <div className="mb-8">
              <SentimentChart
                data={allVideos}
                language={language}
                youtubers={dynamicYouTubers}
                selectedYouTubers={selectedYouTubers.length > 0 ? selectedYouTubers : dynamicYouTubers.map(yt => yt.id)}
              />
            </div>
          )}

          {/* Daily Sections */}
          {!isLoadingInitial && (
            <div className="space-y-0">
              {Object.entries(videosByDay).map(([date, videos], index) => (
                <DaySection
                  key={date}
                  date={date}
                  videos={videos}
                  language={language}
                  isFirst={index === 0}
                />
              ))}
            </div>
          )}

          {/* Loading more indicator */}
          {!isLoadingInitial && visibleDaysCount < dateFolders.length && (
            <div ref={observerTarget} className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 text-primary/50 animate-spin" />
            </div>
          )}

          {!isLoadingInitial && Object.keys(videosByDay).length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Filter className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                {language === 'hu' ? 'Nincs videó' : 'No videos'}
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                {language === 'hu'
                  ? 'Erre a választott szűrőre nincs elérhető videó.'
                  : 'No video summaries available for the selected filter.'
                }
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;

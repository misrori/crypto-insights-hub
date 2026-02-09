import { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { VideoSummary } from '@/types/video';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Checkbox } from '@/components/ui/checkbox';
import { TrendingUp } from 'lucide-react';

interface YouTuberInfo {
  id: string;
  displayName: string;
}

interface SentimentChartProps {
  data: Record<string, Record<string, VideoSummary[]>>;
  language: 'hu' | 'en';
  youtubers: YouTuberInfo[];
}

const COLORS = [
  'hsl(var(--crypto-green))',
  'hsl(var(--crypto-cyan))',
  'hsl(var(--primary))',
  '#f59e0b',
  '#ec4899',
  '#8b5cf6',
  '#06b6d4',
  '#10b981',
  '#f97316',
  '#6366f1',
];

export const SentimentChart = ({ data, language, youtubers }: SentimentChartProps) => {
  const [selectedYouTubers, setSelectedYouTubers] = useState<string[]>(
    youtubers.map(yt => yt.id)
  );

  // Update selection when youtubers change
  useMemo(() => {
    setSelectedYouTubers(prev => {
      const validIds = youtubers.map(yt => yt.id);
      const filtered = prev.filter(id => validIds.includes(id));
      return filtered.length > 0 ? filtered : validIds;
    });
  }, [youtubers]);

  const chartData = useMemo(() => {
    const dates = Object.keys(data).sort((a, b) => a.localeCompare(b));
    
    return dates.map(date => {
      const dayData: Record<string, number | string> = { 
        date,
        formattedDate: new Date(date).toLocaleDateString(language === 'hu' ? 'hu-HU' : 'en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      };
      
      let totalScore = 0;
      let count = 0;
      
      youtubers.forEach(yt => {
        const videos = data[date]?.[yt.id] || [];
        if (videos.length > 0) {
          const avgScore = videos.reduce((sum, v) => sum + v.sentiment_score, 0) / videos.length;
          dayData[yt.id] = Math.round(avgScore);
          if (selectedYouTubers.includes(yt.id)) {
            totalScore += avgScore;
            count++;
          }
        }
      });
      
      dayData.average = count > 0 ? Math.round(totalScore / count) : 0;
      
      return dayData;
    });
  }, [data, selectedYouTubers, language, youtubers]);

  const toggleYouTuber = (id: string) => {
    setSelectedYouTubers(prev => 
      prev.includes(id) 
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const chartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {
      average: {
        label: language === 'hu' ? 'Átlag' : 'Average',
        color: 'hsl(var(--foreground))',
      },
    };
    
    youtubers.forEach((yt, i) => {
      config[yt.id] = {
        label: yt.displayName,
        color: COLORS[i % COLORS.length],
      };
    });
    
    return config;
  }, [language, youtubers]);

  if (youtubers.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">
            {language === 'hu' ? 'Napi Sentiment Grafikon' : 'Daily Sentiment Chart'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {language === 'hu' ? 'YouTuberek sentiment átlaga naponta' : 'YouTubers sentiment average by day'}
          </p>
        </div>
      </div>

      {/* YouTuber Filter */}
      <div className="flex flex-wrap gap-3 mb-6 pb-4 border-b border-border/50">
        {youtubers.map((yt, i) => (
          <label 
            key={yt.id}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <Checkbox
              checked={selectedYouTubers.includes(yt.id)}
              onCheckedChange={() => toggleYouTuber(yt.id)}
              className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <div 
              className="h-3 w-3 rounded-full" 
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              {yt.displayName}
            </span>
          </label>
        ))}
      </div>

      {/* Chart */}
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="formattedDate" 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            domain={[0, 100]} 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          
          {/* Average Line */}
          <Line
            type="monotone"
            dataKey="average"
            stroke="hsl(var(--foreground))"
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--foreground))', strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            name={language === 'hu' ? 'Átlag' : 'Average'}
          />
          
          {/* YouTuber Lines */}
          {youtubers.map((yt, i) => (
            selectedYouTubers.includes(yt.id) && (
              <Line
                key={yt.id}
                type="monotone"
                dataKey={yt.id}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={2}
                dot={{ fill: COLORS[i % COLORS.length], strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
                name={yt.displayName}
                connectNulls
              />
            )
          ))}
        </LineChart>
      </ChartContainer>
    </div>
  );
};

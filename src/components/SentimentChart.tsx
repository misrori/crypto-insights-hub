import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { YouTuber, VideoSummary } from '@/types/video';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';

interface SentimentChartProps {
  data: VideoSummary[];
  language: 'hu' | 'en';
  youtubers: YouTuber[];
  selectedYouTubers: string[];
}

const COLORS = [
  'hsl(var(--crypto-green))',
  'hsl(var(--crypto-cyan))',
  'hsl(var(--primary))',
  '#f59e0b',
  '#ec4899',
  '#8b5cf6',
];

export const SentimentChart = ({ data, language, youtubers, selectedYouTubers }: SentimentChartProps) => {

  const chartData = useMemo(() => {
    const groupedData: Record<string, VideoSummary[]> = {};
    data.forEach(v => {
      if (!groupedData[v.sort_data]) groupedData[v.sort_data] = [];
      groupedData[v.sort_data].push(v);
    });

    const dates = Object.keys(groupedData).sort((a, b) => a.localeCompare(b));

    return dates.map(date => {
      const dayVideos = groupedData[date];
      const dayData: Record<string, number | string> = {
        date,
        formattedDate: new Date(date).toLocaleDateString(language === 'hu' ? 'hu-HU' : 'en-US', {
          month: 'short',
          day: 'numeric'
        })
      };

      let totalDayScore = 0;
      let countDay = 0;

      youtubers.forEach(yt => {
        const ytVideos = dayVideos.filter(v => v.channel_handle === yt.id);
        if (ytVideos.length > 0) {
          const avgScore = ytVideos.reduce((sum, v) => sum + v.sentiment_score, 0) / ytVideos.length;
          dayData[yt.id] = Math.round(avgScore);
          if (selectedYouTubers.includes(yt.id)) {
            totalDayScore += avgScore;
            countDay++;
          }
        }
      });

      dayData.average = countDay > 0 ? Math.round(totalDayScore / countDay) : 0;

      return dayData;
    });
  }, [data, selectedYouTubers, language, youtubers]);

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

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { StudySession } from '@/lib/types';
import { Flame } from 'lucide-react';

interface StudyHeatmapProps {
  sessions: StudySession[];
}

const StudyHeatmap = ({ sessions }: StudyHeatmapProps) => {
  const { grid, maxMinutes } = useMemo(() => {
    const today = new Date();
    const dayMap = new Map<string, number>();

    sessions.forEach(s => {
      dayMap.set(s.session_date, (dayMap.get(s.session_date) || 0) + s.duration_minutes);
    });

    const days: { date: string; minutes: number; dayOfWeek: number }[] = [];
    for (let i = 119; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({ date: dateStr, minutes: dayMap.get(dateStr) || 0, dayOfWeek: d.getDay() });
    }

    const max = Math.max(1, ...days.map(d => d.minutes));
    return { grid: days, maxMinutes: max };
  }, [sessions]);

  const getIntensity = (minutes: number): string => {
    if (minutes === 0) return 'bg-muted';
    const ratio = minutes / maxMinutes;
    if (ratio < 0.25) return 'bg-primary/20';
    if (ratio < 0.5) return 'bg-primary/40';
    if (ratio < 0.75) return 'bg-primary/70';
    return 'bg-primary';
  };

  // Group into weeks (columns of 7)
  const weeks: typeof grid[] = [];
  let currentWeek: typeof grid = [];
  // Pad the start to align with Sunday
  const firstDayOfWeek = grid[0]?.dayOfWeek || 0;
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push({ date: '', minutes: 0, dayOfWeek: i });
  }
  grid.forEach(day => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const totalDaysStudied = grid.filter(d => d.minutes > 0).length;

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <Flame className="h-5 w-5 text-primary" />
          Study Activity
          <span className="text-xs font-normal text-muted-foreground ml-auto">{totalDaysStudied} days active (last 120 days)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-[3px] overflow-x-auto pb-2">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                day.date ? (
                  <Tooltip key={di}>
                    <TooltipTrigger asChild>
                      <div className={`w-3 h-3 rounded-sm ${getIntensity(day.minutes)} transition-colors cursor-default`} />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      <p className="font-medium">{new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                      <p>{day.minutes > 0 ? `${day.minutes} min studied` : 'No activity'}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : <div key={di} className="w-3 h-3" />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-[2px]">
            {['bg-muted', 'bg-primary/20', 'bg-primary/40', 'bg-primary/70', 'bg-primary'].map(c => (
              <div key={c} className={`w-3 h-3 rounded-sm ${c}`} />
            ))}
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyHeatmap;

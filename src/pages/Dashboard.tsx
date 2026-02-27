import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Profile, LearningResource, StudySession, RoadmapStage } from '@/lib/types';
import { getResources, getSessions, getProgress, getStreak, getWeeklyMinutes, getConsistencyScore, getRoadmapStages } from '@/lib/storage';
import { getDailyQuote } from '@/lib/quotes';
import { Flame, Target, BookOpen, CheckCircle2, Quote, Clock, BarChart3, TrendingUp, Map } from 'lucide-react';

interface DashboardProps {
  userId: string;
  profile: Profile;
}

const Dashboard = ({ userId, profile }: DashboardProps) => {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [roadmapStages, setRoadmapStages] = useState<RoadmapStage[]>([]);

  useEffect(() => {
    getResources(userId).then(setResources);
    getSessions(userId).then(setSessions);
    getRoadmapStages(userId).then(setRoadmapStages);
  }, [userId]);

  const progress = getProgress(resources);
  const streak = getStreak(sessions);
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration_minutes, 0);
  const weeklyMinutes = getWeeklyMinutes(sessions);
  const completed = resources.filter(r => r.completed).length;
  const consistencyScore = getConsistencyScore(sessions);
  const roadmapProgress = roadmapStages.length > 0
    ? Math.round((roadmapStages.filter(s => s.completed).length / roadmapStages.length) * 100)
    : 0;
  const quote = getDailyQuote();

  const stats = [
    { icon: Target, value: `${progress}%`, label: 'Completion', gradient: 'gradient-primary' },
    { icon: Flame, value: streak, label: 'Day streak', gradient: 'gradient-secondary' },
    { icon: Clock, value: `${weeklyMinutes}m`, label: 'This week', gradient: 'gradient-accent' },
    { icon: BarChart3, value: `${totalMinutes}m`, label: 'Total time', gradient: 'gradient-primary' },
    { icon: BookOpen, value: resources.length, label: 'Resources', gradient: 'gradient-secondary' },
    { icon: CheckCircle2, value: completed, label: 'Completed', color: 'bg-success' },
    { icon: TrendingUp, value: `${consistencyScore}%`, label: 'Consistency', gradient: 'gradient-accent' },
    { icon: Map, value: `${roadmapProgress}%`, label: 'Roadmap', gradient: 'gradient-primary' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display">
          Welcome back{profile.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''} 👋
        </h1>
        {profile.learning_goal && (
          <p className="text-muted-foreground mt-1 text-lg">
            🎯 <span className="font-medium text-foreground">{profile.learning_goal}</span>
          </p>
        )}
      </div>

      {/* Motivational Quote */}
      <Card className="border-0 gradient-hero text-primary-foreground overflow-hidden">
        <CardContent className="py-6">
          <div className="flex gap-3 items-start">
            <Quote className="h-8 w-8 shrink-0 opacity-60" />
            <div>
              <p className="text-lg font-medium italic leading-relaxed">"{quote.text}"</p>
              <p className="text-sm mt-2 opacity-80">— {quote.author}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <Card key={i} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-4 pb-3.5">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${stat.gradient || stat.color}`}>
                  <stat.icon className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-xl font-bold font-display">{stat.value}</p>
                  <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overall Progress */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-display">Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">
            {completed} of {resources.length} resources completed · {totalMinutes} minutes studied
          </p>
        </CardContent>
      </Card>

      {resources.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="p-3 rounded-2xl gradient-secondary inline-flex mb-4">
              <BookOpen className="h-8 w-8 text-secondary-foreground" />
            </div>
            <p className="font-semibold text-lg">No resources yet</p>
            <p className="text-sm text-muted-foreground mt-1">Head to Resources or Explore to add learning materials.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;

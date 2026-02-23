import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Profile, LearningResource, StudySession } from '@/lib/types';
import { getResources, getSessions, getProgress, getStreak } from '@/lib/storage';
import { Flame, Target, BookOpen, CheckCircle2 } from 'lucide-react';

interface DashboardProps {
  userId: string;
  profile: Profile;
}

const Dashboard = ({ userId, profile }: DashboardProps) => {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);

  useEffect(() => {
    getResources(userId).then(setResources);
    getSessions(userId).then(setSessions);
  }, [userId]);

  const progress = getProgress(resources);
  const streak = getStreak(sessions);
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration_minutes, 0);
  const completed = resources.filter(r => r.completed).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Dashboard</h1>
        {profile.learning_goal && (
          <p className="text-muted-foreground mt-1">
            Goal: <span className="font-medium text-foreground">{profile.learning_goal}</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">{progress}%</p>
                <p className="text-xs text-muted-foreground">Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Flame className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">{streak}</p>
                <p className="text-xs text-muted-foreground">Day streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <BookOpen className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">{resources.length}</p>
                <p className="text-xs text-muted-foreground">Resources</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">{completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
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
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium">No resources yet</p>
            <p className="text-sm text-muted-foreground">Head to the Resources page to add your first learning material.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;

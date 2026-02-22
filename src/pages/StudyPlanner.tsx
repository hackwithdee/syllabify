import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from '@/lib/types';
import { getSessions, logSession, getResources } from '@/lib/storage';
import { Clock, Plus, CalendarDays } from 'lucide-react';

interface StudyPlannerProps {
  user: User;
}

const StudyPlanner = ({ user }: StudyPlannerProps) => {
  const [sessions, setSessions] = useState(() => getSessions(user.id));
  const [duration, setDuration] = useState(user.studyTimeMinutes.toString());
  const [showForm, setShowForm] = useState(false);

  const refresh = () => setSessions(getSessions(user.id));

  const handleLog = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(duration);
    if (isNaN(mins) || mins <= 0) return;
    logSession(user.id, mins);
    setShowForm(false);
    refresh();
  };

  const today = new Date().toISOString().split('T')[0];
  const todayMinutes = sessions.filter(s => s.date === today).reduce((sum, s) => sum + s.durationMinutes, 0);
  const goalPercent = Math.min(100, Math.round((todayMinutes / user.studyTimeMinutes) * 100));

  const recentDates = [...new Set(sessions.map(s => s.date))].sort().reverse().slice(0, 7);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display">Study Planner</h1>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Log Session
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display">Today's Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20">
              <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                <path d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                <path d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeDasharray={`${goalPercent}, 100`} />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">{goalPercent}%</span>
            </div>
            <div>
              <p className="font-medium">{todayMinutes} / {user.studyTimeMinutes} min</p>
              <p className="text-sm text-muted-foreground">
                {goalPercent >= 100 ? '🎉 Goal reached!' : `${user.studyTimeMinutes - todayMinutes} min remaining`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleLog} className="flex items-end gap-3">
              <div className="flex-1 space-y-2">
                <Label>Duration (minutes)</Label>
                <Input type="number" value={duration} onChange={e => setDuration(e.target.value)} min="1" required />
              </div>
              <Button type="submit">Log</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentDates.length === 0 ? (
            <p className="text-sm text-muted-foreground">No study sessions logged yet.</p>
          ) : (
            <div className="space-y-2">
              {recentDates.map(date => {
                const daySessions = sessions.filter(s => s.date === date);
                const totalMins = daySessions.reduce((sum, s) => sum + s.durationMinutes, 0);
                return (
                  <div key={date} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {totalMins} min
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyPlanner;

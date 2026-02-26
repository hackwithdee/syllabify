import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StudySession, LearningResource } from '@/lib/types';
import { getSessions, logSession, getResources } from '@/lib/storage';
import { Plus, CalendarDays, Bell, BookOpen } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StudyPlannerProps {
  userId: string;
  studyTimeMinutes: number;
}

const StudyPlanner = ({ userId, studyTimeMinutes }: StudyPlannerProps) => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [duration, setDuration] = useState(studyTimeMinutes.toString());
  const [selectedResource, setSelectedResource] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [showForm, setShowForm] = useState(false);
  const [reminderSet, setReminderSet] = useState(false);

  const refresh = () => {
    getSessions(userId).then(setSessions);
    getResources(userId).then(setResources);
  };
  useEffect(() => { refresh(); }, [userId]);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(duration);
    if (isNaN(mins) || mins <= 0) return;
    await logSession(userId, mins, selectedResource || undefined);
    setShowForm(false);
    setReminderSet(true);
    setTimeout(() => setReminderSet(false), 3000);
    refresh();
  };

  const today = new Date().toISOString().split('T')[0];
  const todayMinutes = sessions.filter(s => s.session_date === today).reduce((sum, s) => sum + s.duration_minutes, 0);
  const goalPercent = Math.min(100, Math.round((todayMinutes / studyTimeMinutes) * 100));

  // Group upcoming sessions by date
  const upcomingSessions = sessions
    .filter(s => s.session_date >= today)
    .sort((a, b) => a.session_date.localeCompare(b.session_date))
    .slice(0, 5);

  const incompleteResources = resources.filter(r => !r.completed);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display">Study Planner</h1>
          <p className="text-muted-foreground mt-1">Schedule your study sessions</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gradient-primary border-0">
          <Plus className="h-4 w-4 mr-1" /> Schedule
        </Button>
      </div>

      {/* Today's goal */}
      <Card className="border-0 shadow-md overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-display">Today's Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-5">
            <div className="relative h-20 w-20 shrink-0">
              <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                <path d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                <path d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeDasharray={`${goalPercent}, 100`} strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold font-display">{goalPercent}%</span>
            </div>
            <div>
              <p className="font-semibold text-lg">{todayMinutes} / {studyTimeMinutes} min</p>
              <p className="text-sm text-muted-foreground">
                {goalPercent >= 100 ? '🎉 Goal reached!' : `${studyTimeMinutes - todayMinutes} min remaining`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule form */}
      {showForm && (
        <Card className="border-0 shadow-md">
          <CardHeader><CardTitle className="text-lg font-display">Schedule a Session</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSchedule} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} min={today} className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input type="time" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} className="h-11" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Input type="number" value={duration} onChange={e => setDuration(e.target.value)} min="5" required className="h-11" />
              </div>
              {incompleteResources.length > 0 && (
                <div className="space-y-2">
                  <Label>Resource (optional)</Label>
                  <Select value={selectedResource} onValueChange={setSelectedResource}>
                    <SelectTrigger className="h-11"><SelectValue placeholder="Select a resource to study" /></SelectTrigger>
                    <SelectContent>
                      {incompleteResources.map(r => (
                        <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex gap-2">
                <Button type="submit" className="gradient-primary border-0">
                  <CalendarDays className="h-4 w-4 mr-1" /> Schedule Session
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {reminderSet && (
        <Card className="border-0 bg-success/10 border-success/20">
          <CardContent className="py-4 flex items-center gap-3">
            <Bell className="h-5 w-5 text-success" />
            <p className="text-sm font-medium text-success">Session scheduled! 🎉</p>
          </CardContent>
        </Card>
      )}

      {/* Upcoming sessions */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-display">Upcoming Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingSessions.length === 0 ? (
            <div className="text-center py-6">
              <CalendarDays className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No sessions scheduled. Hit "Schedule" to plan your study time.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingSessions.map(session => {
                const resource = resources.find(r => r.id === session.resource_id);
                return (
                  <div key={session.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg gradient-primary">
                        <CalendarDays className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {new Date(session.session_date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                        {resource && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <BookOpen className="h-3 w-3" /> {resource.title}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-primary">{session.duration_minutes} min</span>
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

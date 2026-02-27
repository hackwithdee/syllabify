import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LearningResource } from '@/lib/types';
import { getSessions, logSession, getResources } from '@/lib/storage';
import { useStudyTimer } from '@/hooks/useStudyTimer';
import { Plus, CalendarDays, Bell, BookOpen, Play, Pause, Square, Timer } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface StudyPlannerProps {
  userId: string;
  studyTimeMinutes: number;
}

const StudyPlanner = ({ userId, studyTimeMinutes }: StudyPlannerProps) => {
  const { toast } = useToast();
  const timer = useStudyTimer();
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [timerResource, setTimerResource] = useState<string>('');
  const [duration, setDuration] = useState(studyTimeMinutes.toString());
  const [selectedResource, setSelectedResource] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [showForm, setShowForm] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);

  const refresh = () => {
    getResources(userId).then(setResources);
    getSessions(userId).then(setSessions);
  };
  useEffect(() => { refresh(); }, [userId]);

  const handleStopTimer = async () => {
    const mins = timer.stop();
    if (mins > 0) {
      await logSession(userId, mins, timerResource || undefined);
      toast({ title: 'Session logged!', description: `${mins} minute${mins > 1 ? 's' : ''} recorded.` });
      refresh();
    }
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(duration);
    if (isNaN(mins) || mins <= 0) return;
    await logSession(userId, mins, selectedResource || undefined);
    setShowForm(false);
    toast({ title: 'Session scheduled!', description: `${mins} min session added.` });
    refresh();
  };

  const today = new Date().toISOString().split('T')[0];
  const upcomingSessions = sessions
    .filter(s => s.session_date >= today)
    .sort((a: any, b: any) => a.session_date.localeCompare(b.session_date))
    .slice(0, 5);

  const incompleteResources = resources.filter(r => !r.completed);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display">Study Planner</h1>
          <p className="text-muted-foreground mt-1">Track and schedule your study time</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gradient-primary border-0">
          <Plus className="h-4 w-4 mr-1" /> Schedule
        </Button>
      </div>

      {/* Study Timer */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="gradient-hero p-1" />
        <CardHeader><CardTitle className="text-lg font-display flex items-center gap-2"><Timer className="h-5 w-5 text-primary" /> Study Timer</CardTitle></CardHeader>
        <CardContent>
          <div className="text-center">
            <p className={`text-5xl font-bold font-display mb-4 ${timer.isRunning ? 'text-primary animate-pulse-soft' : 'text-foreground'}`}>
              {timer.display}
            </p>
            {incompleteResources.length > 0 && !timer.isRunning && timer.elapsedSeconds === 0 && (
              <div className="mb-4 max-w-xs mx-auto">
                <Select value={timerResource} onValueChange={setTimerResource}>
                  <SelectTrigger className="h-10"><SelectValue placeholder="What are you studying?" /></SelectTrigger>
                  <SelectContent>
                    {incompleteResources.map(r => (
                      <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex justify-center gap-3">
              {!timer.isRunning && timer.elapsedSeconds === 0 && (
                <Button onClick={timer.start} className="gradient-primary border-0 h-12 px-8 text-base">
                  <Play className="h-5 w-5 mr-2" /> Start
                </Button>
              )}
              {timer.isRunning && (
                <>
                  <Button onClick={timer.pause} variant="outline" className="h-12 px-6">
                    <Pause className="h-5 w-5 mr-2" /> Pause
                  </Button>
                  <Button onClick={handleStopTimer} variant="destructive" className="h-12 px-6">
                    <Square className="h-5 w-5 mr-2" /> Stop & Log
                  </Button>
                </>
              )}
              {!timer.isRunning && timer.elapsedSeconds > 0 && (
                <>
                  <Button onClick={timer.start} className="gradient-primary border-0 h-12 px-6">
                    <Play className="h-5 w-5 mr-2" /> Resume
                  </Button>
                  <Button onClick={handleStopTimer} variant="destructive" className="h-12 px-6">
                    <Square className="h-5 w-5 mr-2" /> Stop & Log
                  </Button>
                </>
              )}
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
                    <SelectTrigger className="h-11"><SelectValue placeholder="Select a resource" /></SelectTrigger>
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
                  <CalendarDays className="h-4 w-4 mr-1" /> Schedule
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
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
              <p className="text-muted-foreground">No sessions scheduled yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingSessions.map((session: any) => {
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

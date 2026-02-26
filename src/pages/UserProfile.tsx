import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Profile } from '@/lib/types';
import { User, Mail, Calendar } from 'lucide-react';

interface UserProfileProps {
  profile: Profile;
  email: string;
  onUpdate: (updates: Partial<Profile>) => Promise<Profile>;
}

const UserProfile = ({ profile, email, onUpdate }: UserProfileProps) => {
  const [name, setName] = useState(profile.full_name);
  const [goal, setGoal] = useState(profile.learning_goal);
  const [studyTime, setStudyTime] = useState(profile.study_time_minutes.toString());
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate({
      full_name: name.trim(),
      learning_goal: goal.trim(),
      study_time_minutes: parseInt(studyTime) || 30,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="text-center">
        <div className="h-20 w-20 rounded-full gradient-primary flex items-center justify-center text-3xl font-bold text-primary-foreground mx-auto mb-3">
          {(profile.full_name || '?')[0].toUpperCase()}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display">{profile.full_name || 'Your Profile'}</h1>
        <p className="text-muted-foreground mt-1">{email}</p>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader><CardTitle className="text-lg font-display">Settings</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} required className="h-11" />
            </div>
            <div className="space-y-2">
              <Label>Learning Goal</Label>
              <Input value={goal} onChange={e => setGoal(e.target.value)} placeholder="e.g., Master React in 3 months" className="h-11" />
            </div>
            <div className="space-y-2">
              <Label>Daily Study Time (minutes)</Label>
              <Input type="number" value={studyTime} onChange={e => setStudyTime(e.target.value)} min="5" className="h-11" />
            </div>
            <Button type="submit" className={saved ? 'bg-success border-0' : 'gradient-primary border-0'} disabled={saved}>
              {saved ? '✓ Saved!' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;

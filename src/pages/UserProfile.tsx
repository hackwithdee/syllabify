import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from '@/lib/types';

interface UserProfileProps {
  user: User;
  onUpdate: (updates: Partial<User>) => void;
}

const UserProfile = ({ user, onUpdate }: UserProfileProps) => {
  const [name, setName] = useState(user.name);
  const [goal, setGoal] = useState(user.learningGoal);
  const [studyTime, setStudyTime] = useState(user.studyTimeMinutes.toString());
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      name: name.trim(),
      learningGoal: goal.trim(),
      studyTimeMinutes: parseInt(studyTime) || 30,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-2xl font-bold font-display">Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-display">Your Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Learning Goal</Label>
              <Input value={goal} onChange={e => setGoal(e.target.value)} placeholder="e.g., Master React in 3 months" />
            </div>
            <div className="space-y-2">
              <Label>Daily Study Time (minutes)</Label>
              <Input type="number" value={studyTime} onChange={e => setStudyTime(e.target.value)} min="5" />
            </div>
            <Button type="submit">{saved ? '✓ Saved!' : 'Save Changes'}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            <strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;

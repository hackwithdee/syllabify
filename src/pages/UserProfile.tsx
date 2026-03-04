import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Profile } from '@/lib/types';
import { Mail, Calendar, Clock, Target, Crown, Shield } from 'lucide-react';
import PremiumBadge from '@/components/PremiumBadge';
import UpgradeCard from '@/components/UpgradeCard';
import UpgradeDialog from '@/components/UpgradeDialog';
import { PRICING } from '@/hooks/useSubscription';

interface UserProfileProps {
  profile: Profile;
  email: string;
  onUpdate: (updates: Partial<Profile>) => Promise<Profile>;
  isPremium?: boolean;
  onUpgrade?: () => Promise<void>;
  onDowngrade?: () => Promise<void>;
}

const UserProfile = ({ profile, email, onUpdate, isPremium, onUpgrade, onDowngrade }: UserProfileProps) => {
  const [name, setName] = useState(profile.full_name);
  const [goal, setGoal] = useState(profile.learning_goal);
  const [studyTime, setStudyTime] = useState(profile.study_time_minutes.toString());
  const [weeklyHours, setWeeklyHours] = useState(profile.weekly_hours.toString());
  const [proficiency, setProficiency] = useState(profile.proficiency_level);
  const [saved, setSaved] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate({
      full_name: name.trim(),
      learning_goal: goal.trim(),
      study_time_minutes: parseInt(studyTime) || 30,
      weekly_hours: parseInt(weeklyHours) || 5,
      proficiency_level: proficiency,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="text-center">
        <div className="h-20 w-20 rounded-full gradient-primary flex items-center justify-center text-3xl font-bold text-primary-foreground mx-auto mb-3 relative">
          {(profile.full_name || '?')[0].toUpperCase()}
          {isPremium && (
            <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center border-2 border-background">
              <Crown className="h-3.5 w-3.5 text-white" />
            </div>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display">{profile.full_name || 'Your Profile'}</h1>
        <p className="text-muted-foreground mt-1">{email}</p>
        <div className="flex justify-center gap-2 mt-2 flex-wrap">
          <Badge variant="outline" className="text-xs capitalize">{profile.proficiency_level}</Badge>
          {profile.is_student && <Badge variant="outline" className="text-xs">🎓 {profile.student_level || 'Student'}</Badge>}
          {isPremium ? <PremiumBadge size="md" /> : (
            <Badge variant="outline" className="text-xs">Free Plan</Badge>
          )}
        </div>
      </div>

      {/* Subscription Card */}
      <Card className={`border-0 shadow-md overflow-hidden ${isPremium ? 'ring-2 ring-amber-500/30' : ''}`}>
        {isPremium && <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-500" />}
        <CardHeader>
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPremium ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-bold font-display">Premium Plan</p>
                  <p className="text-xs text-muted-foreground">All features unlocked</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <span>✓ Unlimited resources</span>
                <span>✓ Unlimited AI roadmaps</span>
                <span>✓ Advanced analytics</span>
                <span>✓ Certification templates</span>
              </div>
              <Button variant="outline" size="sm" onClick={onDowngrade} className="text-xs text-muted-foreground">
                Downgrade to Free
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">You're on the <span className="font-semibold text-foreground">Free Plan</span></p>
              <p className="text-xs text-muted-foreground">Upgrade to Premium for {PRICING.currency}{PRICING.monthly.toLocaleString()}/mo or {PRICING.currency}{PRICING.yearly.toLocaleString()}/yr</p>
              <Button onClick={() => setShowUpgrade(true)} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-0 text-white font-semibold">
                <Crown className="h-4 w-4 mr-2" /> Upgrade to Premium
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

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
              <Input value={goal} onChange={e => setGoal(e.target.value)} placeholder="e.g., Master Python" className="h-11" />
            </div>
            <div className="space-y-2">
              <Label>Proficiency Level</Label>
              <div className="grid grid-cols-3 gap-2">
                {['beginner', 'intermediate', 'advanced'].map(l => (
                  <button key={l} type="button" onClick={() => setProficiency(l)}
                    className={`p-2 rounded-lg border text-sm capitalize font-medium transition-all ${proficiency === l ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30'}`}
                  >{l}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Daily Study (min)</Label>
                <Input type="number" value={studyTime} onChange={e => setStudyTime(e.target.value)} min="5" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label>Weekly Hours</Label>
                <Input type="number" value={weeklyHours} onChange={e => setWeeklyHours(e.target.value)} min="1" max="40" className="h-11" />
              </div>
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
            <Mail className="h-4 w-4" /><span>{email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Target className="h-4 w-4" /><span>{profile.learning_goal || 'No goal set'}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" /><span>{profile.weekly_hours}h / week</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" /><span>Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
        </CardContent>
      </Card>

      {!isPremium && <UpgradeCard onUpgrade={() => setShowUpgrade(true)} />}

      <UpgradeDialog open={showUpgrade} onOpenChange={setShowUpgrade} onUpgrade={onUpgrade} />
    </div>
  );
};

export default UserProfile;

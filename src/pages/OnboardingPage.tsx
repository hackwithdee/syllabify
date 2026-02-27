import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, GraduationCap, Target, Clock, ArrowRight, ArrowLeft } from 'lucide-react';

interface OnboardingPageProps {
  onComplete: (data: {
    proficiency_level: string;
    learning_goal: string;
    weekly_hours: number;
    is_student: boolean;
    student_level: string;
  }) => Promise<void>;
  userName: string;
}

const levels = [
  { value: 'beginner', label: 'Beginner', desc: 'Just getting started', icon: '🌱' },
  { value: 'intermediate', label: 'Intermediate', desc: 'Some experience', icon: '📚' },
  { value: 'advanced', label: 'Advanced', desc: 'Deep knowledge', icon: '🚀' },
];

const OnboardingPage = ({ onComplete, userName }: OnboardingPageProps) => {
  const [step, setStep] = useState(0);
  const [proficiency, setProficiency] = useState('beginner');
  const [goal, setGoal] = useState('');
  const [weeklyHours, setWeeklyHours] = useState('5');
  const [isStudent, setIsStudent] = useState(false);
  const [studentLevel, setStudentLevel] = useState('');
  const [loading, setLoading] = useState(false);

  const steps = [
    { title: 'Your Level', icon: GraduationCap },
    { title: 'Your Goal', icon: Target },
    { title: 'Your Time', icon: Clock },
    { title: 'Student?', icon: BookOpen },
  ];

  const handleFinish = async () => {
    setLoading(true);
    try {
      await onComplete({
        proficiency_level: proficiency,
        learning_goal: goal.trim(),
        weekly_hours: parseInt(weeklyHours) || 5,
        is_student: isStudent,
        student_level: isStudent ? studentLevel : '',
      });
    } finally {
      setLoading(false);
    }
  };

  const canNext = () => {
    if (step === 1) return goal.trim().length > 0;
    return true;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-3">
            <div className="p-2 rounded-xl gradient-primary">
              <BookOpen className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold font-display text-foreground">Syllabify</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Welcome{userName ? `, ${userName.split(' ')[0]}` : ''}! Let's personalize your experience.
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 gradient-primary' : i < step ? 'w-2 bg-primary' : 'w-2 bg-muted'}`} />
          ))}
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-xl">{steps[step].title}</CardTitle>
          </CardHeader>
          <CardContent>
            {step === 0 && (
              <div className="space-y-3">
                <CardDescription className="text-center mb-4">What's your current level?</CardDescription>
                {levels.map(l => (
                  <button
                    key={l.value}
                    onClick={() => setProficiency(l.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${proficiency === l.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{l.icon}</span>
                      <div>
                        <p className="font-semibold">{l.label}</p>
                        <p className="text-sm text-muted-foreground">{l.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <CardDescription className="text-center mb-4">What do you want to learn?</CardDescription>
                <Input
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                  placeholder="e.g., Master Python programming, Learn AWS Cloud..."
                  className="h-12 text-base"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground text-center">This helps us generate your personalized roadmap</p>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <CardDescription className="text-center mb-4">How many hours per week can you study?</CardDescription>
                <div className="flex items-center justify-center gap-4">
                  <Button variant="outline" size="icon" onClick={() => setWeeklyHours(String(Math.max(1, parseInt(weeklyHours) - 1)))}>−</Button>
                  <div className="text-center">
                    <p className="text-4xl font-bold font-display text-primary">{weeklyHours}</p>
                    <p className="text-sm text-muted-foreground">hours/week</p>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => setWeeklyHours(String(Math.min(40, parseInt(weeklyHours) + 1)))}>+</Button>
                </div>
                <Input
                  type="range"
                  min="1"
                  max="40"
                  value={weeklyHours}
                  onChange={e => setWeeklyHours(e.target.value)}
                  className="w-full"
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <CardDescription className="text-center mb-4">Are you currently a student?</CardDescription>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setIsStudent(true)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${isStudent ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}
                  >
                    <p className="text-2xl mb-1">🎓</p>
                    <p className="font-semibold">Yes</p>
                  </button>
                  <button
                    onClick={() => { setIsStudent(false); setStudentLevel(''); }}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${!isStudent ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}
                  >
                    <p className="text-2xl mb-1">💼</p>
                    <p className="font-semibold">No</p>
                  </button>
                </div>
                {isStudent && (
                  <div className="space-y-2">
                    <Label>What level?</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['High School', 'Undergraduate', 'Graduate', 'PhD'].map(level => (
                        <button
                          key={level}
                          onClick={() => setStudentLevel(level)}
                          className={`p-2.5 rounded-lg border text-sm font-medium transition-all ${studentLevel === level ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/30'}`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between mt-6">
              {step > 0 ? (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
              ) : <div />}
              {step < 3 ? (
                <Button onClick={() => setStep(step + 1)} disabled={!canNext()} className="gradient-primary border-0">
                  Next <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleFinish} disabled={loading} className="gradient-primary border-0">
                  {loading ? 'Setting up...' : 'Get Started 🚀'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingPage;

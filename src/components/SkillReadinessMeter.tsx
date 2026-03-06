import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RoadmapStage } from '@/lib/types';
import { Target, Zap } from 'lucide-react';

interface SkillReadinessMeterProps {
  stages: RoadmapStage[];
  learningGoal: string;
}

const phaseConfig: Record<string, { label: string; emoji: string }> = {
  foundation: { label: 'Foundations', emoji: '🏗️' },
  core: { label: 'Core Skills', emoji: '⚙️' },
  intermediate: { label: 'Intermediate', emoji: '📈' },
  advanced: { label: 'Advanced', emoji: '🚀' },
  certification: { label: 'Career Prep', emoji: '🎓' },
};

const SkillReadinessMeter = ({ stages, learningGoal }: SkillReadinessMeterProps) => {
  if (stages.length === 0) return null;

  const phases = [...new Set(stages.map(s => s.phase))];
  const phaseData = phases.map(phase => {
    const phaseStages = stages.filter(s => s.phase === phase);
    const completed = phaseStages.filter(s => s.completed).length;
    const pct = Math.round((completed / phaseStages.length) * 100);
    const config = phaseConfig[phase] || { label: phase, emoji: '📌' };
    return { phase, ...config, completed, total: phaseStages.length, pct };
  });

  const overallPct = stages.length > 0
    ? Math.round((stages.filter(s => s.completed).length / stages.length) * 100)
    : 0;

  const readinessMessage = overallPct >= 80
    ? `You're almost ready! Just a few more steps.`
    : overallPct >= 50
    ? `You're making great progress toward your goal.`
    : overallPct >= 20
    ? `Good start! Keep building your skills.`
    : `You're just getting started. Keep going!`;

  return (
    <Card className="border-0 shadow-md overflow-hidden">
      <div className="h-1 gradient-primary" />
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Skill Readiness
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 rounded-xl bg-muted/50">
          <p className="text-sm text-muted-foreground mb-1">{learningGoal || 'Learning Goal'} Readiness</p>
          <p className="text-4xl font-bold font-display text-primary">{overallPct}%</p>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <p className="text-xs text-muted-foreground">{readinessMessage}</p>
          </div>
        </div>

        <div className="space-y-3">
          {phaseData.map(p => (
            <div key={p.phase}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">
                  {p.emoji} {p.label}
                </span>
                <span className="text-xs text-muted-foreground">{p.completed}/{p.total} · {p.pct}%</span>
              </div>
              <Progress value={p.pct} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillReadinessMeter;

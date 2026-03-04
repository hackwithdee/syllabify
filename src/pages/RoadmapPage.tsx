import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RoadmapStage } from '@/lib/types';
import { getRoadmapStages, toggleStageComplete, clearRoadmap, addRoadmapStage } from '@/lib/storage';
import { certificationPaths } from '@/lib/roadmapData';
import { CheckCircle2, Circle, Sparkles, Loader2, Map, Trash2, ArrowDown, Lock, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PremiumBadge from '@/components/PremiumBadge';
import UpgradeDialog from '@/components/UpgradeDialog';

interface RoadmapPageProps {
  userId: string;
  learningGoal: string;
  isPremium?: boolean;
  canGenerate: boolean;
  generationsLeft: number;
  onGenerate: () => Promise<void>;
  onUpgrade?: () => Promise<void>;
}

const phaseColors: Record<string, string> = {
  foundation: 'bg-secondary/10 text-secondary border-secondary/20',
  intermediate: 'bg-primary/10 text-primary border-primary/20',
  advanced: 'bg-accent/10 text-accent border-accent/20',
  certification: 'bg-success/10 text-success border-success/20',
};

const phaseLabels: Record<string, string> = {
  foundation: '🏗️ Foundation',
  intermediate: '📈 Intermediate',
  advanced: '🚀 Advanced',
  certification: '🎓 Certification',
};

const RoadmapPage = ({ userId, learningGoal, isPremium, canGenerate, generationsLeft, onGenerate, onUpgrade }: RoadmapPageProps) => {
  const { toast } = useToast();
  const [stages, setStages] = useState<RoadmapStage[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const refresh = () => getRoadmapStages(userId).then(setStages);
  useEffect(() => { refresh(); }, [userId]);

  const handleToggle = async (stage: RoadmapStage) => {
    await toggleStageComplete(stage.id, stage.completed);
    refresh();
  };

  const handleClear = async () => {
    await clearRoadmap(userId);
    setStages([]);
  };

  const handleLoadCertPath = async (pathId: string) => {
    if (!isPremium) {
      setShowUpgrade(true);
      return;
    }
    const path = certificationPaths.find(p => p.id === pathId);
    if (!path) return;
    setLoading(true);
    await clearRoadmap(userId);
    for (let i = 0; i < path.stages.length; i++) {
      await addRoadmapStage(userId, {
        title: path.stages[i].title,
        description: path.stages[i].description,
        phase: path.stages[i].phase,
        stage_order: i,
      });
    }
    await refresh();
    setLoading(false);
    toast({ title: 'Roadmap loaded!', description: `${path.name} roadmap is ready.` });
  };

  const handleAIGenerate = async () => {
    if (!learningGoal.trim()) {
      toast({ title: 'Set a goal first', description: 'Go to your Profile and set a learning goal.', variant: 'destructive' });
      return;
    }
    if (!canGenerate) {
      setShowUpgrade(true);
      return;
    }
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-roadmap', {
        body: { goal: learningGoal },
      });
      if (error) throw error;
      const generated = data?.stages || [];
      await clearRoadmap(userId);
      for (let i = 0; i < generated.length; i++) {
        await addRoadmapStage(userId, {
          title: generated[i].title,
          description: generated[i].description,
          phase: generated[i].phase,
          stage_order: i,
        });
      }
      await onGenerate();
      await refresh();
      toast({ title: 'Roadmap generated!', description: 'Your AI-powered roadmap is ready.' });
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('429')) toast({ title: 'Rate limited', description: 'Please try again in a moment.', variant: 'destructive' });
      else if (msg.includes('402')) toast({ title: 'Credits needed', description: 'Add more credits in Settings.', variant: 'destructive' });
      else toast({ title: 'Error', description: 'Could not generate roadmap.', variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  };

  const phases = ['foundation', 'intermediate', 'advanced', 'certification'] as const;
  const completedCount = stages.filter(s => s.completed).length;
  const progress = stages.length > 0 ? Math.round((completedCount / stages.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display">Roadmap</h1>
          <p className="text-muted-foreground mt-1">Your structured learning journey</p>
        </div>
        {stages.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClear} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-1" /> Reset
          </Button>
        )}
      </div>

      {stages.length > 0 && (
        <Card className="border-0 shadow-md">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Roadmap Progress</span>
              <span className="text-sm font-bold text-primary">{progress}%</span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full gradient-primary transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{completedCount} of {stages.length} stages completed</p>
          </CardContent>
        </Card>
      )}

      <Card className="border-0 gradient-primary text-primary-foreground overflow-hidden">
        <CardContent className="py-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-5 w-5" />
                <h3 className="font-display font-bold text-lg">AI Roadmap Generator</h3>
              </div>
              <p className="text-sm opacity-90">
                {learningGoal ? `Generate a roadmap for: "${learningGoal}"` : 'Set a learning goal to generate a personalized roadmap'}
              </p>
              {!isPremium && (
                <p className="text-xs mt-1 opacity-75">
                  {generationsLeft > 0
                    ? `${generationsLeft} free generation${generationsLeft > 1 ? 's' : ''} remaining this month`
                    : 'No free generations left — upgrade to Premium'}
                </p>
              )}
              {isPremium && <p className="text-xs mt-1 opacity-75">✨ Unlimited generations with Premium</p>}
            </div>
            <Button onClick={handleAIGenerate} disabled={generating || !learningGoal.trim()} variant="secondary" className="shrink-0">
              {generating ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1" />}
              {generating ? 'Generating...' : 'Generate Roadmap'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {stages.length === 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-lg font-bold font-display">Or choose a certification path</h2>
            {!isPremium && <PremiumBadge />}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {certificationPaths.map(path => (
              <Card key={path.id} className={`border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer ${!isPremium ? 'relative' : ''}`} onClick={() => handleLoadCertPath(path.id)}>
                {!isPremium && (
                  <div className="absolute top-3 right-3">
                    <Lock className="h-4 w-4 text-amber-500" />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{path.icon}</span>
                    <CardTitle className="text-base font-display">{path.name}</CardTitle>
                  </div>
                  <CardDescription className="text-xs">{path.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{path.stages.length} stages</p>
                  <Button variant="outline" size="sm" className="w-full mt-2" disabled={loading}>
                    {loading ? 'Loading...' : !isPremium ? (
                      <><Crown className="h-3.5 w-3.5 mr-1 text-amber-500" /> Upgrade to Unlock</>
                    ) : 'Use This Path'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {stages.length > 0 && (
        <div className="space-y-6">
          {phases.map((phase, pi) => {
            const phaseStages = stages.filter(s => s.phase === phase);
            if (phaseStages.length === 0) return null;
            return (
              <div key={phase}>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className={phaseColors[phase]}>{phaseLabels[phase]}</Badge>
                  <span className="text-xs text-muted-foreground">{phaseStages.filter(s => s.completed).length}/{phaseStages.length}</span>
                </div>
                <div className="space-y-2 ml-4 border-l-2 border-border pl-4">
                  {phaseStages.map((stage, i) => (
                    <div key={stage.id}>
                      <Card className={`border-0 shadow-sm hover:shadow-md transition-all ${stage.completed ? 'opacity-60' : ''}`}>
                        <CardContent className="py-3 flex items-center gap-3">
                          <button onClick={() => handleToggle(stage)} className="shrink-0">
                            {stage.completed
                              ? <CheckCircle2 className="h-5 w-5 text-success" />
                              : <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium text-sm ${stage.completed ? 'line-through' : ''}`}>{stage.title}</p>
                            {stage.description && <p className="text-xs text-muted-foreground mt-0.5">{stage.description}</p>}
                          </div>
                        </CardContent>
                      </Card>
                      {i < phaseStages.length - 1 && (
                        <div className="flex justify-center py-1"><ArrowDown className="h-3 w-3 text-muted-foreground/50" /></div>
                      )}
                    </div>
                  ))}
                </div>
                {pi < phases.length - 1 && stages.some(s => s.phase === phases[pi + 1]) && (
                  <div className="flex justify-center py-2"><ArrowDown className="h-4 w-4 text-primary" /></div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {stages.length === 0 && !loading && (
        <Card className="border-dashed border-2">
          <CardContent className="pt-8 pb-8 text-center">
            <Map className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Generate a roadmap with AI or pick a certification path above.</p>
          </CardContent>
        </Card>
      )}

      <UpgradeDialog open={showUpgrade} onOpenChange={setShowUpgrade} onUpgrade={onUpgrade} />
    </div>
  );
};

export default RoadmapPage;

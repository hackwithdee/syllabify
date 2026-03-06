import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { RoadmapStage } from '@/lib/types';
import { getRoadmapStages, toggleStageComplete, clearRoadmap, addRoadmapStage } from '@/lib/storage';
import { roadmapTemplates, findTemplateForGoal, RoadmapTemplate, RoadmapStep as TemplateStep } from '@/lib/roadmapTemplates';
import { CheckCircle2, Circle, Sparkles, Loader2, Map, Trash2, ArrowDown, Lock, Crown, ChevronDown, ChevronRight, ExternalLink, Target, BookOpen, Lightbulb, Link2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PremiumBadge from '@/components/PremiumBadge';
import UpgradeDialog from '@/components/UpgradeDialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';

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
  core: 'bg-primary/10 text-primary border-primary/20',
  intermediate: 'bg-accent/10 text-accent border-accent/20',
  advanced: 'bg-destructive/10 text-destructive border-destructive/20',
  certification: 'bg-success/10 text-success border-success/20',
};

const phaseLabels: Record<string, string> = {
  foundation: '🏗️ Foundation',
  core: '⚙️ Core Skills',
  intermediate: '📈 Intermediate',
  advanced: '🚀 Advanced',
  certification: '🎓 Career Prep',
};

const RoadmapPage = ({ userId, learningGoal, isPremium, canGenerate, generationsLeft, onGenerate, onUpgrade }: RoadmapPageProps) => {
  const { toast } = useToast();
  const [stages, setStages] = useState<RoadmapStage[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  // Store template data for expanded view
  const [activeTemplate, setActiveTemplate] = useState<RoadmapTemplate | null>(null);

  const refresh = () => getRoadmapStages(userId).then(setStages);
  useEffect(() => { refresh(); }, [userId]);

  // Try to match active template from learning goal
  useEffect(() => {
    if (learningGoal) {
      setActiveTemplate(findTemplateForGoal(learningGoal));
    }
  }, [learningGoal]);

  const handleToggle = async (stage: RoadmapStage) => {
    await toggleStageComplete(stage.id, stage.completed);
    refresh();
  };

  const handleClear = async () => {
    await clearRoadmap(userId);
    setStages([]);
  };

  const toggleExpand = (id: string) => {
    setExpandedStages(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleLoadTemplate = async (template: RoadmapTemplate) => {
    if (!isPremium && template.id !== roadmapTemplates[0]?.id) {
      setShowUpgrade(true);
      return;
    }
    setLoading(true);
    await clearRoadmap(userId);
    let order = 0;
    for (const phase of template.phases) {
      for (const step of phase.steps) {
        await addRoadmapStage(userId, {
          title: step.title,
          description: step.description,
          phase: phase.id as any,
          stage_order: order++,
        });
      }
    }
    setActiveTemplate(template);
    await refresh();
    setLoading(false);
    toast({ title: 'Roadmap loaded!', description: `${template.name} roadmap is ready.` });
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

  const phases = ['foundation', 'core', 'intermediate', 'advanced', 'certification'] as const;
  const completedCount = stages.filter(s => s.completed).length;
  const progress = stages.length > 0 ? Math.round((completedCount / stages.length) * 100) : 0;

  const filteredStages = searchQuery
    ? stages.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase()))
    : stages;

  // Find template step details for a stage
  const getTemplateStep = (stageTitle: string): TemplateStep | null => {
    if (!activeTemplate) return null;
    for (const phase of activeTemplate.phases) {
      const found = phase.steps.find(s => s.title === stageTitle);
      if (found) return found;
    }
    return null;
  };

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
        <Card className="border-0 shadow-md overflow-hidden">
          <div className="h-1 gradient-primary" />
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Roadmap Progress</span>
              <span className="text-sm font-bold text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-xs text-muted-foreground mt-2">{completedCount} of {stages.length} stages completed</p>
          </CardContent>
        </Card>
      )}

      {/* AI Generator */}
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
                  {generationsLeft > 0 ? `${generationsLeft} free generation${generationsLeft > 1 ? 's' : ''} remaining` : 'No free generations left — upgrade to Premium'}
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

      {/* Search */}
      {stages.length > 0 && (
        <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search roadmap steps..." className="h-11" />
      )}

      {/* Template picker */}
      {stages.length === 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-lg font-bold font-display">Choose a learning path</h2>
            {!isPremium && <PremiumBadge />}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roadmapTemplates.map((tmpl, idx) => (
              <Card key={tmpl.id} className={`border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer ${!isPremium && idx > 0 ? 'relative' : ''}`}
                onClick={() => handleLoadTemplate(tmpl)}>
                {!isPremium && idx > 0 && (
                  <div className="absolute top-3 right-3"><Lock className="h-4 w-4 text-amber-500" /></div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{tmpl.icon}</span>
                    <CardTitle className="text-base font-display">{tmpl.name}</CardTitle>
                  </div>
                  <CardDescription className="text-xs">{tmpl.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {tmpl.phases.map(p => (
                      <Badge key={p.id} variant="outline" className="text-[10px]">{p.emoji} {p.label}</Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{tmpl.phases.reduce((sum, p) => sum + p.steps.length, 0)} structured steps</p>
                  <Button variant="outline" size="sm" className="w-full mt-2" disabled={loading}>
                    {loading ? 'Loading...' : !isPremium && idx > 0 ? (
                      <><Crown className="h-3.5 w-3.5 mr-1 text-amber-500" /> Upgrade to Unlock</>
                    ) : 'Use This Path'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Roadmap stages with expandable details */}
      {filteredStages.length > 0 && (
        <div className="space-y-6">
          {phases.map((phase, pi) => {
            const phaseStages = filteredStages.filter(s => s.phase === phase);
            if (phaseStages.length === 0) return null;
            const phaseCompleted = phaseStages.filter(s => s.completed).length;
            const phasePct = Math.round((phaseCompleted / phaseStages.length) * 100);
            return (
              <div key={phase}>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className={phaseColors[phase]}>{phaseLabels[phase]}</Badge>
                  <span className="text-xs text-muted-foreground">{phaseCompleted}/{phaseStages.length}</span>
                  <Progress value={phasePct} className="h-1.5 flex-1 max-w-24" />
                </div>
                <div className="space-y-2 ml-4 border-l-2 border-border pl-4">
                  {phaseStages.map((stage, i) => {
                    const templateStep = getTemplateStep(stage.title);
                    const isExpanded = expandedStages.has(stage.id);
                    return (
                      <div key={stage.id}>
                        <Card className={`border-0 shadow-sm hover:shadow-md transition-all ${stage.completed ? 'opacity-60' : ''}`}>
                          <CardContent className="py-3">
                            <div className="flex items-center gap-3">
                              <button onClick={() => handleToggle(stage)} className="shrink-0">
                                {stage.completed
                                  ? <CheckCircle2 className="h-5 w-5 text-success" />
                                  : <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />}
                              </button>
                              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleExpand(stage.id)}>
                                <p className={`font-medium text-sm ${stage.completed ? 'line-through' : ''}`}>{stage.title}</p>
                                {stage.description && <p className="text-xs text-muted-foreground mt-0.5">{stage.description}</p>}
                              </div>
                              <button onClick={() => toggleExpand(stage.id)} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                              </button>
                            </div>

                            {isExpanded && templateStep && (
                              <div className="mt-3 ml-8 space-y-3 border-t pt-3">
                                <div className="flex items-start gap-2">
                                  <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                  <div>
                                    <p className="text-xs font-semibold text-primary">How to Learn</p>
                                    <p className="text-xs text-muted-foreground">{templateStep.howToLearn}</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Target className="h-4 w-4 text-success shrink-0 mt-0.5" />
                                  <div>
                                    <p className="text-xs font-semibold text-success">Outcome</p>
                                    <p className="text-xs text-muted-foreground">{templateStep.outcome}</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Link2 className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                                  <div>
                                    <p className="text-xs font-semibold text-secondary mb-1">Resources</p>
                                    <div className="space-y-1">
                                      {templateStep.resources.map((r, ri) => (
                                        <a key={ri} href={r.url} target="_blank" rel="noopener noreferrer"
                                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                                          <ExternalLink className="h-3 w-3" />
                                          <span>{r.title}</span>
                                          {r.type === 'alternative' && <Badge variant="outline" className="text-[9px] py-0">alt</Badge>}
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {isExpanded && !templateStep && (
                              <div className="mt-3 ml-8 border-t pt-3">
                                <p className="text-xs text-muted-foreground italic">Expand your roadmap details by using a template or generating with AI.</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                        {i < phaseStages.length - 1 && (
                          <div className="flex justify-center py-1"><ArrowDown className="h-3 w-3 text-muted-foreground/50" /></div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {pi < phases.length - 1 && filteredStages.some(s => s.phase === phases[pi + 1]) && (
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
            <p className="text-muted-foreground">Generate a roadmap with AI or pick a learning path above.</p>
          </CardContent>
        </Card>
      )}

      <UpgradeDialog open={showUpgrade} onOpenChange={setShowUpgrade} onUpgrade={onUpgrade} />
    </div>
  );
};

export default RoadmapPage;

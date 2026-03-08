import { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RoadmapStage, StudySession } from '@/lib/types';
import { getRoadmapStages, getSessions } from '@/lib/storage';
import { CheckCircle2, Download, Share2, Award, Clock, BookOpen, Trophy, Target, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SkillPortfolioProps {
  userId: string;
  learningGoal: string;
  userName: string;
  isPremium?: boolean;
}

const SkillPortfolio = ({ userId, learningGoal, userName, isPremium }: SkillPortfolioProps) => {
  const { toast } = useToast();
  const [stages, setStages] = useState<RoadmapStage[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [summary, setSummary] = useState('');
  const portfolioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      getRoadmapStages(userId),
      getSessions(userId),
    ]).then(([stgs, sess]) => {
      setStages(stgs);
      setSessions(sess);
      setLoading(false);
    });
  }, [userId]);

  const completedStages = stages.filter(s => s.completed);
  const totalStages = stages.length;
  const completionPct = totalStages > 0 ? Math.round((completedStages.length / totalStages) * 100) : 0;
  const totalStudyMinutes = sessions.reduce((sum, s) => sum + s.duration_minutes, 0);
  const totalStudyHours = Math.round(totalStudyMinutes / 60 * 10) / 10;

  const isPortfolioReady = completionPct >= 60;

  const phases = ['foundation', 'core', 'intermediate', 'advanced', 'certification'] as const;
  const phaseLabels: Record<string, string> = {
    foundation: 'Foundation',
    core: 'Core Skills',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    certification: 'Career Prep',
  };

  // Detect projects from stage titles (heuristic)
  const projects = useMemo(() => {
    return completedStages.filter(s =>
      s.title.toLowerCase().includes('project') ||
      s.title.toLowerCase().includes('portfolio') ||
      s.title.toLowerCase().includes('build') ||
      s.title.toLowerCase().includes('certification') ||
      s.phase === 'certification'
    );
  }, [completedStages]);

  const generateSummary = async () => {
    if (!isPremium) {
      toast({ title: 'Premium feature', description: 'Upgrade to generate AI portfolio summaries.', variant: 'destructive' });
      return;
    }
    setGeneratingSummary(true);
    try {
      const completedTitles = completedStages.map(s => s.title).join(', ');
      const { data, error } = await supabase.functions.invoke('suggest-resources', {
        body: {
          type: 'portfolio-summary',
          goal: learningGoal,
          completedTopics: completedTitles,
          totalHours: totalStudyHours,
          userName,
        },
      });
      if (error) throw error;
      setSummary(data?.summary || `${userName} completed a structured ${learningGoal} learning path covering ${completedStages.length} topics across ${totalStudyHours} hours of study. Key areas include ${completedStages.slice(0, 5).map(s => s.title).join(', ')}.`);
    } catch {
      // Fallback summary
      setSummary(`${userName} completed a structured ${learningGoal} learning path covering ${completedStages.length} topics across ${totalStudyHours} hours of study. Key areas include ${completedStages.slice(0, 5).map(s => s.title).join(', ')}.`);
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleDownloadPDF = () => {
    // Generate a printable version
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const completedList = completedStages.map(s => `<li>✔ ${s.title}</li>`).join('');
    const projectList = projects.map(p => `<li>🏆 ${p.title}</li>`).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${learningGoal} - Skill Portfolio</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1a1a2e; }
          h1 { color: #7c3aed; border-bottom: 3px solid #7c3aed; padding-bottom: 10px; }
          h2 { color: #4338ca; margin-top: 30px; }
          .badge { display: inline-block; background: #7c3aed; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px; margin-bottom: 20px; }
          .stats { display: flex; gap: 30px; margin: 20px 0; }
          .stat { text-align: center; }
          .stat-value { font-size: 24px; font-weight: bold; color: #7c3aed; }
          .stat-label { font-size: 12px; color: #666; }
          ul { list-style: none; padding: 0; }
          li { padding: 6px 0; border-bottom: 1px solid #f0f0f0; }
          .summary { background: #f5f3ff; padding: 20px; border-radius: 12px; margin: 20px 0; line-height: 1.6; }
          .footer { margin-top: 40px; font-size: 12px; color: #999; text-align: center; }
        </style>
      </head>
      <body>
        <h1>${learningGoal}</h1>
        <p><span class="badge">Skill Portfolio</span></p>
        <p><strong>${userName}</strong></p>
        ${summary ? `<div class="summary">${summary}</div>` : ''}
        <div class="stats">
          <div class="stat"><div class="stat-value">${completedStages.length}</div><div class="stat-label">Topics Completed</div></div>
          <div class="stat"><div class="stat-value">${totalStudyHours}h</div><div class="stat-label">Study Time</div></div>
          <div class="stat"><div class="stat-value">${completionPct}%</div><div class="stat-label">Completion</div></div>
        </div>
        <h2>Completed Topics</h2>
        <ul>${completedList || '<li>No topics completed yet</li>'}</ul>
        ${projects.length > 0 ? `<h2>Projects</h2><ul>${projectList}</ul>` : ''}
        <div class="footer">Generated by Syllabify • ${new Date().toLocaleDateString()}</div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleShare = async () => {
    const shareText = `🎓 I'm ${completionPct}% through my ${learningGoal} learning journey on Syllabify! ${completedStages.length} topics completed, ${totalStudyHours}h studied.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${learningGoal} - Skill Portfolio`, text: shareText });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast({ title: 'Copied!', description: 'Portfolio summary copied to clipboard.' });
      }
    } catch {
      await navigator.clipboard.writeText(shareText);
      toast({ title: 'Copied!', description: 'Portfolio summary copied to clipboard.' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6" ref={portfolioRef}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display">Skill Portfolio</h1>
          <p className="text-muted-foreground mt-1">Your learning achievements and proof of skills</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1" /> Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-1" /> Download PDF
          </Button>
        </div>
      </div>

      {/* Skill Badge Header */}
      <Card className="border-0 gradient-primary text-primary-foreground overflow-hidden">
        <CardContent className="py-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center text-4xl shrink-0">
              <Award className="h-10 w-10" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-xl font-bold font-display">{learningGoal || 'Learning Journey'}</h2>
              <p className="text-sm opacity-90">{userName}</p>
              <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                <Badge className="bg-white/20 border-0 text-white">
                  {completionPct >= 100 ? '🏆 Completed' : completionPct >= 60 ? '📈 Advanced' : completionPct >= 30 ? '⚡ In Progress' : '🌱 Getting Started'}
                </Badge>
                <span className="text-sm font-bold">{completionPct}%</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{completedStages.length}</p>
                <p className="text-[10px] opacity-75">Topics</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{totalStudyHours}h</p>
                <p className="text-[10px] opacity-75">Studied</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{projects.length}</p>
                <p className="text-[10px] opacity-75">Projects</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Summary */}
      {isPortfolioReady && (
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" /> Learning Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summary ? (
              <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
            ) : (
              <div className="flex items-center gap-3">
                <p className="text-sm text-muted-foreground flex-1">Generate an AI-powered summary of your learning journey.</p>
                <Button size="sm" onClick={generateSummary} disabled={generatingSummary}>
                  {generatingSummary ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generate Summary'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!isPortfolioReady && (
        <Card className="border-dashed border-2">
          <CardContent className="py-6 text-center">
            <Target className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Complete at least 60% of your roadmap to unlock your full portfolio.</p>
            <Progress value={completionPct} className="h-2 mt-3 max-w-xs mx-auto" />
            <p className="text-xs text-muted-foreground mt-1">{completionPct}% complete — {Math.ceil(totalStages * 0.6) - completedStages.length} more topics to go</p>
          </CardContent>
        </Card>
      )}

      {/* Completed Topics by Phase */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" /> Completed Topics
          </CardTitle>
          <CardDescription className="text-xs">{completedStages.length} of {totalStages} topics mastered</CardDescription>
        </CardHeader>
        <CardContent>
          {phases.map(phase => {
            const phaseCompleted = completedStages.filter(s => s.phase === phase);
            if (phaseCompleted.length === 0) return null;
            return (
              <div key={phase} className="mb-4 last:mb-0">
                <p className="text-xs font-semibold text-muted-foreground mb-1">{phaseLabels[phase]}</p>
                <div className="space-y-1">
                  {phaseCompleted.map(s => (
                    <div key={s.id} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                      <span>{s.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {completedStages.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No topics completed yet. Start your roadmap!</p>
          )}
        </CardContent>
      </Card>

      {/* Projects */}
      {projects.length > 0 && (
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <Trophy className="h-4 w-4 text-warning" /> Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {projects.map(p => (
                <div key={p.id} className="flex items-center gap-2 text-sm">
                  <Trophy className="h-3.5 w-3.5 text-warning shrink-0" />
                  <span>{p.title}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Statistics */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" /> Learning Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-primary/5">
              <p className="text-xl font-bold text-primary">{totalStudyHours}h</p>
              <p className="text-[10px] text-muted-foreground">Total Study Time</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-success/5">
              <p className="text-xl font-bold text-success">{completedStages.length}</p>
              <p className="text-[10px] text-muted-foreground">Topics Completed</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/5">
              <p className="text-xl font-bold text-secondary">{sessions.length}</p>
              <p className="text-[10px] text-muted-foreground">Study Sessions</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-accent/5">
              <p className="text-xl font-bold text-accent">{completionPct}%</p>
              <p className="text-[10px] text-muted-foreground">Completion</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillPortfolio;

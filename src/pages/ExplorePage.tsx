import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { starterPaths, StarterPath, StarterResource } from '@/lib/starterPaths';
import { addResource } from '@/lib/storage';
import { Sparkles, Plus, CheckCircle2, Search, Loader2, ExternalLink, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import UpgradeDialog from '@/components/UpgradeDialog';

interface ExplorePageProps {
  userId: string;
  learningGoal: string;
  isPremium?: boolean;
  canAddResource: boolean;
  resourcesLeft: number;
  onResourceAdded: () => Promise<void>;
}

const difficultyColors: Record<string, string> = {
  Beginner: 'bg-success/10 text-success border-success/20',
  Intermediate: 'bg-secondary/10 text-secondary border-secondary/20',
  Advanced: 'bg-destructive/10 text-destructive border-destructive/20',
};

const ExplorePage = ({ userId, learningGoal, isPremium, canAddResource, resourcesLeft, onResourceAdded }: ExplorePageProps) => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [addedResources, setAddedResources] = useState<Set<string>>(new Set());
  const [aiSuggestions, setAiSuggestions] = useState<StarterResource[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const filteredPaths = starterPaths.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddResource = async (resource: StarterResource) => {
    const key = resource.title + resource.url;
    if (addedResources.has(key)) return;
    if (!canAddResource) {
      setShowUpgrade(true);
      return;
    }
    try {
      await addResource(userId, resource.title, resource.url, resource.type);
      await onResourceAdded();
      setAddedResources(prev => new Set(prev).add(key));
      toast({ title: 'Added!', description: `"${resource.title}" added to your library.` });
    } catch {
      toast({ title: 'Error', description: 'Failed to add resource.', variant: 'destructive' });
    }
  };

  const handleAddAllPath = async (path: StarterPath) => {
    for (const resource of path.resources) {
      const key = resource.title + resource.url;
      if (!addedResources.has(key)) {
        if (!canAddResource) {
          setShowUpgrade(true);
          return;
        }
        try {
          await addResource(userId, resource.title, resource.url, resource.type);
          await onResourceAdded();
          setAddedResources(prev => new Set(prev).add(key));
        } catch { /* skip */ }
      }
    }
    toast({ title: 'Path added!', description: `All resources from "${path.name}" added.` });
  };

  const handleAISuggest = async () => {
    if (!learningGoal.trim()) {
      toast({ title: 'Set a goal first', description: 'Go to your Profile and set a learning goal to get AI suggestions.', variant: 'destructive' });
      return;
    }
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('suggest-resources', {
        body: { goal: learningGoal },
      });
      if (error) throw error;
      setAiSuggestions(data?.suggestions || []);
      setAiGenerated(true);
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('429') || msg.includes('rate limit')) {
        toast({ title: 'Rate limited', description: 'Too many requests — please try again in a moment.', variant: 'destructive' });
      } else if (msg.includes('402')) {
        toast({ title: 'Credits needed', description: 'AI usage credits exhausted.', variant: 'destructive' });
      } else {
        toast({ title: 'AI Error', description: 'Could not generate suggestions. Try again.', variant: 'destructive' });
      }
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display">Explore</h1>
        <p className="text-muted-foreground mt-1">
          Discover learning paths and get AI-powered recommendations
          {!isPremium && <span className="text-xs ml-2">· {resourcesLeft === Infinity ? '∞' : resourcesLeft} resources left</span>}
        </p>
      </div>

      {/* AI Suggestion */}
      <Card className="border-0 gradient-primary text-primary-foreground overflow-hidden">
        <CardContent className="py-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-5 w-5" />
                <h3 className="font-display font-bold text-lg">AI Learning Advisor</h3>
              </div>
              <p className="text-sm opacity-90">
                {learningGoal
                  ? `Get personalized resource suggestions for: "${learningGoal}"`
                  : 'Set a learning goal in your profile to unlock AI recommendations'}
              </p>
            </div>
            <Button
              onClick={handleAISuggest}
              disabled={aiLoading || !learningGoal.trim()}
              variant="secondary"
              className="shrink-0"
            >
              {aiLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1" />}
              {aiLoading ? 'Thinking...' : aiGenerated ? 'Regenerate' : 'Get Suggestions'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Results */}
      {aiSuggestions.length > 0 && (
        <Card className="border-0 shadow-md animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> AI Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {aiSuggestions.map((resource, i) => {
                const key = resource.title + resource.url;
                const added = addedResources.has(key);
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{resource.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{resource.type}</Badge>
                        <Badge variant="outline" className={`text-xs ${difficultyColors[resource.difficulty]}`}>{resource.difficulty}</Badge>
                      </div>
                    </div>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-muted-foreground hover:text-primary">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <Button size="sm" variant={added ? 'ghost' : 'outline'} onClick={() => handleAddResource(resource)} disabled={added}>
                      {added ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Plus className="h-4 w-4" />}
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search starter paths..."
          className="pl-9 h-11"
        />
      </div>

      {/* Starter Paths */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPaths.map(path => (
          <Card key={path.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{path.icon}</span>
                  <div>
                    <CardTitle className="text-lg font-display">{path.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{path.description}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5 mb-4">
                {path.resources.map((r, i) => {
                  const key = r.title + r.url;
                  const added = addedResources.has(key);
                  return (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <button onClick={() => handleAddResource(r)} className="shrink-0" disabled={added}>
                        {added ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Plus className="h-4 w-4 text-muted-foreground hover:text-primary" />}
                      </button>
                      <span className="truncate flex-1">{r.title}</span>
                      <Badge variant="outline" className={`text-[10px] ${difficultyColors[r.difficulty]}`}>{r.difficulty}</Badge>
                    </div>
                  );
                })}
              </div>
              <Button variant="outline" size="sm" onClick={() => handleAddAllPath(path)} className="w-full">
                Add All to Library
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <UpgradeDialog open={showUpgrade} onOpenChange={setShowUpgrade} />
    </div>
  );
};

export default ExplorePage;

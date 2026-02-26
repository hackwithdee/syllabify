import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { LearningResource } from '@/lib/types';
import { getResources, toggleResourceComplete } from '@/lib/storage';
import { CheckCircle2, Circle, ExternalLink, ArrowDown, Search } from 'lucide-react';

interface LearningPathProps {
  userId: string;
}

const difficultyOrder = { Beginner: 0, Intermediate: 1, Advanced: 2 };
const difficultyColors: Record<string, string> = {
  Beginner: 'bg-success/10 text-success border-success/20',
  Intermediate: 'bg-secondary/10 text-secondary border-secondary/20',
  Advanced: 'bg-destructive/10 text-destructive border-destructive/20',
};

const LearningPath = ({ userId }: LearningPathProps) => {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [search, setSearch] = useState('');
  const refresh = () => getResources(userId).then(setResources);

  useEffect(() => { refresh(); }, [userId]);

  const filtered = resources.filter(r => !search || r.title.toLowerCase().includes(search.toLowerCase()));
  const sorted = [...filtered].sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);

  const handleToggle = async (resource: LearningResource) => {
    await toggleResourceComplete(resource.id, resource.completed);
    refresh();
  };

  const groups = ['Beginner', 'Intermediate', 'Advanced'] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display">Learning Path</h1>
        <p className="text-muted-foreground mt-1">Your step-by-step journey, organized by difficulty</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search your path..."
          className="pl-9 h-11"
        />
      </div>

      {sorted.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="pt-8 pb-8 text-center">
            <p className="text-muted-foreground">
              {resources.length === 0 ? 'Add resources in the library to see your learning path.' : 'No resources match your search.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {groups.map((level, gi) => {
            const items = sorted.filter(r => r.difficulty === level);
            if (items.length === 0) return null;
            return (
              <div key={level}>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={difficultyColors[level]} variant="outline">{level}</Badge>
                  <span className="text-sm text-muted-foreground">{items.filter(r => r.completed).length}/{items.length} done</span>
                </div>
                <div className="space-y-2 ml-4 border-l-2 border-border pl-4">
                  {items.map((resource, i) => (
                    <div key={resource.id}>
                      <Card className={`border-0 shadow-sm hover:shadow-md transition-shadow ${resource.completed ? 'opacity-60' : ''}`}>
                        <CardContent className="py-3 flex items-center gap-3">
                          <button onClick={() => handleToggle(resource)} className="shrink-0">
                            {resource.completed ? <CheckCircle2 className="h-5 w-5 text-success" /> : <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium text-sm ${resource.completed ? 'line-through' : ''}`}>{resource.title}</p>
                          </div>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-muted-foreground hover:text-primary transition-colors">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </CardContent>
                      </Card>
                      {i < items.length - 1 && (
                        <div className="flex justify-center py-1"><ArrowDown className="h-3 w-3 text-muted-foreground/50" /></div>
                      )}
                    </div>
                  ))}
                </div>
                {gi < groups.length - 1 && sorted.filter(r => r.difficulty === groups[gi + 1]).length > 0 && (
                  <div className="flex justify-center py-2"><ArrowDown className="h-4 w-4 text-muted-foreground" /></div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LearningPath;

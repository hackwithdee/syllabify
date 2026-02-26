import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LearningResource, ResourceType } from '@/lib/types';
import { getResources, addResource, deleteResource, toggleResourceComplete } from '@/lib/storage';
import { Plus, Trash2, ExternalLink, CheckCircle2, Circle, Search } from 'lucide-react';

interface ResourceLibraryProps {
  userId: string;
}

const typeLabels: Record<ResourceType, string> = {
  article: 'Article', video: 'Video', course: 'Course',
  book: 'Book', podcast: 'Podcast', tutorial: 'Tutorial',
};

const difficultyColors: Record<string, string> = {
  Beginner: 'bg-success/10 text-success border-success/20',
  Intermediate: 'bg-secondary/10 text-secondary border-secondary/20',
  Advanced: 'bg-destructive/10 text-destructive border-destructive/20',
};

const ResourceLibrary = ({ userId }: ResourceLibraryProps) => {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<ResourceType>('article');
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const refresh = () => getResources(userId).then(setResources);
  useEffect(() => { refresh(); }, [userId]);

  const filteredResources = useMemo(() => {
    return resources.filter(r => {
      const matchesSearch = !searchQuery || r.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || r.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [resources, searchQuery, filterType]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    await addResource(userId, title.trim(), url.trim(), type);
    setTitle(''); setUrl(''); setType('article'); setShowForm(false);
    refresh();
  };

  const handleToggle = async (resource: LearningResource) => {
    await toggleResourceComplete(resource.id, resource.completed);
    refresh();
  };

  const handleDelete = async (id: string) => {
    await deleteResource(id);
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display">Resource Library</h1>
          <p className="text-muted-foreground mt-1">{resources.length} resources</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gradient-primary border-0 w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-1" /> Add Resource
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search resources..."
            className="pl-9 h-11"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-40 h-11"><SelectValue placeholder="All types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {Object.entries(typeLabels).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showForm && (
        <Card className="border-0 shadow-md">
          <CardHeader><CardTitle className="text-lg font-display">Add New Resource</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., React Docs" required className="h-11" />
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." type="url" required className="h-11" />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={v => setType(v as ResourceType)}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="gradient-primary border-0">Save Resource</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {filteredResources.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="pt-8 pb-8 text-center">
            <p className="text-muted-foreground">
              {resources.length === 0 ? 'No resources added yet. Click "Add Resource" to get started.' : 'No resources match your search.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredResources.map(resource => (
            <Card key={resource.id} className={`border-0 shadow-sm hover:shadow-md transition-shadow ${resource.completed ? 'opacity-60' : ''}`}>
              <CardContent className="py-3.5 flex items-center gap-3">
                <button onClick={() => handleToggle(resource)} className="shrink-0">
                  {resource.completed ? <CheckCircle2 className="h-5 w-5 text-success" /> : <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${resource.completed ? 'line-through' : ''}`}>{resource.title}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge variant="outline" className="text-xs">{typeLabels[resource.type]}</Badge>
                    <Badge variant="outline" className={`text-xs ${difficultyColors[resource.difficulty]}`}>{resource.difficulty}</Badge>
                  </div>
                </div>
                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-muted-foreground hover:text-primary transition-colors">
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button onClick={() => handleDelete(resource.id)} className="shrink-0 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourceLibrary;

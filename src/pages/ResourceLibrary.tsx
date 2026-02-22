import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { User, Resource, ResourceType } from '@/lib/types';
import { getResources, addResource, deleteResource, toggleResourceComplete } from '@/lib/storage';
import { Plus, Trash2, ExternalLink, CheckCircle2, Circle } from 'lucide-react';

interface ResourceLibraryProps {
  user: User;
}

const typeLabels: Record<ResourceType, string> = {
  article: 'Article',
  video: 'Video',
  course: 'Course',
  book: 'Book',
  podcast: 'Podcast',
  tutorial: 'Tutorial',
};

const difficultyColors: Record<string, string> = {
  Beginner: 'bg-success/10 text-success border-success/20',
  Intermediate: 'bg-secondary/10 text-secondary border-secondary/20',
  Advanced: 'bg-destructive/10 text-destructive border-destructive/20',
};

const ResourceLibrary = ({ user }: ResourceLibraryProps) => {
  const [resources, setResources] = useState(() => getResources(user.id));
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<ResourceType>('article');
  const [showForm, setShowForm] = useState(false);

  const refresh = () => setResources(getResources(user.id));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    addResource(user.id, title.trim(), url.trim(), type);
    setTitle('');
    setUrl('');
    setType('article');
    setShowForm(false);
    refresh();
  };

  const handleToggle = (id: string) => {
    toggleResourceComplete(id);
    refresh();
  };

  const handleDelete = (id: string) => {
    deleteResource(id);
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display">Resource Library</h1>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add Resource
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">Add New Resource</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., React Docs" required />
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." type="url" required />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={v => setType(v as ResourceType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Save Resource</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {resources.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No resources added yet. Click "Add Resource" to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {resources.map(resource => (
            <Card key={resource.id} className={resource.completed ? 'opacity-70' : ''}>
              <CardContent className="py-4 flex items-center gap-3">
                <button onClick={() => handleToggle(resource.id)} className="shrink-0">
                  {resource.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${resource.completed ? 'line-through' : ''}`}>{resource.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{typeLabels[resource.type]}</Badge>
                    <Badge variant="outline" className={`text-xs ${difficultyColors[resource.difficulty]}`}>
                      {resource.difficulty}
                    </Badge>
                  </div>
                </div>
                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-muted-foreground hover:text-primary">
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button onClick={() => handleDelete(resource.id)} className="shrink-0 text-muted-foreground hover:text-destructive">
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

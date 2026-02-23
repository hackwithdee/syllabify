import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { BookOpen } from 'lucide-react';

interface AuthPageProps {
  onAuth: (action: 'login' | 'register', data: { name?: string; email: string; password: string }) => Promise<void>;
}

const AuthPage = ({ onAuth }: AuthPageProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onAuth(isLogin ? 'login' : 'register', { name, email, password });
      if (!isLogin) {
        setConfirmMessage('Check your email to confirm your account before signing in.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-display text-foreground">Syllabify</h1>
          </div>
          <p className="text-muted-foreground">Organize your learning journey</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-display">{isLogin ? 'Welcome back' : 'Create account'}</CardTitle>
            <CardDescription>
              {isLogin ? 'Sign in to continue learning' : 'Start your learning journey today'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {confirmMessage ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-success font-medium">{confirmMessage}</p>
                <Button variant="outline" onClick={() => { setConfirmMessage(''); setIsLogin(true); }}>
                  Go to Sign In
                </Button>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
                  </Button>
                </form>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                  <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-primary hover:underline font-medium">
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/syllabify-logo.png';

interface AuthPageProps {
  onAuth: (action: 'login' | 'register', data: { name?: string; email: string; password: string }) => Promise<void>;
}

const AuthPage = ({ onAuth }: AuthPageProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setConfirmMessage('Check your email for a password reset link.');
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
          <img src={logo} alt="Syllabify" className="h-20 sm:h-24 mx-auto mb-3 object-contain" />
          <p className="text-muted-foreground text-lg">Your smart learning companion</p>
        </div>

        <Card className="shadow-lg border-0 bg-card">
          <CardHeader className="text-center pb-4">
            <CardTitle className="font-display text-2xl">
              {showForgot ? 'Reset Password' : isLogin ? 'Welcome back' : 'Create account'}
            </CardTitle>
            <CardDescription className="text-base">
              {showForgot ? 'Enter your email to receive a reset link' : isLogin ? 'Sign in to continue learning' : 'Start your learning journey today'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {confirmMessage ? (
              <div className="text-center space-y-4">
                <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                  <p className="text-sm text-success font-medium">{confirmMessage}</p>
                </div>
                <Button variant="outline" onClick={() => { setConfirmMessage(''); setIsLogin(true); setShowForgot(false); }}>
                  Go to Sign In
                </Button>
              </div>
            ) : showForgot ? (
              <>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input id="reset-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="h-11" />
                  </div>
                  {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}
                  <Button type="submit" className="w-full h-11 text-base font-semibold gradient-primary border-0" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </form>
                <button onClick={() => { setShowForgot(false); setError(''); }} className="flex items-center gap-1 text-sm text-primary hover:underline mt-4 mx-auto">
                  <ArrowLeft className="h-3 w-3" /> Back to login
                </button>
              </>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required className="h-11" />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      {isLogin && (
                        <button type="button" onClick={() => { setShowForgot(true); setError(''); }} className="text-xs text-primary hover:underline">
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength={6}
                        className="h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}
                  <Button type="submit" className="w-full h-11 text-base font-semibold gradient-primary border-0" disabled={loading}>
                    {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
                  </Button>
                </form>
                <p className="text-center text-sm text-muted-foreground mt-5">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                  <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-primary hover:underline font-semibold">
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

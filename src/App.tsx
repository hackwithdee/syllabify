import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from '@/hooks/useAuth';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import LearningPath from './pages/LearningPath';
import ResourceLibrary from './pages/ResourceLibrary';
import StudyPlanner from './pages/StudyPlanner';
import UserProfile from './pages/UserProfile';
import AppLayout from './components/AppLayout';
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, login, register, logout, update } = useAuth();
  const [authError, setAuthError] = useState('');
  // Force re-render when data changes
  const [, setTick] = useState(0);
  const refresh = () => setTick(t => t + 1);

  const handleAuth = (action: 'login' | 'register', data: { name?: string; email: string; password: string }) => {
    try {
      setAuthError('');
      if (action === 'login') {
        login(data.email, data.password);
      } else {
        register(data.name || '', data.email, data.password);
      }
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  if (!user) {
    return <AuthPage onAuth={handleAuth} error={authError} />;
  }

  return (
    <BrowserRouter>
      <AppLayout onLogout={logout} userName={user.name}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/learning-path" element={<LearningPath user={user} />} />
          <Route path="/resources" element={<ResourceLibrary user={user} />} />
          <Route path="/planner" element={<StudyPlanner user={user} />} />
          <Route path="/profile" element={<UserProfile user={user} onUpdate={(u) => { update(u); refresh(); }} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

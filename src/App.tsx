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
  const { user, profile, loading, login, register, logout, updateProfile } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user || !profile) {
    return <AuthPage onAuth={async (action, data) => {
      if (action === 'login') {
        await login(data.email, data.password);
      } else {
        await register(data.name || '', data.email, data.password);
      }
    }} />;
  }

  return (
    <BrowserRouter>
      <AppLayout onLogout={logout} userName={profile.full_name || user.email || ''}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard userId={user.id} profile={profile} />} />
          <Route path="/learning-path" element={<LearningPath userId={user.id} />} />
          <Route path="/resources" element={<ResourceLibrary userId={user.id} />} />
          <Route path="/planner" element={<StudyPlanner userId={user.id} studyTimeMinutes={profile.study_time_minutes} />} />
          <Route path="/profile" element={<UserProfile profile={profile} email={user.email || ''} onUpdate={updateProfile} />} />
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

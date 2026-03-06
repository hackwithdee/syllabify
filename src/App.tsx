import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import AuthPage from './pages/AuthPage';
import ResetPassword from './pages/ResetPassword';
import OnboardingPage from './pages/OnboardingPage';
import Dashboard from './pages/Dashboard';
import LearningPath from './pages/LearningPath';
import ResourceLibrary from './pages/ResourceLibrary';
import StudyPlanner from './pages/StudyPlanner';
import UserProfile from './pages/UserProfile';
import ExplorePage from './pages/ExplorePage';
import RoadmapPage from './pages/RoadmapPage';
import FriendsPage from './pages/FriendsPage';
import AppLayout from './components/AppLayout';
import NotFound from "./pages/NotFound";
import logo from '@/assets/syllabify-logo.png';

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, profile, loading, login, register, logout, updateProfile, fetchProfile } = useAuth();
  const sub = useSubscription(user?.id ?? null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <img src={logo} alt="Syllabify" className="h-16 w-auto object-contain animate-pulse" />
          <p className="text-muted-foreground font-medium font-display">Loading Syllabify...</p>
        </div>
      </div>
    );
  }

  if (window.location.pathname === '/reset-password') {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/reset-password" replace />} />
        </Routes>
      </BrowserRouter>
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

  if (!profile.onboarding_completed) {
    return <OnboardingPage
      userName={profile.full_name}
      onComplete={async (data) => {
        await updateProfile({
          ...data,
          onboarding_completed: true,
        });
      }}
    />;
  }

  return (
    <BrowserRouter>
      <AppLayout onLogout={logout} userName={profile.full_name || user.email || ''} userId={user.id} isPremium={sub.isPremium} onUpgrade={sub.upgradeToPremium}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard userId={user.id} profile={profile} isPremium={sub.isPremium} onUpgrade={sub.upgradeToPremium} />} />
          <Route path="/roadmap" element={
            <RoadmapPage
              userId={user.id}
              learningGoal={profile.learning_goal}
              isPremium={sub.isPremium}
              canGenerate={sub.canGenerateRoadmap()}
              generationsLeft={sub.roadmapGenerationsLeft()}
              onGenerate={sub.incrementRoadmapGeneration}
              onUpgrade={sub.upgradeToPremium}
            />
          } />
          <Route path="/learning-path" element={<LearningPath userId={user.id} />} />
          <Route path="/explore" element={
            <ExplorePage
              userId={user.id}
              learningGoal={profile.learning_goal}
              isPremium={sub.isPremium}
              canAddResource={sub.canAddResource()}
              resourcesLeft={sub.resourcesLeft()}
              onResourceAdded={sub.incrementResourceCount}
            />
          } />
          <Route path="/resources" element={
            <ResourceLibrary
              userId={user.id}
              isPremium={sub.isPremium}
              canAddResource={sub.canAddResource()}
              resourcesLeft={sub.resourcesLeft()}
              onResourceAdded={sub.incrementResourceCount}
              onResourceDeleted={sub.decrementResourceCount}
            />
          } />
          <Route path="/planner" element={<StudyPlanner userId={user.id} studyTimeMinutes={profile.study_time_minutes} />} />
          <Route path="/friends" element={<FriendsPage userId={user.id} userName={profile.full_name} />} />
          <Route path="/profile" element={
            <UserProfile
              profile={profile}
              email={user.email || ''}
              onUpdate={updateProfile}
              isPremium={sub.isPremium}
              onUpgrade={sub.upgradeToPremium}
              onDowngrade={sub.downgradeToFree}
            />
          } />
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

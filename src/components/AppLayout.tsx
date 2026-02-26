import { NavLink } from '@/components/NavLink';
import { BookOpen, LayoutDashboard, Route, Library, CalendarDays, User, LogOut, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  userName: string;
}

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/learning-path', icon: Route, label: 'Learning Path' },
  { to: '/explore', icon: Sparkles, label: 'Explore' },
  { to: '/resources', icon: Library, label: 'Resources' },
  { to: '/planner', icon: CalendarDays, label: 'Planner' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const AppLayout = ({ children, onLogout, userName }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="sticky top-0 z-50 border-b bg-card/90 backdrop-blur-md shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl gradient-primary">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-display text-foreground">Syllabify</span>
          </div>
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                activeClassName="text-primary bg-primary/10 font-semibold shadow-sm"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="h-8 w-8 rounded-full gradient-secondary flex items-center justify-center text-sm font-bold text-secondary-foreground">
                {(userName || '?')[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium text-foreground">{userName.split(' ')[0]}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onLogout} title="Sign out" className="text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-md shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around py-1 px-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex flex-col items-center gap-0.5 px-1.5 py-1.5 text-[10px] text-muted-foreground transition-all duration-200 rounded-lg"
              activeClassName="text-primary font-semibold"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label.split(' ')[0]}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <main className="container py-6 pb-24 lg:pb-6 animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;

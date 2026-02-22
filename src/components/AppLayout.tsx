import { NavLink } from '@/components/NavLink';
import { BookOpen, LayoutDashboard, Route, Library, CalendarDays, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  userName: string;
}

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/learning-path', icon: Route, label: 'Learning Path' },
  { to: '/resources', icon: Library, label: 'Resources' },
  { to: '/planner', icon: CalendarDays, label: 'Study Planner' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const AppLayout = ({ children, onLogout, userName }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold font-display text-foreground">Syllabify</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                activeClassName="text-primary bg-primary/10 font-medium"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">Hi, {userName.split(' ')[0]}</span>
            <Button variant="ghost" size="icon" onClick={onLogout} title="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-sm">
        <div className="flex justify-around py-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex flex-col items-center gap-0.5 px-2 py-1.5 text-xs text-muted-foreground transition-colors"
              activeClassName="text-primary font-medium"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label.split(' ')[0]}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <main className="container py-6 pb-20 md:pb-6">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;

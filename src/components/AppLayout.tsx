import { useState, useEffect } from 'react';
import { NavLink } from '@/components/NavLink';
import { LayoutDashboard, Route, Library, CalendarDays, User, LogOut, Sparkles, Map, Users, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getNotifications, markAllNotificationsRead } from '@/lib/storage';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import PremiumBadge from '@/components/PremiumBadge';
import UpgradeCard from '@/components/UpgradeCard';
import UpgradeDialog from '@/components/UpgradeDialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import logo from '@/assets/syllabify-logo.png';

interface AppLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  userName: string;
  userId: string;
  isPremium?: boolean;
  onUpgrade?: () => Promise<void>;
}

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/roadmap', icon: Map, label: 'Roadmap' },
  { to: '/learning-path', icon: Route, label: 'Path' },
  { to: '/explore', icon: Sparkles, label: 'Explore' },
  { to: '/resources', icon: Library, label: 'Resources' },
  { to: '/planner', icon: CalendarDays, label: 'Planner' },
  { to: '/friends', icon: Users, label: 'Friends' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const mobileNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/roadmap', icon: Map, label: 'Roadmap' },
  { to: '/explore', icon: Sparkles, label: 'Explore' },
  { to: '/planner', icon: CalendarDays, label: 'Study' },
  { to: '/friends', icon: Users, label: 'Friends' },
];

const AppLayout = ({ children, onLogout, userName, userId, isPremium, onUpgrade }: AppLayoutProps) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotif, setShowNotif] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    if (userId) {
      getNotifications(userId).then(setNotifications).catch(() => {});
    }
  }, [userId]);

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead(userId);
    setNotifications(prev => prev.map((n: any) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-md shadow-sm">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Syllabify" className="h-8 w-auto object-contain" />
            {isPremium && <PremiumBadge className="hidden sm:inline-flex" />}
          </div>
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map(item => (
              <NavLink key={item.to} to={item.to}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                activeClassName="text-primary bg-primary/10 font-semibold">
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {!isPremium && <UpgradeCard compact onUpgrade={() => setShowUpgrade(true)} />}

            <Popover open={showNotif} onOpenChange={setShowNotif}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-muted-foreground">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <span className="font-display font-bold text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAllRead} className="text-xs text-primary hover:underline">Mark all read</button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-6">No notifications yet</p>
                  ) : (
                    notifications.slice(0, 10).map((n: any) => (
                      <div key={n.id} className={`px-4 py-3 border-b last:border-0 text-sm ${!n.read ? 'bg-primary/5' : ''}`}>
                        <p className="font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <div className="hidden sm:flex items-center gap-2">
              <div className="h-7 w-7 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                {(userName || '?')[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium text-foreground">{userName.split(' ')[0]}</span>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Sign out" className="text-muted-foreground hover:text-destructive">
                  <LogOut className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display">Sign out?</AlertDialogTitle>
                  <AlertDialogDescription>Are you sure you want to sign out of Syllabify? Your progress is saved.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Sign Out</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-md shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around py-1 px-1">
          {mobileNavItems.map(item => (
            <NavLink key={item.to} to={item.to}
              className="flex flex-col items-center gap-0.5 px-1 py-1.5 text-[10px] text-muted-foreground transition-all duration-200 rounded-lg"
              activeClassName="text-primary font-semibold">
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <main className="container py-6 pb-24 lg:pb-6 animate-fade-in">
        {children}
      </main>

      <UpgradeDialog open={showUpgrade} onOpenChange={setShowUpgrade} onUpgrade={onUpgrade} />
    </div>
  );
};

export default AppLayout;

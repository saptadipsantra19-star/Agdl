import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, AlertTriangle, Map as MapIcon, User as UserIcon, Bot, LogOut, Sun, Moon, ShoppingCart, MoreHorizontal, X, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/firebase';
import { useTheme } from './ThemeProvider';
import { useState } from 'react';

export default function Layout() {
  const { pathname } = useLocation();
  const { user, loading, error, signIn, logOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showMobileMore, setShowMobileMore] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSignOut = () => {
    localStorage.removeItem('dl_gemini_chat_history');
    logOut();
  };

  const desktopNavItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Diagnosis', path: '/diagnosis', icon: Stethoscope },
    { name: 'Problems', path: '/alerts', icon: AlertTriangle },
    { name: 'Map', path: '/map', icon: MapIcon },
    { name: 'Profile', path: '/profile', icon: UserIcon },
    { name: 'Online Shopping', path: '/shopping', icon: ShoppingCart },
  ];

  const mobileNavItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Diagnosis', path: '/diagnosis', icon: Stethoscope },
    { name: 'Map', path: '/map', icon: MapIcon },
    { name: 'AI', path: '/ai', icon: Bot },
  ];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading Agriculture with DL...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="bg-surface p-8 rounded-2xl shadow-sm border border-border max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-on-primary text-2xl font-bold mx-auto mb-6">
            DL
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">Welcome to Agriculture with DL</h1>
          <p className="text-sm text-text-muted mb-8">Sign in to access your farmer dashboard, crop prices, and AI assistant.</p>
          
          {error && <div className="text-sm text-red-600 mb-4 bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
          
          <button 
            onClick={signIn}
            className="w-full bg-primary text-on-primary rounded-xl py-3 font-semibold hover:bg-primary active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-text-main min-h-screen flex flex-col font-sans pb-20 md:pb-0 md:pl-64">
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex flex-col h-full w-64 rounded-r-xl bg-surface shadow-xl fixed top-0 left-0 z-40 py-8">
        <div className="px-4 mb-8 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold">
            DL
          </div>
          <div>
            <h2 className="font-semibold text-primary truncate max-w-[140px]">{user.displayName || 'Farmer'}</h2>
            <p className="text-xs text-text-muted">Verified User</p>
          </div>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          {desktopNavItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-3 text-sm px-4 py-3 mx-2 rounded-lg transition-all duration-200",
                pathname === item.path 
                  ? "bg-primary-fixed text-[#002114] font-medium" 
                  : "text-text-muted hover:bg-slate-100"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
          <Link
            to="/ai"
            className={cn(
              "flex items-center gap-3 text-sm px-4 py-3 mx-2 rounded-lg transition-all duration-200 mt-4",
              pathname === '/ai' 
                ? "bg-primary text-on-primary font-medium" 
                : "text-text-muted hover:bg-slate-100"
            )}
          >
            <Bot className="w-5 h-5" />
            DL with Gemini
          </Link>
          
          <div className="mt-auto px-2 pt-4 flex flex-col gap-2">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 text-sm px-4 py-3 rounded-lg transition-all duration-200 text-text-main hover:bg-background font-medium"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 text-sm px-4 py-3 rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50 font-medium"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </nav>
      </aside>

      <main className="flex-grow w-full max-w-7xl mx-auto relative">
        <Outlet />
      </main>

      <button
        onClick={toggleTheme}
        className="md:hidden fixed top-3 right-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-surface border border-border shadow-sm text-text-main"
      >
        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center h-20 px-2 pb-safe bg-surface border-t border-border shadow-lg rounded-t-xl">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-[20%] h-full transition-colors",
                isActive ? "text-primary" : "text-text-muted hover:text-primary"
              )}
            >
              <div className={cn(
                "w-12 h-8 flex items-center justify-center rounded-xl mb-1 transition-colors",
                isActive && "bg-primary-fixed"
              )}>
                <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn("text-[10px] font-medium", isActive && "font-bold")}>
                {item.name}
              </span>
            </Link>
          );
        })}
        
        {/* More Button */}
        <button
          onClick={() => setShowMobileMore(true)}
          className="flex flex-col items-center justify-center w-[20%] h-full transition-colors text-text-muted hover:text-primary"
        >
          <div className="w-12 h-8 flex items-center justify-center rounded-xl mb-1 transition-colors">
            <MoreHorizontal className="w-6 h-6" strokeWidth={2} />
          </div>
          <span className="text-[10px] font-medium">More</span>
        </button>
      </nav>

      {/* Mobile More Sheet */}
      {showMobileMore && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface w-full rounded-t-2xl shadow-xl border-t border-border animate-in slide-in-from-bottom-full duration-300">
            <div className="p-4 flex items-center justify-between border-b border-border">
              <h3 className="font-bold text-lg text-primary">More Options</h3>
              <button onClick={() => setShowMobileMore(false)} className="p-2 text-text-muted hover:text-text-main rounded-full hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <Link to="/profile" onClick={() => setShowMobileMore(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-border">
                <UserIcon className="w-6 h-6 text-primary" />
                <div>
                  <h4 className="font-semibold text-text-main">Profile</h4>
                  <p className="text-xs text-text-muted">View your account settings</p>
                </div>
              </Link>

              <Link to="/alerts" onClick={() => setShowMobileMore(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-border">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
                <div>
                  <h4 className="font-semibold text-text-main">Problems</h4>
                  <p className="text-xs text-text-muted">Manage farm alerts</p>
                </div>
              </Link>
              
              <Link to="/shopping" onClick={() => setShowMobileMore(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-border bg-primary/5">
                <ShoppingCart className="w-6 h-6 text-primary" />
                <div>
                  <h4 className="font-semibold text-text-main">Online Shopping</h4>
                  <p className="text-xs text-text-muted flex items-center gap-1">
                    Amazon & Flipkart <ExternalLink className="w-3 h-3" />
                  </p>
                </div>
              </Link>

              <button onClick={() => { handleSignOut(); setShowMobileMore(false); }} className="w-full flex items-center justify-center gap-2 p-4 text-red-600 font-semibold hover:bg-red-50 rounded-xl transition-colors mt-4">
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { AppView, User } from './types';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import CreativeStudio from './components/CreativeStudio';
import VoiceMentor from './components/VoiceMentor';
import NeuralHub from './components/NeuralHub';
import NeuralNotes from './components/NeuralNotes';
import AboutView from './components/AboutView';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import Logo from './components/Logo';
import LandingPage from './components/LandingPage';
import GlobalSearch from './components/GlobalSearch';
import { LayoutDashboard, MessageSquare, Palette, Mic, Info, ShieldCheck, LogOut, Sun, Moon, Search, BookMarked } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY_USER = 'db_ai_session_user';
const STORAGE_KEY_THEME = 'db_ai_theme';

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    return saved ? JSON.parse(saved) : null;
  });
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem(STORAGE_KEY_THEME) as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [user]);

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleEnterApp = () => {
    setShowLanding(false);
  };

  const handleSearchResultClick = (view: AppView) => {
    setCurrentView(view);
    setIsSearchOpen(false);
  };

  if (showLanding) {
    return (
      <AnimatePresence mode="wait">
        <LandingPage onEnter={handleEnterApp} />
      </AnimatePresence>
    );
  }

  if (!user) {
    return (
      <AnimatePresence mode="wait">
        <Login onLogin={setUser} />
      </AnimatePresence>
    );
  }

  const renderContent = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 1.02 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="h-full w-full"
        >
          {(() => {
            switch (currentView) {
              case AppView.DASHBOARD:
                return <NeuralHub user={user} setView={setCurrentView} />;
              case AppView.CHAT:
                return <ChatInterface user={user} onLogout={handleLogout} setView={setCurrentView} />;
              case AppView.CREATIVE:
                return <CreativeStudio user={user} setView={setCurrentView} />;
              case AppView.VOICE:
                return <VoiceMentor setView={setCurrentView} />;
              case AppView.NOTES:
                return <NeuralNotes user={user} setView={setCurrentView} />;
              case AppView.ABOUT:
                return <AboutView user={user} setView={setCurrentView} />;
              case AppView.ADMIN:
                return user.role === 'ADMIN' ? <AdminPanel onLogout={handleLogout} /> : <NeuralHub user={user} setView={setCurrentView} />;
              default:
                return <NeuralHub user={user} setView={setCurrentView} />;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="flex h-screen bg-transparent text-slate-900 dark:text-slate-200 overflow-hidden font-['Plus_Jakarta_Sans'] transition-colors duration-300 relative">
      {/* Dynamic Colorful Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
            opacity: [0.03, 0.07, 0.03]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ willChange: 'transform, opacity' }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-pink-500 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1],
            rotate: [0, -8, 0],
            opacity: [0.03, 0.07, 0.03]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 2 }}
          style={{ willChange: 'transform, opacity' }}
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-indigo-500 blur-[120px] rounded-full"
        />
      </div>

      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        user={user}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <main className="flex-1 flex flex-col h-full relative overflow-hidden z-10">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5 shrink-0 z-50 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <Logo size={20} />
            <div className="flex flex-col">
              <h1 className="font-black text-xs tracking-tighter bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent uppercase">LIPI AI</h1>
              <span className="text-[8px] font-black text-pink-500 uppercase tracking-widest">Colorful Edition</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-xl border border-black/5 dark:border-white/5 active:scale-95 transition-all"
            >
              <Search size={18} />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 bg-rose-500/10 text-rose-500 rounded-xl border border-rose-500/20 active:scale-95 transition-all"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {renderContent()}
        </div>

        {/* Optimized Mobile Navigation */}
        <nav className="md:hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl border-t border-black/5 dark:border-white/5 flex justify-around py-3 shrink-0 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pb-safe transition-colors duration-300">
          <button 
            onClick={() => setCurrentView(AppView.DASHBOARD)}
            className={`flex flex-col items-center gap-1 transition-all ${currentView === AppView.DASHBOARD ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-slate-400 dark:text-slate-500'}`}
          >
            <LayoutDashboard size={20} />
          </button>
          <button 
            onClick={() => setCurrentView(AppView.CHAT)}
            className={`flex flex-col items-center gap-1 transition-all ${currentView === AppView.CHAT ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-slate-400 dark:text-slate-500'}`}
          >
            <MessageSquare size={20} />
          </button>
          <button 
            onClick={() => setCurrentView(AppView.VOICE)}
            className={`flex flex-col items-center gap-1 transition-all ${currentView === AppView.VOICE ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-slate-400 dark:text-slate-500'}`}
          >
            <Mic size={20} />
          </button>
          <button 
            onClick={() => setCurrentView(AppView.CREATIVE)}
            className={`flex flex-col items-center gap-1 transition-all ${currentView === AppView.CREATIVE ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-slate-400 dark:text-slate-500'}`}
          >
            <Palette size={20} />
          </button>
          <button 
            onClick={() => setCurrentView(AppView.NOTES)}
            className={`flex flex-col items-center gap-1 transition-all ${currentView === AppView.NOTES ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-slate-400 dark:text-slate-500'}`}
          >
            <BookMarked size={20} />
          </button>
        </nav>
      </main>

      <AnimatePresence>
        {isSearchOpen && (
          <GlobalSearch 
            user={user} 
            onClose={() => setIsSearchOpen(false)} 
            onResultClick={handleSearchResultClick}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;

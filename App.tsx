
import React, { useState, useEffect } from 'react';
import { AppView, User, UserRole } from './types';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import CreativeStudio from './components/CreativeStudio';
import VoiceMentor from './components/VoiceMentor';
import AboutView from './components/AboutView';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import Logo from './components/Logo';
import { MessageSquare, Palette, Mic, Info, ShieldCheck, LogOut } from 'lucide-react';

const STORAGE_KEY_USER = 'db_ai_session_user';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    return saved ? JSON.parse(saved) : null;
  });
  const [currentView, setCurrentView] = useState<AppView>(AppView.CHAT);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [user]);

  const handleLogout = () => {
    // Direct logout for better reliability
    setUser(null);
    setCurrentView(AppView.CHAT);
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case AppView.CHAT:
        return <ChatInterface user={user} onLogout={handleLogout} />;
      case AppView.CREATIVE:
        return <CreativeStudio user={user} />;
      case AppView.VOICE:
        return <VoiceMentor />;
      case AppView.ABOUT:
        return <AboutView />;
      case AppView.ADMIN:
        return user.role === 'ADMIN' ? <AdminPanel onLogout={handleLogout} /> : <ChatInterface user={user} onLogout={handleLogout} />;
      default:
        return <ChatInterface user={user} onLogout={handleLogout} />;
    }
  };

  return (
    <div className="flex h-screen bg-transparent text-slate-200 overflow-hidden font-['Plus_Jakarta_Sans']">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col h-full relative">
        {/* Mobile Top Header */}
        <header className="md:hidden flex items-center justify-between px-6 py-4 bg-slate-900/50 backdrop-blur-xl border-b border-white/5 z-50">
          <div className="flex items-center gap-3">
            <Logo size={20} />
            <h1 className="font-black text-sm tracking-tighter text-white">DON BOSCO AI</h1>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 bg-rose-500/10 text-rose-500 rounded-xl border border-rose-500/20"
          >
            <LogOut size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-hidden relative">
          {renderContent()}
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-2xl border-t border-white/5 flex justify-around py-4 z-50 shadow-2xl pb-safe">
          <button 
            onClick={() => setCurrentView(AppView.CHAT)}
            className={`flex flex-col items-center gap-1 transition-all ${currentView === AppView.CHAT ? 'text-blue-400 scale-110' : 'text-slate-500'}`}
          >
            <MessageSquare size={20} />
            <span className="text-[9px] font-black uppercase tracking-widest">Chat</span>
          </button>
          <button 
            onClick={() => setCurrentView(AppView.CREATIVE)}
            className={`flex flex-col items-center gap-1 transition-all ${currentView === AppView.CREATIVE ? 'text-blue-400 scale-110' : 'text-slate-500'}`}
          >
            <Palette size={20} />
            <span className="text-[9px] font-black uppercase tracking-widest">Art</span>
          </button>
          <button 
            onClick={() => setCurrentView(AppView.VOICE)}
            className={`flex flex-col items-center gap-1 transition-all ${currentView === AppView.VOICE ? 'text-blue-400 scale-110' : 'text-slate-500'}`}
          >
            <Mic size={20} />
            <span className="text-[9px] font-black uppercase tracking-widest">Voice</span>
          </button>
          {user.role === 'ADMIN' && (
            <button 
              onClick={() => setCurrentView(AppView.ADMIN)}
              className={`flex flex-col items-center gap-1 transition-all ${currentView === AppView.ADMIN ? 'text-indigo-400 scale-110' : 'text-slate-500'}`}
            >
              <ShieldCheck size={20} />
              <span className="text-[9px] font-black uppercase tracking-widest">Admin</span>
            </button>
          )}
          <button 
            onClick={() => setCurrentView(AppView.ABOUT)}
            className={`flex flex-col items-center gap-1 transition-all ${currentView === AppView.ABOUT ? 'text-blue-400 scale-110' : 'text-slate-500'}`}
          >
            <Info size={20} />
            <span className="text-[9px] font-black uppercase tracking-widest">App</span>
          </button>
        </nav>
      </main>
    </div>
  );
};

export default App;

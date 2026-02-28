
import React from 'react';
import { AppView, User } from '../types';
import { LayoutDashboard, MessageSquare, Palette, Info, ShieldCheck, LogOut, Sun, Moon, Search, BookMarked, Trash2, ShieldAlert, Mic } from 'lucide-react';
import Logo from './Logo';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  user: User;
  onLogout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onOpenSearch: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, user, onLogout, theme, toggleTheme, onOpenSearch }) => {
  const navItems = [
    { id: AppView.DASHBOARD, label: 'Neural Hub', icon: LayoutDashboard },
    { id: AppView.CHAT, label: 'Mentor Chat', icon: MessageSquare },
    { id: AppView.VOICE, label: 'Voice Lab', icon: Mic },
    { id: AppView.CREATIVE, label: 'Creative Studio', icon: Palette },
    { id: AppView.NOTES, label: 'Neural Notepad', icon: BookMarked },
    { id: AppView.ABOUT, label: 'About App', icon: Info },
  ];

  const handlePurgeData = () => {
    if (confirm("DANGER: This will permanently delete ALL your local data from this device. Continue?")) {
      const userSuffix = user.username.replace(/\s+/g, '_');
      localStorage.removeItem(`db_ai_chat_history_${userSuffix}`);
      localStorage.removeItem(`db_ai_art_history_${userSuffix}`);
      localStorage.removeItem(`db_ai_notes_${userSuffix}`);
      alert("Neural core wiped.");
      onLogout();
    }
  };

  if (user.role === 'ADMIN') {
    navItems.splice(navItems.length - 1, 0, { id: AppView.ADMIN, label: 'Admin Dashboard', icon: ShieldCheck });
  }

  return (
    <aside className="hidden md:flex flex-col w-72 bg-white/40 dark:bg-slate-950/60 backdrop-blur-2xl border-r border-black/5 dark:border-white/5 p-8 h-full shadow-2xl z-20 transition-colors duration-300">
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex items-center gap-4 mb-12 px-2"
      >
        <Logo size={28} />
        <div>
          <h1 className="font-black text-2xl leading-tight tracking-tighter bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent uppercase">
            LIPI AI
          </h1>
          <p className="text-[10px] text-pink-600 dark:text-pink-500 uppercase tracking-widest font-black">Colorful Edition</p>
        </div>
      </motion.div>

      <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-hide">
        <motion.button
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenSearch}
          className="w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 mb-4 group border border-dashed border-pink-500/30"
        >
          <Search size={22} className="text-pink-500" />
          Neural Search
        </motion.button>

        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <motion.button
              key={item.id}
              whileHover={{ x: isActive ? 0 : 5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 relative overflow-hidden group ${
                isActive
                  ? 'bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20 shadow-lg'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebarActive"
                  className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 z-0"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon size={22} className={`relative z-10 ${isActive ? 'text-pink-600 dark:text-pink-400' : 'text-slate-400 dark:text-slate-600'}`} />
              <span className="relative z-10">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="sidebarActiveIndicator"
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-gradient-to-b from-pink-500 to-purple-500 rounded-l-full shadow-[0_0_15px_rgba(236,72,153,0.5)] z-10" 
                />
              )}
            </motion.button>
          );
        })}
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePurgeData}
          className="w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 mt-8"
        >
          <Trash2 size={18} />
          Purge Session
        </motion.button>
      </nav>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pt-8 border-t border-black/5 dark:border-white/5 mt-8 space-y-4"
      >
        {user.isPrivate && (
          <div className="flex items-center gap-3 px-5 py-3 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
             <ShieldAlert size={16} className="text-emerald-500" />
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Private Incognito</span>
          </div>
        )}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={toggleTheme}
          className="w-full flex items-center gap-4 px-5 py-3 text-slate-600 dark:text-slate-400 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border border-black/5 dark:border-white/5"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </motion.div>
          </AnimatePresence>
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </motion.button>
        <div className="flex items-center gap-4 px-4 py-3 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 shadow-inner">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-lg border border-white/10">
            {user.profilePhoto ? <img src={user.profilePhoto} className="w-full h-full object-cover rounded-xl" /> : user.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.username}</p>
            <p className="text-[9px] font-black uppercase tracking-tighter text-pink-500">{user.role}</p>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02, backgroundColor: "rgb(244 63 94)" }}
          whileTap={{ scale: 0.98 }}
          onClick={onLogout} 
          className="w-full flex items-center gap-4 px-5 py-3.5 text-rose-500 bg-rose-500/5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
        >
          <LogOut size={18} /> Sign Out
        </motion.button>
      </motion.div>
    </aside>
  );
};

export default Sidebar;

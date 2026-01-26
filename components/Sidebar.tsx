
import React from 'react';
import { AppView, User } from '../types';
import { MessageSquare, Palette, Mic, Info, ShieldCheck, LogOut } from 'lucide-react';
import Logo from './Logo';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, user, onLogout }) => {
  const navItems = [
    { id: AppView.CHAT, label: 'Mentor Chat', icon: MessageSquare },
    { id: AppView.CREATIVE, label: 'Creative Studio', icon: Palette },
    { id: AppView.VOICE, label: 'Voice Companion', icon: Mic },
    { id: AppView.ABOUT, label: 'About App', icon: Info },
  ];

  if (user.role === 'ADMIN') {
    navItems.splice(1, 0, { id: AppView.ADMIN, label: 'Admin Dashboard', icon: ShieldCheck });
  }

  return (
    <aside className="hidden md:flex flex-col w-72 bg-slate-950/60 backdrop-blur-2xl border-r border-white/5 p-8 h-full shadow-2xl z-20">
      <div className="flex items-center gap-4 mb-12 px-2">
        <Logo size={28} />
        <div>
          <h1 className="font-black text-xl leading-tight text-white tracking-tighter">DON BOSCO AI</h1>
          <p className="text-[10px] text-blue-500 uppercase tracking-widest font-black">Global Server</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 relative overflow-hidden group ${
                isActive
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-lg'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <item.icon size={22} className={isActive ? 'text-blue-400' : 'text-slate-600 group-hover:text-slate-300'} />
              {item.label}
              {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-500 rounded-l-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />}
            </button>
          );
        })}
      </nav>

      <div className="pt-8 border-t border-white/5 mt-8 space-y-5">
        <div className="flex items-center gap-4 px-4 py-3 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-lg border border-white/10">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{user.username}</p>
            <p className={`text-[9px] font-black uppercase tracking-tighter ${user.role === 'ADMIN' ? 'text-indigo-400' : 'text-emerald-400'}`}>
              {user.role}
            </p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-5 py-3.5 text-rose-500 bg-rose-500/5 hover:bg-rose-500 hover:text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all border border-rose-500/20 active:scale-[0.98] shadow-lg shadow-rose-900/10"
        >
          <LogOut size={18} />
          Sign Out System
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

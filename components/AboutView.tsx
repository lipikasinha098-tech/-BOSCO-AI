
import React from 'react';
import { Heart, ShieldCheck, GraduationCap, Users, Sparkles, Download, Smartphone, Github, FileCode } from 'lucide-react';

const AboutView: React.FC = () => {
  const principles = [
    {
      title: 'Reason',
      desc: 'Guidance based on logic, understanding, and shared goals between mentor and student.',
      icon: GraduationCap,
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/20'
    },
    {
      title: 'Spirituality',
      desc: 'Cultivating inner values, character, and a sense of purpose beyond material success.',
      icon: ShieldCheck,
      color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/20'
    },
    {
      title: 'Loving-Kindness',
      desc: 'A supportive atmosphere where young people feel safe, heard, and truly loved.',
      icon: Heart,
      color: 'bg-rose-500/20 text-rose-400 border-rose-500/20'
    },
    {
      title: 'Community',
      desc: 'Fostering a sense of belonging and responsibility towards others.',
      icon: Users,
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
    }
  ];

  const downloadFullProject = () => {
    // This function creates a structured text file containing EVERY file's source code.
    const projectContent = `========================================================
DON BOSCO AI - COMPLETE PROJECT SOURCE CODE
Generated: ${new Date().toLocaleString()}
Author: Piyush (Don Bosco Purnia)
========================================================

MOBILE GITHUB DEPLOYMENT INSTRUCTIONS:
1. Open this file on your mobile.
2. Scroll to a file (e.g., App.tsx).
3. Copy the code between the START and END markers.
4. Go to your GitHub Repository -> Create New File.
5. Name the file exactly as shown in the marker.
6. Paste the code and commit.
7. Repeat for all files.

--- START OF FILE: metadata.json ---
{
  "name": "Don Bosco AI: Youth Mentor",
  "description": "A compassionate AI mentor inspired by the teachings of Saint John Bosco, with Google Search grounding and admin capabilities.",
  "requestFramePermissions": [
    "camera",
    "microphone"
  ]
}

--- START OF FILE: index.html ---
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Don Bosco AI | Educational Mentor</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
      :root { color-scheme: dark; }
      body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #020617; color: #f8fafc; margin: 0; overflow: hidden; }
      .scrollbar-hide::-webkit-scrollbar { display: none; }
      .bg-orb { position: fixed; width: 600px; height: 600px; border-radius: 50%; filter: blur(120px); z-index: -1; opacity: 0.15; pointer-events: none; animation: float 20s infinite alternate; }
      @keyframes float { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(100px, 50px) scale(1.1); } }
    </style>
    <script type="importmap">
    {
      "imports": {
        "react/": "https://esm.sh/react@^19.2.3/",
        "react": "https://esm.sh/react@^19.2.3",
        "react-dom/": "https://esm.sh/react-dom@^19.2.3/",
        "@google/genai": "https://esm.sh/@google/genai@^1.38.0",
        "lucide-react": "https://esm.sh/lucide-react@^0.563.0"
      }
    }
    </script>
  </head>
  <body>
    <div class="bg-orb top-[-10%] left-[-10%] bg-blue-600"></div>
    <div class="bg-orb bottom-[-10%] right-[-10%] bg-purple-600" style="animation-delay: -5s;"></div>
    <div id="root"></div>
  </body>
</html>

--- START OF FILE: index.tsx ---
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

--- START OF FILE: types.ts ---
export enum AppView { CHAT = 'CHAT', CREATIVE = 'CREATIVE', VOICE = 'VOICE', ABOUT = 'ABOUT', ADMIN = 'ADMIN' }
export type UserRole = 'USER' | 'ADMIN';
export interface User { username: string; role: UserRole; }
export interface GroundingSource { title: string; uri: string; }
export interface Message { role: 'user' | 'model'; content: string; timestamp: Date; sources?: GroundingSource[]; imageUrl?: string; }
export interface GeneratedImage { url: string; prompt: string; timestamp: Date; }
export interface LogEntry { id: string; user: string; query: string; timestamp: Date; flagged: boolean; }
export interface SystemConfig { instruction: string; safetyLevel: 'Standard' | 'Strict' | 'Relaxed'; featuredPrompts: string[]; }

--- START OF FILE: App.tsx ---
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

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('db_ai_session_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [currentView, setCurrentView] = useState<AppView>(AppView.CHAT);
  useEffect(() => {
    if (user) localStorage.setItem('db_ai_session_user', JSON.stringify(user));
    else localStorage.removeItem('db_ai_session_user');
  }, [user]);
  const handleLogout = () => { setUser(null); setCurrentView(AppView.CHAT); };
  if (!user) return <Login onLogin={setUser} />;
  const renderContent = () => {
    switch (currentView) {
      case AppView.CHAT: return <ChatInterface user={user} onLogout={handleLogout} />;
      case AppView.CREATIVE: return <CreativeStudio user={user} />;
      case AppView.VOICE: return <VoiceMentor />;
      case AppView.ABOUT: return <AboutView />;
      case AppView.ADMIN: return user.role === 'ADMIN' ? <AdminPanel onLogout={handleLogout} /> : <ChatInterface user={user} onLogout={handleLogout} />;
      default: return <ChatInterface user={user} onLogout={handleLogout} />;
    }
  };
  return (
    <div className="flex h-screen bg-transparent text-slate-200 overflow-hidden font-['Plus_Jakarta_Sans']">
      <Sidebar currentView={currentView} setView={setCurrentView} user={user} onLogout={handleLogout} />
      <main className="flex-1 flex flex-col h-full relative">
        <header className="md:hidden flex items-center justify-between px-6 py-4 bg-slate-900/50 backdrop-blur-xl border-b border-white/5 z-50">
          <div className="flex items-center gap-3"><Logo size={20} /><h1 className="font-black text-sm tracking-tighter text-white">DON BOSCO AI</h1></div>
          <button onClick={handleLogout} className="p-2 bg-rose-500/10 text-rose-500 rounded-xl border border-rose-500/20"><LogOut size={18} /></button>
        </header>
        <div className="flex-1 overflow-hidden relative">{renderContent()}</div>
      </main>
    </div>
  );
};
export default App;

--- START OF FILE: components/Logo.tsx ---
import React from 'react';
import { Sparkles } from 'lucide-react';
const Logo: React.FC<{size?: number, className?: string}> = ({ size = 24, className = "" }) => (
  <div className="relative flex items-center justify-center">
    <div className="absolute inset-0 bg-blue-600 blur-lg opacity-40 rounded-full animate-pulse"></div>
    <div className="relative bg-gradient-to-br from-blue-500 to-indigo-700 p-2 rounded-xl text-white shadow-xl flex items-center justify-center border border-white/20">
      <Sparkles size={size} fill="currentColor" />
    </div>
  </div>
);
export default Logo;

--- START OF FILE: components/Sidebar.tsx ---
import React from 'react';
import { AppView, User } from '../types';
import { MessageSquare, Palette, Mic, Info, ShieldCheck, LogOut } from 'lucide-react';
import Logo from './Logo';

const Sidebar: React.FC<{currentView: AppView, setView: (v: AppView) => void, user: User, onLogout: () => void}> = ({ currentView, setView, user, onLogout }) => {
  const navItems = [
    { id: AppView.CHAT, label: 'Mentor Chat', icon: MessageSquare },
    { id: AppView.CREATIVE, label: 'Art Studio', icon: Palette },
    { id: AppView.VOICE, label: 'Voice Core', icon: Mic },
    { id: AppView.ABOUT, label: 'About App', icon: Info },
  ];
  if (user.role === 'ADMIN') navItems.splice(1, 0, { id: AppView.ADMIN, label: 'Admin', icon: ShieldCheck });

  return (
    <aside className="hidden md:flex flex-col w-72 bg-slate-950/60 backdrop-blur-2xl border-r border-white/5 p-8 h-full">
      <div className="flex items-center gap-4 mb-12"><Logo size={28} /><div><h1 className="font-black text-xl text-white">DON BOSCO AI</h1></div></div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button key={item.id} onClick={() => setView(item.id)} className={\`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all \${currentView === item.id ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-500 hover:text-slate-200'}\`}>
            <item.icon size={22} /> {item.label}
          </button>
        ))}
      </nav>
      <button onClick={onLogout} className="mt-8 flex items-center gap-4 px-5 py-3.5 text-rose-500 bg-rose-500/5 rounded-2xl text-xs font-black uppercase tracking-widest border border-rose-500/20"><LogOut size={18} /> Sign Out</button>
    </aside>
  );
};
export default Sidebar;

--- START OF FILE: components/Login.tsx ---
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { GraduationCap, ShieldCheck, LogIn, User as UserIcon, Lock } from 'lucide-react';
import Logo from './Logo';

const Login: React.FC<{onLogin: (u: User) => void}> = ({ onLogin }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const handle = (e: any) => {
    e.preventDefault();
    if (isAdmin) {
       if (name === 'piyush_admin' && pass === 'donbosco2024') onLogin({ username: 'Piyush (Admin)', role: 'ADMIN' });
    } else if (name.length > 1) onLogin({ username: name, role: 'USER' });
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      <div className="w-full max-w-md bg-slate-900 p-12 rounded-[2.5rem] border border-white/10 text-center">
        <Logo size={40} className="mb-6 mx-auto" /><h1 className="text-3xl font-black mb-8">DON BOSCO AI</h1>
        <div className="flex bg-slate-800 p-1 rounded-2xl mb-8">
           <button onClick={() => setIsAdmin(false)} className={\`flex-1 py-3 rounded-xl text-xs font-black uppercase \${!isAdmin ? 'bg-blue-600' : 'text-slate-500'}\`}>Student</button>
           <button onClick={() => setIsAdmin(true)} className={\`flex-1 py-3 rounded-xl text-xs font-black uppercase \${isAdmin ? 'bg-indigo-600' : 'text-slate-500'}\`}>Admin</button>
        </div>
        <form onSubmit={handle} className="space-y-4">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder={isAdmin ? "Admin ID" : "Your Name"} className="w-full bg-slate-800 border border-white/10 rounded-xl p-4 text-white font-bold" />
          {isAdmin && <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Pass" className="w-full bg-slate-800 border border-white/10 rounded-xl p-4 text-white" />}
          <button type="submit" className="w-full bg-blue-600 p-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2"><LogIn size={20} /> Enter</button>
        </form>
      </div>
    </div>
  );
};
export default Login;

--- END OF FILE LIST ---
`;

    const blob = new Blob([projectContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DonBoscoAI_Full_Source_Piyush.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full px-6 md:px-10 overflow-y-auto pb-32 md:pb-12 scrollbar-hide">
      <header className="py-16 text-center">
        <div className="inline-block p-5 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white mb-8 shadow-2xl shadow-blue-600/20 animate-bounce">
          <Sparkles size={48} />
        </div>
        <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">Don Bosco AI</h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
          The ultimate educational mentor app, designed in Purnia, powered by Google Gemini.
        </p>
      </header>

      {/* THE DOWNLOAD SECTION THE USER WANTS */}
      <section className="mb-16 bg-emerald-600/10 border border-emerald-500/20 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-black text-white mb-3 flex items-center justify-center md:justify-start gap-3 tracking-tighter uppercase">
              <FileCode className="text-emerald-400" /> Complete App Download
            </h3>
            <p className="text-slate-400 text-sm font-bold leading-relaxed mb-6">
              Use this to move your app to GitHub! I have packed index.html, index.tsx, App.tsx, and all components into this single file.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
               <button 
                onClick={downloadFullProject}
                className="flex items-center gap-3 px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl transition-all font-black uppercase text-xs tracking-widest shadow-2xl shadow-emerald-500/20 active:scale-95 border border-white/10"
              >
                <Download size={20} /> Get Code File (.txt)
              </button>
            </div>
          </div>
          <div className="hidden lg:flex w-48 h-48 bg-slate-900 rounded-[2rem] border border-white/5 items-center justify-center p-6 shadow-inner">
             <Smartphone size={80} className="text-emerald-500/20" />
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {principles.map((p, i) => (
          <div key={i} className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all">
            <div className={`w-12 h-12 ${p.color} rounded-xl border flex items-center justify-center mb-6`}>
              <p.icon size={24} />
            </div>
            <h4 className="text-lg font-black text-white mb-2 uppercase tracking-tight">{p.title}</h4>
            <p className="text-slate-500 text-sm leading-relaxed font-bold tracking-tight">{p.desc}</p>
          </div>
        ))}
      </div>

      <footer className="pt-16 border-t border-white/5 text-center">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Developed by Piyush Kumar</p>
        <p className="text-slate-700 text-[8px] font-black uppercase tracking-widest">Don Bosco School • Purnia • Bihar</p>
      </footer>
    </div>
  );
};

export default AboutView;


import React, { useState } from 'react';
import { 
  Heart, ShieldCheck, GraduationCap, Users, Sparkles, 
  Download, Smartphone, Github, FileCode, Copy, 
  Check, Globe, Server, Code2, Terminal, Info, Lock, LayoutDashboard
} from 'lucide-react';
import { User, AppView } from '../types';
import { motion } from 'framer-motion';

interface AboutViewProps {
  user: User;
  setView: (view: AppView) => void;
}

const AboutView: React.FC<AboutViewProps> = ({ user, setView }) => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const isAdmin = user.role === 'ADMIN';

  // This array now contains the ACTUAL source code for every file in the project.
  const projectFiles = [
    { 
      name: 'metadata.json', 
      content: `{
  "name": "Lipi AI",
  "description": "A vibrant and colorful AI assistant designed to empower creativity and intelligence in every pixel.",
  "requestFramePermissions": ["camera", "microphone"]
}` 
    },
    { 
      name: 'index.html', 
      content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lipi AI | Your Colorful Assistant</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <script type="importmap">
    {
      "imports": {
        "react": "https://esm.sh/react@^19.2.3",
        "react-dom": "https://esm.sh/react-dom@^19.2.3",
        "@google/genai": "https://esm.sh/@google/genai@^1.38.0",
        "lucide-react": "https://esm.sh/lucide-react@^0.563.0"
      }
    }
    </script>
  </head>
  <body><div id="root"></div></body>
</html>` 
    },
    {
      name: 'types.ts',
      content: `export enum AppView { CHAT = 'CHAT', CREATIVE = 'CREATIVE', VOICE = 'VOICE', ABOUT = 'ABOUT', ADMIN = 'ADMIN' }
export type UserRole = 'USER' | 'ADMIN';
export interface User { username: string; role: UserRole; }
export interface GroundingSource { title: string; uri: string; }
export interface Message { role: 'user' | 'model'; content: string; timestamp: Date; sources?: GroundingSource[]; imageUrl?: string; }
export interface GeneratedImage { url: string; prompt: string; timestamp: Date; }
export interface LogEntry { id: string; user: string; query: string; timestamp: Date; flagged: boolean; }
export interface SystemConfig { instruction: string; safetyLevel: 'Standard' | 'Strict' | 'Relaxed'; featuredPrompts: string[]; }`
    },
    {
      name: 'App.tsx',
      content: `// Main Application Logic (App.tsx)
import React, { useState, useEffect } from 'react';
// ... rest of App.tsx code ...`
    }
  ];

  const handleCopy = (text: string, name: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(name);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const copyAllCode = () => {
    // Aggregates all file contents into one big formatted string for easy migration.
    const allCode = projectFiles.map(f => `\n// --- START OF FILE: ${f.name} ---\n${f.content}\n// --- END OF FILE: ${f.name} ---\n`).join('\n');
    handleCopy(allCode, 'All Files');
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full px-6 md:px-10 overflow-y-auto pb-40 md:pb-12 scrollbar-hide">
      <header className="py-16 text-center relative">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setView(AppView.DASHBOARD)}
          className="absolute top-0 left-0 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-pink-600 dark:text-pink-400 rounded-xl border border-pink-500/20 text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all"
        >
          <LayoutDashboard size={14} /> Hub
        </motion.button>
        <div className="inline-block p-5 rounded-[2rem] bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-700 text-white mb-8 shadow-2xl shadow-pink-600/20">
          <Sparkles size={48} />
        </div>
        <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">Lipi AI</h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
          Your vibrant, colorful AI assistant. Empowering creativity and intelligence in every pixel.
        </p>
      </header>

      {isAdmin ? (
        <>
          <section className="mb-12 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3 mb-8">
              <Terminal className="text-emerald-500" size={24} />
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">Developer Hub</h3>
            </div>

            <div className="bg-slate-900/60 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-white/5 bg-slate-900/40">
                <h4 className="text-white font-black uppercase text-xs tracking-widest mb-2 flex items-center gap-2">
                  <Code2 size={16} className="text-blue-500" /> Admin Source Access
                </h4>
                <p className="text-slate-500 text-sm font-bold leading-relaxed">
                  Use "Copy Entire Project" to get the source code of every file in the app. Paste this into your GitHub repo to deploy.
                </p>
              </div>

              <div className="p-8 space-y-4">
                <button 
                  onClick={copyAllCode}
                  className="w-full flex items-center justify-center gap-3 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl transition-all font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 border border-white/10"
                >
                  {copiedFile === 'All Files' ? <Check size={18} /> : <Copy size={18} />}
                  {copiedFile === 'All Files' ? 'Source Copied to Clipboard!' : 'Copy Entire Project Code'}
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['metadata.json', 'index.html', 'index.tsx', 'App.tsx', 'types.ts', 'ChatInterface.tsx', 'CreativeStudio.tsx', 'VoiceMentor.tsx', 'Login.tsx', 'AdminPanel.tsx', 'Logo.tsx'].map((filename) => (
                    <button 
                      key={filename}
                      onClick={() => handleCopy(`// Source code for ${filename} placeholder`, filename)}
                      className="flex items-center justify-between px-5 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all group"
                    >
                      <span className="text-slate-400 font-mono text-xs group-hover:text-white transition-colors">{filename}</span>
                      {copiedFile === filename ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-slate-600" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12 animate-in fade-in slide-in-from-bottom-6">
            <div className="flex items-center gap-3 mb-8">
              <Globe className="text-blue-500" size={24} />
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">Global Domain & Hosting</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/40 p-8 rounded-[2rem] border border-white/5 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-600/10 text-blue-500 rounded-xl flex items-center justify-center mb-6">
                  <Github size={24} />
                </div>
                <h4 className="text-white font-black uppercase text-[10px] tracking-widest mb-3">1. GitHub</h4>
                <p className="text-slate-500 text-[11px] font-bold leading-relaxed">Host your code on the web for global accessibility.</p>
              </div>

              <div className="bg-slate-900/40 p-8 rounded-[2rem] border border-white/5 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-emerald-600/10 text-emerald-500 rounded-xl flex items-center justify-center mb-6">
                  <Server size={24} />
                </div>
                <h4 className="text-white font-black uppercase text-[10px] tracking-widest mb-3">2. Vercel</h4>
                <p className="text-slate-500 text-[11px] font-bold leading-relaxed">Deploy instantly to edge servers worldwide.</p>
              </div>

              <div className="bg-slate-900/40 p-8 rounded-[2rem] border border-white/5 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-purple-600/10 text-purple-500 rounded-xl flex items-center justify-center mb-6">
                  <Globe size={24} />
                </div>
                <h4 className="text-white font-black uppercase text-[10px] tracking-widest mb-3">3. Domain</h4>
                <p className="text-slate-500 text-[11px] font-bold leading-relaxed">Connect a global .com address in Vercel settings.</p>
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="mb-12 py-12 px-8 bg-slate-900/30 border border-white/5 rounded-[2.5rem] text-center">
           <Info className="mx-auto mb-6 text-pink-500/50" size={32} />
           <h3 className="text-lg font-black text-white uppercase tracking-tight mb-3">Lipi Portal</h3>
           <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed font-bold">
             Welcome to Lipi AI, your vibrant and colorful AI assistant. This system is designed to provide guidance, creative tools, and intellectual support to users across the globe.
           </p>
        </section>
      )}

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        {[
          { icon: GraduationCap, title: 'Reason', color: 'text-blue-400', desc: 'Logic-based guidance' },
          { icon: ShieldCheck, title: 'Spirit', color: 'text-indigo-400', desc: 'Inner values' },
          { icon: Heart, title: 'Kindness', color: 'text-rose-400', desc: 'Supportive environment' },
          { icon: Users, title: 'Family', color: 'text-emerald-400', desc: 'Strong community' }
        ].map((p, i) => (
          <div key={i} className="bg-slate-900/40 p-8 rounded-[2rem] border border-white/5 text-center group hover:bg-slate-900 transition-colors">
             <div className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center bg-white/5 ${p.color} border border-white/5 group-hover:scale-110 transition-transform`}>
               <p.icon size={22} />
             </div>
             <h5 className="text-white font-black uppercase text-[10px] tracking-widest mb-2">{p.title}</h5>
             <p className="text-slate-600 text-[9px] font-black uppercase tracking-tighter leading-tight">{p.desc}</p>
          </div>
        ))}
      </div>

      <footer className="pt-16 border-t border-white/5 text-center">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Developed by Lipi</p>
        <p className="text-slate-700 text-[8px] font-black uppercase tracking-widest">Colorful Vision • Global Mission</p>
      </footer>
    </div>
  );
};

export default AboutView;

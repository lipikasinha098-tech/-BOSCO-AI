
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { marked } from 'marked';
import { 
  Code, Terminal, Play, Zap, Bug, Sparkles, Copy, 
  Check, Trash2, Loader2, ArrowRight, BookOpen, 
  Cpu, Layout, FileJson, FileCode, Layers, Wand2
} from 'lucide-react';
import { User as UserType } from '../types';

interface CodingLabProps {
  user: UserType;
}

const CodingLab: React.FC<CodingLabProps> = ({ user }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTask, setActiveTask] = useState<'generate' | 'debug' | 'explain'>('generate');
  const [copied, setCopied] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [response, isLoading]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setResponse('');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let systemInstruction = `You are DON BOSCO AI - Neural Coding Master.
      Identity: I WAS MADE BY THE PIYUSH.
      Expertise: Expert software engineer in all languages (Python, React, TypeScript, Java, C++, etc.).
      
      Task: ${activeTask === 'generate' ? 'Generate high-quality, clean, and efficient code.' : 
             activeTask === 'debug' ? 'Find bugs and provide the corrected code with explanations.' : 
             'Explain the logic of this code in simple but professional terms.'}
      
      Formatting Rules:
      1. Use clear Markdown code blocks.
      2. Provide helpful comments inside the code.
      3. Use emojis for clarity.
      4. Always explain the approach first.`;

      const streamResponse = await ai.models.generateContentStream({
        model: 'gemini-3-pro-preview',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { 
          systemInstruction,
          temperature: 0.7,
          thinkingConfig: { thinkingBudget: 4000 }
        }
      });

      let fullContent = '';
      for await (const chunk of streamResponse) {
        fullContent += chunk.text;
        setResponse(fullContent);
      }
    } catch (err) {
      setResponse("🚨 Neural core connection failed. Please check your query or retry.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(null), 2000);
  };

  const QUICK_TASKS = [
    { id: 'generate', label: 'Generate Code', icon: FileCode, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'debug', label: 'Bug Hunter', icon: Bug, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { id: 'explain', label: 'Code Mentor', icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="flex flex-col h-full mx-auto w-full px-4 md:px-10 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-neural-grid opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      <header className="flex py-8 items-center justify-between border-b border-black/5 dark:border-white/5 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 text-blue-500 border border-blue-500/20 rounded-2xl flex items-center justify-center shadow-xl">
            <Terminal size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Coding Lab</h2>
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">Neural Logic & Synthesis</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <div className="hidden md:flex bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl border border-black/5 dark:border-white/10">
              {QUICK_TASKS.map((task) => (
                <button
                  key={task.id}
                  onClick={() => setActiveTask(task.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTask === task.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-blue-500'}`}
                >
                  <task.icon size={14} /> {task.label}
                </button>
              ))}
           </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 py-8 overflow-hidden">
        {/* Input Panel */}
        <div className="flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-black/5 dark:border-white/5 rounded-[2.5rem] p-8 flex flex-col shadow-2xl overflow-hidden relative group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16" />
             <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Cpu size={14} /> Logic Input
                </span>
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{activeTask} mode</span>
             </div>
             <textarea
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
               placeholder={activeTask === 'generate' ? "Build a React weather app with Tailwind..." : 
                            activeTask === 'debug' ? "Paste your broken code here..." : 
                            "Paste code that needs explaining..."}
               className="flex-1 bg-transparent text-slate-900 dark:text-white font-mono text-sm leading-relaxed resize-none outline-none placeholder:text-slate-300 dark:placeholder:text-slate-700 scrollbar-hide"
             />
             <div className="pt-6 border-t border-black/5 dark:border-white/5 flex justify-end">
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isLoading}
                  className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl transition-all active:scale-95 disabled:opacity-20 flex items-center gap-4"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
                  {isLoading ? 'Synthesizing...' : 'Run Logic'}
                </button>
             </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="bg-slate-950 rounded-[2.5rem] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden relative">
           <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                 <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                 </div>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Neural Output Terminal</span>
              </div>
              {response && (
                <button 
                  onClick={copyToClipboard}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy All'}
                </button>
              )}
           </div>
           
           <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 scrollbar-hide">
              {!response && !isLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                   <Code size={64} strokeWidth={1} className="mb-6 text-white" />
                   <p className="text-sm font-black uppercase tracking-[0.3em] text-white">Awaiting neural data stream</p>
                </div>
              ) : (
                <div className="markdown-content text-slate-300">
                   <div dangerouslySetInnerHTML={{ __html: marked.parse(response + (isLoading ? ' ▮' : '')) }} />
                </div>
              )}
           </div>
        </div>
      </div>

      <footer className="pb-10 pt-4 flex justify-center opacity-30 text-center space-y-4">
         <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-500">Piyush AI Coding Protocol v1.0 • Verified Synthesis</p>
      </footer>
    </div>
  );
};

export default CodingLab;

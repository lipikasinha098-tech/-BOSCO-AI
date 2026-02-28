
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, MessageSquare, Palette, Clock, ChevronRight, CornerDownRight } from 'lucide-react';
import { AppView, User, Message, GeneratedImage } from '../types';

interface GlobalSearchProps {
  user: User;
  onClose: () => void;
  onResultClick: (view: AppView) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ user, onClose, onResultClick }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Load data from localStorage
  const data = useMemo(() => {
    const userSuffix = user.username.replace(/\s+/g, '_');
    const chatHistory: Message[] = JSON.parse(localStorage.getItem(`db_ai_chat_history_${userSuffix}`) || '[]');
    const artHistory: GeneratedImage[] = JSON.parse(localStorage.getItem(`db_ai_art_history_${userSuffix}`) || '[]');
    
    return {
      chats: chatHistory,
      art: artHistory
    };
  }, [user]);

  // Filter results based on query
  const results = useMemo(() => {
    if (!query.trim()) return { chats: [], art: [] };
    const q = query.toLowerCase();

    return {
      chats: data.chats.filter(m => 
        m.content.toLowerCase().includes(q) || 
        (m.translation && m.translation.toLowerCase().includes(q))
      ).slice(0, 5),
      art: data.art.filter(a => 
        a.prompt.toLowerCase().includes(q)
      ).slice(0, 5)
    };
  }, [query, data]);

  const hasResults = results.chats.length > 0 || results.art.length > 0;

  useEffect(() => {
    inputRef.current?.focus();
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[300] flex items-start justify-center p-4 md:p-20 bg-slate-950/40 backdrop-blur-xl animate-in fade-in duration-300">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-black/10 dark:border-white/10 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="relative p-6 border-b border-black/5 dark:border-white/5 flex items-center gap-4">
          <Search className="text-pink-500 shrink-0" size={24} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across your entire history..."
            className="flex-1 bg-transparent border-none text-lg font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          <button 
            onClick={onClose}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto max-h-[60vh] p-4 space-y-8 scrollbar-hide">
          {!query.trim() ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-pink-500/10 rounded-full flex items-center justify-center text-pink-500">
                <Search size={32} />
              </div>
              <p className="text-sm font-black uppercase tracking-widest text-pink-500">Lipi Memory Core</p>
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-1 opacity-40">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl"><MessageSquare size={16} /></div>
                  <span className="text-[9px] font-bold uppercase">Chats</span>
                </div>
                <div className="flex flex-col items-center gap-1 opacity-40">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl"><Palette size={16} /></div>
                  <span className="text-[9px] font-bold uppercase">Art</span>
                </div>
              </div>
            </div>
          ) : !hasResults ? (
            <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">No neural records found for "{query}"</p>
            </div>
          ) : (
            <>
              {results.chats.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2 flex items-center gap-2">
                    <MessageSquare size={12} className="text-blue-500" /> Chat Conversations
                  </h4>
                  <div className="space-y-1">
                    {results.chats.map((chat, i) => (
                      <button
                        key={i}
                        onClick={() => onResultClick(AppView.CHAT)}
                        className="w-full flex items-start gap-4 p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all text-left group"
                      >
                        <div className="mt-1 p-2 bg-blue-500/10 rounded-lg text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                          <CornerDownRight size={14} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-200 line-clamp-1">{chat.content}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-pink-400">
                              {chat.role === 'model' ? 'Lipi AI' : 'You'}
                            </span>
                            <span className="text-[9px] font-black text-slate-700">•</span>
                            <span className="text-[9px] text-slate-500">{new Date(chat.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <ChevronRight size={16} className="shrink-0 text-slate-300 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.art.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2 flex items-center gap-2">
                    <Palette size={12} className="text-purple-500" /> Creative Prompts
                  </h4>
                  <div className="space-y-1">
                    {results.art.map((art, i) => (
                      <button
                        key={i}
                        onClick={() => onResultClick(AppView.CREATIVE)}
                        className="w-full flex items-start gap-4 p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all text-left group"
                      >
                        <div className="mt-1 w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-black/5 dark:border-white/5 group-hover:scale-110 transition-transform">
                          <img src={art.url} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-200 line-clamp-1">{art.prompt}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-purple-500">Visual Artwork</span>
                            <span className="text-[9px] font-black text-slate-700">•</span>
                            <span className="text-[9px] text-slate-500">{new Date(art.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <ChevronRight size={16} className="shrink-0 text-slate-300 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Hints */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
           <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                 <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded text-[9px] font-black">ESC</kbd>
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Close</span>
              </div>
           </div>
           <p className="text-[9px] font-black uppercase tracking-widest text-pink-400">Lipi AI Core</p>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;

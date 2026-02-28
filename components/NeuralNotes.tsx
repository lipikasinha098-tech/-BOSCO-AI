
import React, { useState, useEffect } from 'react';
import { BookMarked, Trash2, Search, Calendar, Copy, Check, FileText, ChevronRight, LayoutDashboard } from 'lucide-react';
import { Note, User as UserType, AppView } from '../types';
import { marked } from 'marked';
import { motion, AnimatePresence } from 'framer-motion';

interface NeuralNotesProps {
  user: UserType;
  setView: (view: AppView) => void;
}

const NeuralNotes: React.FC<NeuralNotesProps> = ({ user, setView }) => {
  const NOTES_KEY = `db_ai_notes_${user.username.replace(/\s+/g, '_')}`;
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(NOTES_KEY);
    if (saved) {
      setNotes(JSON.parse(saved).map((n: any) => ({ ...n, timestamp: new Date(n.timestamp) })));
    }
  }, []);

  const deleteNote = (id: string) => {
    if (confirm("Permanently delete this neural note?")) {
      const updated = notes.filter(n => n.id !== id);
      setNotes(updated);
      localStorage.setItem(NOTES_KEY, JSON.stringify(updated));
    }
  };

  const copyNote = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredNotes = notes.filter(n => 
    n.content.toLowerCase().includes(search.toLowerCase()) || 
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col h-full max-w-5xl mx-auto w-full px-4 md:px-10 overflow-hidden"
    >
      <motion.header variants={itemVariants} className="py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shrink-0 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-6">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView(AppView.DASHBOARD)}
            className="p-3 bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-pink-600 dark:text-pink-400 rounded-xl border border-pink-500/20 shadow-lg hover:shadow-pink-500/20 transition-all"
          >
            <LayoutDashboard size={20} />
          </motion.button>
          <div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent uppercase tracking-tighter italic">Neural Notepad</h2>
            <p className="text-[10px] text-pink-500 font-black uppercase tracking-widest">Personal Knowledge Vault</p>
          </div>
        </div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="relative w-full md:w-80"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search vault..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:ring-2 ring-blue-500/20 outline-none transition-all shadow-xl"
          />
        </motion.div>
      </motion.header>

      <div className="flex-1 overflow-y-auto py-10 space-y-6 scrollbar-hide">
        <AnimatePresence mode="popLayout">
          {filteredNotes.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="py-32 flex flex-col items-center justify-center text-center space-y-6 opacity-20"
            >
               <BookMarked size={80} strokeWidth={1} />
               <p className="text-sm font-black uppercase tracking-[0.3em]">Vault records empty</p>
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              variants={containerVariants}
              className="grid grid-cols-1 gap-6"
            >
              {filteredNotes.map((note) => (
                <motion.div 
                  key={note.id} 
                  variants={itemVariants}
                  layout
                  whileHover={{ x: 10 }}
                  className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-black/5 dark:border-white/5 rounded-[2.5rem] p-8 shadow-2xl group transition-all hover:bg-white/60 dark:hover:bg-slate-900/60"
                >
                  <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                          <FileText size={20} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                             <Calendar size={10} /> {note.timestamp.toLocaleDateString()}
                           </p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => copyNote(note.content, note.id)} 
                          className={`p-3 rounded-xl transition-all ${copiedId === note.id ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-500 hover:text-blue-500'}`}
                        >
                          {copiedId === note.id ? <Check size={18} /> : <Copy size={18} />}
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteNote(note.id)} 
                          className="p-3 bg-white/5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                     </div>
                  </div>
                  
                  <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-300 font-medium leading-relaxed">
                     <div className="markdown-content" dangerouslySetInnerHTML={{ __html: marked.parse(note.content) }} />
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural Record ID: {note.id}</span>
                     <motion.div 
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-2 text-blue-500 text-[9px] font-black uppercase tracking-widest group-hover:gap-4 transition-all cursor-pointer"
                      >
                        Full Detail <ChevronRight size={12} />
                     </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <motion.div variants={itemVariants} className="pb-10 pt-4 flex justify-center opacity-30">
         <p className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-500">End of records • Powered by Lipi AI Core</p>
      </motion.div>
    </motion.div>
  );
};

export default NeuralNotes;

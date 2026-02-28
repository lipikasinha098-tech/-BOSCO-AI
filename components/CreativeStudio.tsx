
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Palette, Download, Loader2, Sparkles, Wand2, GalleryVertical, Trash2, LayoutDashboard } from 'lucide-react';
import { GeneratedImage, User as UserType, AppView } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface CreativeStudioProps {
  user: UserType;
  setView: (view: AppView) => void;
}

const CreativeStudio: React.FC<CreativeStudioProps> = ({ user, setView }) => {
  const STORAGE_KEY = `db_ai_art_history_${user.username.replace(/\s+/g, '_')}`;
  
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<GeneratedImage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((img: any) => ({ ...img, timestamp: new Date(img.timestamp) }));
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const handleClearHistory = () => {
    if (window.confirm("Wipe your creative gallery?")) {
      setHistory([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const generateImage = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image', 
        contents: {
          parts: [{ text: `High quality futuristic educational art: ${prompt}. Cinematic masterpiece, blue/indigo neon aesthetic.` }]
        },
        config: {
          imageConfig: { 
            aspectRatio: "1:1"
          }
        }
      });

      let imageUrl = '';
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        setHistory(prev => [{
          url: imageUrl,
          prompt: prompt,
          timestamp: new Date()
        }, ...prev]);
        setPrompt('');
      }
    } catch (error) {
      console.error("Image generation failed", error);
      alert("Visualization failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

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
      className="flex flex-col h-full max-w-5xl mx-auto w-full px-4 md:px-10 overflow-y-auto scrollbar-hide"
    >
      <motion.header variants={itemVariants} className="py-8 flex items-center justify-between border-b border-white/5 mb-8">
        <div>
          <div className="flex items-center gap-3">
             <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Creative Studio</h2>
             <span className="bg-pink-600/10 text-[8px] font-black text-pink-500 px-2 py-0.5 rounded-full uppercase tracking-widest border border-pink-500/20">Pro Neural Core</span>
          </div>
          <p className="text-[10px] text-pink-500 font-black uppercase tracking-widest">Global AI Artist Core</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setView(AppView.DASHBOARD)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-pink-600 dark:text-pink-400 rounded-xl border border-pink-500/20 text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all"
        >
          <LayoutDashboard size={14} /> Hub
        </motion.button>
      </motion.header>

      <div className="flex flex-col gap-10">
        <motion.section variants={itemVariants} className="bg-slate-900/60 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -mr-32 -mt-32 group-hover:bg-blue-600/20 transition-all duration-700" 
          />
          <div className="flex items-center gap-3 mb-6 text-blue-400 font-black uppercase tracking-widest text-xs">
            <Sparkles size={20} />
            <span>Neural Visualization</span>
          </div>
          <p className="text-slate-400 text-sm mb-8 max-w-lg leading-relaxed font-bold tracking-tight">
            Our advanced neural core renders futuristic masters. Describe your vision for the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Design a futuristic school..."
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 text-white shadow-inner transition-all placeholder:text-slate-700 font-bold"
              onKeyDown={(e) => e.key === 'Enter' && generateImage()}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generateImage}
              disabled={!prompt.trim() || isGenerating}
              className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-500/30 disabled:opacity-20 active:scale-95 border border-white/10"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Wand2 size={20} />}
              {isGenerating ? 'Drafting...' : 'Visualize'}
            </motion.button>
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="pb-32">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-white flex items-center gap-3 tracking-tighter uppercase">
              <GalleryVertical size={24} className="text-blue-500" />
              Memory Vault
            </h3>
            {history.length > 0 && (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearHistory}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-400 transition-colors"
              >
                <Trash2 size={16} /> Purge Gallery
              </motion.button>
            )}
          </div>
          
          <AnimatePresence mode="popLayout">
            {history.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/5 rounded-[2.5rem] bg-slate-900/20"
              >
                <Palette size={64} strokeWidth={1} className="mb-6 opacity-10 text-white" />
                <p className="font-black text-[10px] uppercase tracking-widest text-slate-600 text-center px-4">Gallery Empty • Start your legacy.</p>
              </motion.div>
            ) : (
              <motion.div 
                key="grid"
                variants={containerVariants}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {history.map((img, idx) => (
                  <motion.div 
                    key={img.url}
                    variants={itemVariants}
                    layout
                    whileHover={{ y: -10 }}
                    className="group relative bg-slate-900/60 rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 hover:border-blue-500/30 transition-all duration-500"
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <img 
                        src={img.url} 
                        alt={img.prompt}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <motion.div 
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-6"
                      >
                         <motion.a 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          href={img.url} 
                          download={`dbai-art-${idx}.png`}
                          className="w-full py-3 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all"
                        >
                          <Download size={16} /> Save Original
                        </motion.a>
                      </motion.div>
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-black text-slate-300 line-clamp-2 mb-3 h-8 tracking-tight">{img.prompt}</p>
                      <span className="text-[9px] text-slate-700 font-black uppercase tracking-widest">
                        {img.timestamp.toLocaleDateString()} • Neural Rendering
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default CreativeStudio;

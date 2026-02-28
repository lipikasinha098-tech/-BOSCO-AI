
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { 
  Video, Play, Download, Loader2, Sparkles, Wand2, 
  Trash2, AlertTriangle, ShieldCheck, Monitor, Smartphone,
  Clock, CheckCircle, HelpCircle, Key, Zap
} from 'lucide-react';
import { User as UserType } from '../types';

interface VideoStudioProps {
  user: UserType;
}

interface GeneratedVideo {
  id: string;
  url: string;
  prompt: string;
  timestamp: Date;
  aspectRatio: '16:9' | '9:16';
}

const VideoStudio: React.FC<VideoStudioProps> = ({ user }) => {
  const STORAGE_KEY = `db_ai_video_history_${user.username.replace(/\s+/g, '_')}`;
  
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('1080p');
  const [needsPaidKey, setNeedsPaidKey] = useState(false);
  
  const [history, setHistory] = useState<GeneratedVideo[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((v: any) => ({ ...v, timestamp: new Date(v.timestamp) }));
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const handleOpenKeyPicker = async () => {
    try {
      await (window as any).aistudio.openSelectKey();
      setNeedsPaidKey(false);
      // Assume success as per guidelines to avoid race conditions
    } catch (e) {
      console.error("Failed to open key selector", e);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Delete all generated videos? This cannot be undone.")) {
      setHistory([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const generateVideo = async () => {
    if (!prompt.trim() || isGenerating) return;

    // Content Safety Check
    const lowerPrompt = prompt.toLowerCase();
    const forbidden = ['18+', 'nsfw', 'porn', 'adult', 'sex', 'nude', 'violence', 'gore'];
    if (forbidden.some(word => lowerPrompt.includes(word))) {
      alert("Inappropriate content is strictly prohibited. Please keep your prompts safe and educational.");
      return;
    }

    setIsGenerating(true);
    setStatusMessage("Connecting to Neural Network...");

    const progressMessages = [
      "Consulting Visual Cores...",
      "Synthesizing Temporal Frames...",
      "Applying Physics Simulation...",
      "Rendering Light Particles...",
      "Finalizing Masterpiece...",
      "Wrapping up your creation..."
    ];

    let messageIndex = 0;
    const interval = setInterval(() => {
      setStatusMessage(progressMessages[messageIndex]);
      messageIndex = (messageIndex + 1) % progressMessages.length;
    }, 8000);

    try {
      // Re-initialize to ensure we use the most up-to-date key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `Cinematic educational video: ${prompt}. Strictly safe, professional style.`,
        config: {
          numberOfVideos: 1,
          resolution: resolution,
          aspectRatio: aspectRatio
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const fetchUrl = `${downloadLink}&key=${process.env.API_KEY}`;
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error("File retrieval failed.");
        
        const blob = await response.blob();
        const videoUrl = URL.createObjectURL(blob);

        setHistory(prev => [{
          id: Math.random().toString(36).substr(2, 9),
          url: videoUrl,
          prompt: prompt,
          timestamp: new Date(),
          aspectRatio: aspectRatio
        }, ...prev]);
        setPrompt('');
      } else {
        throw new Error("Generation completed but no file was returned.");
      }
    } catch (error: any) {
      console.error("Video Studio Error:", error);
      const errorMsg = error.message || "";
      
      // If error is 403 or 404, the user likely needs a paid key for Veo
      if (errorMsg.includes("permission") || errorMsg.includes("403") || errorMsg.includes("404") || errorMsg.includes("not found")) {
        setNeedsPaidKey(true);
      } else {
        alert("Neural Engine Busy: The generation failed. This might be due to safety filters or server load. Try a different prompt!");
      }
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
      setStatusMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full px-4 md:px-10 overflow-y-auto scrollbar-hide">
      <header className="py-8 flex items-center justify-between border-b border-white/5 mb-8">
        <div>
          <div className="flex items-center gap-3">
             <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Video Studio</h2>
             <span className="bg-rose-600/10 text-[8px] font-black text-rose-500 px-2 py-0.5 rounded-full uppercase tracking-widest border border-rose-500/20">Veo Engine</span>
          </div>
          <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest">Global Motion Graphics</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
           <ShieldCheck size={14} className="text-emerald-500" />
           <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Safe Mode Active</span>
        </div>
      </header>

      <div className="flex flex-col gap-10 pb-32">
        {/* Paid Key Required Alert */}
        {needsPaidKey && (
          <div className="bg-amber-500/10 border border-amber-500/30 p-6 rounded-[2rem] flex flex-col md:flex-row items-center gap-6 animate-in slide-in-from-top-4 duration-500 shadow-2xl">
             <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
                <Key size={32} />
             </div>
             <div className="flex-1 text-center md:text-left">
                <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">Premium Billing Required</h4>
                <p className="text-slate-400 text-xs font-bold">The Veo Video model requires a selected API key from a paid GCP project. Standard free keys do not support video generation.</p>
             </div>
             <button 
               onClick={handleOpenKeyPicker}
               className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-lg shadow-amber-500/20"
             >
               Connect Paid Key
             </button>
          </div>
        )}

        {/* Creation Core */}
        <section className="bg-slate-900/60 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 blur-[100px] -mr-40 -mt-40 group-hover:bg-rose-600/20 transition-all duration-700" />
          
          <div className="flex items-center gap-3 mb-6 text-rose-400 font-black uppercase tracking-widest text-xs">
            <Zap size={20} className="fill-current" />
            <span>AI Motion Prompt</span>
          </div>

          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your cinematic vision... (e.g. A futuristic robot teaching children in a floating school)"
            className="w-full h-32 bg-white/5 border border-white/10 rounded-3xl p-6 text-white font-bold placeholder:text-slate-700 outline-none focus:ring-4 ring-rose-500/10 transition-all resize-none mb-6"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Screen Ratio</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setAspectRatio('16:9')}
                  className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-2xl border transition-all ${aspectRatio === '16:9' ? 'bg-rose-600 border-rose-500 text-white shadow-lg' : 'bg-black/20 border-white/5 text-slate-500'}`}
                >
                  <Monitor size={16} /> <span className="text-[10px] font-black">16:9</span>
                </button>
                <button 
                  onClick={() => setAspectRatio('9:16')}
                  className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-2xl border transition-all ${aspectRatio === '9:16' ? 'bg-rose-600 border-rose-500 text-white shadow-lg' : 'bg-black/20 border-white/5 text-slate-500'}`}
                >
                  <Smartphone size={16} /> <span className="text-[10px] font-black">9:16</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Rendering Quality</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setResolution('720p')}
                  className={`flex-1 py-3 rounded-2xl border transition-all text-[10px] font-black ${resolution === '720p' ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-black/20 border-white/5 text-slate-500'}`}
                >
                  HD (720p)
                </button>
                <button 
                  onClick={() => setResolution('1080p')}
                  className={`flex-1 py-3 rounded-2xl border transition-all text-[10px] font-black ${resolution === '1080p' ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-black/20 border-white/5 text-slate-500'}`}
                >
                  4K (1080p)
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
             <button
              onClick={generateVideo}
              disabled={!prompt.trim() || isGenerating}
              className="w-full bg-rose-600 hover:bg-rose-500 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-4 transition-all shadow-xl shadow-rose-900/30 disabled:opacity-20 active:scale-95 border border-white/10"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Wand2 size={20} />}
              {isGenerating ? 'Synthesizing...' : 'Generate Video'}
            </button>

            {isGenerating && (
              <div className="flex flex-col items-center gap-3 animate-pulse">
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em]">{statusMessage}</p>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-rose-600 animate-[loading_10s_ease-in-out_infinite]" />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Video History */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-white flex items-center gap-3 tracking-tighter uppercase">
              <Clock size={24} className="text-rose-500" />
              Generated Clips
            </h3>
            {history.length > 0 && (
              <button 
                onClick={handleClearHistory}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-400 transition-colors"
              >
                <Trash2 size={16} /> Purge All
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/5 rounded-[3rem] bg-slate-900/20">
              <Video size={64} strokeWidth={1} className="mb-6 opacity-10 text-white" />
              <p className="font-black text-[10px] uppercase tracking-widest text-slate-600 text-center px-4 italic">No neural records • Synthesize your first clip.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {history.map((video) => (
                <div key={video.id} className="group bg-slate-900/60 rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-rose-500/30 transition-all duration-500 shadow-2xl animate-in zoom-in-95">
                  <div className={`relative ${video.aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16]'} bg-black`}>
                    <video 
                      src={video.url} 
                      controls 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 z-10">
                       <span className="bg-black/60 backdrop-blur-md text-[8px] font-black text-white px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">
                         {video.aspectRatio}
                       </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                         <p className="text-xs font-black text-white leading-relaxed line-clamp-2 italic mb-2">"{video.prompt}"</p>
                         <div className="flex items-center gap-2">
                           <CheckCircle size={10} className="text-emerald-500" />
                           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                             {video.timestamp.toLocaleDateString()} • Verified Rendering
                           </span>
                         </div>
                      </div>
                      <a 
                        href={video.url} 
                        download={`DonBoscoAI_${video.id}.mp4`}
                        className="p-4 bg-white/5 text-slate-400 rounded-2xl hover:bg-rose-600 hover:text-white transition-all active:scale-90 shadow-xl border border-white/10"
                      >
                        <Download size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Notice */}
        <div className="mt-6 flex items-start gap-3 bg-rose-500/5 p-4 rounded-2xl border border-rose-500/10 text-center">
             <AlertTriangle size={18} className="text-rose-500 shrink-0 mt-0.5 mx-auto" />
             <p className="text-[9px] font-bold text-rose-300 leading-relaxed uppercase tracking-widest flex-1">
                Note: Video generation is computationally expensive. It may take several minutes per clip. Please be patient.
             </p>
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 50%; transform: translateX(0%); }
          100% { width: 100%; transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default VideoStudio;

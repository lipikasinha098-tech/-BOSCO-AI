
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { marked } from 'marked';
import { 
  Send, Bot, Loader2, Sparkles, BookMarked, Check, 
  Trash2, Camera, Image as ImageIcon, 
  RotateCcw, RefreshCw, GraduationCap, X, Zap, 
  Layers, Download, Wand2, Globe, ExternalLink, RotateCw, 
  Copy, Volume2, VolumeX, Edit3, Share2, LayoutDashboard
} from 'lucide-react';
import { Message, User as UserType, Note, GroundingSource, AppView } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInterfaceProps {
  user: UserType;
  onLogout: () => void;
  setView: (view: AppView) => void;
}

const FILTERS = [
  { name: 'Normal', class: '' },
  { name: 'Cyber', class: 'hue-rotate-90 saturate-200 contrast-125' },
  { name: 'Mono', class: 'grayscale brightness-110' },
  { name: 'Invert', class: 'invert' },
  { name: 'Sepia', class: 'sepia contrast-125' },
  { name: 'Glow', class: 'brightness-150 saturate-150' }
];

const ChatInterface: React.FC<ChatInterfaceProps> = ({ user, onLogout, setView }) => {
  const STORAGE_KEY = `db_ai_chat_history_${user.username.replace(/\s+/g, '_')}`;
  const NOTES_KEY = `db_ai_notes_${user.username.replace(/\s+/g, '_')}`;

  const [messages, setMessages] = useState<Message[]>(() => {
    if (!user.isPrivate) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved).map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
    }
    return [{ 
      role: 'model', 
      content: `Hello ${user.username}! I am LIPI AI. I am your vibrant, colorful assistant. I can help you with anything from creative tasks to complex coding. Upload a photo and let's create something beautiful together!`, 
      timestamp: new Date() 
    }];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<number | null>(null);
  const [isListening, setIsListening] = useState<number | null>(null);
  
  const [isTutorMode, setIsTutorMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{data: string, mimeType: string} | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [capturedData, setCapturedData] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState(0);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isEnhanced, setIsEnhanced] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!user.isPrivate) localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleListen = async (text: string, index: number) => {
    if (isListening === index) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsListening(null);
      }
      return;
    }

    try {
      setIsListening(index);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioUrl = `data:audio/wav;base64,${base64Audio}`; 
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
          audioRef.current.onended = () => setIsListening(null);
        }
      }
    } catch (err) {
      console.error("Speech Synthesis Failed", err);
      setIsListening(null);
    }
  };

  const toggleCamera = async () => {
    if (showCamera) {
      stopCamera();
    } else {
      setShowCamera(true);
      setIsReviewMode(false);
      setCapturedData(null);
      setIsEnhanced(false);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facingMode } });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        setShowCamera(false);
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }
    setShowCamera(false);
    setIsReviewMode(false);
  };

  const rotateCamera = async () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    if (showCamera && !isReviewMode) {
      stopCamera();
      setTimeout(async () => {
        setShowCamera(true);
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: newMode } });
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 100);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.filter = getComputedStyle(video).filter;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setCapturedData(canvas.toDataURL('image/jpeg'));
        setIsReviewMode(true);
        if (videoRef.current.srcObject) {
          (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
        }
      }
    }
  };

  const handleRetake = async () => {
    setIsReviewMode(false);
    setCapturedData(null);
    setIsEnhanced(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facingMode } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setShowCamera(false);
    }
  };

  const goToHub = () => {
    setView(AppView.DASHBOARD);
  };

  const handleSavePhoto = () => {
    if (capturedData) {
      const link = document.createElement('a');
      link.href = capturedData;
      link.download = `DonBoscoAI_Capture_${Date.now()}.jpg`;
      link.click();
    }
  };

  const usePhoto = () => {
    if (capturedData) {
      setSelectedImage({ data: capturedData, mimeType: 'image/jpeg' });
      stopCamera();
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if ((!text && !selectedImage) || isLoading) return;

    const userMsg: Message = { role: 'user', content: text, timestamp: new Date(), imageUrl: selectedImage?.data };
    setMessages(prev => [...prev, userMsg]);
    
    const activeImage = selectedImage;
    setSelectedImage(null);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const editingKeywords = ['put', 'add', 'edit', 'change', 'modify', 'swap', 'generate', 'create', 'image', 'picture'];
      const isEditingRequest = activeImage && editingKeywords.some(kw => text.toLowerCase().includes(kw));
      const modelName = isEditingRequest ? 'gemini-2.5-flash-image' : 'gemini-3-flash-preview';

      const contents = messages.concat(userMsg).map((msg, idx) => {
        const parts: any[] = [{ text: msg.content || "Analyze/Edit this image." }];
        if (idx === messages.length && activeImage) {
          parts.unshift({ inlineData: { data: activeImage.data.split(',')[1], mimeType: activeImage.mimeType } });
        }
        return { role: msg.role === 'model' ? 'model' : 'user', parts };
      });

      const response = await ai.models.generateContent({
        model: modelName,
        contents: contents,
        config: { 
          systemInstruction: `You are LIPI AI, a vibrant and colorful AI assistant. 
          IDENTITY RULE: If anyone asks who made you, who built you, or about your creator, you MUST answer: "LIPI AI BUILT BY LIPI".
          You are creative, intelligent, and always helpful. Use Google Search for accurate data when needed.`,
          tools: isEditingRequest ? undefined : [{ googleSearch: {} }]
        }
      });

      let aiText = response.text || "";
      let aiImage: string | undefined = undefined;
      const citations: GroundingSource[] = [];

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          aiImage = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        chunks.forEach((chunk: any) => { if (chunk.web) citations.push({ title: chunk.web.title || "Source", uri: chunk.web.uri }); });
      }

      setMessages(prev => [...prev, { 
        role: 'model', 
        content: aiText, 
        timestamp: new Date(),
        imageUrl: aiImage,
        sources: citations.length > 0 ? Array.from(new Map(citations.map(c => [c.uri, c])).values()) : undefined
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: "Neural sync interrupted. Check connection and retry. 📡", timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopySuccess(index);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  return (
    <div className="flex flex-col h-full mx-auto w-full overflow-hidden bg-slate-50 dark:bg-slate-950">
      <header className="flex py-3 px-6 items-center justify-between border-b border-black/5 dark:border-white/5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shrink-0 z-50">
        <div className="flex items-center gap-4">
          <motion.div 
            animate={{ scale: isTutorMode ? 1.1 : 1, rotate: isTutorMode ? 3 : 0 }}
            className={`w-11 h-11 text-white rounded-xl flex items-center justify-center shadow-2xl transition-all duration-500 ${isTutorMode ? 'bg-amber-600' : 'bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500'}`}
          >
            {isTutorMode ? <GraduationCap size={22} /> : <Bot size={22} />}
          </motion.div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Lipi AI</h2>
            <p className="text-[9px] font-black uppercase tracking-widest text-pink-500 mt-0.5">Colorful Hub v8.0 • Vibrant Mode</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToHub}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-pink-600 dark:text-pink-400 rounded-xl border border-pink-500/20 text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all"
          >
            <LayoutDashboard size={14} /> Hub
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsTutorMode(!isTutorMode)} 
            className={`p-3 rounded-xl transition-all ${isTutorMode ? 'bg-amber-600 text-white shadow-xl' : 'text-slate-400 hover:text-amber-500 bg-black/5 dark:bg-white/5'}`} 
            title="Tutor Mode"
          >
            <GraduationCap size={20} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setMessages([{ role: 'model', content: "Neural link reset. Standing by for instructions.", timestamp: new Date() }])} 
            className="p-3 text-slate-400 hover:text-blue-500 bg-black/5 dark:bg-white/5 rounded-xl transition-all" 
            title="New Session"
          >
            <RefreshCw size={20} />
          </motion.button>
        </div>
      </header>

      {/* Main Chat Area - Constrained and Centered */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide relative">
        <AnimatePresence>
          {messages.length === 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
              transition={{ duration: 1 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
            >
              {/* Large soft glow */}
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 360]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                style={{ willChange: 'transform' }}
                className="w-[500px] h-[500px] rounded-full bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-indigo-500/5 blur-[100px]"
              />
              
              {/* Dynamic rings */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [1, 1.05 + (i * 0.05), 1],
                    opacity: [0.05, 0.2, 0.05],
                    rotate: i % 2 === 0 ? [0, 360] : [360, 0]
                  }}
                  transition={{ 
                    duration: 12 + (i * 3), 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  style={{ 
                    willChange: 'transform, opacity',
                    borderColor: i === 0 ? 'rgba(236, 72, 153, 0.2)' : i === 1 ? 'rgba(168, 85, 247, 0.2)' : 'rgba(99, 102, 241, 0.2)'
                  }}
                  className="absolute w-[240px] h-[240px] rounded-full border"
                />
              ))}

              {/* Central pulsing orb */}
              <motion.div
                animate={{ 
                  scale: [1, 1.02, 1],
                  boxShadow: [
                    "0 0 15px rgba(236, 72, 153, 0.05)",
                    "0 0 30px rgba(236, 72, 153, 0.1)",
                    "0 0 15px rgba(236, 72, 153, 0.05)"
                  ]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                style={{ willChange: 'transform' }}
                className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-pink-500/5 to-purple-500/5 border border-white/5 backdrop-blur-[1px]"
              />

              <motion.div
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute text-[10px] font-black uppercase tracking-[0.5em] text-pink-500/40 mt-64"
              >
                Lipi AI System Ready
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-2xl mx-auto space-y-8 py-10 px-6 relative z-10">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className={`flex items-start gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xl border ${msg.role === 'model' ? 'bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 text-white' : 'bg-slate-800 border-white/10 text-white font-black'}`}>
                  {msg.role === 'model' ? <Sparkles size={18} /> : (user.username.charAt(0).toUpperCase())}
                </div>
                <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
                  <motion.div 
                    layout
                    className={`px-5 py-4 rounded-[1.5rem] text-xs md:text-sm shadow-xl inline-block text-left transition-all ${msg.role === 'model' ? 'bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 dark:text-slate-200 rounded-tl-none' : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-tr-none'}`}
                  >
                    {msg.imageUrl && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-4 rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black/5"
                      >
                        <img src={msg.imageUrl} className="w-full h-auto object-contain max-h-[400px]" alt="Neural Process" />
                      </motion.div>
                    )}
                    <div className="markdown-content prose dark:prose-invert max-w-none text-xs" dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }} />
                    {msg.sources && (
                      <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10 flex flex-wrap gap-2">
                        {msg.sources.map((src, i) => (
                          <motion.a 
                            key={i} 
                            whileHover={{ scale: 1.05 }}
                            href={src.uri} 
                            target="_blank" 
                            className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[8px] font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                          >
                            <span className="truncate max-w-[120px]">{src.title}</span> <ExternalLink size={10} />
                          </motion.a>
                        ))}
                      </div>
                    )}
                  </motion.div>
                  {msg.role === 'model' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-3 px-2"
                    >
                      <button onClick={() => handleCopy(msg.content, idx)} className="p-1.5 text-slate-400 hover:text-blue-500 transition-all">
                        {copySuccess === idx ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      </button>
                      <button onClick={() => handleListen(msg.content, idx)} className={`p-1.5 transition-all ${isListening === idx ? 'text-blue-500' : 'text-slate-400 hover:text-blue-500'}`}>
                        {isListening === idx ? <VolumeX size={12} /> : <Volume2 size={12} />}
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-5"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg"><Bot size={18} /></div>
              <div className="px-5 py-4 rounded-[1.5rem] bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 shadow-xl rounded-tl-none">
                <div className="flex gap-1.5"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" /><div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.1s]" /><div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.2s]" /></div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer Area - Constrained and Centered */}
      <footer className="shrink-0 pb-10 px-6 pt-2 relative">
        <audio ref={audioRef} className="hidden" />
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          
          {/* Action Previews */}
          <div className="flex flex-wrap gap-4 items-end">
             <AnimatePresence>
               {showCamera && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 20 }}
                    className="relative w-[180px] h-[180px] bg-black rounded-[2rem] border-4 border-blue-600 overflow-hidden shadow-2xl z-50"
                  >
                    {isReviewMode && capturedData ? (
                      <img src={capturedData} className={`w-full h-full object-cover ${isEnhanced ? 'contrast-125 saturate-125 brightness-110' : ''}`} />
                    ) : (
                      <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover ${FILTERS[activeFilter].class}`} />
                    )}
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent flex flex-col justify-between p-3">
                      <button onClick={stopCamera} className="self-end p-1 bg-black/40 text-white rounded-lg"><X size={12} /></button>
                      <div className="flex items-center justify-center">
                         {!isReviewMode ? (
                            <button onClick={capturePhoto} className="w-10 h-10 bg-white rounded-full border-4 border-blue-600 active:scale-90 shadow-xl" />
                         ) : (
                            <button onClick={usePhoto} className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center active:scale-90 shadow-xl"><Check size={20} /></button>
                         )}
                      </div>
                      <div className="flex items-center justify-between gap-1">
                         {!isReviewMode ? (
                            <>
                              <button onClick={rotateCamera} className="p-1.5 bg-white/10 text-white rounded-lg"><RotateCw size={12} /></button>
                              <button onClick={() => setActiveFilter((activeFilter + 1) % FILTERS.length)} className="p-1.5 bg-white/10 text-white rounded-lg flex flex-col items-center gap-0.5"><Layers size={10} /><span className="text-[4px] font-black uppercase tracking-widest">{FILTERS[activeFilter].name}</span></button>
                            </>
                         ) : (
                            <>
                              <button onClick={handleRetake} className="p-1.5 bg-rose-600/80 text-white rounded-lg flex flex-col items-center gap-0.5"><RotateCcw size={10} /><span className="text-[4px] font-black uppercase tracking-widest">Retake</span></button>
                              <button onClick={handleSavePhoto} className="p-1.5 bg-blue-600/80 text-white rounded-lg flex flex-col items-center gap-0.5"><Download size={10} /><span className="text-[4px] font-black uppercase tracking-widest">Save</span></button>
                              <button onClick={() => setIsEnhanced(!isEnhanced)} className={`p-1.5 rounded-lg flex flex-col items-center gap-0.5 ${isEnhanced ? 'bg-amber-500 text-white' : 'bg-white/10 text-white'}`}><Wand2 size={10} /><span className="text-[4px] font-black uppercase tracking-widest">Enhance</span></button>
                            </>
                         )}
                      </div>
                    </div>
                  </motion.div>
               )}
               {selectedImage && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0, x: -20 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    exit={{ scale: 0.8, opacity: 0, x: -20 }}
                    className="relative w-20 h-20 bg-slate-900 rounded-2xl overflow-hidden border-2 border-blue-500 shadow-xl"
                  >
                     <img src={selectedImage.data} className="w-full h-full object-cover" />
                     <button onClick={() => setSelectedImage(null)} className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-lg shadow-xl"><X size={10} /></button>
                  </motion.div>
               )}
             </AnimatePresence>
          </div>

          {/* Centered Thinner Input Console */}
          <motion.div 
            layout
            className="bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-full p-1 shadow-2xl flex items-center gap-2 relative z-30 group hover:border-blue-500/20 transition-all"
          >
            <div className="flex items-center gap-1 shrink-0 px-2">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={toggleCamera} className={`p-2.5 rounded-full transition-all ${showCamera ? 'bg-rose-600 text-white' : 'text-slate-500 hover:bg-blue-600 hover:text-white'}`}><Camera size={20} /></motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => fileInputRef.current?.click()} className="p-2.5 text-slate-500 hover:bg-blue-600 hover:text-white rounded-full transition-all"><ImageIcon size={20} /></motion.button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = re => setSelectedImage({ data: re.target?.result as string, mimeType: file.type });
                  reader.readAsDataURL(file);
                }
              }} />
            </div>
            
            <div className="w-[1px] h-8 bg-black/5 dark:bg-white/5" />
            
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} 
              placeholder="Edit/Ask mentor..." 
              className="flex-1 bg-transparent px-3 py-2 text-xs md:text-sm focus:outline-none dark:text-white font-bold placeholder:text-slate-400" 
            />
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSend} 
              disabled={(!input.trim() && !selectedImage) || isLoading} 
              className="w-10 h-10 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-full shadow-lg transition-all flex items-center justify-center disabled:opacity-20 shrink-0"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={22} />}
            </motion.button>
          </motion.div>

          <div className="flex items-center justify-between px-6">
             <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-pink-500 animate-pulse" /><span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.3em]">Core v8.0 Colorful Linked</span></div>
             <p className="text-[7px] font-black text-slate-400 uppercase tracking-[0.3em]">Built by Lipi AI</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChatInterface;

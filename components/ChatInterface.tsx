
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Send, User, Bot, Loader2, Sparkles, Image as ImageIcon, Camera, ExternalLink, X, RefreshCw, LogOut, Wand2, Download, Zap, Mic, MicOff } from 'lucide-react';
import { Message, GroundingSource, User as UserType, SystemConfig } from '../types';

interface ChatInterfaceProps {
  user: UserType;
  onLogout: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ user, onLogout }) => {
  const STORAGE_KEY = `db_ai_chat_history_${user.username.replace(/\s+/g, '_')}`;
  const LOG_KEY = 'db_ai_global_logs';
  const CONFIG_KEY = 'db_ai_global_config';

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
    }
    return [{
      role: 'model',
      content: `Hello ${user.username}! I am DON BOSCO AI, your global mentor. I'm here to support learners everywhere. I can visualize ideas, explain complex topics, or just provide encouragement. How can I assist you today?`,
      timestamp: new Date()
    }];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isListening, setIsListening] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);

  const [config, setConfig] = useState<SystemConfig>(() => {
    const saved = localStorage.getItem(CONFIG_KEY);
    return saved ? JSON.parse(saved) : {
      instruction: 'You are DON BOSCO AI, build by PIYUSH FROM DON BOSCO PURNIA. You are a global genius mentor for youth worldwide. Be extremely fast, compassionate, and concise.',
      safetyLevel: 'Standard',
      featuredPrompts: []
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isGeneratingImage]);

  // Camera stream lifecycle management with Facing Mode toggle
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    const startCamera = async () => {
      // Stop existing tracks before starting new ones to avoid conflicts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      try {
        activeStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: facingMode, width: { ideal: 1280 }, height: { ideal: 720 } }, 
          audio: false 
        });
        streamRef.current = activeStream;
        if (videoRef.current) {
          videoRef.current.srcObject = activeStream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(e => console.error("Video play failed", e));
          };
        }
      } catch (err) {
        alert("Unable to access camera. Please check permissions.");
        setIsCameraOpen(false);
        console.error(err);
      }
    };

    if (isCameraOpen) {
      startCamera();
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOpen, facingMode]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setInput(prev => (prev + ' ' + event.results[i][0].transcript).trim());
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setSelectedImage(dataUrl);
        setIsCameraOpen(false);
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const downloadTranscript = () => {
    const transcript = messages.map(m => 
      `[${m.timestamp.toLocaleString()}] ${m.role === 'user' ? user.username : 'DON BOSCO AI'}: ${m.content}`
    ).join('\n\n');
    
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DonBoscoAI_Transcript_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const logActivity = (query: string) => {
    const logs = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      user: user.username,
      query: query.substring(0, 100),
      timestamp: new Date(),
      flagged: query.toLowerCase().includes('hack') || query.toLowerCase().includes('cheat')
    };
    localStorage.setItem(LOG_KEY, JSON.stringify([newLog, ...logs].slice(0, 50)));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        setSelectedImage(readerEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    const resetMsg: Message = {
      role: 'model',
      content: `Memory reset successful. I'm ready to support your global learning journey, ${user.username}.`,
      timestamp: new Date()
    };
    setMessages([resetMsg]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([resetMsg]));
  };

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if ((!trimmedInput && !selectedImage) || isLoading || isGeneratingImage) return;

    if (isListening) {
      recognitionRef.current?.stop();
    }

    const userMsg: Message = {
      role: 'user',
      content: trimmedInput,
      imageUrl: selectedImage || undefined,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    logActivity(trimmedInput);
    const currentInput = trimmedInput;
    const currentImage = selectedImage;
    setInput('');
    setSelectedImage(null);

    const imgTriggers = ['generate', 'create', 'draw', 'show me', 'visualize', 'image', 'picture', 'mockup', 'design'];
    const lowerInput = currentInput.toLowerCase();
    const isImageRequest = imgTriggers.some(kw => lowerInput.includes(kw)) && (lowerInput.includes('image') || lowerInput.includes('draw') || lowerInput.includes('picture') || lowerInput.includes('visual'));

    if (isImageRequest && !currentImage) {
      setIsGeneratingImage(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: `Professional educational visualization for global learners: ${currentInput}. Style: High-tech, futuristic, clear, blue/indigo neon highlights.` }]
          },
          config: { imageConfig: { aspectRatio: "1:1" } }
        });

        let generatedUrl = '';
        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            generatedUrl = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }

        if (generatedUrl) {
          const modelMsg: Message = {
            role: 'model',
            content: `I've visualized this for you: "${currentInput}".`,
            imageUrl: generatedUrl,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, modelMsg]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsGeneratingImage(false);
      }
    } else {
      setIsLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const parts: any[] = [{ text: currentInput || "Analyze this image." }];
        
        if (currentImage) {
          parts.push({
            inlineData: {
              mimeType: 'image/jpeg',
              data: currentImage.split(',')[1]
            }
          });
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [
            ...messages.slice(-8).map(m => ({
              role: m.role,
              parts: [{ text: m.content }]
            })),
            { role: 'user', parts: parts }
          ],
          config: {
            systemInstruction: config.instruction,
            tools: [{ googleSearch: {} }]
          }
        });

        const modelMsg: Message = {
          role: 'model',
          content: response.text || "I am here to help.",
          timestamp: new Date(),
          sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => c.web && ({ title: c.web.title, uri: c.web.uri })).filter(Boolean)
        };
        setMessages(prev => [...prev, modelMsg]);
      } catch (error) {
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full px-4 md:px-10">
      <header className="hidden md:flex py-6 items-center justify-between border-b border-white/5 mb-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Bot size={28} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tighter uppercase">DON BOSCO AI</h2>
            <div className="flex items-center gap-2 text-[10px] text-blue-500 font-black uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Global Core Active
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={downloadTranscript} title="Download Chat" className="p-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-all border border-white/5">
            <Download size={18} />
          </button>
          <button onClick={handleReset} title="Reset Chat" className="p-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-all border border-white/5">
            <RefreshCw size={18} />
          </button>
          <button onClick={onLogout} className="p-3 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-xl transition-all border border-rose-500/20">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <div className="md:hidden flex items-center justify-between py-3 border-b border-white/5 mb-2">
         <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global Logic</span>
         <div className="flex gap-2">
           <button onClick={downloadTranscript} className="flex items-center gap-1.5 text-[8px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/5 px-2.5 py-1 rounded-lg border border-emerald-500/20">
             <Download size={10} /> Save
           </button>
           <button onClick={handleReset} className="flex items-center gap-1.5 text-[8px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/5 px-2.5 py-1 rounded-lg border border-blue-500/20">
             <RefreshCw size={10} /> Reset
           </button>
         </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pt-4 pb-12 pr-1 scrollbar-hide">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 shadow-lg border ${msg.role === 'model' ? 'bg-blue-600 text-white border-blue-500/50' : 'bg-slate-800 text-slate-400 border-white/10'}`}>
              {msg.role === 'model' ? <Sparkles size={16} /> : <User size={16} />}
            </div>
            <div className={`max-w-[88%] md:max-w-[75%] space-y-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
              <div className={`px-4 py-3 rounded-[1.25rem] text-sm leading-relaxed shadow-xl inline-block text-left ${msg.role === 'model' ? 'bg-slate-900/90 backdrop-blur-md border border-white/5 text-slate-200 rounded-tl-none' : 'bg-blue-600 text-white border border-blue-500/50 rounded-tr-none shadow-blue-500/20'}`}>
                {msg.imageUrl && <img src={msg.imageUrl} className="max-w-full rounded-xl mb-3 border border-white/10 shadow-lg" alt="AI Vision" />}
                <div className="whitespace-pre-wrap font-bold tracking-tight">{msg.content}</div>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-white/5 flex flex-wrap gap-1.5">
                    {msg.sources.map((s, i) => (
                      <a key={i} href={s.uri} target="_blank" rel="noreferrer" className="text-[8px] bg-white/5 text-slate-400 px-2 py-0.5 rounded border border-white/10 truncate max-w-[100px] font-bold">
                        {s.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-[8px] font-black text-slate-800 px-2 uppercase tracking-widest">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        ))}
        {(isLoading || isGeneratingImage) && (
          <div className="flex items-center gap-2 text-blue-500 text-[9px] font-black animate-pulse ml-11 uppercase tracking-widest">
            <Loader2 size={12} className="animate-spin" />
            {isGeneratingImage ? "Synthesizing..." : "Processing..."}
          </div>
        )}
      </div>

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg bg-slate-900 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className="w-full aspect-[3/4] object-cover bg-black"
            />
            <div className="p-8 flex items-center justify-between bg-slate-950/80">
              <button 
                onClick={() => setIsCameraOpen(false)}
                className="p-4 bg-white/5 hover:bg-rose-500/20 text-white rounded-2xl border border-white/10 transition-all active:scale-95"
              >
                <X size={24} />
              </button>
              <button 
                onClick={capturePhoto}
                className="p-6 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-2xl shadow-blue-500/40 transition-all active:scale-90 border-4 border-white/10"
              >
                <Zap size={32} fill="currentColor" />
              </button>
              <button 
                onClick={toggleCameraFacing}
                className="p-4 bg-white/5 hover:bg-emerald-500/20 text-white rounded-2xl border border-white/10 transition-all active:scale-95"
                title="Switch Camera"
              >
                <RefreshCw size={24} className={facingMode === 'environment' ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </button>
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      <div className="pb-36 md:pb-10 pt-2 sticky bottom-0 z-40 bg-slate-950/40 backdrop-blur-sm -mx-4 px-4">
        {selectedImage && (
          <div className="mb-3 flex items-center gap-3 p-1.5 bg-slate-900 border border-white/10 rounded-2xl w-fit shadow-2xl animate-in zoom-in">
            <img src={selectedImage} className="w-12 h-12 object-cover rounded-lg" alt="Preview" />
            <button onClick={() => setSelectedImage(null)} className="p-1.5 text-rose-500"><X size={14} /></button>
          </div>
        )}
        <div className="bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-[1.75rem] md:rounded-[2rem] p-1.5 md:p-2.5 shadow-2xl flex flex-row items-center gap-1 transition-all focus-within:ring-1 ring-blue-500/50">
          <div className="flex items-center gap-0.5">
             <button 
              onClick={() => fileInputRef.current?.click()} 
              title="Upload Image"
              className="p-2 md:p-2.5 text-slate-500 hover:text-blue-400 active:scale-90 transition-transform"
             >
               <ImageIcon size={20} />
             </button>
             <button 
              onClick={() => setIsCameraOpen(true)} 
              title="Take Photo"
              className="p-2 md:p-2.5 text-slate-500 hover:text-emerald-400 active:scale-90 transition-transform"
             >
               <Camera size={20} />
             </button>
             <button 
              onClick={toggleListening} 
              title="Voice to Text"
              className={`p-2 md:p-2.5 transition-all active:scale-90 ${isListening ? 'text-rose-500 animate-pulse' : 'text-slate-500 hover:text-blue-400'}`}
             >
               {isListening ? <MicOff size={20} /> : <Mic size={20} />}
             </button>
          </div>
          <div className="flex-1 flex items-center gap-2 min-w-0 pr-1">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder={isListening ? "Listening..." : "Ask global mentor..."}
              className={`flex-1 bg-transparent px-1 py-3 text-sm focus:outline-none text-white font-bold tracking-tight placeholder:text-slate-700 ${isListening ? 'animate-pulse' : ''}`}
            />
            <button
              onClick={handleSend}
              disabled={(!input.trim() && !selectedImage) || isLoading || isGeneratingImage}
              className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 disabled:opacity-20 transition-all shadow-lg active:scale-95 border border-white/10"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      </div>
    </div>
  );
};

export default ChatInterface;

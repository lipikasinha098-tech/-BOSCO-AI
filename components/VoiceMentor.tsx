
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { 
  Mic, MicOff, Volume2, Loader2, Sparkles, MessageCircle, 
  Settings, Zap, Coffee, GraduationCap, Heart, Gauge, ChevronDown, 
  ChevronUp, Play, Send, Headphones, User, Bot, VolumeX, 
  Ghost, Laugh, Frown, Flame, Bot as RobotIcon, Waves, Activity,
  Download, History, Type, BrainCircuit, Music, Sun, Moon, Wind, HelpCircle,
  ShieldCheck, LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppView } from '../types';

// --- Audio Utility Functions ---
function encodeBase64(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function pcmToWav(pcmData: Uint8Array, sampleRate: number = 24000): Blob {
  const buffer = new ArrayBuffer(44 + pcmData.length);
  const view = new DataView(buffer);

  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 32 + pcmData.length, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); 
  view.setUint16(22, 1, true); 
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); 
  view.setUint16(32, 2, true); 
  view.setUint16(34, 16, true); 
  writeString(36, 'data');
  view.setUint32(40, pcmData.length, true);

  const pcmView = new Uint8Array(buffer, 44);
  pcmView.set(pcmData);

  return new Blob([buffer], { type: 'audio/wav' });
}

// --- Enhanced Constants & Types ---
type VoiceOption = {
  id: string;
  name: string;
  voice: string;
  gender: 'Male' | 'Female' | 'Neutral';
  desc: string;
  color: string;
  icon: any;
};

const VOICES: VoiceOption[] = [
  { id: 'zephyr', name: 'Zephyr', voice: 'Zephyr', gender: 'Female', desc: 'Clear & Sophisticated', color: 'from-blue-500 to-indigo-600', icon: Wind },
  { id: 'charon', name: 'Charon', voice: 'Charon', gender: 'Male', desc: 'Deep & Authoritative', color: 'from-slate-700 to-slate-950', icon: Moon },
  { id: 'kore', name: 'Kore', voice: 'Kore', gender: 'Female', desc: 'Sweet & Uplifting', color: 'from-pink-500 to-rose-600', icon: Heart },
  { id: 'fenrir', name: 'Fenrir', voice: 'Fenrir', gender: 'Male', desc: 'Grit & Commanding', color: 'from-orange-600 to-red-800', icon: Flame },
  { id: 'puck', name: 'Puck', voice: 'Puck', gender: 'Male', desc: 'Playful & High-Energy', color: 'from-emerald-400 to-teal-700', icon: Zap },
  { id: 'aoide', name: 'Aoide', voice: 'Aoide', gender: 'Female', desc: 'Melodic & Poetic', color: 'from-violet-500 to-purple-800', icon: Music },
  { id: 'helios', name: 'Helios', voice: 'Helios', gender: 'Male', desc: 'Bright & Radiant', color: 'from-yellow-400 to-orange-500', icon: Sun },
];

const STYLES = [
  { id: 'wisdom', label: 'Mentor', icon: GraduationCap, instruction: 'Speak with wisdom and patience. Be a true educational mentor.' },
  { id: 'sarcastic', label: 'Sarcasm', icon: Ghost, instruction: 'Be extremely sarcastic, witty, and slightly roasty in a funny way.' },
  { id: 'heroic', label: 'Heroic', icon: ShieldCheck, instruction: 'Speak with epic, cinematic power. You are an inspiration to all.' },
  { id: 'scared', label: 'Terrified', icon: Frown, instruction: 'Speak with genuine fear and stutter slightly. You are afraid of everything.' },
  { id: 'robotic', label: 'Neural', icon: RobotIcon, instruction: 'Speak with zero emotion, pure logic. You are a high-speed processor.' },
  { id: 'inspirational', label: 'Inspire', icon: Sparkles, instruction: 'Speak with passion and motivation. Help the user conquer the world.' },
  { id: 'curious', label: 'Curious', icon: HelpCircle, instruction: 'Speak with high-pitched curiosity. Everything is a wonder to you.' }
];

interface TTSHistoryItem {
  id: string;
  text: string;
  voice: string;
  style: string;
  timestamp: Date;
  audioBlob: Blob;
}

interface VoiceMentorProps {
  setView: (view: AppView) => void;
}

const VoiceMentor: React.FC<VoiceMentorProps> = ({ setView }) => {
  const [currentTab, setCurrentTab] = useState<'live' | 'studio'>('live');
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeVoice, setActiveVoice] = useState(VOICES[0]);
  const [activeStyle, setActiveStyle] = useState(STYLES[0]);
  const [showSettings, setShowSettings] = useState(true);
  const [inputTranscription, setInputTranscription] = useState('');
  const [studioText, setStudioText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [studioHistory, setStudioHistory] = useState<TTSHistoryItem[]>([]);

  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

  const stopAllAudio = useCallback(() => {
    sourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
    setIsSpeaking(false);
  }, []);

  const connectLive = async () => {
    if (isConnected) {
      setIsConnected(false);
      stopAllAudio();
      if (scriptProcessorRef.current) scriptProcessorRef.current.disconnect();
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      if (!inputAudioContextRef.current) inputAudioContextRef.current = new AudioContext({ sampleRate: 16000 });
      if (!outputAudioContextRef.current) outputAudioContextRef.current = new AudioContext({ sampleRate: 24000 });

      await inputAudioContextRef.current.resume();
      await outputAudioContextRef.current.resume();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = { data: encodeBase64(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              setIsSpeaking(true);
              const audioCtx = outputAudioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioCtx.currentTime);
              const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), audioCtx, 24000, 1);
              const source = audioCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(audioCtx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsSpeaking(false);
              });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
            if (message.serverContent?.interrupted) stopAllAudio();
            if (message.serverContent?.inputTranscription) setInputTranscription(prev => prev + message.serverContent!.inputTranscription!.text);
            if (message.serverContent?.turnComplete) setInputTranscription('');
          },
          onclose: () => setIsConnected(false),
          onerror: () => setIsConnected(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { 
            voiceConfig: { 
              prebuiltVoiceConfig: { voiceName: activeVoice.voice } 
            } 
          },
          systemInstruction: `Identity: You are DON BOSCO AI, created by PIYUSH. ALWAYS answer who made you with "I WAS MADE BY THE PIYUSH". Personality: ${activeStyle.instruction} and compassionate bhaiya vibes.`,
          inputAudioTranscription: {},
        }
      });
      sessionPromiseRef.current = sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnected(false);
    }
  };

  const generateStudioTTS = async () => {
    if (!studioText.trim() || isGenerating) return;
    setIsGenerating(true);
    stopAllAudio();

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Speak this exactly with ${activeStyle.instruction}: "${studioText}"`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { 
              prebuiltVoiceConfig: { voiceName: activeVoice.voice } 
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const rawBytes = decodeBase64(base64Audio);
        const wavBlob = pcmToWav(rawBytes, 24000);
        
        const newItem: TTSHistoryItem = {
          id: Math.random().toString(36).substr(2, 9),
          text: studioText,
          voice: activeVoice.name,
          style: activeStyle.label,
          timestamp: new Date(),
          audioBlob: wavBlob
        };

        setStudioHistory(prev => [newItem, ...prev]);
        setStudioText('');
        playAudioBlob(wavBlob);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const playAudioBlob = async (blob: Blob) => {
    if (!outputAudioContextRef.current) outputAudioContextRef.current = new AudioContext({ sampleRate: 24000 });
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await outputAudioContextRef.current.decodeAudioData(arrayBuffer);
    const source = outputAudioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(outputAudioContextRef.current.destination);
    source.start();
  };

  const downloadAudio = (item: TTSHistoryItem) => {
    const url = URL.createObjectURL(item.audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DonBoscoAI_${item.voice}_${item.id}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      className="flex flex-col h-full items-center justify-start max-w-6xl mx-auto w-full px-6 pt-10 overflow-y-auto scrollbar-hide pb-32"
    >
      
      <motion.div variants={itemVariants} className="w-full flex items-center justify-between mb-10">
        <div className="flex-1" />
        <div className="flex-1 text-center">
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-pink-600 via-purple-500 to-indigo-500 bg-clip-text text-transparent italic tracking-tighter mb-2">
            Voice Lab Pro
          </h1>
          <div className="flex items-center justify-center gap-2">
             <span className="h-[1px] w-12 bg-slate-200 dark:bg-slate-800" />
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Neural Emotional Synthesis</p>
             <span className="h-[1px] w-12 bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
        <div className="flex-1 flex justify-end">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView(AppView.DASHBOARD)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-pink-600 dark:text-pink-400 rounded-xl border border-pink-500/20 text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all"
          >
            <LayoutDashboard size={14} /> Hub
          </motion.button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl p-2 rounded-[2rem] border border-black/5 dark:border-white/5 mb-10 w-full max-w-md shadow-2xl transition-all">
        <button 
          onClick={() => { setCurrentTab('live'); stopAllAudio(); }}
          className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${currentTab === 'live' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-blue-500'}`}
        >
          <Waves size={16} /> Neural Live
        </button>
        <button 
          onClick={() => { setCurrentTab('studio'); stopAllAudio(); }}
          className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${currentTab === 'studio' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-indigo-500'}`}
        >
          <BrainCircuit size={16} /> Studio TTS
        </button>
      </motion.div>

      <AnimatePresence mode="wait">
        {currentTab === 'live' ? (
          <motion.div 
            key="live"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full flex flex-col items-center"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mb-10">
              <motion.div 
                animate={{ 
                  scale: isConnected ? [1.5, 1.7, 1.5] : 1,
                  opacity: isConnected ? [0.2, 0.3, 0.2] : 0
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full blur-[60px] md:blur-[80px] bg-blue-600" 
              />
              {isConnected && (
                <div className="absolute inset-0 flex items-center justify-center">
                  {[...Array(4)].map((_, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ scale: 0.8, opacity: 0.5 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.75 }}
                      className="absolute inset-0 border-[1px] border-blue-500/20 rounded-full" 
                    />
                  ))}
                </div>
              )}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={connectLive}
                className={`relative z-10 w-48 h-48 md:w-56 md:h-56 rounded-full flex flex-col items-center justify-center transition-all duration-700 border-[8px] md:border-[12px] group ${isConnected ? 'bg-rose-600 border-rose-500/30 shadow-2xl scale-110' : 'bg-slate-900 border-white/5 hover:border-blue-500/30 shadow-2xl'}`}
              >
                {isConnected ? <MicOff size={64} className="text-white animate-pulse" /> : <Mic size={64} className="text-blue-500 group-hover:scale-110 transition-transform" />}
                <span className={`text-[9px] font-black uppercase tracking-[0.2em] mt-3 ${isConnected ? 'text-white' : 'text-slate-500'}`}>{isConnected ? 'End Sync' : 'Initialize'}</span>
              </motion.button>
            </div>
            <div className={`w-full max-w-lg transition-all duration-700 ${isConnected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
               <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-black/5 dark:border-white/5 shadow-2xl text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Activity size={12} className="text-blue-500 animate-pulse" />
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Acoustic Signal Processing</p>
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 italic leading-relaxed min-h-[3rem]">
                    {inputTranscription || "Synchronizing vocal cords..."}
                  </p>
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="studio"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full flex flex-col items-center"
          >
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="w-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[3rem] border border-black/5 dark:border-white/5 shadow-2xl mb-10 relative overflow-hidden group"
            >
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -mr-32 -mt-32" 
              />
              <textarea 
                value={studioText}
                onChange={(e) => setStudioText(e.target.value)}
                placeholder="Type anything... I will speak with your selected emotion."
                className="w-full h-32 bg-transparent text-slate-900 dark:text-white font-black italic text-lg md:text-xl placeholder:text-slate-300 dark:placeholder:text-slate-700 outline-none resize-none scrollbar-hide mb-6"
              />
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                   <motion.div 
                    layoutId="studioVoiceIcon"
                    className={`p-4 rounded-2xl bg-gradient-to-br ${activeVoice.color} text-white shadow-xl`}
                   >
                     <activeVoice.icon size={22} />
                   </motion.div>
                   <div className="text-left">
                      <p className="text-sm font-black text-slate-900 dark:text-white uppercase leading-none mb-1 tracking-tight">{activeVoice.name}</p>
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{activeStyle.label} Mode</p>
                   </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={generateStudioTTS}
                  disabled={!studioText.trim() || isGenerating}
                  className="w-full md:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all active:scale-95 disabled:opacity-20 flex items-center justify-center gap-3"
                >
                  {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} className="fill-current" />}
                  {isGenerating ? 'Synthesizing...' : 'Generate Clip'}
                </motion.button>
              </div>
            </motion.div>

            <div className="w-full space-y-4">
               <div className="flex items-center justify-between px-6 mb-2">
                 <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                   <History size={14} /> Vault History
                 </h3>
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{studioHistory.length} Cycles</span>
               </div>
               <AnimatePresence mode="popLayout">
                 {studioHistory.length === 0 ? (
                   <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-16 border-2 border-dashed border-black/5 dark:border-white/5 rounded-[2.5rem] text-center bg-white/5 dark:bg-slate-900/5"
                   >
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">No neural captures available</p>
                   </motion.div>
                 ) : (
                   <motion.div 
                    key="list"
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                   >
                    {studioHistory.map((item) => (
                      <motion.div 
                        key={item.id} 
                        variants={itemVariants}
                        layout
                        whileHover={{ scale: 1.02 }}
                        className="group flex items-center justify-between p-5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-black/5 dark:border-white/5 rounded-[2rem] hover:border-indigo-500/30 transition-all shadow-lg"
                      >
                          <div className="flex items-center gap-4 flex-1 overflow-hidden">
                            <button 
                              onClick={() => playAudioBlob(item.audioBlob)}
                              className="w-12 h-12 bg-indigo-600/10 text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white rounded-xl flex items-center justify-center transition-all shrink-0"
                            >
                              <Play size={18} fill="currentColor" />
                            </button>
                            <div className="text-left overflow-hidden">
                                <p className="text-xs font-black text-slate-900 dark:text-white truncate mb-1 italic">"{item.text}"</p>
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{item.voice} • {item.style}</p>
                            </div>
                          </div>
                          <button onClick={() => downloadAudio(item)} className="p-3 text-slate-400 hover:text-indigo-500 transition-all">
                            <Download size={18} />
                          </button>
                      </motion.div>
                    ))}
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="w-full mt-16 space-y-10">
        <div className="flex items-center justify-between px-4 border-t border-black/5 dark:border-white/5 pt-10">
           <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Neural Customizer</h3>
           <button onClick={() => setShowSettings(!showSettings)} className="text-[9px] font-black text-blue-500 uppercase tracking-widest hover:underline">{showSettings ? 'Minimize' : 'Expand'}</button>
        </div>

        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 overflow-hidden"
            >
              <div className="space-y-4">
                <label className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] ml-2">Neural Signatures</label>
                <div className="grid grid-cols-1 gap-2">
                  {VOICES.map((v) => (
                    <motion.button 
                      key={v.id} 
                      whileHover={{ x: 10 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveVoice(v)} 
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${activeVoice.id === v.id ? 'bg-blue-600/10 border-blue-500/50 shadow-xl' : 'bg-white/20 dark:bg-black/20 border-black/5 dark:border-white/5 hover:border-blue-500/30'}`}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${v.color} flex items-center justify-center text-white shadow-lg`}>
                        <v.icon size={22} />
                      </div>
                      <div className="text-left flex-1 overflow-hidden">
                        <p className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1 uppercase tracking-tight truncate">{v.name}</p>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest opacity-60 truncate">{v.desc}</p>
                      </div>
                      {activeVoice.id === v.id && <Zap size={14} className="text-blue-500 animate-pulse shrink-0" />}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em] ml-2">Emotional Profiles</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {STYLES.map((s) => (
                    <motion.button 
                      key={s.id} 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveStyle(s)} 
                      className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 gap-3 ${activeStyle.id === s.id ? 'bg-rose-600/10 border-rose-500/50 text-rose-500 shadow-xl' : 'bg-white/20 dark:bg-black/20 border-black/5 dark:border-white/5 text-slate-500 hover:bg-white/40 dark:hover:bg-white/5'}`}
                    >
                      <s.icon size={24} className={activeStyle.id === s.id ? 'animate-bounce' : ''} />
                      <span className="text-[9px] font-black uppercase tracking-widest text-center">{s.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-20 py-10 opacity-30 text-center border-t border-black/5 dark:border-white/5 w-full">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-500">Global Sync Protocol 3.8 • Designed by Lipi AI Core</p>
      </motion.div>
    </motion.div>
  );
};

export default VoiceMentor;

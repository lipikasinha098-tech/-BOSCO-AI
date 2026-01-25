
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Mic, MicOff, Volume2, Loader2, Sparkles, MessageCircle } from 'lucide-react';

const VoiceMentor: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const audioContextRef = useRef<AudioContext | null>(null);

  const speakAdvice = async (text: string) => {
    setIsSpeaking(true);
    try {
      // Correctly initialize GoogleGenAI as per guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: [{ parts: [{ text: `In a kind, encouraging mentor voice, say this to a student: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        
        // Manual audio decoding as required by guidelines
        const audioBuffer = await decodeAudioData(
          decodeBase64(base64Audio),
          audioContextRef.current,
          24000,
          1
        );
        
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
      }
    } catch (error) {
      console.error("TTS Error", error);
      setIsSpeaking(false);
    }
  };

  // Manual base64 decoding as required by guidelines
  const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  // Manual PCM audio data decoding as required by guidelines
  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
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
  };

  const toggleListening = () => {
    if (!isListening) {
      setIsListening(true);
      setTranscript("Mentoring requested...");
      
      setTimeout(async () => {
        setIsListening(false);
        const responseText = "Always remember that education is a matter of the heart. Be cheerful, be brave, and be kind.";
        setLastResponse(responseText);
        await speakAdvice(responseText);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col h-full items-center justify-center max-w-2xl mx-auto w-full px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-black text-white mb-3 tracking-tight">Voice Mentor</h2>
        <p className="text-slate-500 font-medium">Conversational guidance in real-time</p>
      </div>

      <div className="relative flex flex-col items-center">
        {/* Animated Rings */}
        <div className={`absolute -inset-16 rounded-full bg-blue-500/10 blur-2xl transition-all duration-1000 scale-[2] ${isListening || isSpeaking ? 'animate-pulse opacity-40' : 'opacity-0'}`} />
        <div className={`absolute -inset-8 rounded-full bg-indigo-500/10 blur-xl transition-all duration-700 scale-[1.5] ${isListening || isSpeaking ? 'animate-ping opacity-30' : 'opacity-0'}`} />

        <button 
          onClick={toggleListening}
          disabled={isSpeaking}
          className={`relative w-40 h-40 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.3)] transition-all duration-500 border-4 border-white/5 ${
            isListening 
              ? 'bg-rose-600 border-rose-400/50 scale-110' 
              : isSpeaking 
                ? 'bg-amber-600 border-amber-400/50 scale-105' 
                : 'bg-blue-600 hover:bg-blue-500 border-blue-400/20'
          } ${isSpeaking ? 'cursor-default' : 'cursor-pointer hover:shadow-blue-500/60 active:scale-95'}`}
        >
          {isListening ? <MicOff size={48} className="text-white" /> : isSpeaking ? <Volume2 size={48} className="text-white animate-bounce" /> : <Mic size={48} className="text-white" />}
        </button>

        <div className="mt-20 w-full max-w-md space-y-6">
          {transcript && (
            <div className="flex items-start gap-4 justify-end animate-in slide-in-from-right-4 fade-in">
              <div className="bg-slate-800 text-slate-200 px-5 py-3 rounded-[1.5rem] text-sm font-medium border border-white/5 rounded-tr-none shadow-xl">
                {transcript}
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center shrink-0 border border-white/10">
                <MessageCircle size={20} className="text-slate-400" />
              </div>
            </div>
          )}

          {lastResponse && (
            <div className="flex items-start gap-4 animate-in slide-in-from-left-4 fade-in">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
                <Sparkles size={20} className="text-white" />
              </div>
              <div className="bg-slate-900 text-slate-200 px-5 py-3 rounded-[1.5rem] text-sm font-medium border border-white/10 shadow-2xl rounded-tl-none leading-relaxed">
                {lastResponse}
              </div>
            </div>
          )}

          {isListening && (
            <div className="flex justify-center pt-4">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-24 text-center max-w-sm px-4">
        <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] italic mb-2">Pedagogical Note</p>
        <p className="text-xs text-slate-500 leading-relaxed font-medium italic">
          "Education is not about filling a bucket, but about lighting a fire. Let your words be fire."
        </p>
      </div>
    </div>
  );
};

export default VoiceMentor;


import React, { useState } from 'react';
import { Lock, Timer, Fingerprint, Brain, Sparkles, BookOpen, UserCheck, ShieldCheck } from 'lucide-react';
import { GovernanceState } from '../types';

interface FocusLockProps {
  governance: GovernanceState;
  setGovernance: (g: GovernanceState) => void;
}

const FocusLock: React.FC<FocusLockProps> = ({ governance, setGovernance }) => {
  const [showAuth, setShowAuth] = useState(false);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleParentAuth = async () => {
    // Biometric Simulation
    alert("Parent: Please verify identity via fingerprint sensor.");
    setGovernance({
      ...governance,
      isLocked: false,
      studyTimeRemaining: 0,
      playTimeRemaining: 30 * 60 // Grant 30 mins play if parent overrides
    });
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950 flex flex-col items-center justify-center overflow-hidden animate-in fade-in duration-1000">
      {/* Background Neural Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute inset-0 bg-neural-grid opacity-10" />
      </div>

      <div className="relative z-10 w-full max-w-4xl px-8 flex flex-col items-center text-center space-y-12">
        <div className="space-y-4 animate-in slide-in-from-bottom-8 duration-700">
          <div className="w-20 h-20 bg-blue-600/10 text-blue-500 rounded-[1.5rem] flex items-center justify-center mx-auto border border-blue-500/20 mb-6">
             <Brain size={40} className="animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter italic">Deep Study Mode</h2>
          <div className="flex items-center justify-center gap-3">
             <div className="h-[1px] w-12 bg-slate-800" />
             <p className="text-blue-500 font-black uppercase tracking-[0.5em] text-xs">Neural Core Locked</p>
             <div className="h-[1px] w-12 bg-slate-800" />
          </div>
        </div>

        {/* Timer Display */}
        <div className="relative group">
           <div className="absolute inset-0 bg-blue-600 blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity" />
           <div className="relative bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-12 md:p-20 shadow-2xl min-w-[300px]">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 flex items-center justify-center gap-2">
                 <Timer size={14} /> Time until rewards
              </p>
              <h3 className="text-7xl md:text-9xl font-black text-white font-mono tracking-tighter tabular-nums">
                {formatTime(governance.studyTimeRemaining)}
              </h3>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl">
           {[
             { icon: BookOpen, text: 'Active Focus' },
             { icon: Sparkles, text: 'Brain Synthesis' },
             { icon: ShieldCheck, text: 'Logic Protection' }
           ].map((item, i) => (
            <div key={i} className="flex items-center justify-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 opacity-50">
               <item.icon size={16} className="text-blue-500" />
               <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.text}</span>
            </div>
           ))}
        </div>

        <footer className="space-y-6">
           <p className="text-slate-500 text-xs font-bold italic opacity-60">"The secret of happiness is to do good to others." - St. John Bosco</p>
           
           <button 
             onClick={() => setShowAuth(true)}
             className="px-10 py-5 bg-slate-900 border border-white/10 hover:border-rose-500/40 text-slate-500 hover:text-rose-500 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-4 transition-all"
           >
              <Fingerprint size={18} /> Parent Override Access
           </button>
        </footer>
      </div>

      {/* Internal Auth Overlay */}
      {showAuth && (
        <div className="fixed inset-0 z-[1100] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-in zoom-in duration-300">
           <div className="w-full max-w-md space-y-8 text-center">
              <div className="w-24 h-24 bg-rose-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(225,29,72,0.4)]">
                 <UserCheck size={48} />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Identity Verified?</h3>
                <p className="text-slate-500 text-xs font-bold px-8">Confirm parent presence by touching the biometric fingerprint sensor below.</p>
              </div>
              <button 
                onClick={handleParentAuth}
                className="w-full py-6 bg-rose-600 hover:bg-rose-500 text-white rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl active:scale-95 transition-all"
              >
                Authenticate Now
              </button>
              <button onClick={() => setShowAuth(false)} className="text-slate-600 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors">Return to Session</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default FocusLock;

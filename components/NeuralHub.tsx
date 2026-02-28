
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Zap, Brain, MessageCircle, Palette, 
  Activity, User, ArrowRight, LayoutDashboard,
  BrainCircuit, Lightbulb, GraduationCap,
  BookMarked, Mic, ShieldCheck, TrendingUp, Globe, Award
} from 'lucide-react';
import { User as UserType, AppView } from '../types';
import { motion } from 'framer-motion';

interface NeuralHubProps {
  user: UserType;
  setView: (view: AppView) => void;
}

const NeuralHub: React.FC<NeuralHubProps> = ({ user, setView }) => {
  const [greeting, setGreeting] = useState('');
  const [simulatedLoad, setSimulatedLoad] = useState(12.4);
  const [activeUsers, setActiveUsers] = useState(1284);
  
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good Morning');
    else if (hours < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const interval = setInterval(() => {
      setSimulatedLoad(prev => {
        const next = prev + (Math.random() * 2 - 1);
        return Math.max(8, Math.min(24, next));
      });
      setActiveUsers(prev => prev + Math.floor(Math.random() * 10 - 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const modules = [
    { id: AppView.CHAT, label: 'Mentor AI', desc: 'Accelerated Learning', icon: MessageCircle, color: 'bg-blue-600' },
    { id: AppView.VOICE, label: 'Voice Lab', desc: 'Neural Conversation', icon: Mic, color: 'bg-rose-600' },
    { id: AppView.CREATIVE, label: 'Art Engine', desc: 'Visual Synthesis', icon: Palette, color: 'bg-purple-600' },
    { id: AppView.NOTES, label: 'Neural Notepad', desc: 'Knowledge Vault', icon: BookMarked, color: 'bg-amber-600' }
  ];

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
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col h-full overflow-y-auto scrollbar-hide"
    >
      <div className="max-w-6xl mx-auto w-full px-6 py-10 md:py-16 space-y-12 pb-32">
        
        {/* Advanced Header */}
        <motion.header 
          variants={itemVariants}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8"
        >
          <div className="space-y-3">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full"
            >
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Neural Link Synchronized</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
              {greeting}, <br className="md:hidden" />
              <motion.span 
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: "100% 50%" }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ willChange: 'background-position' }}
                className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent italic bg-[length:200%_auto]"
              >
                {user.username.split(' ')[0]}
              </motion.span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm tracking-tight opacity-80">Welcome back to your global educational command center.</p>
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 1 }}
            className="flex items-center gap-5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-black/5 dark:border-white/5 p-5 rounded-[3rem] shadow-2xl transition-all"
          >
            <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white shadow-xl overflow-hidden border-4 border-white/10">
              {user.profilePhoto ? (
                <img src={user.profilePhoto} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                <User size={40} />
              )}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Global Latency</p>
              <div className="flex items-center gap-3">
                <p className="text-2xl font-black dark:text-white tracking-tighter">{simulatedLoad.toFixed(1)}ms</p>
                <TrendingUp size={18} className="text-emerald-500" />
              </div>
              <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-1">Tier: Neural Alpha</p>
            </div>
          </motion.div>
        </motion.header>

        {/* Cinematic Hero */}
        <motion.section 
          variants={itemVariants}
          className="relative bg-gradient-to-br from-pink-600 via-purple-700 to-indigo-900 rounded-[3.5rem] p-10 md:p-16 overflow-hidden shadow-[0_40px_100px_rgba(236,72,153,0.2)] group border border-white/10 min-h-[400px] flex flex-col justify-center"
        >
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 3, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            style={{ willChange: 'transform' }}
            className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 blur-[120px] -mr-40 -mt-40" 
          />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 blur-[80px] -ml-20 -mb-20" />
          
          <div className="relative z-10 space-y-8 text-white">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-3 px-5 py-2 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest"
            >
              <Award size={14} className="text-yellow-400" /> Education Paradigm v3.8
            </motion.div>
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-[1.05] italic max-w-3xl">
              "Technology is the bridge; Heart is the destination."
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <motion.button 
                whileHover={{ scale: 1.05, x: 10 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setView(AppView.CHAT)}
                className="group w-full md:w-auto px-12 py-6 bg-white text-blue-600 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-4 shadow-2xl transition-all"
              >
                Launch Mentor AI <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </motion.button>
              <div className="flex items-center gap-3 text-white/60">
                <Globe size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">{activeUsers.toLocaleString()} active learners worldwide</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Modules Grid */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
           {modules.map((action, i) => (
             <motion.button 
               variants={itemVariants}
               key={i}
               whileHover={{ y: -10, scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               onClick={() => setView(action.id)}
               className="p-10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-black/5 dark:border-white/5 rounded-[3.5rem] text-left transition-all group relative overflow-hidden shadow-2xl hover:shadow-blue-500/10"
             >
                <div className={`absolute top-0 right-0 w-32 h-32 ${action.color} opacity-5 blur-3xl -mr-16 -mt-16 group-hover:opacity-10 transition-opacity`} />
                <div className={`w-16 h-16 ${action.color} text-white rounded-[1.5rem] flex items-center justify-center mb-8 shadow-xl transition-transform group-hover:rotate-6`}>
                  <action.icon size={32} />
                </div>
                <h4 className="text-xl font-black dark:text-white mb-2 uppercase tracking-tight leading-none italic">{action.label}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold mb-8 opacity-70">{action.desc}</p>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase text-blue-500 tracking-[0.2em] group-hover:gap-5 transition-all">
                  Open <ArrowRight size={16} />
                </div>
             </motion.button>
           ))}
        </motion.div>

        {/* High-Impact Stats */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
           {[
             { label: 'Neural IQ', value: '142', icon: BrainCircuit, color: 'text-blue-500', desc: 'Logic Processing' },
             { label: 'Creative Level', value: 'Alpha', icon: Palette, color: 'text-purple-500', desc: 'Visual Artistry' },
             { label: 'Vocals', value: '9.8', icon: Mic, color: 'text-rose-500', desc: 'Fidelity Rating' },
             { label: 'Security', value: 'Safe', icon: ShieldCheck, color: 'text-emerald-500', desc: 'Protocol status' },
           ].map((stat, i) => (
            <motion.div 
              variants={itemVariants}
              key={i} 
              whileHover={{ scale: 1.05 }}
              className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-black/5 dark:border-white/5 p-10 rounded-[3rem] group transition-all duration-500 shadow-xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 pointer-events-none" />
              <stat.icon className={`${stat.color} mb-6 transition-transform group-hover:scale-110`} size={32} />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-4xl font-black dark:text-white tracking-tighter mb-2">{stat.value}</h3>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.footer 
          variants={itemVariants}
          className="pt-24 border-t border-black/5 dark:border-white/5 text-center space-y-6"
        >
           <div className="flex items-center justify-center gap-8">
              <div className="flex flex-col items-center">
                 <p className="text-xs font-black text-slate-400">Purnia Node</p>
                 <p className="text-[10px] text-slate-500 font-bold">Active</p>
              </div>
              <div className="w-[1px] h-8 bg-slate-200 dark:bg-slate-800" />
              <div className="flex flex-col items-center">
                 <p className="text-xs font-black text-slate-400">Global API</p>
                 <p className="text-[10px] text-slate-500 font-bold">Encrypted</p>
              </div>
           </div>
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] pt-4">Global Educator AI System v3.8 • Designed by Lipi</p>
        </motion.footer>
      </div>
    </motion.div>
  );
};

export default NeuralHub;

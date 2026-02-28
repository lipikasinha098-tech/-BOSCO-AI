
import React from 'react';
import { Sparkles, ChevronRight, Globe, Zap, Heart } from 'lucide-react';
import Logo from './Logo';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-950 overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.1, 0.05],
          rotate: [0, 3, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{ willChange: 'transform, opacity' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-indigo-500/10 rounded-full blur-[100px]" 
      />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      
      <div className="relative flex flex-col items-center text-center px-6 max-w-4xl">
        {/* Animated Logo Section */}
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
          className="mb-12"
        >
          <div className="relative">
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 bg-blue-500 blur-3xl" 
            />
            <Logo size={80} className="scale-150 md:scale-[2]" />
          </div>
        </motion.div>

        {/* Brand Identity */}
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="space-y-4 mb-12"
        >
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent filter drop-shadow-[0_0_15px_rgba(236,72,153,0.3)]">
            LIPI AI
          </h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 1 }}
            className="flex items-center justify-center gap-3 overflow-hidden whitespace-nowrap"
          >
            <div className="h-[1px] w-8 bg-slate-800" />
            <p className="text-pink-500 font-black uppercase tracking-[0.4em] text-[10px] md:text-xs">
              Colorful Assistant v8.0
            </p>
            <div className="h-[1px] w-8 bg-slate-800" />
          </motion.div>
        </motion.div>

        {/* Value Proposition */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-slate-400 text-sm md:text-lg max-w-xl mx-auto leading-relaxed mb-16 font-medium"
        >
          Your vibrant, colorful AI assistant. Empowering creativity and intelligence in every pixel. 🌈✨
        </motion.p>

        {/* Primary CTA */}
        <motion.button 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(236,72,153,0.6)" }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          onClick={onEnter}
          className="group relative flex items-center gap-4 px-10 py-6 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm transition-all shadow-[0_0_50px_rgba(236,72,153,0.4)] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <Zap size={20} className="fill-current" />
          Initialize Lipi AI
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </motion.button>

        {/* Footer Credit */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-[-150px] md:bottom-[-200px] left-1/2 -translate-x-1/2 w-full pt-12"
        >
          <div className="flex flex-col items-center gap-2">
            <p className="text-slate-700 text-[9px] font-black uppercase tracking-[0.5em]">Developed by Lipi</p>
            <p className="text-slate-800 text-[8px] font-black uppercase tracking-widest">Colorful Vision • Global Mission</p>
          </div>
        </motion.div>
      </div>

      {/* Side Indicators */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="hidden lg:flex fixed left-10 top-1/2 -translate-y-1/2 flex-col gap-8"
      >
        <div className="flex flex-col items-center gap-4 text-slate-800">
           <Globe size={16} />
           <div className="w-[1px] h-20 bg-slate-900" />
           <span className="[writing-mode:vertical-lr] text-[8px] font-black uppercase tracking-widest">Status: Online</span>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="hidden lg:flex fixed right-10 top-1/2 -translate-y-1/2 flex-col gap-8"
      >
        <div className="flex flex-col items-center gap-4 text-slate-800">
           <span className="[writing-mode:vertical-lr] text-[8px] font-black uppercase tracking-widest">Protocol: Secure</span>
           <div className="w-[1px] h-20 bg-slate-900" />
           <Heart size={16} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LandingPage;

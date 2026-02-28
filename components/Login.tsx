
import React, { useState, useRef } from 'react';
import { User, UserRole } from '../types';
// Added Check to the imported icons from lucide-react
import { Lock, User as UserIcon, LogIn, AlertCircle, GraduationCap, ShieldCheck, Camera, X, RefreshCw, Shield, Check } from 'lucide-react';
import Logo from './Logo';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [studentName, setStudentName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Photo is too large. Please select an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (re) => setProfilePhoto(re.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isAdminMode) {
      if (username === 'piyush_admin' && password === 'donbosco2024') {
        onLogin({ username: 'Piyush (Admin)', role: 'ADMIN', profilePhoto: profilePhoto || undefined, isPrivate: false });
      } else {
        setError('Incorrect Admin credentials.');
      }
    } else {
      if (studentName.trim().length < 2) {
        setError('Please enter your full name to continue.');
      } else {
        onLogin({ 
          username: studentName.trim(), 
          role: 'USER', 
          profilePhoto: profilePhoto || undefined,
          isPrivate: isPrivate
        });
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-6 bg-slate-950"
    >
      <motion.div 
        initial={{ y: 40, scale: 0.9, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        style={{ willChange: 'transform, opacity' }}
        className="w-full max-w-md bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/10 p-8 md:p-12 relative overflow-hidden"
      >
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: 'transform, opacity' }}
          className="absolute -top-20 -right-20 w-64 h-64 bg-pink-500/10 blur-[80px] rounded-full pointer-events-none"
        />
        
        <div className="text-center mb-8 flex flex-col items-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Logo size={36} className="mb-6" />
          </motion.div>
          <h1 className="text-4xl font-black text-white mb-1 tracking-tighter bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent uppercase">LIPI AI</h1>
          <p className="text-pink-500 text-[10px] font-black uppercase tracking-widest">Colorful Gateway v8.0</p>
        </div>

        <div className="flex bg-slate-800/30 p-1 rounded-2xl mb-8 border border-white/5 relative">
          <motion.div 
            layoutId="activeTab"
            className={`absolute inset-y-1 w-[calc(50%-4px)] rounded-xl transition-colors duration-300 ${isAdminMode ? 'right-1 bg-gradient-to-r from-purple-600 to-indigo-600' : 'left-1 bg-gradient-to-r from-pink-600 to-purple-600'}`}
          />
          <button 
            onClick={() => setIsAdminMode(false)} 
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all relative z-10 ${!isAdminMode ? 'text-white' : 'text-slate-500'}`}
          >
            <GraduationCap size={16} /> Student
          </button>
          <button 
            onClick={() => setIsAdminMode(true)} 
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all relative z-10 ${isAdminMode ? 'text-white' : 'text-slate-500'}`}
          >
            <ShieldCheck size={16} /> Admin
          </button>
        </div>

        {/* Neural Identity Module */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center mb-8"
        >
           <motion.div 
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => fileInputRef.current?.click()}
             className="group relative w-24 h-24 rounded-3xl bg-slate-800 border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:border-blue-500/50"
           >
             {profilePhoto ? (
               <>
                 <img src={profilePhoto} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Camera className="text-white" size={24} /></div>
                 <button onClick={(e) => { e.stopPropagation(); setProfilePhoto(null); }} className="absolute top-1 right-1 p-1 bg-rose-500 rounded-lg text-white shadow-lg"><X size={12} /></button>
               </>
             ) : (
               <div className="flex flex-col items-center text-slate-500 group-hover:text-blue-500 transition-colors">
                 <Camera size={28} />
                 <span className="text-[8px] font-black uppercase tracking-widest mt-2">Identity</span>
               </div>
             )}
           </motion.div>
           <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        </motion.div>

        <form onSubmit={handleLogin} className="space-y-5">
          <AnimatePresence mode="wait">
            {!isAdminMode ? (
              <motion.div
                key="student"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-4 pl-12 text-white font-bold focus:ring-2 ring-blue-500/40 outline-none" placeholder="Enter name" required />
                  </div>
                </div>
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsPrivate(!isPrivate)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${isPrivate ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800/30 border-white/5'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isPrivate ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-500'}`}>
                    <Shield size={18} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isPrivate ? 'text-emerald-500' : 'text-slate-400'}`}>Private Session</p>
                    <p className="text-[8px] text-slate-600 font-bold">Don't save chat history to this browser.</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isPrivate ? 'bg-emerald-500 border-emerald-500' : 'border-slate-700'}`}>
                     {isPrivate && <Check size={12} className="text-white" />}
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="admin"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admin ID</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-4 pl-12 text-white font-bold focus:ring-2 ring-indigo-500/40 outline-none" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Key</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-4 pl-12 text-white font-bold focus:ring-2 ring-indigo-500/40 outline-none" required />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="text-rose-400 bg-rose-500/10 p-4 rounded-2xl text-[10px] font-black uppercase tracking-tight border border-rose-500/20 overflow-hidden"
            >
              {error}
            </motion.div>
          )}

          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(236,72,153,0.4)" }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className={`w-full font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl transition-all ${isAdminMode ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white' : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white'}`}
          >
            Initialize Lipi AI
          </motion.button>
        </form>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex items-start gap-3 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10"
        >
           <AlertCircle size={16} className="text-blue-500 shrink-0" />
           <p className="text-[9px] text-slate-500 font-bold leading-relaxed">
             <span className="text-blue-400 uppercase font-black">Privacy Notice:</span> All data is stored locally in your browser cache. Others cannot see it unless they use this exact device.
           </p>
        </motion.div>

        <p className="mt-8 text-[9px] text-slate-600 uppercase tracking-[0.3em] font-black text-center">Built by Lipi • Colorful Vision</p>
      </motion.div>
    </motion.div>
  );
};

export default Login;


import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Sparkles, Lock, User as UserIcon, LogIn, AlertCircle, GraduationCap, ShieldCheck } from 'lucide-react';
import Logo from './Logo';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [studentName, setStudentName] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isAdminMode) {
      if (username === 'piyush_admin' && password === 'donbosco2024') {
        onLogin({ username: 'Piyush (Admin)', role: 'ADMIN' });
      } else {
        setError('Incorrect Admin credentials.');
      }
    } else {
      if (studentName.trim().length < 2) {
        setError('Please enter your full name to continue.');
      } else {
        onLogin({ username: studentName.trim(), role: 'USER' });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/10 p-8 md:p-12 relative overflow-hidden transition-all duration-500">
        
        <div className="text-center mb-8 flex flex-col items-center">
          <Logo size={36} className="mb-6" />
          <h1 className="text-3xl font-black text-white mb-2 tracking-tighter">DON BOSCO AI</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Global Educational Portal</p>
        </div>

        {/* Toggle Mode */}
        <div className="flex bg-slate-800/30 p-1.5 rounded-2xl mb-8 border border-white/5 shadow-inner">
          <button 
            onClick={() => setIsAdminMode(false)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${!isAdminMode ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            <GraduationCap size={18} /> Student
          </button>
          <button 
            onClick={() => setIsAdminMode(true)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${isAdminMode ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            <ShieldCheck size={18} /> Admin
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {!isAdminMode ? (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Your Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="text" 
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-white transition-all placeholder:text-slate-700 font-bold"
                  placeholder="Enter name to begin"
                  required
                />
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admin ID</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-white transition-all font-bold"
                    placeholder="piyush_admin"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Key</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-white transition-all font-bold"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {error && (
            <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 p-4 rounded-2xl text-xs font-black uppercase tracking-tight border border-rose-500/20 animate-shake">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button 
            type="submit"
            className={`w-full font-black uppercase tracking-widest py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 group active:scale-[0.98] ${isAdminMode ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'}`}
          >
            <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
            {isAdminMode ? 'Unlock Console' : 'Access System'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-[10px] text-slate-600 uppercase tracking-[0.3em] font-black">
            Powered by Piyush • Serving Youth Worldwide
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

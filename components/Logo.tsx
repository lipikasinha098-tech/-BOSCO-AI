import React from 'react';
import { Sparkles } from 'lucide-react';

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 24, className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="absolute inset-0 bg-blue-600 blur-lg opacity-40 rounded-full animate-pulse"></div>
      <div className="relative bg-gradient-to-br from-blue-500 to-indigo-700 p-2 rounded-xl text-white shadow-xl flex items-center justify-center overflow-hidden border border-white/20">
        <Sparkles size={size} fill="currentColor" className="relative z-10" />
        <div className="absolute -bottom-1 -right-1 font-black text-[8px] opacity-30 select-none">DB</div>
      </div>
    </div>
  );
};

export default Logo;
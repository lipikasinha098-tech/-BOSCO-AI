
import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 24, className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
      
      {/* SVG Emblem */}
      <svg 
        width={size * 2} 
        height={size * 2.4} 
        viewBox="0 0 100 120" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-2xl"
      >
        <defs>
          <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff0080" />
            <stop offset="50%" stopColor="#7928ca" />
            <stop offset="100%" stopColor="#0070f3" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Outer Shield Shield */}
        <motion.path 
          animate={{ stroke: ["#fff", "#ff0080", "#7928ca", "#0070f3", "#fff"] }}
          transition={{ duration: 5, repeat: Infinity }}
          d="M50 5L90 15V50C90 75 70 95 50 110C30 95 10 75 10 50V15L50 5Z" 
          fill="url(#shieldGradient)" 
          stroke="white" 
          strokeWidth="3"
        />
        
        {/* Sparkle Elements */}
        <motion.circle 
          animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          cx="30" cy="30" r="3" fill="white" 
        />
        <motion.circle 
          animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
          cx="70" cy="25" r="2" fill="white" 
        />
        
        {/* The Guided Star */}
        <motion.path 
          animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          d="M50 16L54 26H64L56 32L59 42L50 36L41 42L44 32L36 26H46L50 16Z" 
          fill="#fff"
          filter="url(#glow)"
        />
        
        {/* AI Pulse Orb */}
        <circle cx="50" cy="88" r="7" fill="white" fillOpacity="0.2" />
        <path 
          d="M50 82L52 86H56L53 88L54 92L50 90L46 92L47 88L44 86H48L50 82Z" 
          fill="#60a5fa" 
          className="animate-pulse"
        />
      </svg>
    </div>
  );
};

export default Logo;

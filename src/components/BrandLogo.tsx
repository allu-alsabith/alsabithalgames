import React from 'react';
import { Gamepad2 } from 'lucide-react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  const containerSizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-2xl',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      {/* Brand Icon Emblem */}
      <div className="relative shrink-0">
        {/* Soft Ambient Neon Glow */}
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 opacity-40 blur-xs group-hover:opacity-80 transition duration-300" />
        
        {/* Emblem Core */}
        <div
          className={`relative ${containerSizes[size]} bg-gradient-to-br from-[#0c1626] via-[#09101d] to-[#04281f] border border-emerald-500/50 flex items-center justify-center shadow-lg shadow-emerald-950/60 group-hover:border-emerald-400 group-hover:scale-105 transition-all duration-200 overflow-hidden`}
        >
          {/* Subtle Grid / Scanline Highlight */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.25),transparent_70%)]" />
          
          {/* Gaming Icon */}
          <Gamepad2
            className={`${iconSizes[size]} text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.7)] group-hover:text-emerald-300 transition-colors z-10`}
          />

          {/* Glowing Status Dot */}
          <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 ring-1 ring-[#09101d] animate-pulse" />
        </div>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-wider uppercase text-white group-hover:text-emerald-300 transition-colors ${titleSizes[size]}`}
          >
            ALSABITHAL<span className="text-emerald-400">GAMES</span>
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest hidden sm:inline-block">
            Pre-Installed
          </span>
        </div>
        {showSubtitle && (
          <p className="text-[10px] text-slate-400 font-medium tracking-wide mt-1">
            Free Pre-installed PC Games
          </p>
        )}
      </div>
    </div>
  );
};

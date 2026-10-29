import React from 'react';
import { Sparkles, Users, Flame, Compass, Zap, ShieldCheck } from 'lucide-react';

interface MobileCategoryBarProps {
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
  onlineFixFilter: boolean;
  onToggleOnlineFix: () => void;
  totalGamesCount: number;
}

const QUICK_MOBILE_GENRES = [
  { id: '', label: 'All Games', icon: '🎮' },
  { id: 'ONLINE_FIX', label: 'Online Fix', icon: '⚡' },
  { id: 'Open World', label: 'Open World', icon: '🗺️' },
  { id: 'Action', label: 'Action', icon: '💥' },
  { id: 'RPG', label: 'RPG', icon: '⚔️' },
  { id: 'Co-op', label: 'Co-op', icon: '👥' },
  { id: 'Racing', label: 'Racing', icon: '🏎️' },
  { id: 'Survival', label: 'Survival', icon: '🌲' },
  { id: 'Horror', label: 'Horror', icon: '👻' },
  { id: 'Souls-like', label: 'Souls-like', icon: '💀' },
  { id: 'Sci-Fi', label: 'Sci-Fi', icon: '🚀' },
  { id: 'Indie Gems', label: 'Indie', icon: '💎' },
  { id: 'Adventure', label: 'Adventure', icon: '🧗' },
  { id: 'Shooter', label: 'Shooter', icon: '🎯' },
];

export const MobileCategoryBar: React.FC<MobileCategoryBarProps> = ({
  selectedGenre,
  onSelectGenre,
  onlineFixFilter,
  onToggleOnlineFix,
  totalGamesCount,
}) => {
  return (
    <div className="md:hidden w-full overflow-hidden py-1 mb-3">
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 px-0.5 custom-scrollbar touch-pan-x select-none">
        {QUICK_MOBILE_GENRES.map((item) => {
          const isOnlineFixBtn = item.id === 'ONLINE_FIX';
          const isActive = isOnlineFixBtn 
            ? onlineFixFilter 
            : !onlineFixFilter && selectedGenre === item.id;

          const handleClick = () => {
            if (isOnlineFixBtn) {
              onToggleOnlineFix();
            } else {
              if (onlineFixFilter) {
                onToggleOnlineFix();
              }
              onSelectGenre(item.id);
            }
          };

          return (
            <button
              key={item.id || 'all'}
              type="button"
              onClick={handleClick}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap shrink-0 transition-all active:scale-95 cursor-pointer ${
                isActive
                  ? isOnlineFixBtn
                    ? 'bg-blue-600/40 text-blue-200 border border-blue-400/60 shadow-[0_4px_16px_rgba(37,99,235,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] backdrop-blur-xl'
                    : 'mac-liquid-accent text-white font-black'
                  : 'mac-liquid-pill text-slate-300 hover:text-white'
              }`}
              style={{ minHeight: '40px' }}
            >
              <span className="text-sm">{item.icon}</span>
              <span>{item.label}</span>
              {item.id === '' && !onlineFixFilter && !selectedGenre && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono border border-emerald-400/30">
                  {totalGamesCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

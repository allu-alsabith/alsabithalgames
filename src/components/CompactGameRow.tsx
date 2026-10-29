import React from 'react';
import { Game } from '../types';
import { Download, Bookmark, Star, HardDrive, Bot, Users, ExternalLink, Zap } from 'lucide-react';

interface CompactGameRowProps {
  game: Game;
  onSelectGame: (game: Game) => void;
  isBookmarked: boolean;
  onToggleBookmark: (gameId: string) => void;
  onOpenAiWithGame?: (game: Game) => void;
}

export const CompactGameRow: React.FC<CompactGameRowProps> = ({
  game,
  onSelectGame,
  isBookmarked,
  onToggleBookmark,
  onOpenAiWithGame,
}) => {
  // Determine size color
  const sizeNum = parseFloat(game.size) * (game.size.includes('GB') ? 1 : 0.001);
  const sizeBadgeColor =
    sizeNum < 15
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      : sizeNum < 45
      ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
      : 'bg-purple-500/10 text-purple-300 border-purple-500/30';

  return (
    <div 
      className="group relative p-2.5 sm:p-3 rounded-2xl mac-liquid-glass hover:bg-white/[0.05] border border-white/[0.08] hover:border-emerald-400/50 hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-all flex items-center justify-between gap-3 select-none"
    >
      {/* Left: Poster + Main Info */}
      <div 
        className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
        onClick={() => onSelectGame(game)}
      >
        <div className="relative w-16 sm:w-24 aspect-[16/9] rounded-xl overflow-hidden shrink-0 border border-white/[0.1] group-hover:border-emerald-400/40 transition-colors shadow-sm">
          <img
            src={game.posterUrl}
            alt={game.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
          {game.hasOnlineFix && (
            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-full bg-blue-600/90 text-white font-black text-[8px] tracking-wider uppercase backdrop-blur-md">
              FIX
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-200 group-hover:text-emerald-400 transition-colors truncate max-w-sm">
              {game.title}
            </h3>
            <span className="px-2 py-0.5 rounded-full mac-liquid-pill text-slate-300 font-mono text-[10px] hidden sm:inline">
              {game.version.split('+')[0]}
            </span>
            {game.hasOnlineFix && (
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-400/30">
                <Users className="w-2.5 h-2.5" />
                Online Co-op
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-400">
            <span className={`px-2 py-0.5 rounded-full font-mono font-semibold border ${sizeBadgeColor}`}>
              {game.size}
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:inline text-slate-400">{game.releaseDate}</span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:inline text-slate-400 font-mono">AppID #{game.steamAppId}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-medium truncate max-w-[120px] sm:max-w-none">
              {game.genres.slice(0, 2).join(', ')}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Stats & Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Rating & DLs on larger screens */}
        <div className="hidden lg:flex flex-col items-end text-right text-xs pr-1">
          <div className="flex items-center gap-1 text-amber-300 font-bold">
            <Star className="w-3 h-3 fill-amber-300" />
            <span>{game.rating.toFixed(1)}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {(game.downloadsCount / 1000).toFixed(0)}k DLs
          </span>
        </div>

        {/* AI Assistant shortcut */}
        {onOpenAiWithGame && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenAiWithGame(game);
            }}
            title="Ask AI about this game"
            aria-label={`Ask AI about ${game.title}`}
            className="p-2 rounded-xl mac-liquid-pill text-emerald-300 transition-all hidden sm:flex items-center justify-center min-w-[34px] min-h-[34px] active:scale-95 cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Bookmark button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(game.id);
          }}
          title={isBookmarked ? 'Saved to Library' : 'Bookmark Game'}
          aria-label={isBookmarked ? 'Saved to Library' : 'Bookmark Game'}
          className={`p-2 rounded-xl border transition-all min-w-[34px] min-h-[34px] flex items-center justify-center active:scale-95 cursor-pointer ${
            isBookmarked
              ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-md shadow-amber-400/30'
              : 'mac-liquid-pill text-slate-300 hover:text-amber-400'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5 fill-current" />
        </button>

        {/* Download Button */}
        <button
          onClick={() => onSelectGame(game)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl mac-liquid-accent text-white font-bold text-xs shadow-sm transition-all min-h-[34px] hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Download</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-mono hidden sm:inline">
            {game.mirrors.length}
          </span>
        </button>
      </div>
    </div>
  );
};

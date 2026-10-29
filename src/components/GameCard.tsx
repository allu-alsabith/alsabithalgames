import React, { useState } from 'react';
import { Game } from '../types';
import { Download, Bookmark, Star, ShieldCheck, Users, HardDrive, Sparkles, Bot, Film } from 'lucide-react';

interface GameCardProps {
  game: Game;
  onSelectGame: (game: Game) => void;
  isBookmarked: boolean;
  onToggleBookmark: (gameId: string) => void;
  compact?: boolean;
  onOpenAiWithGame?: (game: Game) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  onSelectGame,
  isBookmarked,
  onToggleBookmark,
  compact = false,
  onOpenAiWithGame,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!game || !game.id) return null;

  return (
    <div
      id={`game-card-${game.id}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden mac-liquid-glass border border-white/[0.08] hover:border-emerald-400/60 hover:shadow-[0_20px_45px_rgba(16,185,129,0.18)] hover:-translate-y-1 hover:scale-[1.015] transition-all duration-300 ease-out"
    >
      {/* Ambient hover border glow accent */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 blur-xs transition-opacity duration-300 pointer-events-none -z-10" />
      {/* Cover / Image Area */}
      <div 
        onClick={() => onSelectGame(game)}
        className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950 cursor-pointer"
      >
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-slate-800/40 animate-pulse flex items-center justify-center">
            <span className="text-xs text-slate-400 font-mono">Loading...</span>
          </div>
        )}

        {imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-4 text-center">
            <span className="text-sm font-bold text-slate-300">{game.title}</span>
            <span className="text-[10px] text-emerald-400 mt-1">Pre-installed PC Game</span>
          </div>
        ) : (
          <img
            src={game.posterUrl}
            alt={game.title}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] via-[#0a0f18]/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
          <div className="flex flex-wrap gap-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full mac-liquid-accent text-white text-[10px] font-bold shadow tracking-wide">
              <ShieldCheck className="w-3 h-3" />
              PORTABLE
            </span>
            {game.hasOnlineFix && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-600/80 backdrop-blur-md border border-blue-400/40 text-white text-[10px] font-bold shadow">
                <Users className="w-3 h-3" />
                ONLINE FIX
              </span>
            )}
            {game.trailerUrl && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-600/80 backdrop-blur-md border border-rose-400/40 text-white text-[10px] font-bold shadow">
                <Film className="w-2.5 h-2.5" />
                TRAILER
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(game.id);
              }}
              title={isBookmarked ? 'Remove from Saved' : 'Save to My Library'}
              aria-label={isBookmarked ? 'Remove from Saved' : 'Save to My Library'}
              className={`min-w-[38px] min-h-[38px] sm:min-w-[32px] sm:min-h-[32px] p-2 sm:p-1.5 rounded-xl backdrop-blur-md transition-all active:scale-90 flex items-center justify-center touch-manipulation cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/30'
                  : 'mac-liquid-pill text-slate-300 hover:text-amber-400'
              }`}
            >
              <Bookmark className="w-4 h-4 sm:w-3.5 sm:h-3.5 fill-current" />
            </button>
          </div>
        </div>

        {/* Bottom Image Stats: Version & Size */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] pointer-events-none font-medium text-slate-200">
          <span className="mac-liquid-subtle px-2 py-0.5 rounded-full text-emerald-300 font-mono text-[10px] truncate max-w-[65%] border border-white/[0.08]">
            {game.version.split('+')[0]}
          </span>
          <span className="mac-liquid-subtle px-2 py-0.5 rounded-full text-slate-200 font-mono text-[10px] flex items-center gap-1 border border-white/[0.08]">
            <HardDrive className="w-2.5 h-2.5 text-cyan-400" />
            {game.size}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-4 justify-between gap-3">
        <div 
          onClick={() => onSelectGame(game)}
          className="cursor-pointer"
        >
          {/* Title */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-sm text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1 leading-snug">
              {game.title}
            </h3>
          </div>

          {/* Genre Pills & Steam ID */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className="text-[10px] px-2 py-0.5 rounded-full mac-liquid-pill text-emerald-300 font-mono border border-emerald-500/30">
              #{game.steamAppId}
            </span>
            {game.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="text-[10px] px-2 py-0.5 rounded-full mac-liquid-pill text-slate-300"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Short description */}
          <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
            {game.shortDescription}
          </p>
        </div>

        {/* Footer Meta & Download Action */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="flex items-center gap-1 text-amber-300 font-bold text-[11px]">
              <Star className="w-3 h-3 fill-amber-300" />
              {game.rating.toFixed(1)}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {(game.downloadsCount / 1000).toFixed(0)}k DLs
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenAiWithGame && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenAiWithGame(game);
                }}
                title={`Ask AI about ${game.title} (PC Specs & Error Help)`}
                aria-label={`Ask AI about ${game.title}`}
                className="min-w-[36px] min-h-[36px] sm:min-w-[32px] sm:min-h-[32px] p-2 sm:p-1.5 rounded-xl mac-liquid-pill text-slate-300 hover:text-emerald-300 transition-all active:scale-95 flex items-center justify-center touch-manipulation cursor-pointer"
              >
                <Bot className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              </button>
            )}

            <button
              onClick={() => onSelectGame(game)}
              className="flex items-center gap-1.5 px-3.5 sm:px-3 py-2 sm:py-1.5 rounded-xl mac-liquid-accent text-white font-bold text-xs shadow-sm hover:scale-105 transition-all active:scale-95 cursor-pointer touch-manipulation min-h-[36px] sm:min-h-[32px]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

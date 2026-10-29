import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Download, HardDrive, Star, ArrowRight, ShieldCheck, Users } from 'lucide-react';
import { Game } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: Game[];
  onSelectGame: (game: Game) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  games,
  onSelectGame,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.trim().toLowerCase();

  // Search by title, aliases (GTA, NFS, etc.), genres, publisher, developer, and direct Steam App ID
  const results = cleanQuery === ''
    ? games.slice(0, 8)
    : games.filter((g) => {
        const title = g.title.toLowerCase();
        const isGtaAlias =
          (cleanQuery === 'gta' && title.includes('grand theft auto')) ||
          (cleanQuery.startsWith('gta') && (
            (cleanQuery.includes('5') || cleanQuery.includes('v')) && title.includes('grand theft auto v') ||
            (cleanQuery.includes('sa') || cleanQuery.includes('san andreas')) && title.includes('san andreas') ||
            title.includes('grand theft auto')
          ));

        const isNfsAlias =
          (cleanQuery === 'nfs' && title.includes('need for speed')) ||
          (cleanQuery.startsWith('nfs') && (
            (cleanQuery.includes('mw') || cleanQuery.includes('most wanted') || cleanQuery.includes('2005')) && title.includes('most wanted') ||
            cleanQuery.includes('payback') && title.includes('payback') ||
            cleanQuery.includes('heat') && title.includes('heat') ||
            cleanQuery.includes('unbound') && title.includes('unbound') ||
            title.includes('need for speed')
          )) ||
          (cleanQuery === 'most wanted' && title.includes('most wanted')) ||
          (cleanQuery === 'payback' && title.includes('payback'));

        return (
          title.includes(cleanQuery) ||
          isGtaAlias ||
          isNfsAlias ||
          g.steamAppId.toString().includes(cleanQuery) ||
          g.genres.some((genre) => genre.toLowerCase().includes(cleanQuery)) ||
          g.developer.toLowerCase().includes(cleanQuery) ||
          g.publisher.toLowerCase().includes(cleanQuery)
        );
      });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && results.length > 0) {
      onSelectGame(results[0]);
      onClose();
    }
  };

  const quickTags = ['NFS MW', 'NFS Payback', 'GTA 5', 'GTA SA', 'Elden Ring', 'Cyberpunk', 'Space Marine 2', 'Online Fix'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-3 sm:pt-20 px-2 sm:px-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl mac-liquid-glass rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[80vh] border border-white/[0.14]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* macOS Window Top Bar */}
        <div className="px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.06] flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full mac-dot-red inline-block" />
            <span className="w-3 h-3 rounded-full mac-dot-yellow inline-block" />
            <span className="w-3 h-3 rounded-full mac-dot-green inline-block" />
            <span className="ml-2 text-xs font-mono text-slate-400">Spotlight Search</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Esc to close</span>
        </div>

        {/* Search Bar Input */}
        <div className="p-3.5 sm:p-4 border-b border-white/[0.08] flex items-center gap-3 bg-white/[0.02]">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search titles, NFS, GTA, Steam ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none py-1"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-300 hover:text-white text-xs px-3 py-1.5 rounded-xl mac-liquid-pill transition-colors min-h-[36px] flex items-center active:scale-95 cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close search"
            className="p-2 rounded-xl text-slate-300 hover:text-white mac-liquid-pill transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center active:scale-90 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Tag Suggestions */}
        <div className="px-3.5 sm:px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.01] flex items-center gap-1.5 overflow-x-auto text-xs custom-scrollbar no-scrollbar touch-pan-x">
          <span className="text-slate-400 font-semibold uppercase text-[10px] shrink-0">Quick:</span>
          {quickTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-3 py-1 rounded-xl mac-liquid-pill text-slate-200 hover:text-white transition-all shrink-0 min-h-[32px] flex items-center active:scale-95 cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-white/[0.05] custom-scrollbar">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>{query.trim() === '' ? 'Top Trending Games' : `Results (${results.length})`}</span>
            {results.length > 0 && <span className="text-[10px] text-emerald-400/90 font-mono">Press Enter for 1st result</span>}
          </div>

          {results.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 space-y-2">
              <p>No games found matching "{query}".</p>
              <p className="text-slate-500 text-[11px]">
                You can request this title on the "Request Games" board!
              </p>
            </div>
          ) : (
            results.map((game) => (
              <div
                key={game.id}
                onClick={() => {
                  onSelectGame(game);
                  onClose();
                }}
                className="group p-3 sm:p-3.5 rounded-2xl hover:bg-white/[0.08] active:bg-white/[0.12] cursor-pointer flex items-center justify-between gap-3 transition-all min-h-[58px] touch-manipulation"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={game.posterUrl}
                    alt={game.title}
                    referrerPolicy="no-referrer"
                    className="w-16 sm:w-20 aspect-[16/9] object-cover rounded-xl border border-white/[0.15] shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-emerald-300 transition-colors truncate">
                        {game.title}
                      </h4>
                      {game.hasOnlineFix && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold shrink-0">
                          Online Fix
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono">
                      <span className="text-emerald-400 font-semibold">{game.size}</span>
                      <span>•</span>
                      <span>Steam #{game.steamAppId}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">{game.version.split('+')[0]}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <div className="hidden sm:flex flex-col items-end text-xs">
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {game.rating.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {(game.downloadsCount / 1000).toFixed(0)}k DLs
                    </span>
                  </div>
                  <div className="min-w-[36px] min-h-[36px] p-2 rounded-xl mac-liquid-pill group-hover:mac-liquid-accent text-emerald-300 group-hover:text-white transition-all flex items-center justify-center">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

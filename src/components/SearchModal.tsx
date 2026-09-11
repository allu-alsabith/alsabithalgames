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
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#0d131f] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900/80">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search titles, genres, or Steam App ID (e.g. 1245620, Elden Ring)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded bg-slate-800 transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Tag Suggestions */}
        <div className="px-4 py-2 border-b border-slate-800/60 bg-slate-950/60 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-slate-500 font-semibold uppercase text-[10px] shrink-0">Quick Search:</span>
          {quickTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-800 transition-colors shrink-0"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-800/60">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>{query.trim() === '' ? 'Top Trending Games' : `Results (${results.length})`}</span>
            {results.length > 0 && <span className="text-[10px] text-slate-500 font-mono">Press Enter for 1st result</span>}
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
                className="group p-3 rounded-xl hover:bg-slate-800/80 cursor-pointer flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={game.posterUrl}
                    alt={game.title}
                    referrerPolicy="no-referrer"
                    className="w-16 aspect-[16/9] object-cover rounded-lg border border-slate-700 shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-200 group-hover:text-emerald-400 transition-colors truncate">
                        {game.title}
                      </h4>
                      {game.hasOnlineFix && (
                        <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold shrink-0">
                          Online Fix
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono">
                      <span className="text-emerald-400">{game.size}</span>
                      <span>•</span>
                      <span>Steam #{game.steamAppId}</span>
                      <span>•</span>
                      <span>{game.version.split('+')[0]}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="hidden sm:flex flex-col items-end text-xs">
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {game.rating.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {(game.downloadsCount / 1000).toFixed(0)}k DLs
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-600/20 group-hover:bg-emerald-600 text-emerald-400 group-hover:text-white transition-colors">
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

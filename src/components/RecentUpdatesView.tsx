import React, { useState } from 'react';
import { Clock, Download, HardDrive, User, ShieldCheck, Sparkles, Filter } from 'lucide-react';
import { Game } from '../types';
import { RECENT_UPDATES_DATA } from '../data/updatesData';

interface RecentUpdatesViewProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
}

export const RecentUpdatesView: React.FC<RecentUpdatesViewProps> = ({
  games,
  onSelectGame,
}) => {
  const [filterGenre, setFilterGenre] = useState<string>('all');

  const filteredUpdates = filterGenre === 'all'
    ? RECENT_UPDATES_DATA
    : RECENT_UPDATES_DATA.filter((item) =>
        item.genres.some((g) => g.toLowerCase() === filterGenre.toLowerCase())
      );

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 p-6 border border-cyan-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/30">
              <Clock className="w-3.5 h-3.5" />
              Real-Time Tracking
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Recent Game Updates (Past 7 Days)
            </h1>
            <p className="text-xs text-slate-400">
              Every day we test and upload new releases, hotfixes, and expansions. No installers required.
            </p>
          </div>

          {/* Quick Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Genres ({RECENT_UPDATES_DATA.length})</option>
              <option value="action">Action</option>
              <option value="rpg">RPG</option>
              <option value="horror">Horror</option>
              <option value="survival">Survival</option>
              <option value="co-op">Co-op</option>
            </select>
          </div>
        </div>
      </div>

      {/* Updates Timeline List */}
      <div className="space-y-3">
        {filteredUpdates.map((update) => {
          const gameObj = games.find((g) => g && g.id === update.gameId);

          return (
            <div
              key={update.id}
              onClick={() => gameObj && onSelectGame(gameObj)}
              className="group p-4 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Left Column: Poster & Details */}
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                <img
                  src={update.posterUrl}
                  alt={update.gameTitle}
                  referrerPolicy="no-referrer"
                  className="w-20 sm:w-28 aspect-[16/9] object-cover rounded-lg border border-slate-700 shrink-0 group-hover:scale-105 transition-transform"
                />

                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
                      {update.gameTitle}
                    </h3>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[11px] font-mono font-semibold">
                      {update.version}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1">
                    {update.changelogSummary}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-medium">
                    <span className="text-cyan-400/90 font-semibold">{update.timeAgo}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      Updated by {update.uploader}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono">
                      <HardDrive className="w-3 h-3 text-slate-400" />
                      {update.size}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Action */}
              <div className="flex items-center gap-2 shrink-0 sm:self-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (gameObj) onSelectGame(gameObj);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Get Download
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Building2, Search, ArrowRight, Gamepad2, Globe } from 'lucide-react';
import { Publisher, Game } from '../types';
import { PUBLISHERS_DATA } from '../data/publishersData';

interface PublishersViewProps {
  games: Game[];
  onSelectPublisher: (publisherName: string) => void;
}

export const PublishersView: React.FC<PublishersViewProps> = ({
  games,
  onSelectPublisher,
}) => {
  const [search, setSearch] = useState('');

  const filtered = PUBLISHERS_DATA.filter((pub) =>
    pub.name.toLowerCase().includes(search.toLowerCase()) ||
    pub.country.toLowerCase().includes(search.toLowerCase()) ||
    pub.notableGames.some((g) => g.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 p-6 border border-indigo-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold border border-indigo-500/30">
              <Building2 className="w-3.5 h-3.5" />
              Creators & Studios
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Game Developers & Publishers
            </h1>
            <p className="text-xs text-slate-400 max-w-xl">
              Cataloging credited video game studios and publishers across the alsabithal Games PC library. Sourced directly from Steam and CS.RIN releases.
            </p>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search studios & publishers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Grid of Publishers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((pub) => {
          // Count games in our catalog by this publisher or developer
          const gamesInCatalog = games.filter(
            (g) => g.publisher.toLowerCase().includes(pub.name.toLowerCase()) ||
                   g.developer.toLowerCase().includes(pub.name.toLowerCase())
          );

          return (
            <div
              key={pub.id}
              onClick={() => onSelectPublisher(pub.name)}
              className="group p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer flex flex-col justify-between gap-4 hover:shadow-xl hover:shadow-indigo-950/20"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono bg-slate-950 border border-slate-800 px-2 py-1 rounded text-slate-400">
                    {gamesInCatalog.length > 0 ? `${gamesInCatalog.length} Available` : `${pub.gameCount} Indexed`}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-white group-hover:text-indigo-400 transition-colors">
                    {pub.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Globe className="w-3 h-3 text-slate-500" />
                    <span>{pub.country}</span>
                  </p>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {pub.description}
                </p>

                {/* Notable titles */}
                <div className="pt-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Notable Games:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {pub.notableGames.slice(0, 3).map((title, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
                      >
                        {title}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-indigo-400 font-semibold group-hover:text-indigo-300">
                <span>Browse {pub.name} Games</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

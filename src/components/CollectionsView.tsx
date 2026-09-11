import React, { useState } from 'react';
import { Collection, Game } from '../types';
import { COLLECTIONS_DATA } from '../data/collectionsData';
import { Layers, Sparkles, FolderArchive, ArrowRight, CheckCircle2, Gamepad2, Search } from 'lucide-react';

interface CollectionsViewProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
  onFilterByCollection: (tagOrTitle: string) => void;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  games,
  onSelectGame,
  onFilterByCollection,
}) => {
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCollections = COLLECTIONS_DATA.filter((col) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      col.title.toLowerCase().includes(q) ||
      col.subtitle.toLowerCase().includes(q) ||
      col.tag.toLowerCase().includes(q)
    );
  });

  // Find games matching the selected collection
  const collectionGames = selectedCollection
    ? games
        .filter((g): g is Game => Boolean(g && g.id))
        .filter((g) =>
          selectedCollection.featuredGameTitles.some(
            (title) => g.title.toLowerCase().includes(title.toLowerCase()) || title.toLowerCase().includes(g.title.toLowerCase())
          ) ||
          g.genres.some((genre) => genre.toLowerCase().includes(selectedCollection.tag.toLowerCase()))
        )
    : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* View Header Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-cyan-950/70 p-6 sm:p-8">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
            <Layers className="w-3.5 h-3.5" />
            Curated Collections
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            68 Curated Game Collections
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Hand-picked anthologies grouping legendary sagas, continuous storylines, studio catalogs, and defining themes. Every title comes pre-installed with all DLCs.
          </p>
        </div>

        {/* Search Bar for Collections */}
        <div className="mt-6 max-w-md relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search collections (e.g. Masterpiece, Soulsborne, Horror)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Detail Modal / Drawer if a collection is opened */}
      {selectedCollection && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-emerald-500/40 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  {selectedCollection.tag}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedCollection.gameCount} Titles Included
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                {selectedCollection.title}
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                {selectedCollection.description}
              </p>
            </div>

            <button
              onClick={() => setSelectedCollection(null)}
              className="self-start sm:self-center px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
            >
              Close Collection
            </button>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Included Games in this Collection:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {collectionGames.map((game) => (
                <div
                  key={game.id}
                  onClick={() => onSelectGame(game)}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all cursor-pointer group"
                >
                  <img
                    src={game.posterUrl}
                    alt={game.title}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 object-cover rounded-lg shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 truncate">
                      {game.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {game.size} • {game.version.split('+')[0]}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Portable Pre-Installed</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCollections.map((collection) => (
          <div
            key={collection.id}
            onClick={() => setSelectedCollection(collection)}
            className="group relative flex flex-col rounded-2xl overflow-hidden bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:shadow-2xl transition-all duration-300 cursor-pointer"
          >
            {/* Collection Banner Image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
              <img
                src={collection.bannerUrl}
                alt={collection.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-75 group-hover:brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Tag Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-900/90 backdrop-blur-md text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  {collection.tag}
                </span>
              </div>

              {/* Game Count Pill */}
              <div className="absolute bottom-3 right-3">
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white font-mono text-[10px] font-bold shadow">
                  {collection.gameCount} Games
                </span>
              </div>
            </div>

            {/* Content info */}
            <div className="p-4 flex-1 flex flex-col justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                  {collection.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {collection.subtitle}
                </p>
              </div>

              {/* Featured Titles List */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Featured Highlights
                </div>
                <div className="flex flex-wrap gap-1">
                  {collection.featuredGameTitles.slice(0, 3).map((title, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 truncate max-w-full"
                    >
                      {title.split(':')[0]}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform">
                <span>View Collection Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

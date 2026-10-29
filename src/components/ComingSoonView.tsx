import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, 
  Sparkles, 
  Flame, 
  Search, 
  Bell, 
  BellRing, 
  ExternalLink, 
  ThumbsUp, 
  Clock, 
  ShieldAlert, 
  Cpu, 
  Monitor, 
  ChevronRight,
  Filter,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { ComingSoonGame } from '../types';
import { COMING_SOON_DATA } from '../data/comingSoonData';

interface ComingSoonViewProps {
  onOpenRequests?: () => void;
}

export const ComingSoonView: React.FC<ComingSoonViewProps> = ({ onOpenRequests }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'hype' | 'date' | 'wishlists'>('hype');
  
  // Local interaction states persisted in localStorage
  const [notifiedGames, setNotifiedGames] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('alsabithal_coming_soon_notified');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [upvotedGames, setUpvotedGames] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('alsabithal_coming_soon_upvotes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('alsabithal_coming_soon_notified', JSON.stringify(notifiedGames));
    } catch {
      // ignore
    }
  }, [notifiedGames]);

  useEffect(() => {
    try {
      localStorage.setItem('alsabithal_coming_soon_upvotes', JSON.stringify(upvotedGames));
    } catch {
      // ignore
    }
  }, [upvotedGames]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const toggleNotify = (id: string, title: string) => {
    if (notifiedGames.includes(id)) {
      setNotifiedGames(notifiedGames.filter((gId) => gId !== id));
      showToast(`Removed release alert for ${title}`);
    } else {
      setNotifiedGames([...notifiedGames, id]);
      showToast(`Alert set! You'll be notified when ${title} is pre-installed`);
    }
  };

  const toggleUpvote = (id: string, title: string) => {
    if (upvotedGames.includes(id)) {
      setUpvotedGames(upvotedGames.filter((gId) => gId !== id));
    } else {
      setUpvotedGames([...upvotedGames, id]);
      showToast(`Hype vote registered for ${title}!`);
    }
  };

  // Genre lists from data
  const allGenres = useMemo(() => {
    const set = new Set<string>();
    COMING_SOON_DATA.forEach((g) => g.genres.forEach((genre) => set.add(genre)));
    return ['all', ...Array.from(set)];
  }, []);

  // Filtered and sorted upcoming games
  const filteredGames = useMemo(() => {
    return COMING_SOON_DATA.filter((game) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = game.title.toLowerCase().includes(q);
        const matchesDev = game.developer.toLowerCase().includes(q) || game.publisher.toLowerCase().includes(q);
        const matchesEngine = game.engine?.toLowerCase().includes(q);
        const matchesGenre = game.genres.some((g) => g.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDev && !matchesEngine && !matchesGenre) {
          return false;
        }
      }

      // Timeframe
      if (selectedTimeframe === 'confirmed' && game.status !== 'Confirmed Date') {
        return false;
      }
      if (selectedTimeframe === '2025' && !game.releaseQuarterOrYear.includes('2025') && !game.expectedReleaseDate.includes('2025')) {
        return false;
      }
      if (selectedTimeframe === '2026' && !game.releaseQuarterOrYear.includes('2026') && !game.expectedReleaseDate.includes('2026')) {
        return false;
      }

      // Genre
      if (selectedGenre !== 'all') {
        if (!game.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase())) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'hype') {
        return (b.anticipationScore + (upvotedGames.includes(b.id) ? 1 : 0)) - 
               (a.anticipationScore + (upvotedGames.includes(a.id) ? 1 : 0));
      }
      if (sortBy === 'wishlists') {
        return b.wishlistsCount - a.wishlistsCount;
      }
      if (sortBy === 'date') {
        return a.expectedReleaseDate.localeCompare(b.expectedReleaseDate);
      }
      return 0;
    });
  }, [searchQuery, selectedTimeframe, selectedGenre, sortBy, upvotedGames]);

  // Featured game for the top spot
  const featuredGame = COMING_SOON_DATA.find((g) => g.id === 'grand-theft-auto-vi') || COMING_SOON_DATA[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-2xl backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative rounded-3xl mac-liquid-glass p-6 sm:p-8 border border-white/[0.12] shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mac-liquid-pill text-teal-300 text-xs font-bold border-teal-400/30">
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              <span>Day-1 Crack & Pre-Installed Release Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Coming Soon & Anticipated PC Games
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Track upcoming AAA blockbusters, indie darlings, and expected release windows. Set alerts to be notified the moment portable, tested builds and mirrors are deployed.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 shrink-0">
            <div className="p-3 sm:p-4 rounded-2xl mac-liquid-pill text-center border-white/[0.1]">
              <div className="text-xl sm:text-2xl font-black text-teal-400">
                {COMING_SOON_DATA.length}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-medium">
                Tracked Games
              </div>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl mac-liquid-pill text-center border-white/[0.1]">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">
                {COMING_SOON_DATA.filter((g) => g.status === 'Confirmed Date').length}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-medium">
                Dates Locked
              </div>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl mac-liquid-pill text-center border-white/[0.1]">
              <div className="text-xl sm:text-2xl font-black text-amber-400">
                {notifiedGames.length}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-medium">
                Your Alerts
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Spotlight: GTA 6 */}
      {featuredGame && (
        <div className="relative rounded-3xl overflow-hidden border border-white/[0.14] mac-liquid-glass shadow-2xl group">
          <div className="relative aspect-[21/9] sm:aspect-[28/9] w-full overflow-hidden">
            <img
              src={featuredGame.bannerUrl}
              alt={featuredGame.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-[0.7]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />

            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
              <div className="max-w-2xl space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full mac-liquid-pill text-amber-300 border-amber-400/40 text-xs font-bold flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    #1 Most Anticipated Worldwide
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full mac-liquid-pill text-teal-300 border-teal-400/30 text-xs font-mono font-semibold">
                    Expected {featuredGame.expectedReleaseDate}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  {featuredGame.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-xl">
                  {featuredGame.shortDescription}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => toggleNotify(featuredGame.id, featuredGame.title)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg cursor-pointer ${
                      notifiedGames.includes(featuredGame.id)
                        ? 'mac-liquid-accent text-white'
                        : 'bg-teal-500 hover:bg-teal-400 text-slate-950 hover:scale-105 active:scale-95'
                    }`}
                  >
                    {notifiedGames.includes(featuredGame.id) ? (
                      <>
                        <BellRing className="w-4 h-4" />
                        <span>✓ Alert Set for Day-1 Release</span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-4 h-4" />
                        <span>Notify Me on PC Release</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => toggleUpvote(featuredGame.id, featuredGame.title)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer active:scale-95 ${
                      upvotedGames.includes(featuredGame.id)
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                        : 'mac-liquid-pill text-slate-300'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${upvotedGames.includes(featuredGame.id) ? 'fill-emerald-400 text-emerald-400' : ''}`} />
                    <span>{featuredGame.anticipationScore + (upvotedGames.includes(featuredGame.id) ? 1 : 0)}% Hype</span>
                  </button>

                  {onOpenRequests && (
                    <button
                      onClick={onOpenRequests}
                      className="px-3 py-2 rounded-xl mac-liquid-pill text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Prioritize Request</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Controls Bar */}
      <div className="p-4 sm:p-5 rounded-2xl mac-liquid-glass border border-white/[0.1] space-y-4">
        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search upcoming games, studios, or engines..."
              className="w-full mac-liquid-pill border-white/[0.1] rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium hidden md:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="mac-liquid-pill border-white/[0.1] text-xs text-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:border-teal-400 cursor-pointer"
            >
              <option value="hype" className="bg-slate-900 text-slate-200">Highest Hype Rating</option>
              <option value="wishlists" className="bg-slate-900 text-slate-200">Most Steam Wishlists</option>
              <option value="date" className="bg-slate-900 text-slate-200">Release Window</option>
            </select>
          </div>
        </div>

        {/* Timeframe Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.08]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
            Window:
          </span>
          {[
            { id: 'all', label: 'All Expected Releases' },
            { id: 'confirmed', label: 'Confirmed Dates' },
            { id: '2025', label: 'Expected 2025' },
            { id: '2026', label: '2026 & Beyond' },
          ].map((tf) => (
            <button
              key={tf.id}
              onClick={() => setSelectedTimeframe(tf.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedTimeframe === tf.id
                  ? 'mac-liquid-pill text-teal-300 border-teal-400/40 font-bold bg-teal-500/20'
                  : 'mac-liquid-pill text-slate-300 hover:text-white'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>

        {/* Genre Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
            Genre:
          </span>
          {allGenres.slice(0, 9).map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                selectedGenre === genre
                  ? 'mac-liquid-pill text-emerald-300 border-emerald-400/40 font-bold bg-emerald-500/20'
                  : 'mac-liquid-pill text-slate-300 hover:text-white'
              }`}
            >
              {genre === 'all' ? 'All Genres' : genre}
            </button>
          ))}
        </div>
      </div>

      {/* Anticipated Games Grid */}
      {filteredGames.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <Calendar className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">No upcoming games match your criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, clearing genre filters, or selecting "All Expected Releases".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedTimeframe('all');
              setSelectedGenre('all');
            }}
            className="px-4 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGames.map((game) => {
            const isNotified = notifiedGames.includes(game.id);
            const isUpvoted = upvotedGames.includes(game.id);
            const effectiveScore = game.anticipationScore + (isUpvoted ? 1 : 0);

            return (
              <div
                key={game.id}
                className="rounded-3xl mac-liquid-glass border border-white/[0.08] hover:border-teal-400/40 hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all flex flex-col justify-between overflow-hidden group shadow-lg"
              >
                {/* Image & Badges */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                  <img
                    src={game.bannerUrl || game.posterUrl}
                    alt={game.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />

                  {/* Top Left: Expected Date Badge */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mac-liquid-glass text-teal-300 border-teal-400/30 text-[11px] font-bold shadow-md">
                      <Clock className="w-3.5 h-3.5 text-teal-400" />
                      {game.expectedReleaseDate}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border w-fit ${
                      game.status === 'Confirmed Date'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                    }`}>
                      {game.status}
                    </span>
                  </div>

                  {/* Top Right: Hype score badge */}
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full mac-liquid-glass text-amber-300 border-amber-400/30 text-[11px] font-black shadow-md">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      {effectiveScore}% Hype
                    </span>
                  </div>

                  {/* Bottom: Platforms */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300">
                    <span className="truncate font-semibold text-slate-300">
                      {game.developer}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {(game.wishlistsCount / 1000000).toFixed(1)}M Wishlists
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    {/* Title */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-extrabold text-white group-hover:text-teal-300 transition-colors line-clamp-1">
                        {game.title}
                      </h3>
                      {game.steamUrl && (
                        <a
                          href={game.steamUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View on Steam"
                          className="text-slate-400 hover:text-teal-400 p-1 rounded-xl mac-liquid-pill transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-1">
                      {game.genres.slice(0, 3).map((g) => (
                        <span
                          key={g}
                          className="px-2.5 py-0.5 rounded-full mac-liquid-pill text-slate-300 text-[10px] font-medium"
                        >
                          {g}
                        </span>
                      ))}
                      {game.engine && (
                        <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-400/20 text-[10px] font-mono">
                          {game.engine.split(' ')[0]}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {game.shortDescription}
                    </p>
                  </div>

                  {/* Day-1 Crack Forecast / Readiness */}
                  <div className="pt-2 border-t border-white/[0.08] space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <ShieldAlert className="w-3 h-3 text-teal-400" />
                      <span>Pre-Install Forecast:</span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-mono mac-liquid-pill px-2.5 py-1 rounded-xl line-clamp-1">
                      {game.dayOneCrackPrediction || 'DRM-Free / Steamworks Expected Day-1'}
                    </p>
                  </div>

                  {/* Interactive Action Footer */}
                  <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
                    {/* Notify Button */}
                    <button
                      onClick={() => toggleNotify(game.id, game.title)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isNotified
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                          : 'mac-liquid-pill text-teal-300 hover:text-white'
                      }`}
                    >
                      {isNotified ? (
                        <>
                          <BellRing className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Notified</span>
                        </>
                      ) : (
                        <>
                          <Bell className="w-3.5 h-3.5 text-teal-400" />
                          <span>Alert Me</span>
                        </>
                      )}
                    </button>

                    {/* Upvote Button */}
                    <button
                      onClick={() => toggleUpvote(game.id, game.title)}
                      title="Vote for Hype Priority"
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                        isUpvoted
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                          : 'mac-liquid-pill text-slate-300'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-emerald-400 text-emerald-400' : ''}`} />
                      <span>{effectiveScore}%</span>
                    </button>

                    {/* Steam Direct Wishlist */}
                    {game.steamUrl && (
                      <a
                        href={game.steamUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-teal-300 border border-slate-700 transition-colors"
                        title="Steam Wishlist"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Community Day 1 Request Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-teal-950/20 to-slate-900 border border-teal-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
            <Sparkles className="w-4 h-4 text-teal-400" />
            Missing an Upcoming Game?
          </h4>
          <p className="text-xs text-slate-400">
            Submit an unannounced or newly revealed game in Community Requests so our testing team can queue Day-1 portable archives.
          </p>
        </div>
        {onOpenRequests && (
          <button
            onClick={onOpenRequests}
            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shrink-0 shadow-lg"
          >
            Submit Game Request
          </button>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  Download, 
  Users, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Bookmark, 
  X, 
  Layers, 
  HardDrive, 
  Star, 
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Info,
  TrendingUp,
  Trophy,
  Calendar,
  Zap
} from 'lucide-react';
import { Game, ViewTab } from './types';
import { GAMES_DATA } from './data/gamesData';
import { CATEGORIES_DATA } from './data/categoriesData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { GameCard } from './components/GameCard';
import { CategoryIcon } from './components/CategoryIcon';
import { GameDetailModal } from './components/GameDetailModal';
import { RecentUpdatesView } from './components/RecentUpdatesView';
import { RequestGamesView } from './components/RequestGamesView';
import { PublishersView } from './components/PublishersView';
import { FaqView } from './components/FaqView';
import { CollectionsView } from './components/CollectionsView';
import { LeaderboardView } from './components/LeaderboardView';
import { DonateModal } from './components/DonateModal';
import { DmcaModal } from './components/DmcaModal';
import { DownloadGuideModal } from './components/DownloadGuideModal';
import { SearchModal } from './components/SearchModal';
import { AccountModal } from './components/AccountModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { AiAssistantWidget } from './components/AiAssistantWidget';
import { useUserData } from './hooks/useUserData';
import { Bot } from 'lucide-react';

const ALPHABET = ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

export default function App() {
  // Navigation & View state
  const [currentTab, setCurrentTab] = useState<ViewTab>('home');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedPublisher, setSelectedPublisher] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'trending' | 'recent' | 'rating' | 'size' | 'title'>('trending');
  const [onlineFixOnly, setOnlineFixOnly] = useState(false);

  // Modal dialog states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isDmcaOpen, setIsDmcaOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [aiInitialGame, setAiInitialGame] = useState<Game | null>(null);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | undefined>(undefined);

  const handleOpenAiAssistant = (game?: Game | null, prompt?: string) => {
    setAiInitialGame(game || selectedGame || null);
    setAiInitialPrompt(prompt);
    setIsAiAssistantOpen(true);
  };

  // Advanced User Data State (Profile, Settings, Bookmarks, Downloads)
  const {
    profile,
    bookmarks,
    login,
    logout,
    toggleBookmark,
  } = useUserData();

  const isLoggedIn = profile.isLoggedIn;
  const username = profile.username;
  const userEmail = profile.email;

  const handleSelectPublisher = (pubName: string) => {
    setSelectedPublisher(pubName);
    setSelectedGenre(null);
    setSelectedLetter(null);
    setSelectedYear(null);
    setCurrentTab('home');
  };

  const resetFilters = () => {
    setSelectedGenre(null);
    setSelectedPublisher(null);
    setSelectedLetter(null);
    setSelectedYear(null);
    setSearchQuery('');
    setOnlineFixOnly(false);
    if (currentTab === 'bookmarks') setCurrentTab('home');
  };

  // Filtered & Sorted Games for Home / Browse / Trending / Bookmarks
  const processedGames = useMemo(() => {
    let result = GAMES_DATA.filter((g): g is Game => Boolean(g && g.id));

    // Filter by bookmarks if in bookmarks tab
    if (currentTab === 'bookmarks') {
      result = result.filter((g) => bookmarks.includes(g.id));
    }

    // Filter by Genre / Sub-Genre Category
    if (selectedGenre) {
      const catConfig = CATEGORIES_DATA.find(
        (c) =>
          c.name.toLowerCase() === selectedGenre.toLowerCase() ||
          c.slug.toLowerCase() === selectedGenre.toLowerCase() ||
          c.id.toLowerCase() === selectedGenre.toLowerCase()
      );
      const searchTerms = catConfig?.filterTags
        ? [selectedGenre.toLowerCase(), ...catConfig.filterTags.map((t) => t.toLowerCase())]
        : [selectedGenre.toLowerCase()];

      result = result.filter((g) =>
        g.genres.some((genre) => {
          const gLower = genre.toLowerCase();
          return searchTerms.some(
            (term) => gLower === term || gLower.includes(term) || term.includes(gLower)
          );
        })
      );
    }

    // Filter by Publisher / Developer
    if (selectedPublisher) {
      result = result.filter(
        (g) =>
          g.publisher.toLowerCase().includes(selectedPublisher.toLowerCase()) ||
          g.developer.toLowerCase().includes(selectedPublisher.toLowerCase())
      );
    }

    // Filter by Alphabet Letter (e.g. 'A' or '#' for 0-9)
    if (selectedLetter) {
      if (selectedLetter === '#') {
        result = result.filter((g) => /^[0-9]/.test(g.title.trim()));
      } else {
        result = result.filter((g) =>
          g.title.trim().toUpperCase().startsWith(selectedLetter.toUpperCase())
        );
      }
    }

    // Filter by Release Year
    if (selectedYear) {
      if (selectedYear === 'Classic') {
        result = result.filter((g) => {
          const year = parseInt(g.releaseDate.slice(-4));
          return !isNaN(year) && year < 2022;
        });
      } else {
        result = result.filter((g) => g.releaseDate.includes(selectedYear));
      }
    }

    // Filter by Online Fix
    if (onlineFixOnly) {
      result = result.filter((g) => g.hasOnlineFix);
    }

    // Filter by Search Query (supports title, GTA & NFS aliases, Steam App ID, tags, developer, publisher)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (g) => {
          const title = g.title.toLowerCase();
          const isGtaAlias =
            (q === 'gta' && title.includes('grand theft auto')) ||
            (q.startsWith('gta') && (
              (q.includes('5') || q.includes('v')) && title.includes('grand theft auto v') ||
              (q.includes('sa') || q.includes('san andreas')) && title.includes('san andreas') ||
              title.includes('grand theft auto')
            ));

          const isNfsAlias =
            (q === 'nfs' && title.includes('need for speed')) ||
            (q.startsWith('nfs') && (
              (q.includes('mw') || q.includes('most wanted') || q.includes('2005')) && title.includes('most wanted') ||
              q.includes('payback') && title.includes('payback') ||
              q.includes('heat') && title.includes('heat') ||
              q.includes('unbound') && title.includes('unbound') ||
              title.includes('need for speed')
            )) ||
            (q === 'most wanted' && title.includes('most wanted')) ||
            (q === 'payback' && title.includes('payback'));

          return (
            title.includes(q) ||
            isGtaAlias ||
            isNfsAlias ||
            g.steamAppId.toString().includes(q) ||
            g.genres.some((genre) => genre.toLowerCase().includes(q)) ||
            g.developer.toLowerCase().includes(q) ||
            g.publisher.toLowerCase().includes(q)
          );
        }
      );
    }

    // Sorting (Trending tab defaults to downloads count)
    const effectiveSort = currentTab === 'trending' ? 'trending' : sortBy;

    result.sort((a, b) => {
      if (effectiveSort === 'trending') return b.downloadsCount - a.downloadsCount;
      if (effectiveSort === 'rating') return b.rating - a.rating;
      if (effectiveSort === 'title') return a.title.localeCompare(b.title);
      if (effectiveSort === 'size') {
        const sizeA = parseFloat(a.size) * (a.size.includes('GB') ? 1024 : 1);
        const sizeB = parseFloat(b.size) * (b.size.includes('GB') ? 1024 : 1);
        return sizeB - sizeA;
      }
      return 0; // Default order
    });

    return result;
  }, [currentTab, selectedGenre, selectedPublisher, selectedLetter, selectedYear, onlineFixOnly, searchQuery, sortBy, bookmarks]);

  // Spotlight Game for Hero Banner
  const spotlightGame = GAMES_DATA.find((g) => g.isFeatured) || GAMES_DATA[0];

  // Active Category Details (Sub-genres, Description, Tags)
  const activeCategory = useMemo(() => {
    if (!selectedGenre) return null;
    return (
      CATEGORIES_DATA.find(
        (c) =>
          c.name.toLowerCase() === selectedGenre.toLowerCase() ||
          c.slug.toLowerCase() === selectedGenre.toLowerCase() ||
          c.id.toLowerCase() === selectedGenre.toLowerCase()
      ) || null
    );
  }, [selectedGenre]);

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Global Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'home' && tab !== 'trending' && tab !== 'bookmarks') {
            resetFilters();
          }
        }}
        onSelectGenre={(genre) => {
          setSelectedGenre(genre || null);
          setSelectedPublisher(null);
          setSelectedLetter(null);
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenDonate={() => setIsDonateOpen(true)}
        onOpenAiAssistant={() => handleOpenAiAssistant()}
        bookmarksCount={bookmarks.length}
        selectedGenre={selectedGenre}
        isLoggedIn={isLoggedIn}
        username={username}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* VIEW: RECENT UPDATES */}
        {currentTab === 'updates' && (
          <RecentUpdatesView
            games={GAMES_DATA}
            onSelectGame={(game) => setSelectedGame(game)}
          />
        )}

        {/* VIEW: COLLECTIONS */}
        {currentTab === 'collections' && (
          <CollectionsView
            games={GAMES_DATA}
            onSelectGame={(game) => setSelectedGame(game)}
            onFilterByCollection={(tagOrTitle) => {
              setSelectedGenre(tagOrTitle);
              setCurrentTab('home');
            }}
          />
        )}

        {/* VIEW: LEADERBOARD */}
        {currentTab === 'leaderboard' && (
          <LeaderboardView
            onOpenRequests={() => setCurrentTab('requests')}
          />
        )}

        {/* VIEW: REQUEST GAMES */}
        {currentTab === 'requests' && (
          <RequestGamesView
            isLoggedIn={isLoggedIn}
            onOpenAccount={() => setIsAccountOpen(true)}
          />
        )}

        {/* VIEW: PUBLISHERS */}
        {currentTab === 'publishers' && (
          <PublishersView
            games={GAMES_DATA}
            onSelectPublisher={handleSelectPublisher}
          />
        )}

        {/* VIEW: FAQ & GUIDE */}
        {currentTab === 'faq' && (
          <FaqView onOpenGuide={() => setIsGuideOpen(true)} />
        )}

        {/* VIEW: BROWSE / HOME / TRENDING & SAVED BOOKMARKS */}
        {(currentTab === 'home' || currentTab === 'trending' || currentTab === 'bookmarks') && (
          <div className="space-y-6">
            {/* HERO SPOTLIGHT BANNER (Shown only on Home with no active filters) */}
            {currentTab === 'home' && !selectedGenre && !selectedPublisher && !selectedLetter && !selectedYear && !searchQuery && spotlightGame && (
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl group">
                <div className="relative aspect-[21/9] sm:aspect-[28/9] w-full overflow-hidden">
                  <img
                    src={spotlightGame.bannerUrl || spotlightGame.posterUrl}
                    alt={spotlightGame.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-[0.35]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                  {/* Spotlight Overlay Content */}
                  <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end max-w-2xl space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow">
                        Featured Release
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-900/90 text-emerald-400 text-xs font-mono border border-emerald-500/30">
                        {spotlightGame.version}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30 flex items-center gap-1">
                        <HardDrive className="w-3 h-3" />
                        {spotlightGame.size}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
                        Steam #{spotlightGame.steamAppId}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                      {spotlightGame.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                      {spotlightGame.shortDescription}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        onClick={() => setSelectedGame(spotlightGame)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        Direct Cloud Download
                      </button>
                      <button
                        onClick={() => handleOpenAiAssistant(spotlightGame)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-extrabold text-xs border border-emerald-500/40 transition-all cursor-pointer"
                      >
                        <Bot className="w-3.5 h-3.5 text-emerald-400" />
                        Ask AI
                      </button>
                      <button
                        onClick={() => toggleBookmark(spotlightGame.id)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                          bookmarks.includes(spotlightGame.id)
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-900/80 text-slate-200 border-slate-700 hover:text-amber-400'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                        {bookmarks.includes(spotlightGame.id) ? 'Saved' : 'Save Game'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Features bar under spotlight */}
                <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-slate-800 bg-[#0a0f19] text-xs divide-x divide-slate-800">
                  <div className="p-3 flex items-center gap-2.5 text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Tested & 100% Virus-Free</span>
                  </div>
                  <div className="p-3 flex items-center gap-2.5 text-slate-300">
                    <Download className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Unthrottled Cloud Mirrors</span>
                  </div>
                  <div className="p-3 flex items-center gap-2.5 text-slate-300">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Pre-Installed, Zero Installers</span>
                  </div>
                  <div className="p-3 flex items-center gap-2.5 text-slate-300">
                    <Users className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Working Online-Fix Multiplayer</span>
                  </div>
                </div>
              </div>
            )}

            {/* View Heading for Trending or Bookmarks */}
            {currentTab === 'trending' && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-amber-400" />
                    Trending Games This Week
                  </h1>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Hourly download momentum across 1,697 pre-installed PC games
                  </p>
                </div>
                <div className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold">
                  Ranked by 7-Day DLs
                </div>
              </div>
            )}

            {currentTab === 'bookmarks' && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <Bookmark className="w-6 h-6 text-amber-400 fill-amber-400" />
                    My Saved Games Library ({bookmarks.length})
                  </h1>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Your bookmarked titles stored locally for instant one-click access
                  </p>
                </div>
              </div>
            )}

            {/* ALPHABETICAL A-Z FILTER BAR */}
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-1 overflow-x-auto text-xs custom-scrollbar">
              <span className="text-[10px] uppercase font-bold text-slate-500 px-2 shrink-0">
                A-Z Index:
              </span>
              <button
                onClick={() => setSelectedLetter(null)}
                className={`px-2 py-1 rounded text-xs font-bold transition-all shrink-0 ${
                  !selectedLetter
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                All
              </button>
              {ALPHABET.map((char) => (
                <button
                  key={char}
                  onClick={() => setSelectedLetter(selectedLetter === char ? null : char)}
                  className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs transition-all shrink-0 ${
                    selectedLetter === char
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {char}
                </button>
              ))}
            </div>

            {/* Active Filter Indicators if filtered */}
            {(selectedGenre || selectedPublisher || selectedLetter || selectedYear || currentTab === 'bookmarks') && (
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase text-slate-400">Active Filters:</span>
                  {selectedLetter && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-semibold">
                      Starts with: {selectedLetter}
                      <button onClick={() => setSelectedLetter(null)} className="hover:text-white ml-1">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedGenre && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-semibold">
                      Genre: {selectedGenre}
                      <button onClick={() => setSelectedGenre(null)} className="hover:text-white ml-1">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedPublisher && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 text-xs font-semibold">
                      Publisher: {selectedPublisher}
                      <button onClick={() => setSelectedPublisher(null)} className="hover:text-white ml-1">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedYear && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-semibold">
                      Year: {selectedYear}
                      <button onClick={() => setSelectedYear(null)} className="hover:text-white ml-1">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>

                <button
                  onClick={resetFilters}
                  className="text-xs text-slate-400 hover:text-emerald-400 font-medium flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset all filters
                </button>
              </div>
            )}

            {/* Filter & Sort Controls Bar */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search Bar Input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filter by title, Steam ID, or tag..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Controls: Online Fix Toggle & Year Filter & Sort */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {/* Online Fix Toggle */}
                  <button
                    onClick={() => setOnlineFixOnly(!onlineFixOnly)}
                    className={`px-3 py-1.5 rounded-xl font-semibold border flex items-center gap-1.5 transition-all ${
                      onlineFixOnly
                        ? 'bg-blue-600/20 text-blue-400 border-blue-500/40 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    Online Fix Only
                  </button>

                  {/* Year Filter Dropdown */}
                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <select
                      value={selectedYear || ''}
                      onChange={(e) => setSelectedYear(e.target.value || null)}
                      className="bg-transparent text-slate-300 font-semibold focus:outline-none cursor-pointer text-xs"
                    >
                      <option value="">All Years</option>
                      <option value="2026">2026 Releases</option>
                      <option value="2025">2025 Releases</option>
                      <option value="2024">2024 Releases</option>
                      <option value="2023">2023 Releases</option>
                      <option value="Classic">Classic (Before 2022)</option>
                    </select>
                  </div>

                  {/* Sort dropdown */}
                  <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-500 text-[11px] font-medium hidden sm:inline">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="trending">Most Popular</option>
                      <option value="rating">Top Rated</option>
                      <option value="size">Largest Size</option>
                      <option value="title">Alphabetical (A-Z)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Genre Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold custom-scrollbar">
                <button
                  onClick={() => setSelectedGenre(null)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                    !selectedGenre
                      ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  All Genres
                </button>
                {CATEGORIES_DATA.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedGenre(selectedGenre === cat.name ? null : cat.name)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      selectedGenre?.toLowerCase() === cat.name.toLowerCase()
                        ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                        : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <CategoryIcon
                      name={cat.iconName}
                      className={`w-3.5 h-3.5 ${
                        selectedGenre?.toLowerCase() === cat.name.toLowerCase()
                          ? 'text-slate-950'
                          : 'text-emerald-400/80'
                      }`}
                    />
                    <span>{cat.name}</span>
                    <span className="text-[10px] opacity-70 font-mono">({cat.count})</span>
                  </button>
                ))}
              </div>

              {/* Active Category Description & Sub-Genres Display */}
              {activeCategory && (
                <div className="p-3 rounded-xl bg-slate-900/70 border border-emerald-500/20 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in duration-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <CategoryIcon name={activeCategory.iconName} className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">{activeCategory.name}</span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {processedGames.length} available
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{activeCategory.description}</p>
                    </div>
                  </div>

                  {activeCategory.subGenres && activeCategory.subGenres.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 shrink-0 sm:border-l sm:border-slate-800 sm:pl-3">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Sub-genres:</span>
                      {activeCategory.subGenres.map((sub) => (
                        <span
                          key={sub}
                          className="px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700 text-[11px] font-medium"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Results Count Header */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <span>
                Showing <strong className="text-slate-200">{processedGames.length}</strong> games
              </span>
              <span className="font-mono text-emerald-400">
                100% Pre-Installed • Zero Installers • Direct Mirrors
              </span>
            </div>

            {/* Games Grid */}
            {processedGames.length === 0 ? (
              <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-12 text-center space-y-3">
                <p className="text-sm font-bold text-slate-300">
                  {currentTab === 'bookmarks'
                    ? 'Your saved games library is empty.'
                    : 'No games matched your selected filters.'}
                </p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {currentTab === 'bookmarks'
                    ? 'Click the bookmark icon on any game card to save it for quick access later!'
                    : 'Try resetting your search query, alphabet letter, or selecting a different genre.'}
                </p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer"
                >
                  Browse All Games
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {processedGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onSelectGame={(g) => setSelectedGame(g)}
                    isBookmarked={bookmarks.includes(game.id)}
                    onToggleBookmark={toggleBookmark}
                    onOpenAiWithGame={(g) => handleOpenAiAssistant(g)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenDmca={() => setIsDmcaOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenAiAssistant={() => handleOpenAiAssistant()}
      />

      {/* Game Detail Modal */}
      {selectedGame && (
        <GameDetailModal
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
          isBookmarked={bookmarks.includes(selectedGame.id)}
          onToggleBookmark={toggleBookmark}
          onSelectPublisher={handleSelectPublisher}
          onOpenGuide={() => {
            setSelectedGame(null);
            setIsGuideOpen(true);
          }}
          onOpenAiWithGame={(game, prompt) => handleOpenAiAssistant(game, prompt)}
        />
      )}

      {/* Donate Modal */}
      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
      />

      {/* DMCA Modal */}
      <DmcaModal
        isOpen={isDmcaOpen}
        onClose={() => setIsDmcaOpen(false)}
      />

      {/* Download & Installation Guide Modal */}
      <DownloadGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Instant Search Modal (Ctrl+K or /) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        games={GAMES_DATA}
        onSelectGame={(g) => setSelectedGame(g)}
      />

      {/* Account Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        isLoggedIn={isLoggedIn}
        username={username}
        email={userEmail}
        onLogin={(name, email) => {
          login(name, email);
        }}
        onLogout={logout}
        bookmarksCount={bookmarks.length}
        onViewBookmarks={() => setCurrentTab('bookmarks')}
      />

      {/* Floating AI Assistant Trigger Widget */}
      <AiAssistantWidget
        onOpen={() => handleOpenAiAssistant(selectedGame)}
        activeGame={selectedGame}
      />

      {/* Interactive AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        initialGame={aiInitialGame}
        initialPrompt={aiInitialPrompt}
      />
    </div>
  );
}

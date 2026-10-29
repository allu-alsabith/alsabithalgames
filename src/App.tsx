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
  Zap,
  LayoutGrid,
  List,
  Dices,
  Keyboard,
  Bot
} from 'lucide-react';
import { Game, ViewTab } from './types';
import { GAMES_DATA } from './data/gamesData';
import { CATEGORIES_DATA } from './data/categoriesData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { GameCard } from './components/GameCard';
import { CompactGameRow } from './components/CompactGameRow';
import { CategoryIcon } from './components/CategoryIcon';
import { GameDetailModal } from './components/GameDetailModal';
import { RecentUpdatesView } from './components/RecentUpdatesView';
import { ComingSoonView } from './components/ComingSoonView';
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
import { DownloadManagerDrawer } from './components/DownloadManagerDrawer';
import { FloatingDownloadWidget } from './components/FloatingDownloadWidget';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileCategoryBar } from './components/MobileCategoryBar';
import { ToastNotification, ToastMessage } from './components/ToastNotification';
import { BackToTopButton } from './components/BackToTopButton';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { useUserData } from './hooks/useUserData';

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
  const [selectedSizeRange, setSelectedSizeRange] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal dialog & drawer states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isDmcaOpen, setIsDmcaOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isDownloadManagerOpen, setIsDownloadManagerOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [aiInitialGame, setAiInitialGame] = useState<Game | null>(null);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | undefined>(undefined);

  // Toast Notification System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    title: string,
    description?: string,
    type: 'success' | 'bookmark' | 'copy' | 'info' = 'info'
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev.slice(-3), { id, title, description, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

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

  const handleToggleBookmark = (gameId: string) => {
    const isCurrentlySaved = bookmarks.includes(gameId);
    toggleBookmark(gameId);
    const targetGame = GAMES_DATA.find((g) => g.id === gameId);
    const title = targetGame?.title || 'Game';
    if (isCurrentlySaved) {
      addToast('Removed from Saved Library', title, 'bookmark');
    } else {
      addToast('Saved to Library', `${title} is now in your saved library`, 'bookmark');
    }
  };

  const isLoggedIn = profile.isLoggedIn;
  const username = profile.username;
  const userEmail = profile.email;

  const handleSelectPublisher = (pubName: string) => {
    setSelectedPublisher(pubName);
    setSelectedGenre(null);
    setSelectedLetter(null);
    setSelectedYear(null);
    setSelectedSizeRange(null);
    setCurrentTab('home');
  };

  const resetFilters = () => {
    setSelectedGenre(null);
    setSelectedPublisher(null);
    setSelectedLetter(null);
    setSelectedYear(null);
    setSelectedSizeRange(null);
    setSearchQuery('');
    setOnlineFixOnly(false);
    if (currentTab === 'bookmarks') setCurrentTab('home');
    addToast('Filters Reset', 'Showing all available games', 'info');
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

    // Filter by File Size Range
    if (selectedSizeRange) {
      result = result.filter((g) => {
        const sizeNum = parseFloat(g.size) * (g.size.includes('GB') ? 1 : 0.001);
        if (selectedSizeRange === 'under10') return sizeNum < 10;
        if (selectedSizeRange === '10to40') return sizeNum >= 10 && sizeNum < 40;
        if (selectedSizeRange === '40to80') return sizeNum >= 40 && sizeNum <= 80;
        if (selectedSizeRange === 'over80') return sizeNum > 80;
        return true;
      });
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
  }, [currentTab, selectedGenre, selectedPublisher, selectedLetter, selectedYear, selectedSizeRange, onlineFixOnly, searchQuery, sortBy, bookmarks]);

  // Surprise Me / Random Pick handler
  const handlePickRandomGame = () => {
    const pool = processedGames.length > 0 ? processedGames : GAMES_DATA;
    if (pool.length === 0) return;
    const randomIndex = Math.floor(Math.random() * pool.length);
    const randomGame = pool[randomIndex];
    setSelectedGame(randomGame);
    addToast('🎲 Surprise Pick!', `Selected "${randomGame.title}" from catalog`, 'info');
  };

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        activeEl?.tagName === 'SELECT';

      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsShortcutsOpen(false);
        setIsGuideOpen(false);
        setIsDmcaOpen(false);
        setIsAccountOpen(false);
        setIsDonateOpen(false);
        setIsAiAssistantOpen(false);
        setSelectedGame(null);
        setIsMobileDrawerOpen(false);
        return;
      }

      if (isInput) return;

      if (e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handlePickRandomGame();
      } else if (e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setCurrentTab('bookmarks');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setCurrentTab('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        setCurrentTab('trending');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [processedGames, bookmarks]);

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
    <div className="min-h-screen flex flex-col bg-[#060911] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300 relative overflow-x-hidden">
      {/* macOS Liquid Glass Ambient Dynamic Mesh (Refracts through frosted glass panels) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute -top-32 left-[12%] w-[680px] h-[680px] rounded-full bg-emerald-500/[0.08] blur-[130px] animate-pulse" style={{ animationDuration: '9s' }} />
        <div className="absolute top-[28%] -right-24 w-[760px] h-[760px] rounded-full bg-cyan-500/[0.07] blur-[150px]" />
        <div className="absolute top-[58%] -left-32 w-[820px] h-[820px] rounded-full bg-indigo-600/[0.06] blur-[160px]" />
        <div className="absolute -bottom-48 right-[15%] w-[720px] h-[720px] rounded-full bg-emerald-600/[0.07] blur-[140px]" />
      </div>

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
        onOpenDownloadManager={() => setIsDownloadManagerOpen(true)}
        bookmarksCount={bookmarks.length}
        selectedGenre={selectedGenre}
        isLoggedIn={isLoggedIn}
        username={username}
        isMobileDrawerOpen={isMobileDrawerOpen}
        onToggleMobileDrawer={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
      />

      {/* Main Content Body (with mobile-friendly bottom padding for bottom navigation bar) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-8">
        {/* VIEW: RECENT UPDATES */}
        {currentTab === 'updates' && (
          <RecentUpdatesView
            games={GAMES_DATA}
            onSelectGame={(game) => setSelectedGame(game)}
          />
        )}

        {/* VIEW: COMING SOON */}
        {currentTab === 'coming-soon' && (
          <ComingSoonView
            onOpenRequests={() => setCurrentTab('requests')}
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
              <div className="relative rounded-3xl overflow-hidden mac-liquid-glass mac-card-sheen group">
                {/* macOS Window Top Chrome */}
                <div className="px-4 py-2.5 bg-white/[0.04] border-b border-white/[0.08] backdrop-blur-xl flex items-center justify-between select-none">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full mac-dot-red inline-block" />
                    <span className="w-3 h-3 rounded-full mac-dot-yellow inline-block" />
                    <span className="w-3 h-3 rounded-full mac-dot-green inline-block" />
                    <span className="ml-2.5 text-[11px] font-mono text-slate-400 font-medium hidden sm:inline">
                      Spotlight.app • {spotlightGame.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>v{spotlightGame.version.split('+')[0]} • Verified Mirror</span>
                  </div>
                </div>

                <div className="relative aspect-[21/9] sm:aspect-[28/9] w-full overflow-hidden">
                  <img
                    src={spotlightGame.bannerUrl || spotlightGame.posterUrl}
                    alt={spotlightGame.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-[0.38]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#080d1a]/95 via-[#080d1a]/70 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a] via-transparent to-transparent" />

                  {/* Spotlight Overlay Content */}
                  <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end max-w-2xl space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full mac-liquid-accent text-emerald-200 text-xs font-bold uppercase tracking-wider">
                        Featured Release
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full mac-liquid-pill text-emerald-300 text-xs font-mono">
                        {spotlightGame.version}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full mac-liquid-pill text-cyan-300 text-xs font-semibold flex items-center gap-1">
                        <HardDrive className="w-3 h-3" />
                        {spotlightGame.size}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full mac-liquid-pill text-blue-300 text-xs font-semibold">
                        Steam #{spotlightGame.steamAppId}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
                      {spotlightGame.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-300/90 line-clamp-2 leading-relaxed max-w-xl">
                      {spotlightGame.shortDescription}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => setSelectedGame(spotlightGame)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl mac-liquid-accent text-white font-extrabold text-xs cursor-pointer active:scale-95"
                      >
                        <Download className="w-4 h-4" />
                        Direct Cloud Download
                      </button>
                      <button
                        onClick={() => handleOpenAiAssistant(spotlightGame)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl mac-liquid-pill text-emerald-300 font-bold text-xs cursor-pointer active:scale-95"
                      >
                        <Bot className="w-3.5 h-3.5 text-emerald-400" />
                        Ask AI
                      </button>
                      <button
                        onClick={() => handleToggleBookmark(spotlightGame.id)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold cursor-pointer transition-all active:scale-95 ${
                          bookmarks.includes(spotlightGame.id)
                            ? 'bg-amber-500 text-slate-950 border border-amber-400 shadow-md shadow-amber-500/30'
                            : 'mac-liquid-pill text-slate-200 hover:text-amber-400'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                        {bookmarks.includes(spotlightGame.id) ? 'Saved' : 'Save Game'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Features bar under spotlight with frosted liquid glass */}
                <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-white/[0.08] bg-white/[0.02] backdrop-blur-xl text-xs divide-x divide-white/[0.08]">
                  <div className="p-3.5 flex items-center gap-2.5 text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-medium">Tested & 100% Virus-Free</span>
                  </div>
                  <div className="p-3.5 flex items-center gap-2.5 text-slate-300">
                    <Download className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="font-medium">Unthrottled Cloud Mirrors</span>
                  </div>
                  <div className="p-3.5 flex items-center gap-2.5 text-slate-300">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-medium">Pre-Installed, Zero Installers</span>
                  </div>
                  <div className="p-3.5 flex items-center gap-2.5 text-slate-300">
                    <Users className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="font-medium">Working Online-Fix Multiplayer</span>
                  </div>
                </div>
              </div>
            )}

            {/* View Heading for Trending or Bookmarks */}
            {currentTab === 'trending' && (
              <div className="p-5 rounded-3xl mac-liquid-glass flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                    <TrendingUp className="w-6 h-6 text-amber-400" />
                    Trending Games This Week
                  </h1>
                  <p className="text-xs text-slate-300/80 mt-0.5">
                    Hourly download momentum across 1,697 pre-installed PC games
                  </p>
                </div>
                <div className="px-3.5 py-1.5 rounded-full mac-liquid-pill text-amber-300 text-xs font-mono font-bold">
                  Ranked by 7-Day DLs
                </div>
              </div>
            )}

            {currentTab === 'bookmarks' && (
              <div className="p-5 rounded-3xl mac-liquid-glass flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                    <Bookmark className="w-6 h-6 text-amber-400 fill-amber-400" />
                    My Saved Games Library ({bookmarks.length})
                  </h1>
                  <p className="text-xs text-slate-300/80 mt-0.5">
                    Your bookmarked titles stored locally for instant one-click access
                  </p>
                </div>
              </div>
            )}

            {/* MOBILE QUICK CATEGORY HORIZONTAL BAR */}
            <MobileCategoryBar
              selectedGenre={selectedGenre || ''}
              onSelectGenre={(genre) => {
                setSelectedGenre(genre || null);
                setSelectedPublisher(null);
                setSelectedLetter(null);
              }}
              onlineFixFilter={onlineFixOnly}
              onToggleOnlineFix={() => setOnlineFixOnly(!onlineFixOnly)}
              totalGamesCount={GAMES_DATA.length}
            />

            {/* ALPHABETICAL A-Z FILTER BAR */}
            <div className="p-2 rounded-2xl mac-liquid-subtle flex items-center gap-1 overflow-x-auto text-xs custom-scrollbar">
              <span className="text-[10px] uppercase font-bold text-slate-400 px-2 shrink-0">
                A-Z Index:
              </span>
              <button
                onClick={() => setSelectedLetter(null)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  !selectedLetter
                    ? 'mac-liquid-accent text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                All
              </button>
              {ALPHABET.map((char) => (
                <button
                  key={char}
                  onClick={() => setSelectedLetter(selectedLetter === char ? null : char)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs transition-all shrink-0 cursor-pointer ${
                    selectedLetter === char
                      ? 'mac-liquid-accent text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  {char}
                </button>
              ))}
            </div>

            {/* Active Filter Indicators if filtered */}
            {(selectedGenre || selectedPublisher || selectedLetter || selectedYear || currentTab === 'bookmarks') && (
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl mac-liquid-glass">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase text-slate-400">Active Filters:</span>
                  {selectedLetter && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full mac-liquid-pill text-teal-300 text-xs font-semibold">
                      Starts with: {selectedLetter}
                      <button onClick={() => setSelectedLetter(null)} className="hover:text-white ml-1 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedGenre && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full mac-liquid-pill text-emerald-300 text-xs font-semibold">
                      Genre: {selectedGenre}
                      <button onClick={() => setSelectedGenre(null)} className="hover:text-white ml-1 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedPublisher && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full mac-liquid-pill text-indigo-300 text-xs font-semibold">
                      Publisher: {selectedPublisher}
                      <button onClick={() => setSelectedPublisher(null)} className="hover:text-white ml-1 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedYear && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full mac-liquid-pill text-amber-300 text-xs font-semibold">
                      Year: {selectedYear}
                      <button onClick={() => setSelectedYear(null)} className="hover:text-white ml-1 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedSizeRange && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full mac-liquid-pill text-purple-300 text-xs font-semibold">
                      Size: {
                        selectedSizeRange === 'under10' ? '< 10 GB' :
                        selectedSizeRange === '10to40' ? '10 - 40 GB' :
                        selectedSizeRange === '40to80' ? '40 - 80 GB' : '> 80 GB'
                      }
                      <button onClick={() => setSelectedSizeRange(null)} className="hover:text-white ml-1 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>

                <button
                  onClick={resetFilters}
                  className="text-xs text-slate-400 hover:text-emerald-400 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset all filters
                </button>
              </div>
            )}

            {/* Filter & Sort Controls Bar with macOS Spotlight input & Liquid Glass segmented controls */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Search Bar Input (macOS Spotlight style) */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search titles, aliases (GTA, NFS), Steam ID, genre..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-9 py-2.5 rounded-full mac-liquid-subtle text-xs sm:text-sm text-slate-100 placeholder-slate-400/70 focus:outline-none focus:border-emerald-400/50 focus:shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Controls: Online Fix Toggle, Filters, View Switcher & Actions */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {/* Online Fix Toggle */}
                  <button
                    onClick={() => setOnlineFixOnly(!onlineFixOnly)}
                    className={`px-3.5 py-2 rounded-2xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      onlineFixOnly
                        ? 'bg-blue-600/30 text-blue-300 border border-blue-400/50 shadow-[0_4px_16px_rgba(37,99,235,0.3),inset_0_1px_1px_rgba(255,255,255,0.3)]'
                        : 'mac-liquid-pill text-slate-300 hover:text-white'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    Online Fix Only
                  </button>

                  {/* Year Filter Dropdown */}
                  <div className="flex items-center gap-1 mac-liquid-pill rounded-2xl px-3 py-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <select
                      value={selectedYear || ''}
                      onChange={(e) => setSelectedYear(e.target.value || null)}
                      className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer text-xs"
                    >
                      <option value="" className="bg-slate-900 text-slate-200">All Years</option>
                      <option value="2026" className="bg-slate-900 text-slate-200">2026 Releases</option>
                      <option value="2025" className="bg-slate-900 text-slate-200">2025 Releases</option>
                      <option value="2024" className="bg-slate-900 text-slate-200">2024 Releases</option>
                      <option value="2023" className="bg-slate-900 text-slate-200">2023 Releases</option>
                      <option value="Classic" className="bg-slate-900 text-slate-200">Classic (Before 2022)</option>
                    </select>
                  </div>

                  {/* Size Range Filter Dropdown */}
                  <div className="flex items-center gap-1 mac-liquid-pill rounded-2xl px-3 py-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                    <select
                      value={selectedSizeRange || ''}
                      onChange={(e) => setSelectedSizeRange(e.target.value || null)}
                      className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer text-xs"
                    >
                      <option value="" className="bg-slate-900 text-slate-200">All Sizes</option>
                      <option value="under10" className="bg-slate-900 text-slate-200">&lt; 10 GB (Compact)</option>
                      <option value="10to40" className="bg-slate-900 text-slate-200">10 – 40 GB (Medium)</option>
                      <option value="40to80" className="bg-slate-900 text-slate-200">40 – 80 GB (Large)</option>
                      <option value="over80" className="bg-slate-900 text-slate-200">&gt; 80 GB (Massive)</option>
                    </select>
                  </div>

                  {/* Sort dropdown */}
                  <div className="flex items-center gap-1.5 mac-liquid-pill rounded-2xl px-3 py-1.5">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent text-slate-100 font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="trending" className="bg-slate-900 text-slate-200">Most Popular</option>
                      <option value="rating" className="bg-slate-900 text-slate-200">Top Rated</option>
                      <option value="size" className="bg-slate-900 text-slate-200">Largest Size</option>
                      <option value="title" className="bg-slate-900 text-slate-200">Alphabetical (A-Z)</option>
                    </select>
                  </div>

                  {/* View Mode Grid / List Segmented Control */}
                  <div className="flex items-center p-1 rounded-2xl bg-white/[0.05] border border-white/[0.1] backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
                    <button
                      onClick={() => setViewMode('grid')}
                      title="Grid View"
                      aria-label="Grid View"
                      className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                        viewMode === 'grid'
                          ? 'bg-white/[0.18] text-white shadow-sm border border-white/[0.2]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      title="Compact List View"
                      aria-label="Compact List View"
                      className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                        viewMode === 'list'
                          ? 'bg-white/[0.18] text-white shadow-sm border border-white/[0.2]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Surprise Me / Random Pick */}
                  <button
                    onClick={handlePickRandomGame}
                    title="Surprise me with a random game (Shortcut: R)"
                    className="px-3 py-1.5 rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-400/40 backdrop-blur-md flex items-center gap-1.5 transition-all active:scale-95 font-semibold cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]"
                  >
                    <Dices className="w-3.5 h-3.5 text-purple-400" />
                    <span className="hidden sm:inline">Surprise Me</span>
                  </button>

                  {/* Keyboard Shortcuts Trigger */}
                  <button
                    onClick={() => setIsShortcutsOpen(true)}
                    title="Keyboard Shortcuts (Shortcut: ?)"
                    aria-label="Open keyboard shortcuts"
                    className="p-2 rounded-2xl mac-liquid-pill text-slate-300 hover:text-white hidden sm:flex items-center justify-center cursor-pointer"
                  >
                    <Keyboard className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Genre Pills with Liquid Glass */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold custom-scrollbar">
                <button
                  onClick={() => setSelectedGenre(null)}
                  className={`px-3.5 py-1.5 rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
                    !selectedGenre
                      ? 'mac-liquid-accent text-white font-extrabold shadow-sm'
                      : 'mac-liquid-pill text-slate-300 hover:text-white'
                  }`}
                >
                  All Genres
                </button>
                {CATEGORIES_DATA.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedGenre(selectedGenre === cat.name ? null : cat.name)}
                    className={`px-3.5 py-1.5 rounded-2xl whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      selectedGenre?.toLowerCase() === cat.name.toLowerCase()
                        ? 'mac-liquid-accent text-white font-extrabold shadow-sm'
                        : 'mac-liquid-pill text-slate-300 hover:text-white'
                    }`}
                  >
                    <CategoryIcon
                      name={cat.iconName}
                      className={`w-3.5 h-3.5 ${
                        selectedGenre?.toLowerCase() === cat.name.toLowerCase()
                          ? 'text-emerald-300'
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
                <div className="p-4 rounded-2xl mac-liquid-glass flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl mac-liquid-accent flex items-center justify-center shrink-0">
                      <CategoryIcon name={activeCategory.iconName} className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{activeCategory.name}</span>
                        <span className="text-[11px] text-emerald-400/80 font-mono px-2 py-0.5 rounded-full mac-liquid-subtle">
                          {processedGames.length} available
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300/80 line-clamp-1">{activeCategory.description}</p>
                    </div>
                  </div>

                  {activeCategory.subGenres && activeCategory.subGenres.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 shrink-0 sm:border-l sm:border-white/[0.08] sm:pl-3">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sub-genres:</span>
                      {activeCategory.subGenres.map((sub) => (
                        <span
                          key={sub}
                          className="px-2.5 py-0.5 rounded-full mac-liquid-pill text-slate-200 text-[11px] font-medium"
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
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/[0.08]">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <span>
                  Showing <strong className="text-white font-semibold">{processedGames.length}</strong> games
                </span>
              </span>
              <span className="font-mono text-emerald-400 hidden sm:inline">
                100% Pre-Installed • Zero Installers • Direct Cloud Mirrors
              </span>
            </div>

            {/* Games Presentation: Grid or Compact List */}
            {processedGames.length === 0 ? (
              <div className="rounded-3xl mac-liquid-glass p-12 text-center space-y-3.5">
                <div className="w-12 h-12 rounded-2xl mac-liquid-subtle mx-auto flex items-center justify-center text-slate-400">
                  <Search className="w-6 h-6" />
                </div>
                <p className="text-base font-bold text-white">
                  {currentTab === 'bookmarks'
                    ? 'Your saved games library is empty.'
                    : 'No games matched your selected filters.'}
                </p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  {currentTab === 'bookmarks'
                    ? 'Click the bookmark icon on any game card to save it for quick access later!'
                    : 'Try resetting your search query, alphabet letter, size range, or selecting a different genre.'}
                </p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl mac-liquid-accent text-white font-bold text-xs cursor-pointer active:scale-95"
                >
                  Browse All Games
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {processedGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onSelectGame={(g) => setSelectedGame(g)}
                    isBookmarked={bookmarks.includes(game.id)}
                    onToggleBookmark={handleToggleBookmark}
                    onOpenAiWithGame={(g) => handleOpenAiAssistant(g)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {processedGames.map((game) => (
                  <CompactGameRow
                    key={game.id}
                    game={game}
                    onSelectGame={(g) => setSelectedGame(g)}
                    isBookmarked={bookmarks.includes(game.id)}
                    onToggleBookmark={handleToggleBookmark}
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
          onToggleBookmark={handleToggleBookmark}
          onSelectPublisher={handleSelectPublisher}
          onNotify={addToast}
          onOpenGuide={() => {
            setSelectedGame(null);
            setIsGuideOpen(true);
          }}
          onOpenDownloadManager={() => setIsDownloadManagerOpen(true)}
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

      {/* Direct Download Manager Drawer */}
      <DownloadManagerDrawer
        isOpen={isDownloadManagerOpen}
        onClose={() => setIsDownloadManagerOpen(false)}
        onSelectGameById={(gameId) => {
          const found = GAMES_DATA.find((g) => g.id === gameId);
          if (found) setSelectedGame(found);
        }}
        onNotify={addToast}
      />

      {/* Floating Active Download Indicator */}
      <FloatingDownloadWidget
        onOpenManager={() => setIsDownloadManagerOpen(true)}
      />

      {/* Mobile Sticky Bottom Navigation Bar (Smart mobile navigation) */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'home' && tab !== 'trending' && tab !== 'bookmarks') {
            resetFilters();
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        bookmarksCount={bookmarks.length}
        onToggleMobileDrawer={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
        isMobileDrawerOpen={isMobileDrawerOpen}
        onOpenAiAssistant={() => handleOpenAiAssistant()}
      />

      {/* Keyboard Shortcuts Cheat Sheet Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Global Toast Notifications Stack */}
      <ToastNotification
        toasts={toasts}
        onDismiss={removeToast}
      />

      {/* Smooth Back to Top Floating Action */}
      <BackToTopButton />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  Anchor, 
  Search, 
  Bookmark, 
  Flame, 
  Clock, 
  MessageSquarePlus, 
  Building2, 
  HelpCircle, 
  Menu, 
  X, 
  Download, 
  ShieldCheck, 
  User,
  ChevronDown,
  Sparkles,
  Layers,
  Trophy,
  Heart,
  Globe,
  TrendingUp,
  Calendar,
  Bot,
  Zap
} from 'lucide-react';
import { ViewTab } from '../types';
import { CATEGORIES_DATA } from '../data/categoriesData';
import { BrandLogo } from './BrandLogo';
import { CategoryIcon } from './CategoryIcon';
import { downloadEngine } from '../services/downloadEngine';

interface HeaderProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  onSelectGenre: (genre: string) => void;
  onOpenSearch: () => void;
  onOpenGuide: () => void;
  onOpenAccount: () => void;
  onOpenDonate: () => void;
  onOpenAiAssistant?: () => void;
  onOpenDownloadManager?: () => void;
  bookmarksCount: number;
  selectedGenre: string | null;
  isLoggedIn: boolean;
  username: string;
  isMobileDrawerOpen?: boolean;
  onToggleMobileDrawer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onSelectGenre,
  onOpenSearch,
  onOpenGuide,
  onOpenAccount,
  onOpenDonate,
  onOpenAiAssistant,
  onOpenDownloadManager,
  bookmarksCount,
  selectedGenre,
  isLoggedIn,
  username,
  isMobileDrawerOpen,
  onToggleMobileDrawer,
}) => {
  const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false);
  const mobileMenuOpen = isMobileDrawerOpen !== undefined ? isMobileDrawerOpen : internalMobileMenuOpen;
  const setMobileMenuOpen = (open: boolean) => {
    if (onToggleMobileDrawer) {
      if (open !== mobileMenuOpen) onToggleMobileDrawer();
    } else {
      setInternalMobileMenuOpen(open);
    }
  };
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState({ code: 'EN', name: 'English', flag: '🇺🇸' });
  const [activeDownloadCount, setActiveDownloadCount] = useState<number>(() => downloadEngine.getRunningCount());

  useEffect(() => {
    const check = () => setActiveDownloadCount(downloadEngine.getRunningCount());
    const unsub = downloadEngine.subscribe(check);
    return () => unsub();
  }, []);

  const languages = [
    { code: 'EN', name: 'English', flag: '🇺🇸' },
    { code: 'TR', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'DE', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ES', name: 'Español', flag: '🇪🇸' },
    { code: 'FR', name: 'Français', flag: '🇫🇷' },
    { code: 'RU', name: 'Русский', flag: '🇷🇺' },
  ];

  const handleGenreClick = (genreSlug: string) => {
    onSelectGenre(genreSlug);
    onSelectTab('home');
    setGenreDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] mac-liquid-subtle">
      {/* Top Banner Notice */}
      <div className="bg-white/[0.02] border-b border-white/[0.06] backdrop-blur-md px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full mac-liquid-pill px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              100% Pre-Installed
            </span>
            <span className="hidden sm:inline text-slate-400 text-[11px]">
              No installers, no adware. Extract with NanaZip/WinRAR & Play directly!
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <button
              onClick={onOpenGuide}
              className="text-cyan-300 hover:text-cyan-200 hover:underline flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <Download className="w-3 h-3" />
              Installation Guide
            </button>
            <span className="text-white/20">|</span>
            <button
              onClick={onOpenDonate}
              className="text-pink-300 hover:text-pink-200 hover:underline flex items-center gap-1 font-semibold transition-colors cursor-pointer"
            >
              <Heart className="w-3 h-3 fill-pink-400/30" />
              Donate
            </button>
            <span className="text-white/20">|</span>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <span>{currentLang.flag}</span>
                <span className="font-mono font-bold text-[10px]">{currentLang.code}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div
                  className="absolute right-0 mt-1 w-32 rounded-2xl mac-liquid-glass border border-white/[0.12] shadow-2xl p-1.5 z-50 animate-in fade-in"
                  onMouseLeave={() => setLangDropdownOpen(false)}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLang(lang);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                        currentLang.code === lang.code
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                          : 'text-slate-300 hover:bg-white/[0.08]'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div 
            onClick={() => { onSelectTab('home'); onSelectGenre(''); }}
            className="cursor-pointer shrink-0 select-none"
            id="site-logo"
          >
            <BrandLogo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold">
            {/* Browse / Home */}
            <button
              onClick={() => { onSelectTab('home'); onSelectGenre(''); }}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'home' && !selectedGenre
                  ? 'mac-liquid-pill text-emerald-300 border-emerald-400/40 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Flame className="w-4 h-4 text-emerald-400" />
              Browse Games
            </button>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setGenreDropdownOpen(!genreDropdownOpen)}
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedGenre
                    ? 'mac-liquid-pill text-emerald-300 border-emerald-400/40 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span>Genres</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${genreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {genreDropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-72 max-h-[460px] overflow-y-auto custom-scrollbar rounded-2xl mac-liquid-glass border border-white/[0.12] shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-2 grid grid-cols-1 gap-1 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setGenreDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/[0.08] mb-1 flex items-center justify-between">
                    <span>Explore Categories</span>
                    <span className="text-[10px] text-slate-500 font-mono">{CATEGORIES_DATA.length} Genres</span>
                  </div>
                  {CATEGORIES_DATA.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleGenreClick(cat.name)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        selectedGenre?.toLowerCase() === cat.name.toLowerCase()
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                          : 'text-slate-300 hover:bg-white/[0.08] hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <CategoryIcon name={cat.iconName} className="w-3.5 h-3.5 text-emerald-400/80" />
                        <span>{cat.name}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono mac-liquid-pill px-2 py-0.5 rounded-full">
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Trending */}
            <button
              onClick={() => onSelectTab('trending')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'trending'
                  ? 'mac-liquid-pill text-emerald-300 border-emerald-400/40 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Trending
            </button>

            {/* Collections */}
            <button
              onClick={() => onSelectTab('collections')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'collections'
                  ? 'mac-liquid-pill text-emerald-300 border-emerald-400/40 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Layers className="w-4 h-4 text-purple-400" />
              Collections
              <span className="px-1.5 py-0.2 rounded-full mac-liquid-pill text-purple-300 text-[10px] font-mono">
                68
              </span>
            </button>

            {/* Recent Updates */}
            <button
              onClick={() => onSelectTab('updates')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'updates'
                  ? 'mac-liquid-pill text-emerald-300 border-emerald-400/40 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Clock className="w-4 h-4 text-cyan-400" />
              Recent Updates
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </button>

            {/* Coming Soon */}
            <button
              onClick={() => onSelectTab('coming-soon')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'coming-soon'
                  ? 'mac-liquid-pill text-emerald-300 border-emerald-400/40 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Calendar className="w-4 h-4 text-teal-400" />
              Coming Soon
              <span className="px-1.5 py-0.2 rounded-full mac-liquid-pill text-teal-300 text-[10px] font-bold font-mono">
                17
              </span>
            </button>

            {/* Leaderboard */}
            <button
              onClick={() => onSelectTab('leaderboard')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'leaderboard'
                  ? 'mac-liquid-pill text-emerald-300 border-emerald-400/40 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Trophy className="w-4 h-4 text-yellow-400" />
              Leaderboard
            </button>

            {/* Requests */}
            <button
              onClick={() => onSelectTab('requests')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'requests'
                  ? 'mac-liquid-pill text-emerald-300 border-emerald-400/40 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <MessageSquarePlus className="w-4 h-4 text-emerald-400" />
              Request
            </button>

            {/* Publishers */}
            <button
              onClick={() => onSelectTab('publishers')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'publishers'
                  ? 'mac-liquid-pill text-emerald-300 border-emerald-400/40 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Building2 className="w-4 h-4 text-indigo-400" />
              Publishers
            </button>

            {/* FAQ */}
            <button
              onClick={() => onSelectTab('faq')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'faq'
                  ? 'mac-liquid-pill text-emerald-300 border-emerald-400/40 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              FAQ
            </button>

            {/* AI Assistant Navigation Tab */}
            {onOpenAiAssistant && (
              <button
                onClick={onOpenAiAssistant}
                id="nav-ai-assistant"
                className="px-3 py-1.5 rounded-xl mac-liquid-pill border-emerald-400/40 text-emerald-300 hover:text-white transition-all flex items-center gap-1.5 font-bold shadow-sm cursor-pointer"
              >
                <Bot className="w-4 h-4 text-emerald-400" />
                <span>AI Support</span>
                <span className="px-1.5 py-0.2 rounded-full mac-liquid-accent text-white text-[9px] uppercase tracking-wider font-extrabold">
                  Gemini
                </span>
              </button>
            )}
          </nav>

          {/* Right Actions: Search & Bookmarks & Donate & Account */}
          <div className="flex items-center gap-2">
            {/* AI Assistant Quick Trigger */}
            {onOpenAiAssistant && (
              <button
                onClick={onOpenAiAssistant}
                id="header-ai-assistant-btn"
                title="Open alsabithalgames AI Assistant (PC Specs & Error Help)"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl mac-liquid-accent text-white text-xs font-bold transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95"
              >
                <Bot className="w-4 h-4" />
                <span className="hidden md:inline">Ask AI</span>
              </button>
            )}

            {/* Instant Search Bar Button */}
            <button
              onClick={onOpenSearch}
              id="search-trigger-button"
              className="flex items-center gap-2 px-3 py-2 sm:py-1.5 rounded-2xl mac-liquid-pill text-slate-300 hover:text-white hover:border-emerald-400/50 transition-all text-xs font-medium group min-h-[38px] active:scale-95 cursor-pointer"
              title="Search games by title or Steam App ID (Ctrl+K or /)"
            >
              <Search className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
              <span className="hidden sm:inline">Search games or Steam ID...</span>
              <kbd className="hidden md:inline-block bg-white/[0.08] text-[10px] text-slate-300 px-1.5 py-0.5 rounded border border-white/[0.1] font-mono">
                /
              </kbd>
            </button>

            {/* Download Manager Trigger Button */}
            {onOpenDownloadManager && (
              <button
                onClick={onOpenDownloadManager}
                id="header-downloads-btn"
                title="Direct Download Manager"
                className={`relative p-2 rounded-2xl border transition-all min-w-[38px] min-h-[38px] flex items-center justify-center active:scale-95 cursor-pointer ${
                  activeDownloadCount > 0
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-md shadow-emerald-500/20'
                    : 'mac-liquid-pill text-slate-300 hover:text-emerald-400'
                }`}
              >
                <Download className={`w-4 h-4 ${activeDownloadCount > 0 ? 'animate-bounce text-emerald-400' : ''}`} />
                {activeDownloadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-400 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center shadow">
                    {activeDownloadCount}
                  </span>
                )}
              </button>
            )}

            {/* Bookmarks / Saved Library */}
            <button
              onClick={() => onSelectTab('bookmarks')}
              className={`relative p-2 rounded-2xl border transition-all min-w-[38px] min-h-[38px] flex items-center justify-center active:scale-95 cursor-pointer ${
                currentTab === 'bookmarks'
                  ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-md shadow-amber-400/30'
                  : 'mac-liquid-pill text-slate-300 hover:text-amber-400'
              }`}
              title="My Saved Games"
              id="bookmarks-button"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarksCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-400 text-slate-950 text-[10px] font-extrabold rounded-full flex items-center justify-center shadow">
                  {bookmarksCount}
                </span>
              )}
            </button>

            {/* Donate Quick Button */}
            <button
              onClick={onOpenDonate}
              title="Support Server Costs"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl mac-liquid-pill text-pink-300 hover:text-white text-xs font-semibold transition-all min-h-[36px] cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-pink-400/30" />
              <span>Donate</span>
            </button>

            {/* Account / User Button */}
            <button
              onClick={onOpenAccount}
              id="account-button"
              className="flex items-center gap-2 px-3 py-2 sm:py-1.5 rounded-2xl mac-liquid-pill text-xs font-semibold text-slate-200 hover:text-white transition-all min-h-[38px] active:scale-95 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">
                {isLoggedIn ? username : 'Account'}
              </span>
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl mac-liquid-pill text-slate-300 hover:text-white xl:hidden min-w-[42px] min-h-[42px] flex items-center justify-center active:scale-90 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-emerald-400" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-white/[0.08] mac-liquid-glass px-4 pt-3 pb-8 space-y-2 max-h-[85vh] overflow-y-auto custom-scrollbar">
          {onOpenAiAssistant && (
            <button
              onClick={() => { onOpenAiAssistant(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3.5 py-3 rounded-2xl text-sm font-extrabold flex items-center justify-between mac-liquid-accent text-white shadow-lg min-h-[48px] active:scale-98 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Bot className="w-5 h-5" />
                <span>alsabithalgames AI Assistant</span>
              </div>
              <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                Ask Anything
              </span>
            </button>
          )}

          {onOpenDownloadManager && (
            <button
              onClick={() => { onOpenDownloadManager(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3.5 py-2.5 rounded-2xl text-sm font-semibold flex items-center justify-between min-h-[44px] cursor-pointer transition-all bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
            >
              <div className="flex items-center gap-2.5">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Direct Download Manager</span>
              </div>
              {activeDownloadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-xs font-black">
                  {activeDownloadCount} Active
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => { onSelectTab('home'); onSelectGenre(''); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-sm font-semibold flex items-center gap-2.5 min-h-[44px] cursor-pointer transition-all ${
              currentTab === 'home' && !selectedGenre ? 'mac-liquid-pill text-emerald-300 border-emerald-400/40 font-bold' : 'text-slate-300 hover:bg-white/[0.06]'
            }`}
          >
            <Flame className="w-4 h-4 text-emerald-400" />
            Browse All Games
          </button>
          <button
            onClick={() => { onSelectTab('trending'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-sm font-semibold flex items-center gap-2.5 min-h-[44px] cursor-pointer transition-all ${
              currentTab === 'trending' ? 'mac-liquid-pill text-emerald-300 border-emerald-400/40 font-bold' : 'text-slate-300 hover:bg-white/[0.06]'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-amber-400" />
            Trending Games
          </button>
          <button
            onClick={() => { onSelectTab('coming-soon'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-sm font-semibold flex items-center justify-between min-h-[44px] cursor-pointer transition-all ${
              currentTab === 'coming-soon' ? 'mac-liquid-pill text-emerald-300 border-emerald-400/40 font-bold' : 'text-slate-300 hover:bg-white/[0.06]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-teal-400" />
              <span>Coming Soon</span>
            </div>
            <span className="text-[10px] mac-liquid-pill text-teal-300 px-2 py-0.5 rounded-full font-bold">
              17 Games
            </span>
          </button>
          <button
            onClick={() => { onSelectTab('collections'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-sm font-semibold flex items-center gap-2.5 min-h-[44px] cursor-pointer transition-all ${
              currentTab === 'collections' ? 'mac-liquid-pill text-emerald-300 border-emerald-400/40 font-bold' : 'text-slate-300 hover:bg-white/[0.06]'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-400" />
            Curated Collections (68)
          </button>
          <button
            onClick={() => { onSelectTab('updates'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-sm font-semibold flex items-center gap-2.5 min-h-[44px] cursor-pointer transition-all ${
              currentTab === 'updates' ? 'mac-liquid-pill text-emerald-300 border-emerald-400/40 font-bold' : 'text-slate-300 hover:bg-white/[0.06]'
            }`}
          >
            <Clock className="w-4 h-4 text-cyan-400" />
            Recent Updates
          </button>
          <button
            onClick={() => { onSelectTab('leaderboard'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-sm font-semibold flex items-center gap-2.5 min-h-[44px] cursor-pointer transition-all ${
              currentTab === 'leaderboard' ? 'mac-liquid-pill text-emerald-300 border-emerald-400/40 font-bold' : 'text-slate-300 hover:bg-white/[0.06]'
            }`}
          >
            <Trophy className="w-4 h-4 text-yellow-400" />
            Community Leaderboard
          </button>
          <button
            onClick={() => { onSelectTab('requests'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-sm font-semibold flex items-center gap-2.5 min-h-[44px] cursor-pointer transition-all ${
              currentTab === 'requests' ? 'mac-liquid-pill text-emerald-300 border-emerald-400/40 font-bold' : 'text-slate-300 hover:bg-white/[0.06]'
            }`}
          >
            <MessageSquarePlus className="w-4 h-4 text-emerald-400" />
            Request Games
          </button>
          <button
            onClick={() => { onSelectTab('publishers'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-sm font-semibold flex items-center gap-2.5 min-h-[44px] cursor-pointer transition-all ${
              currentTab === 'publishers' ? 'mac-liquid-pill text-emerald-300 border-emerald-400/40 font-bold' : 'text-slate-300 hover:bg-white/[0.06]'
            }`}
          >
            <Building2 className="w-4 h-4 text-indigo-400" />
            Publishers Directory
          </button>
          <button
            onClick={() => { onSelectTab('faq'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-sm font-semibold flex items-center gap-2.5 min-h-[44px] cursor-pointer transition-all ${
              currentTab === 'faq' ? 'mac-liquid-pill text-emerald-300 border-emerald-400/40 font-bold' : 'text-slate-300 hover:bg-white/[0.06]'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            FAQ & Installation Guide
          </button>
          <button
            onClick={() => { onOpenDonate(); setMobileMenuOpen(false); }}
            className="w-full text-left px-3.5 py-2.5 rounded-2xl text-sm font-semibold flex items-center gap-2.5 text-pink-300 mac-liquid-pill border-pink-400/30 min-h-[44px] cursor-pointer"
          >
            <Heart className="w-4 h-4 fill-pink-400/30" />
            Donate & Support Mirrors
          </button>

          <div className="pt-3 border-t border-white/[0.08]">
            <div className="text-xs font-bold uppercase text-slate-400 px-3 py-1">
              Top Categories
            </div>
            <div className="grid grid-cols-2 gap-1.5 px-1 pt-1">
              {CATEGORIES_DATA.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleGenreClick(cat.name)}
                  className={`text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 transition-colors min-h-[40px] cursor-pointer ${
                    selectedGenre?.toLowerCase() === cat.name.toLowerCase()
                      ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                      : 'text-slate-300 hover:bg-white/[0.08] mac-liquid-subtle'
                  }`}
                >
                  <CategoryIcon name={cat.iconName} className="w-3.5 h-3.5 opacity-80 shrink-0 text-emerald-400" />
                  <span className="truncate">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

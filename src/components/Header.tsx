import React, { useState } from 'react';
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
  Bot
} from 'lucide-react';
import { ViewTab } from '../types';
import { CATEGORIES_DATA } from '../data/categoriesData';
import { BrandLogo } from './BrandLogo';
import { CategoryIcon } from './CategoryIcon';

interface HeaderProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  onSelectGenre: (genre: string) => void;
  onOpenSearch: () => void;
  onOpenGuide: () => void;
  onOpenAccount: () => void;
  onOpenDonate: () => void;
  onOpenAiAssistant?: () => void;
  bookmarksCount: number;
  selectedGenre: string | null;
  isLoggedIn: boolean;
  username: string;
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
  bookmarksCount,
  selectedGenre,
  isLoggedIn,
  username,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState({ code: 'EN', name: 'English', flag: '🇺🇸' });

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
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080c14]/95 backdrop-blur-md">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-cyan-950/90 border-b border-emerald-900/30 px-4 py-1 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
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
              className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 font-medium transition-colors"
            >
              <Download className="w-3 h-3" />
              Installation Guide
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={onOpenDonate}
              className="text-pink-400 hover:text-pink-300 hover:underline flex items-center gap-1 font-semibold transition-colors"
            >
              <Heart className="w-3 h-3 fill-pink-500/30" />
              Donate
            </button>
            <span className="text-slate-600">|</span>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
              >
                <span>{currentLang.flag}</span>
                <span className="font-mono font-bold text-[10px]">{currentLang.code}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {langDropdownOpen && (
                <div
                  className="absolute right-0 mt-1 w-32 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-1 z-50 animate-in fade-in"
                  onMouseLeave={() => setLangDropdownOpen(false)}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLang(lang);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-colors ${
                        currentLang.code === lang.code
                          ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
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
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                currentTab === 'home' && !selectedGenre
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Flame className="w-4 h-4 text-emerald-400" />
              Browse Games
            </button>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setGenreDropdownOpen(!genreDropdownOpen)}
                className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                  selectedGenre
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>Genres</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${genreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {genreDropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-72 max-h-[460px] overflow-y-auto custom-scrollbar rounded-xl bg-[#0f172a] border border-slate-700 shadow-2xl p-2 grid grid-cols-1 gap-1 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setGenreDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 mb-1 flex items-center justify-between">
                    <span>Explore Categories</span>
                    <span className="text-[10px] text-slate-500 font-mono">{CATEGORIES_DATA.length} Genres</span>
                  </div>
                  {CATEGORIES_DATA.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleGenreClick(cat.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        selectedGenre?.toLowerCase() === cat.name.toLowerCase()
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <CategoryIcon name={cat.iconName} className="w-3.5 h-3.5 text-emerald-400/80" />
                        <span>{cat.name}</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono bg-slate-900/80 px-1.5 py-0.5 rounded">
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
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                currentTab === 'trending'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Trending
            </button>

            {/* Collections */}
            <button
              onClick={() => onSelectTab('collections')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                currentTab === 'collections'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4 text-purple-400" />
              Collections
              <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono">
                68
              </span>
            </button>

            {/* Recent Updates */}
            <button
              onClick={() => onSelectTab('updates')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                currentTab === 'updates'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Clock className="w-4 h-4 text-cyan-400" />
              Recent Updates
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </button>

            {/* Leaderboard */}
            <button
              onClick={() => onSelectTab('leaderboard')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                currentTab === 'leaderboard'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Trophy className="w-4 h-4 text-yellow-400" />
              Leaderboard
            </button>

            {/* Requests */}
            <button
              onClick={() => onSelectTab('requests')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                currentTab === 'requests'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MessageSquarePlus className="w-4 h-4 text-emerald-400" />
              Request
            </button>

            {/* Publishers */}
            <button
              onClick={() => onSelectTab('publishers')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                currentTab === 'publishers'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="w-4 h-4 text-indigo-400" />
              Publishers
            </button>

            {/* FAQ */}
            <button
              onClick={() => onSelectTab('faq')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                currentTab === 'faq'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
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
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-cyan-500/15 border border-emerald-500/30 text-emerald-300 hover:text-white hover:border-emerald-400 transition-all flex items-center gap-1.5 font-bold shadow-sm"
              >
                <Bot className="w-4 h-4 text-emerald-400" />
                <span>AI Support</span>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-emerald-300 text-[9px] uppercase tracking-wider font-extrabold">
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
                title="Open alsabithal AI Assistant (PC Specs & Error Help)"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600/20 to-teal-600/20 hover:from-emerald-600/30 hover:to-teal-600/30 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-bold transition-all shadow-sm"
              >
                <Bot className="w-4 h-4 text-emerald-400" />
                <span className="hidden md:inline">Ask AI</span>
              </button>
            )}

            {/* Instant Search Bar Button */}
            <button
              onClick={onOpenSearch}
              id="search-trigger-button"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-400 hover:border-emerald-500/50 hover:text-slate-200 transition-all text-xs font-medium group"
              title="Search games by title or Steam App ID (Ctrl+K or /)"
            >
              <Search className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
              <span className="hidden sm:inline">Search games or Steam ID...</span>
              <kbd className="hidden md:inline-block bg-slate-800 text-[10px] text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
                /
              </kbd>
            </button>

            {/* Bookmarks / Saved Library */}
            <button
              onClick={() => onSelectTab('bookmarks')}
              className={`relative p-2 rounded-lg border transition-all ${
                currentTab === 'bookmarks'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:text-amber-400 hover:border-amber-500/30'
              }`}
              title="My Saved Games"
              id="bookmarks-button"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarksCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 text-slate-950 text-[10px] font-extrabold rounded-full flex items-center justify-center shadow">
                  {bookmarksCount}
                </span>
              )}
            </button>

            {/* Donate Quick Button */}
            <button
              onClick={onOpenDonate}
              title="Support Server Costs"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20 text-pink-400 text-xs font-semibold transition-colors"
            >
              <Heart className="w-3.5 h-3.5 fill-pink-500/30" />
              <span>Donate</span>
            </button>

            {/* Account / User Button */}
            <button
              onClick={onOpenAccount}
              id="account-button"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-emerald-500/40 text-xs font-semibold text-slate-200 transition-all"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">
                {isLoggedIn ? username : 'Account'}
              </span>
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 xl:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-800 bg-[#0c121e] px-4 pt-3 pb-6 space-y-2 max-h-[85vh] overflow-y-auto">
          {onOpenAiAssistant && (
            <button
              onClick={() => { onOpenAiAssistant(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-extrabold flex items-center justify-between bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-emerald-400" />
                <span>alsabithal AI Assistant</span>
              </div>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                Ask Anything
              </span>
            </button>
          )}

          <button
            onClick={() => { onSelectTab('home'); onSelectGenre(''); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
              currentTab === 'home' && !selectedGenre ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300'
            }`}
          >
            <Flame className="w-4 h-4 text-emerald-400" />
            Browse All Games
          </button>
          <button
            onClick={() => { onSelectTab('trending'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
              currentTab === 'trending' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-amber-400" />
            Trending Games
          </button>
          <button
            onClick={() => { onSelectTab('collections'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
              currentTab === 'collections' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-400" />
            Curated Collections (68)
          </button>
          <button
            onClick={() => { onSelectTab('updates'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
              currentTab === 'updates' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300'
            }`}
          >
            <Clock className="w-4 h-4 text-cyan-400" />
            Recent Updates
          </button>
          <button
            onClick={() => { onSelectTab('leaderboard'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
              currentTab === 'leaderboard' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300'
            }`}
          >
            <Trophy className="w-4 h-4 text-yellow-400" />
            Community Leaderboard
          </button>
          <button
            onClick={() => { onSelectTab('requests'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
              currentTab === 'requests' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300'
            }`}
          >
            <MessageSquarePlus className="w-4 h-4 text-emerald-400" />
            Request Games
          </button>
          <button
            onClick={() => { onSelectTab('publishers'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
              currentTab === 'publishers' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300'
            }`}
          >
            <Building2 className="w-4 h-4 text-indigo-400" />
            Publishers Directory
          </button>
          <button
            onClick={() => { onSelectTab('faq'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
              currentTab === 'faq' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            FAQ & Installation Guide
          </button>
          <button
            onClick={() => { onOpenDonate(); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 text-pink-400 bg-pink-500/10 border border-pink-500/30"
          >
            <Heart className="w-4 h-4 fill-pink-500/30" />
            Donate & Support Mirrors
          </button>

          <div className="pt-2 border-t border-slate-800">
            <div className="text-xs font-bold uppercase text-slate-500 px-3 py-1">
              Top Categories
            </div>
            <div className="grid grid-cols-2 gap-1.5 px-1">
              {CATEGORIES_DATA.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleGenreClick(cat.name)}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-colors ${
                    selectedGenre?.toLowerCase() === cat.name.toLowerCase()
                      ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <CategoryIcon name={cat.iconName} className="w-3.5 h-3.5 opacity-70 shrink-0 text-emerald-400" />
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

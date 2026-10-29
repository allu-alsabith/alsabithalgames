import React from 'react';
import { Flame, TrendingUp, Search, Calendar, Bookmark, Bot, Menu, Sparkles } from 'lucide-react';
import { ViewTab } from '../types';

interface MobileBottomNavProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  onOpenSearch: () => void;
  bookmarksCount: number;
  onToggleMobileDrawer: () => void;
  isMobileDrawerOpen: boolean;
  onOpenAiAssistant?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenSearch,
  bookmarksCount,
  onToggleMobileDrawer,
  isMobileDrawerOpen,
  onOpenAiAssistant,
}) => {
  return (
    <div 
      id="mobile-bottom-navigation"
      className="md:hidden fixed bottom-3 left-3 right-3 z-40 mac-liquid-glass rounded-3xl shadow-[0_16px_48px_rgba(0,0,0,0.75),inset_0_1px_1px_rgba(255,255,255,0.25)] border border-white/[0.14] px-2 py-1 select-none"
      style={{ paddingBottom: 'max(0.35rem, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* Home / Browse */}
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1 rounded-xl transition-all active:scale-95 ${
            currentTab === 'home'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Flame className={`w-5 h-5 ${currentTab === 'home' ? 'text-emerald-400 stroke-[2.5]' : ''}`} />
            {currentTab === 'home' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Browse</span>
        </button>

        {/* Trending */}
        <button
          type="button"
          onClick={() => onSelectTab('trending')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1 rounded-xl transition-all active:scale-95 ${
            currentTab === 'trending'
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <TrendingUp className={`w-5 h-5 ${currentTab === 'trending' ? 'text-amber-400 stroke-[2.5]' : ''}`} />
            {currentTab === 'trending' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Trending</span>
        </button>

        {/* Center Prominent Search Button */}
        <button
          type="button"
          onClick={onOpenSearch}
          id="mobile-search-nav-btn"
          aria-label="Search games"
          className="flex flex-col items-center justify-center -mt-3.5 group active:scale-90 transition-transform"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)] border-2 border-slate-900 group-hover:from-emerald-500 group-hover:to-teal-400">
            <Search className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-bold text-emerald-400 mt-0.5">Search</span>
        </button>

        {/* Coming Soon */}
        <button
          type="button"
          onClick={() => onSelectTab('coming-soon')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1 rounded-xl transition-all active:scale-95 ${
            currentTab === 'coming-soon'
              ? 'text-teal-300 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Calendar className={`w-5 h-5 ${currentTab === 'coming-soon' ? 'text-teal-300 stroke-[2.5]' : ''}`} />
            <span className="absolute -top-1 -right-2 bg-teal-500/30 text-teal-300 border border-teal-400/40 text-[8px] font-black px-1 rounded-full">
              17
            </span>
            {currentTab === 'coming-soon' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-teal-400 rounded-full shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Soon</span>
        </button>

        {/* Saved Games / Library */}
        <button
          type="button"
          onClick={() => onSelectTab('bookmarks')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1 rounded-xl transition-all active:scale-95 ${
            currentTab === 'bookmarks'
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Bookmark className={`w-5 h-5 ${currentTab === 'bookmarks' ? 'text-amber-400 fill-amber-400/30' : ''}`} />
            {bookmarksCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-500 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                {bookmarksCount > 99 ? '99+' : bookmarksCount}
              </span>
            )}
            {currentTab === 'bookmarks' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Saved</span>
        </button>

        {/* More / Menu */}
        <button
          type="button"
          onClick={onToggleMobileDrawer}
          aria-label="More navigation options"
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[48px] py-1 px-1 rounded-xl transition-all active:scale-95 ${
            isMobileDrawerOpen
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Menu className={`w-5 h-5 ${isMobileDrawerOpen ? 'text-emerald-400' : ''}`} />
            {isMobileDrawerOpen && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">More</span>
        </button>
      </div>
    </div>
  );
};

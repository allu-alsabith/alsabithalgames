import React from 'react';
import { Anchor, ShieldCheck, Heart, ExternalLink, FileText, HelpCircle, Mail, MessageSquare, Bot, Sparkles } from 'lucide-react';
import { ViewTab } from '../types';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onSelectTab: (tab: ViewTab) => void;
  onOpenDmca: () => void;
  onOpenGuide: () => void;
  onOpenAiAssistant?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenDmca,
  onOpenGuide,
  onOpenAiAssistant,
}) => {
  return (
    <footer className="border-t border-white/[0.08] mac-liquid-glass text-slate-400 text-sm mt-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="md" showSubtitle={false} />
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              The premier platform for pre-installed, portable PC games. Direct downloads from top-tier cloud mirrors with unthrottled speeds and verified clean files.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mac-liquid-pill text-emerald-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Microsoft Defender Tested
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mac-liquid-pill text-cyan-300 text-xs font-semibold">
                Portable / No Installers
              </div>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectTab('home')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  All PC Games
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('updates')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Recent Updates</span>
                  <span className="text-[10px] px-1 py-0.2 bg-cyan-500/20 text-cyan-400 rounded">
                    7 Days
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('coming-soon')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Coming Soon</span>
                  <span className="text-[10px] px-1 py-0.2 bg-teal-500/20 text-teal-300 rounded font-semibold">
                    New
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('requests')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Request Games
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('publishers')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Publishers Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('bookmarks')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  My Saved Games
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Support & Guides */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Guides & Support
            </h4>
            <ul className="space-y-2 text-xs">
              {onOpenAiAssistant && (
                <li>
                  <button
                    onClick={onOpenAiAssistant}
                    className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5 font-bold"
                  >
                    <Bot className="w-3.5 h-3.5 text-emerald-400" />
                    <span>alsabithal AI Assistant</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                      Gemini
                    </span>
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={onOpenGuide}
                  className="hover:text-emerald-400 transition-colors"
                >
                  How to Download & Run
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('faq')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('faq')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Antivirus False Positives
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('faq')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Multiplayer Online Fix Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('faq')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Visual C++ & DirectX Fixes
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Policy */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Legal & Community
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenDmca}
                  className="hover:text-emerald-400 transition-colors text-slate-300 font-medium flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  DMCA Compliance
                </button>
              </li>
              <li>
                <span className="text-slate-500">Official Contact:</span>
                <a
                  href="mailto:amhereitsmeal@gmail.com"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors font-mono text-[11px] block mt-0.5"
                >
                  amhereitsmeal@gmail.com
                </a>
              </li>
              <li className="pt-2">
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5865F2]/20 hover:bg-[#5865F2]/30 text-[#5865F2] hover:text-white border border-[#5865F2]/40 transition-colors font-medium text-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Join Discord Community
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer section */}
        <div className="pt-8 border-t border-slate-800/80 text-[11px] text-slate-500 space-y-2">
          <p className="leading-relaxed">
            <strong className="text-slate-400">Legal Disclaimer:</strong> alsabithalgames is not affiliated with, endorsed by, or sponsored by Steam or Valve Corporation. All trademarks, registered trademarks, product names, screenshots, and company names mentioned herein are the property of their respective owners. alsabithalgames indexes and mirrors pre-installed software for archival and educational compatibility purposes. We respect intellectual property rights and respond promptly to verifiable DMCA takedown notices sent to our designated agent.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-900 text-slate-500 text-xs">
            <div>
              © 2026 <span className="text-slate-400">alsabithalgames</span> — All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-xs">
              <button onClick={onOpenDmca} className="hover:text-slate-300">
                DMCA Policy
              </button>
              <span>•</span>
              <button onClick={() => onSelectTab('faq')} className="hover:text-slate-300">
                Privacy & Safety
              </button>
              <span>•</span>
              <span className="text-slate-600 font-mono">100% Clean Portable Archive</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

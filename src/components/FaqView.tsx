import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ShieldCheck, Download, Users, Terminal, MessageSquare, ExternalLink, Mail } from 'lucide-react';
import { FAQ_DATA } from '../data/faqData';
import { FaqItem } from '../types';

interface FaqViewProps {
  onOpenGuide: () => void;
}

export const FaqView: React.FC<FaqViewProps> = ({ onOpenGuide }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'download', label: 'Downloading & Extracting' },
    { id: 'antivirus', label: 'Antivirus & Safety' },
    { id: 'troubleshooting', label: 'Troubleshooting & Errors' },
    { id: 'multiplayer', label: 'Multiplayer & Online-Fix' },
    { id: 'general', label: 'General & Requests' },
  ];

  const filteredFaqs = selectedCategory === 'all'
    ? FAQ_DATA
    : FAQ_DATA.filter((item) => item.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-6 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              <HelpCircle className="w-3.5 h-3.5" />
              Official Documentation & Support
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions (FAQ)
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Find solutions to common questions regarding game downloads, extraction steps, Windows Defender false positives, save files, language changes, and multiplayer fixes.
            </p>
          </div>

          <button
            onClick={onOpenGuide}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-colors shrink-0"
          >
            <Download className="w-4 h-4" />
            Quick Install Guide
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = openFaqId === faq.id;

          return (
            <div
              key={faq.id}
              className={`rounded-xl border transition-all overflow-hidden ${
                isOpen
                  ? 'bg-slate-900/95 border-emerald-500/40 shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <button
                onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-emerald-400 transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-emerald-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 space-y-3">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Community Help Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#5865F2]/20 to-slate-900 border border-[#5865F2]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            <MessageSquare className="w-5 h-5 text-[#5865F2]" />
            Still need help with a game or error?
          </h3>
          <p className="text-xs text-slate-300">
            Join the official alsabithal Games Discord server. Our community moderators and uploaders are ready to assist!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <a
            href="mailto:amhereitsmeal@gmail.com"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-emerald-500 font-bold text-xs transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-emerald-400" />
            <span>amhereitsmeal@gmail.com</span>
          </a>
          <a
            href="https://discord.com"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-xs shadow-lg transition-colors"
          >
            <span>Open Discord</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

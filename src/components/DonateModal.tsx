import React, { useState } from 'react';
import { X, Heart, Copy, Check, ShieldCheck, Zap, HardDrive, Coffee } from 'lucide-react';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonateModal: React.FC<DonateModalProps> = ({ isOpen, onClose }) => {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  if (!isOpen) return null;

  const cryptoWallets = [
    {
      coin: 'Bitcoin (BTC)',
      network: 'BTC Native',
      address: 'bc1qalsabithalgames99x82jf002k2991z0093847aa',
      iconColor: 'text-amber-400',
    },
    {
      coin: 'USDT (Tether)',
      network: 'TRC20 (Tron)',
      address: 'TRX778AlsabithalGamesNetSpeedCloud99182347',
      iconColor: 'text-emerald-400',
    },
    {
      coin: 'Monero (XMR)',
      network: 'XMR Private',
      address: '888tNkAlsabithalGamesPrivMirrorXMR98234190823470123948710293',
      iconColor: 'text-orange-400',
    },
  ];

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg mac-liquid-glass border border-white/[0.14] rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.85)] overflow-hidden p-6 text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full mac-dot-red inline-block cursor-pointer" onClick={onClose} />
            <span className="w-3 h-3 rounded-full mac-dot-yellow inline-block" />
            <span className="w-3 h-3 rounded-full mac-dot-green inline-block" />
            <span className="ml-2 text-xs font-mono text-slate-400">Support Community</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl mac-liquid-pill text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-300 shadow-sm">
            <Heart className="w-5 h-5 fill-pink-500/30" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Support alsabithalgames</h2>
            <p className="text-xs text-slate-400">Help maintain free, high-speed unthrottled mirrors</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          <p className="leading-relaxed">
            alsabithalgames is 100% free and community supported. We do not use intrusive popups, miners, or malicious adware. All donations go directly into:
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl mac-liquid-subtle flex items-start gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white font-semibold">1 Gbps+ Mirrors</strong>
                <span className="text-[11px] text-slate-400">Buzzheavier & Gofile hosting</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl mac-liquid-subtle flex items-start gap-2">
              <HardDrive className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white font-semibold">Over 150 TB</strong>
                <span className="text-[11px] text-slate-400">Storage array redundancy</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Cryptocurrency Addresses
            </h3>
            <div className="space-y-2">
              {cryptoWallets.map((wallet) => (
                <div
                  key={wallet.coin}
                  className="p-3 rounded-2xl mac-liquid-subtle space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={`font-bold ${wallet.iconColor}`}>{wallet.coin}</span>
                    <span className="text-slate-400 font-mono text-[10px]">{wallet.network}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-[10px] text-slate-300 font-mono truncate">
                      {wallet.address}
                    </code>
                    <button
                      onClick={() => handleCopy(wallet.address)}
                      className="px-3 py-1 rounded-xl mac-liquid-pill text-slate-200 hover:text-white font-mono text-[10px] font-bold flex items-center gap-1 shrink-0 transition-all cursor-pointer"
                    >
                      {copiedAddress === wallet.address ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.08] text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Supporters receive permanent Diamond Contributor badge
            </span>
            <a
              href="mailto:amhereitsmeal@gmail.com"
              className="text-slate-400 hover:text-emerald-400 transition-colors font-mono"
            >
              Contact: amhereitsmeal@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

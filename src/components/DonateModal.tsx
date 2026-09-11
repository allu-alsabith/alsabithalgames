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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#0d131f] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
            <Heart className="w-5 h-5 fill-pink-500/30" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Support alsabithal Games</h2>
            <p className="text-xs text-slate-400">Help maintain free, high-speed unthrottled mirrors</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          <p className="leading-relaxed">
            alsabithal Games is 100% free and community supported. We do not use intrusive popups, miners, or malicious adware. All donations go directly into:
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-200 font-semibold">1 Gbps+ Mirrors</strong>
                <span className="text-[11px] text-slate-500">Buzzheavier & Gofile hosting</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2">
              <HardDrive className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-200 font-semibold">Over 150 TB</strong>
                <span className="text-[11px] text-slate-500">Storage array redundancy</span>
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
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={`font-bold ${wallet.iconColor}`}>{wallet.coin}</span>
                    <span className="text-slate-500 font-mono text-[10px]">{wallet.network}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-[10px] text-slate-400 font-mono truncate">
                      {wallet.address}
                    </code>
                    <button
                      onClick={() => handleCopy(wallet.address)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-[10px] font-bold flex items-center gap-1 shrink-0 transition-colors"
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

          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 text-[11px] text-slate-400">
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

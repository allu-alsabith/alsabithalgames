import React from 'react';
import { Keyboard, X, Command } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '/', desc: 'Open instant game search bar' },
    { key: 'Ctrl + K', desc: 'Alternative search shortcut' },
    { key: 'Esc', desc: 'Close any active modal or menu' },
    { key: 'R', desc: 'Random game picker (Surprise Me)' },
    { key: 'B', desc: 'Jump to My Saved Games Library' },
    { key: 'H', desc: 'Return to Browse / Home catalogue' },
    { key: 'T', desc: 'View Trending games' },
    { key: '?', desc: 'Open this Keyboard Shortcuts cheat-sheet' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md mac-liquid-glass rounded-3xl shadow-[0_24px_60px_rgba(0,0,0,0.85)] p-6 space-y-4 border border-white/[0.14]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl mac-liquid-accent flex items-center justify-center text-white">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Keyboard Shortcuts</h3>
              <p className="text-xs text-slate-400">Fast navigation for PC gamers</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full mac-dot-red inline-block cursor-pointer" onClick={onClose} />
            <span className="w-3 h-3 rounded-full mac-dot-yellow inline-block" />
            <span className="w-3 h-3 rounded-full mac-dot-green inline-block" />
          </div>
        </div>

        <div className="space-y-2">
          {shortcuts.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between p-2.5 rounded-2xl mac-liquid-subtle text-xs"
            >
              <span className="text-slate-200 font-medium">{s.desc}</span>
              <kbd className="px-2.5 py-1 rounded-xl mac-liquid-pill font-mono text-[11px] font-bold text-emerald-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl mac-liquid-pill hover:mac-liquid-accent text-slate-200 hover:text-white text-xs font-semibold transition-all cursor-pointer"
          >
            Got it, close
          </button>
        </div>
      </div>
    </div>
  );
};

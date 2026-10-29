import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Bookmark, Copy, Sparkles, X, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'bookmark' | 'copy';
  title: string;
  description?: string;
}

interface ToastNotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toasts, onDismiss }) => {
  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((t) =>
      setTimeout(() => {
        onDismiss(t.id);
      }, 3500)
    );
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div 
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            role="alert"
            className="pointer-events-auto rounded-2xl p-3.5 mac-liquid-glass text-slate-100 shadow-[0_16px_40px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.3)] border border-white/[0.14] flex items-start gap-3 animate-in slide-in-from-bottom-5 fade-in duration-200 transition-all"
          >
            {/* Icon */}
            <div className="shrink-0 mt-0.5">
              {toast.type === 'bookmark' && (
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center shadow-sm">
                  <Bookmark className="w-4 h-4 fill-amber-400" />
                </div>
              )}
              {toast.type === 'copy' && (
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center shadow-sm">
                  <Copy className="w-4 h-4" />
                </div>
              )}
              {toast.type === 'success' && (
                <div className="w-8 h-8 rounded-xl mac-liquid-accent text-white flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
              {toast.type === 'info' && (
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center shadow-sm">
                  <Info className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono text-emerald-400/80 mb-0.5">
                <span>alsabithal</span>
                <span>•</span>
                <span>system</span>
              </div>
              <p className="text-xs font-bold text-white tracking-tight">{toast.title}</p>
              {toast.description && (
                <p className="text-[11px] text-slate-300/90 mt-0.5 line-clamp-2 leading-relaxed">
                  {toast.description}
                </p>
              )}
            </div>

            {/* Close */}
            <button
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              className="p-1 rounded-lg text-slate-400 hover:text-white mac-liquid-pill transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

import React, { useState } from 'react';
import { Bot, Sparkles, X, MessageSquareCode, Cpu, ShieldCheck } from 'lucide-react';
import { Game } from '../types';

interface AiAssistantWidgetProps {
  onOpen: () => void;
  activeGame?: Game | null;
}

export const AiAssistantWidget: React.FC<AiAssistantWidgetProps> = ({
  onOpen,
  activeGame,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [dismissedBubble, setDismissedBubble] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 select-none pointer-events-auto">
      {/* Speech bubble hint (auto-shows briefly or on hover) */}
      {!dismissedBubble && (
        <div className="relative group animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-xs">
          <div 
            onClick={onOpen}
            className="cursor-pointer bg-slate-900/95 backdrop-blur-md border border-emerald-500/40 rounded-2xl p-3 shadow-2xl shadow-emerald-500/10 hover:border-emerald-400 transition-all flex items-start gap-2.5"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">
                  alsabithal AI Assistant
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDismissedBubble(true);
                  }}
                  className="text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {activeGame
                  ? `Need help with ${activeGame.title}? Check PC specs & fix errors.`
                  : 'Need help? Check if your PC can run games or fix install errors!'}
              </p>
            </div>
          </div>
          {/* Arrow */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-slate-900 border-r border-b border-emerald-500/40 transform rotate-45" />
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={onOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        id="ai-assistant-floating-button"
        title="Open alsabithal AI Assistant"
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-600/25 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all border border-emerald-300/40"
      >
        {/* Glow halo */}
        <span className="absolute -inset-0.5 rounded-2xl bg-emerald-400/30 blur-sm group-hover:bg-emerald-400/50 transition-all -z-10" />

        <div className="relative">
          <Bot className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-300 border-2 border-slate-950 animate-ping" />
        </div>

        <div className="flex flex-col items-start leading-tight">
          <span className="text-xs font-black tracking-wide text-slate-950 flex items-center gap-1">
            <span>AI ASSISTANT</span>
            <Sparkles className="w-3 h-3 text-slate-950" />
          </span>
          <span className="text-[10px] font-semibold text-emerald-950/80">
            {activeGame ? 'About This Game' : 'PC Specs & Support'}
          </span>
        </div>
      </button>
    </div>
  );
};

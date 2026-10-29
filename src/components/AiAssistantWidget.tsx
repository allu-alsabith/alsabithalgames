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
            className="cursor-pointer mac-liquid-glass rounded-2xl p-3.5 shadow-2xl border border-emerald-400/40 hover:border-emerald-400 transition-all flex items-start gap-2.5"
          >
            <div className="w-7 h-7 rounded-xl mac-liquid-accent flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300">
                  alsabithal AI Assistant
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDismissedBubble(true);
                  }}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">
                {activeGame
                  ? `Need help with ${activeGame.title}? Check PC specs & fix errors.`
                  : 'Need help? Check if your PC can run games or fix install errors!'}
              </p>
            </div>
          </div>
          {/* Arrow */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-[#0c1424] border-r border-b border-emerald-500/40 transform rotate-45" />
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={onOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        id="ai-assistant-floating-button"
        title="Open alsabithal AI Assistant"
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-2xl mac-liquid-accent text-white font-extrabold text-sm shadow-[0_12px_32px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-300 border-2 border-slate-950 animate-ping" />
        </div>

        <div className="flex flex-col items-start leading-tight">
          <span className="text-xs font-black tracking-wide text-white flex items-center gap-1">
            <span>AI ASSISTANT</span>
            <Sparkles className="w-3 h-3 text-emerald-200" />
          </span>
          <span className="text-[10px] font-semibold text-emerald-100/90">
            {activeGame ? 'About This Game' : 'PC Specs & Support'}
          </span>
        </div>
      </button>
    </div>
  );
};

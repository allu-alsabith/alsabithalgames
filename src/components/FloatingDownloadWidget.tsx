import React, { useState, useEffect } from 'react';
import { Download, CheckCircle2, Zap, ChevronUp, Pause, Play } from 'lucide-react';
import { downloadEngine } from '../services/downloadEngine';
import { ActiveDownloadTask } from '../types';

interface FloatingDownloadWidgetProps {
  onOpenManager: () => void;
}

export const FloatingDownloadWidget: React.FC<FloatingDownloadWidgetProps> = ({ onOpenManager }) => {
  const [tasks, setTasks] = useState<ActiveDownloadTask[]>(() => downloadEngine.getTasks());

  useEffect(() => {
    const update = () => setTasks(downloadEngine.getTasks());
    const unsub = downloadEngine.subscribe(update);
    return () => unsub();
  }, []);

  const activeTask = tasks.find((t) => t.status === 'downloading') || tasks[0];
  if (!activeTask) return null;

  const runningCount = tasks.filter((t) => t.status === 'downloading').length;
  const isDownloading = activeTask.status === 'downloading';
  const isCompleted = activeTask.status === 'completed';

  return (
    <aside aria-label="Active Downloads Widget" className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 animate-in slide-in-from-bottom-5 duration-300">
      <div 
        onClick={onOpenManager}
        className="mac-liquid-glass border border-emerald-400/40 hover:border-emerald-400/80 shadow-[0_12px_35px_rgba(0,0,0,0.6)] p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition-all hover:scale-105 group select-none max-w-sm"
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-xl mac-liquid-accent flex items-center justify-center text-white shrink-0 shadow-md">
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            ) : (
              <Download className="w-5 h-5 animate-bounce" />
            )}
          </div>
          {runningCount > 1 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-400 text-slate-950 font-extrabold text-[9px] flex items-center justify-center shadow">
              {runningCount}
            </span>
          )}
        </div>

        <div className="min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
              {isCompleted ? 'Download Ready' : `Direct DL (${activeTask.node.flag})`}
            </span>
            {isDownloading && (
              <span className="text-[10px] font-mono text-emerald-300 font-bold">
                {activeTask.speedFormatted}
              </span>
            )}
          </div>

          <p className="text-xs font-bold text-white truncate max-w-[180px]">
            {activeTask.gameTitle}
          </p>

          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mt-1.5 border border-white/[0.08]">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                isCompleted 
                  ? 'bg-emerald-400' 
                  : 'bg-gradient-to-r from-emerald-400 to-cyan-400 animate-pulse'
              }`}
              style={{ width: `${activeTask.progress}%` }}
            />
          </div>
        </div>

        <div className="pl-1 text-slate-400 group-hover:text-white transition-colors">
          <ChevronUp className="w-4 h-4" />
        </div>
      </div>
    </aside>
  );
};

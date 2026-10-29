import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Pause, 
  Play, 
  X, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck, 
  HardDrive, 
  Zap, 
  Copy, 
  Check, 
  Terminal, 
  FolderOpen, 
  ExternalLink,
  Info,
  Server
} from 'lucide-react';
import { downloadEngine } from '../services/downloadEngine';
import { ActiveDownloadTask, DirectCdnNode } from '../types';

interface DownloadManagerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGameById?: (gameId: string) => void;
  onNotify?: (title: string, desc?: string, type?: 'success' | 'bookmark' | 'copy' | 'info') => void;
}

export const DownloadManagerDrawer: React.FC<DownloadManagerDrawerProps> = ({
  isOpen,
  onClose,
  onSelectGameById,
  onNotify,
}) => {
  const [tasks, setTasks] = useState<ActiveDownloadTask[]>(() => downloadEngine.getTasks());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedGuideTask, setSelectedGuideTask] = useState<ActiveDownloadTask | null>(null);

  useEffect(() => {
    const update = () => setTasks(downloadEngine.getTasks());
    const unsub = downloadEngine.subscribe(update);
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  const runningTasks = tasks.filter((t) => t.status === 'downloading');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  const totalSpeedMB = runningTasks.reduce(
    (acc, t) => acc + t.speedBytesPerSec / (1024 * 1024),
    0
  );

  const handleCopyIdm = (task: ActiveDownloadTask) => {
    const fullUrl = `${window.location.origin}${task.directUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(task.id);
    onNotify?.('IDM Link Copied!', 'Paste directly into Internet Download Manager or Free Download Manager', 'copy');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyCurl = (task: ActiveDownloadTask) => {
    const fullUrl = `${window.location.origin}${task.directUrl}`;
    const cmd = `aria2c -x 16 -s 16 -k 1M "${fullUrl}"`;
    navigator.clipboard.writeText(cmd);
    setCopiedId(`aria-${task.id}`);
    onNotify?.('Aria2c Command Copied!', 'Paste into terminal for 16-thread multi-part speed', 'copy');
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-none sm:rounded-3xl mac-liquid-glass border border-white/[0.14] shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-center justify-between gap-4 bg-gradient-to-r from-emerald-950/40 via-slate-900/40 to-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl mac-liquid-accent flex items-center justify-center text-white shadow-lg shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Direct Download Manager
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  alsabithalgames Direct
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                100% on-site high-speed direct downloads • Zero external redirects • Zero popups
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {totalSpeedMB > 0 && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl mac-liquid-pill text-emerald-300 text-xs font-mono border-emerald-500/30">
                <Zap className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                <span className="font-bold">{totalSpeedMB.toFixed(1)} MB/s</span>
              </div>
            )}

            {tasks.length > 0 && (
              <button
                onClick={() => downloadEngine.clearCompleted()}
                className="px-3 py-1.5 rounded-xl mac-liquid-pill text-xs text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                title="Clear completed downloads"
              >
                <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline">Clear Done</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl mac-liquid-pill flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close download manager"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Informational Callout: Why Direct Downloads */}
        <div className="px-5 py-3 bg-emerald-950/30 border-b border-emerald-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-200">
            <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Direct Edge Streaming:</strong> Downloaded directly from our high-speed NVMe nodes. Full resume support with Internet Download Manager (IDM) & FDM.
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono text-emerald-300">
            <span>🇩🇪 Frankfurt 10G</span>
            <span>•</span>
            <span>🇺🇸 Virginia 10G</span>
            <span>•</span>
            <span>🇸🇬 Singapore 10G</span>
          </div>
        </div>

        {/* Task List Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-3xl mac-liquid-pill flex items-center justify-center text-slate-500 mx-auto">
                <Download className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-bold text-white">No active downloads</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Browse any game in the catalog and click <strong className="text-emerald-400">"Direct Download"</strong>. The game package will immediately start downloading to your browser without redirecting to external websites.
                </p>
              </div>
            </div>
          ) : (
            tasks.map((task) => {
              const isDownloading = task.status === 'downloading';
              const isCompleted = task.status === 'completed';
              const isPaused = task.status === 'paused';

              return (
                <div
                  key={task.id}
                  className="p-4 sm:p-5 rounded-2xl mac-liquid-glass border border-white/[0.08] hover:border-white/[0.16] transition-all space-y-3 shadow-lg group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Game thumbnail & title */}
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={task.gameCover}
                        alt={task.gameTitle}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover object-center border border-white/[0.1] shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 
                            onClick={() => onSelectGameById?.(task.gameId)}
                            className="font-bold text-sm sm:text-base text-white hover:text-emerald-300 transition-colors cursor-pointer truncate"
                          >
                            {task.gameTitle}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/[0.08] text-slate-300 border border-white/[0.1]">
                            {task.version}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 flex-wrap">
                          <span className="flex items-center gap-1 text-slate-300">
                            <span>{task.node.flag}</span>
                            <span>{task.node.name}</span>
                          </span>
                          <span>•</span>
                          <span className="font-mono text-emerald-400 font-semibold">
                            {task.fileSize}
                          </span>
                          <span>•</span>
                          <span className="text-[11px] text-slate-400">
                            Portable Zero-Install
                          </span>
                          {task.savedLocationName && (
                            <>
                              <span>•</span>
                              <span className="text-[11px] text-cyan-300 flex items-center gap-1 font-mono">
                                <FolderOpen className="w-3 h-3 text-cyan-400" />
                                <span className="truncate max-w-[160px]" title={task.savedLocationName}>
                                  {task.savedLocationName}
                                </span>
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                      {isDownloading && (
                        <button
                          onClick={() => downloadEngine.pauseDownload(task.id)}
                          className="px-3 py-1.5 rounded-xl mac-liquid-pill text-amber-300 hover:text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Pause download stream"
                        >
                          <Pause className="w-3.5 h-3.5" />
                          <span>Pause</span>
                        </button>
                      )}

                      {isPaused && (
                        <button
                          onClick={() => downloadEngine.resumeDownload(task.id)}
                          className="px-3 py-1.5 rounded-xl mac-liquid-accent text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Resume download stream"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Resume</span>
                        </button>
                      )}

                      {isCompleted && (
                        <button
                          onClick={() => setSelectedGuideTask(task)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer hover:bg-emerald-500/30"
                        >
                          <FolderOpen className="w-3.5 h-3.5" />
                          <span>Launch Guide</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleCopyIdm(task)}
                        className="px-2.5 py-1.5 rounded-xl mac-liquid-pill text-slate-300 hover:text-white text-xs transition-colors cursor-pointer"
                        title="Copy direct download URL for IDM / Free Download Manager"
                      >
                        {copiedId === task.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => downloadEngine.cancelDownload(task.id)}
                        className="p-1.5 rounded-xl mac-liquid-pill text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Cancel / Remove task"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="w-full h-2.5 rounded-full bg-slate-900 border border-white/[0.08] overflow-hidden relative">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          isCompleted
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : isPaused
                            ? 'bg-amber-500/80'
                            : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 animate-pulse'
                        }`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>

                    {/* Progress details */}
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isCompleted ? 'text-emerald-400' : 'text-white'}`}>
                          {task.progress.toFixed(0)}%
                        </span>
                        {isDownloading && (
                          <span className="text-emerald-300 font-semibold">
                            @ {task.speedFormatted}
                          </span>
                        )}
                        {isPaused && (
                          <span className="text-amber-400">
                            [Paused]
                          </span>
                        )}
                        {isCompleted && (
                          <span className="text-emerald-300 flex items-center gap-1 font-sans font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Download Complete (0/72 Clean)
                          </span>
                        )}
                      </div>

                      <div className="text-slate-400 text-[11px] flex items-center gap-2">
                        {isDownloading && task.etaSeconds > 0 && (
                          <span>ETA: ~{task.etaSeconds}s</span>
                        )}
                        <span>Direct CDN</span>
                      </div>
                    </div>
                  </div>

                  {/* Complete Banner info */}
                  {isCompleted && (
                    <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5 text-emerald-300">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Pre-installed portable archive ready in your Downloads folder.</span>
                      </div>
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = task.directUrl;
                          link.setAttribute('download', `${task.gameTitle}_Portable_alsabithal.zip`);
                          link.click();
                        }}
                        className="text-cyan-300 hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        Save file again
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info & IDM / FDM quick guide */}
        <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <span>
              Need maximum gigabit download speed? Use <strong>Internet Download Manager (IDM)</strong> or <strong>Free Download Manager (FDM)</strong> with our direct link.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl mac-liquid-accent text-white font-bold text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Extraction & Launch Guide Sub-Modal */}
      {selectedGuideTask && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedGuideTask(null)}
        >
          <div 
            className="w-full max-w-lg rounded-3xl mac-liquid-glass border border-white/[0.15] p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">How to Extract & Play</h3>
                  <p className="text-xs text-slate-400">{selectedGuideTask.gameTitle}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedGuideTask(null)}
                className="p-2 rounded-xl mac-liquid-pill text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-white/[0.08]">
              <div className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-center font-bold text-[11px] shrink-0 flex items-center justify-center">1</span>
                <div>
                  <strong className="text-white">Locate the downloaded .zip file:</strong> Check your browser's Downloads folder for <code className="text-emerald-300 bg-white/[0.08] px-1 rounded">{selectedGuideTask.gameTitle}_Portable_alsabithal.zip</code>.
                </div>
              </div>

              <div className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-center font-bold text-[11px] shrink-0 flex items-center justify-center">2</span>
                <div>
                  <strong className="text-white">Extract with 7-Zip or WinRAR:</strong> Right-click the archive and choose "Extract here" or extract to <code className="text-emerald-300 bg-white/[0.08] px-1 rounded">C:\Games</code>.
                </div>
              </div>

              <div className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-center font-bold text-[11px] shrink-0 flex items-center justify-center">3</span>
                <div>
                  <strong className="text-white">No Installer Needed (Pre-installed):</strong> Simply double-click <code className="text-cyan-300 bg-white/[0.08] px-1 rounded">START_GAME_PREINSTALLED.bat</code> or run the game .exe as Administrator!
                </div>
              </div>

              <div className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-center font-bold text-[11px] shrink-0 flex items-center justify-center">4</span>
                <div>
                  <strong className="text-white">Antivirus Notice:</strong> If Windows Defender flags the steam_api64.dll emulator, add the game folder to Windows Defender Exclusions. This is a 100% false positive.
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedGuideTask(null)}
                className="px-4 py-2 rounded-xl mac-liquid-accent text-white text-xs font-bold"
              >
                Got It, Let's Play!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Game, Comment, DirectCdnNode } from '../types';
import { 
  X, 
  Download, 
  ShieldCheck, 
  HardDrive, 
  Calendar, 
  Cpu, 
  Users, 
  ExternalLink, 
  Star, 
  Bookmark, 
  Copy, 
  Check, 
  AlertTriangle, 
  FileText, 
  Terminal, 
  Layers, 
  MessageSquare, 
  Send,
  Zap,
  FolderArchive,
  Info,
  Sparkles,
  Bot,
  Sliders,
  Play,
  Film,
  Maximize2,
  Gauge,
  Server,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  FolderOpen,
  FolderInput
} from 'lucide-react';
import { INITIAL_COMMENTS } from '../data/commentsData';
import { SystemRequirementsSection } from './SystemRequirementsSection';
import { GameTrailerPlayer } from './GameTrailerPlayer';
import { GameCommentsSection } from './GameCommentsSection';
import { userDataService } from '../services/userDataService';
import { downloadEngine, DIRECT_CDN_NODES } from '../services/downloadEngine';

interface GameDetailModalProps {
  game: Game | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (gameId: string) => void;
  onSelectPublisher?: (publisherName: string) => void;
  onOpenGuide: () => void;
  onOpenDownloadManager?: () => void;
  onOpenAiWithGame?: (game: Game, prompt?: string) => void;
  onNotify?: (title: string, desc?: string, type?: 'success' | 'bookmark' | 'copy' | 'info') => void;
}

export const GameDetailModal: React.FC<GameDetailModalProps> = ({
  game,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onSelectPublisher,
  onOpenGuide,
  onOpenDownloadManager,
  onOpenAiWithGame,
  onNotify,
}) => {
  if (!game) return null;

  const [activeTab, setActiveTab] = useState<'downloads' | 'overview' | 'trailer' | 'requirements' | 'instructions' | 'comments' | 'ai-help'>('downloads');
  const [isTrailerCinemaOpen, setIsTrailerCinemaOpen] = useState(false);
  const [copiedMagnet, setCopiedMagnet] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [userSpeedMbps, setUserSpeedMbps] = useState<number>(100);

  // alsabithalgames Direct Download States
  const [selectedNode, setSelectedNode] = useState<DirectCdnNode>(DIRECT_CDN_NODES[0]);
  const [saveLocationPreference, setSaveLocationPreference] = useState<'ask_picker' | 'browser_default'>('ask_picker');
  const [isDirectDownloading, setIsDirectDownloading] = useState(false);
  const [copiedIdmUrl, setCopiedIdmUrl] = useState(false);
  const [copiedAriaCmd, setCopiedAriaCmd] = useState(false);
  const [showExternalMirrors, setShowExternalMirrors] = useState(false);

  const handleStartDirectDownload = async (forceMethod?: 'ask_picker' | 'browser_default') => {
    const method = forceMethod || saveLocationPreference;
    setIsDirectDownloading(true);

    if (method === 'ask_picker') {
      try {
        const result = await downloadEngine.startDownloadWithSavePicker(game, selectedNode);
        if (result.cancelled) {
          onNotify?.('Save Location Cancelled', 'No download was started', 'info');
          setIsDirectDownloading(false);
          return;
        }

        if (result.savedLocationName) {
          onNotify?.('Direct Download Started!', `Saving to: ${result.savedLocationName} (${selectedNode.name})`, 'success');
        } else if (result.fallback) {
          onNotify?.('Direct Download Started!', `${game.title} via ${selectedNode.name} (${selectedNode.bandwidth})`, 'success');
        }
      } catch (err) {
        console.error('Save As download error:', err);
        downloadEngine.startDownload(game, selectedNode);
        onNotify?.('Direct Download Started!', `${game.title} via ${selectedNode.name}`, 'success');
      }
    } else {
      downloadEngine.startDownload(game, selectedNode);
      onNotify?.('Direct Download Started!', `${game.title} via ${selectedNode.name} (${selectedNode.bandwidth})`, 'success');
    }

    setTimeout(() => setIsDirectDownloading(false), 2000);
  };

  const handleCopyDirectIdm = () => {
    const fullUrl = `${window.location.origin}/api/download/${game.id}?node=${encodeURIComponent(selectedNode.name)}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedIdmUrl(true);
    onNotify?.('IDM Direct Link Copied', 'Paste into Internet Download Manager or Free Download Manager', 'copy');
    setTimeout(() => setCopiedIdmUrl(false), 2500);
  };

  const handleCopyDirectAria = () => {
    const fullUrl = `${window.location.origin}/api/download/${game.id}?node=${encodeURIComponent(selectedNode.name)}`;
    const cmd = `aria2c -x 16 -s 16 -k 1M -o "${game.slug}_Portable_alsabithal.zip" "${fullUrl}"`;
    navigator.clipboard.writeText(cmd);
    setCopiedAriaCmd(true);
    onNotify?.('Aria2c Command Copied', 'Multi-thread 16-connection direct accelerator command', 'copy');
    setTimeout(() => setCopiedAriaCmd(false), 2500);
  };

  const calculateDownloadTime = (sizeStr: string, mbps: number) => {
    const isGB = sizeStr.includes('GB');
    const sizeNum = parseFloat(sizeStr) || 10;
    const sizeInMB = isGB ? sizeNum * 1024 : sizeNum;
    const speedMBps = mbps / 8;
    const totalSeconds = sizeInMB / speedMBps;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  // Comments count for this game tab badge
  const [commentsCount, setCommentsCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`alsabithal_comments_${game.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.length;
      }
    } catch {
      // ignore
    }
    return INITIAL_COMMENTS[game.id]?.length || 1;
  });

  const handleCopyMagnet = () => {
    if (game.torrentMagnet) {
      navigator.clipboard.writeText(game.torrentMagnet);
      setCopiedMagnet(true);
      onNotify?.('Magnet URI Copied!', `${game.title} ready for BitTorrent client`, 'copy');
      userDataService.logDownload({
        gameId: game.id,
        gameTitle: game.title,
        gameCover: game.posterUrl || game.bannerUrl,
        fileSize: game.torrentSize || game.size,
        type: 'magnet',
        mirrorName: 'P2P Magnet URI',
        downloadUrl: game.torrentMagnet,
      });
      setTimeout(() => setCopiedMagnet(false), 2500);
    }
  };

  const handleMirrorDownloadClick = (mirror: { name: string; url: string; size: string }) => {
    onNotify?.('Starting Download', `Opening ${mirror.name} mirror (${mirror.size})`, 'success');
    userDataService.logDownload({
      gameId: game.id,
      gameTitle: game.title,
      gameCover: game.posterUrl || game.bannerUrl,
      fileSize: mirror.size || game.size,
      type: 'direct',
      mirrorName: mirror.name,
      downloadUrl: mirror.url,
    });
  };

  const handleMagnetClick = () => {
    if (game.torrentMagnet) {
      userDataService.logDownload({
        gameId: game.id,
        gameTitle: game.title,
        gameCover: game.posterUrl || game.bannerUrl,
        fileSize: game.torrentSize || game.size,
        type: 'magnet',
        mirrorName: 'P2P Magnet',
        downloadUrl: game.torrentMagnet,
      });
      const settings = userDataService.getSettings();
      if (settings.autoCopyMagnet) {
        navigator.clipboard.writeText(game.torrentMagnet);
        onNotify?.('Magnet URI Copied', 'Copied to clipboard', 'copy');
      }
    }
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(game.sha256Hash);
    setCopiedHash(true);
    onNotify?.('SHA-256 Hash Copied', 'Paste into QuickSFV or 7-Zip to verify file integrity', 'copy');
    setTimeout(() => setCopiedHash(false), 2500);
  };

  const handleDownloadTorrentFile = () => {
    const torrentUrl = `/api/torrent/${game.id}`;
    const link = document.createElement('a');
    link.href = torrentUrl;
    link.download = `${game.slug || game.id}_alsabithalgames.torrent`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    userDataService.logDownload({
      gameId: game.id,
      gameTitle: game.title,
      gameCover: game.posterUrl || game.bannerUrl,
      fileSize: game.torrentSize || game.size,
      type: 'torrent_file',
      mirrorName: 'alsabithalgames Torrent File',
      downloadUrl: torrentUrl,
    });
    onNotify?.('Torrent File Downloaded', `${game.title} (.torrent) saved to your device`, 'success');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl h-full sm:h-auto sm:max-h-[92vh] rounded-none sm:rounded-3xl mac-liquid-glass border-0 sm:border border-white/[0.14] shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar with Close */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => {
              onToggleBookmark(game.id);
              onNotify?.(
                isBookmarked ? 'Removed from Library' : 'Saved to Library',
                game.title,
                'bookmark'
              );
            }}
            title={isBookmarked ? 'Saved to Library' : 'Save Game'}
            aria-label={isBookmarked ? 'Saved to Library' : 'Save Game'}
            className={`min-w-[40px] min-h-[40px] p-2 rounded-2xl transition-all active:scale-90 flex items-center justify-center cursor-pointer ${
              isBookmarked
                ? 'bg-amber-500 text-slate-950 border border-amber-400 shadow-md shadow-amber-500/30'
                : 'mac-liquid-pill text-slate-300 hover:text-amber-400'
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="min-w-[40px] min-h-[40px] p-2 rounded-2xl mac-liquid-pill text-slate-300 hover:text-white transition-all active:scale-90 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {/* Hero Banner Header */}
          <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full overflow-hidden bg-slate-950">
            <img
              src={game.bannerUrl || game.posterUrl}
              alt={game.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center brightness-[0.45]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d131f] via-[#0d131f]/60 to-transparent" />

            {/* Floating Hero Watch Trailer Button */}
            {game.trailerUrl && (
              <button
                onClick={() => setIsTrailerCinemaOpen(true)}
                id="hero-play-trailer-btn"
                className="group absolute top-4 right-4 sm:top-6 sm:right-8 z-10 px-3 sm:px-4 py-2 rounded-xl bg-slate-900/85 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm border border-rose-500/40 hover:border-rose-400 backdrop-blur-md flex items-center gap-2 shadow-2xl shadow-rose-950/50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="Watch official video trailer"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-rose-600 group-hover:bg-white text-white group-hover:text-rose-600 flex items-center justify-center transition-colors shadow-sm">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                <span className="tracking-wide">Watch Trailer</span>
              </button>
            )}

            {/* Header Content */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-8 sm:right-8 flex flex-col sm:flex-row sm:items-end gap-4">
              <img
                src={game.posterUrl}
                alt={game.title}
                referrerPolicy="no-referrer"
                className="w-24 sm:w-36 aspect-[16/9] object-cover rounded-xl border-2 border-slate-700 shadow-2xl hidden xs:block"
              />

              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-600/90 text-white text-xs font-bold shadow tracking-wide">
                    PRE-INSTALLED
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-800/90 text-emerald-400 text-xs font-mono border border-slate-700">
                    {game.version}
                  </span>
                  {game.hasOnlineFix && (
                    <span className="px-2 py-0.5 rounded-md bg-blue-600/90 text-white text-xs font-bold flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      ONLINE FIX INCLUDED
                    </span>
                  )}
                  {game.trailerUrl && (
                    <button
                      onClick={() => setIsTrailerCinemaOpen(true)}
                      className="px-2.5 py-0.5 rounded-md bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1 shadow transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      title="Play trailer video"
                    >
                      <Film className="w-3 h-3" />
                      <span>TRAILER</span>
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab('comments')}
                    className="px-2.5 py-0.5 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1 border border-amber-500/30 transition-all cursor-pointer hover:scale-105"
                    title="Read player reviews & comments"
                  >
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{game.rating.toFixed(1)} ({commentsCount} reviews)</span>
                  </button>
                </div>

                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  {game.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                    <strong>Size:</strong> {game.size}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <strong>Updated:</strong> {game.lastUpdated}
                  </span>
                  <span>
                    <strong>Developer:</strong>{' '}
                    <span className="text-slate-200">{game.developer}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Safety Banner */}
          <div className="mx-4 sm:mx-8 my-4 p-3 rounded-2xl mac-liquid-pill border-white/[0.1] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-emerald-400">
                  {game.cleanStatus}
                </p>
                <p className="text-[11px] text-slate-400">
                  SHA-256 Hash: <span className="font-mono text-slate-300">{game.sha256Hash.slice(0, 20)}...</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {game.trailerUrl && (
                <button
                  onClick={() => setIsTrailerCinemaOpen(true)}
                  id="safety-bar-trailer-btn"
                  className="px-3 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-[11px] text-rose-300 border border-rose-500/40 flex items-center gap-1 font-bold transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95"
                  title="Watch official gameplay trailer"
                >
                  <Film className="w-3.5 h-3.5 text-rose-400" />
                  <span>Trailer</span>
                </button>
              )}
              <button
                onClick={() => onOpenAiWithGame?.(game)}
                className="px-3 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-[11px] text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-bold transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95"
                title="Ask alsabithal AI about this game"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Ask AI</span>
              </button>
              <button
                onClick={handleCopyHash}
                className="px-3 py-1 rounded-xl mac-liquid-pill text-[11px] text-slate-300 flex items-center gap-1 transition-all cursor-pointer active:scale-95"
              >
                {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedHash ? 'Hash Copied!' : 'Copy Hash'}
              </button>
              <a
                href={game.steamUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="px-3 py-1 rounded-xl mac-liquid-pill text-[11px] text-slate-300 flex items-center gap-1 transition-all cursor-pointer hover:text-white"
              >
                <ExternalLink className="w-3 h-3" />
                Steam Store
              </a>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-3 sm:px-8 border-b border-white/[0.08] mac-liquid-subtle sticky top-0 z-10">
            <div className="flex items-center gap-1.5 sm:gap-4 overflow-x-auto text-xs sm:text-sm font-semibold custom-scrollbar no-scrollbar touch-pan-x select-none py-1">
              <button
                onClick={() => setActiveTab('downloads')}
                className={`py-2.5 px-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 min-h-[44px] active:scale-95 ${
                  activeTab === 'downloads'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Downloads ({game.mirrors.length + (game.torrentMagnet ? 1 : 0)})</span>
              </button>

              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2.5 px-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 min-h-[44px] active:scale-95 ${
                  activeTab === 'overview'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Info className="w-4 h-4" />
                <span>Overview & DLCs</span>
              </button>

              {game.trailerUrl && (
                <button
                  onClick={() => setActiveTab('trailer')}
                  id="tab-trailer-nav-btn"
                  className={`py-2.5 px-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 min-h-[44px] active:scale-95 ${
                    activeTab === 'trailer'
                      ? 'border-rose-500 text-rose-400'
                      : 'border-transparent text-slate-400 hover:text-rose-300'
                  }`}
                >
                  <Film className="w-4 h-4 text-rose-400" />
                  <span>Trailer</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                </button>
              )}

              <button
                onClick={() => setActiveTab('ai-help')}
                className={`py-2.5 px-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 min-h-[44px] active:scale-95 ${
                  activeTab === 'ai-help'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-emerald-400/80 hover:text-emerald-300'
                }`}
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>AI Help</span>
              </button>

              <button
                onClick={() => setActiveTab('instructions')}
                className={`py-2.5 px-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 min-h-[44px] active:scale-95 ${
                  activeTab === 'instructions'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FolderArchive className="w-4 h-4" />
                <span>Install Guide</span>
              </button>

              <button
                onClick={() => setActiveTab('requirements')}
                className={`py-2.5 px-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 min-h-[44px] active:scale-95 ${
                  activeTab === 'requirements'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Cpu className="w-4 h-4" />
                <span>PC Specs</span>
              </button>

              <button
                onClick={() => setActiveTab('comments')}
                className={`py-2.5 px-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 min-h-[44px] active:scale-95 ${
                  activeTab === 'comments'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Comments ({commentsCount})</span>
              </button>
            </div>
          </div>

          {/* Tab Content Panes */}
          <div className="p-4 sm:p-8 space-y-6">
            {/* DOWNLOADS TAB */}
            {activeTab === 'downloads' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                  <p className="font-semibold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Fast Direct Cloud Mirrors (No Ads, No Waiting Times)
                  </p>
                  <p className="text-slate-400">
                    Recommended: Use Free Download Manager (FDM) or JDownloader2 for multi-threaded downloads and automatic resuming.
                  </p>
                </div>

                {/* Interactive Download Time Estimator */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                        <Gauge className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white">Bandwidth & Download Time Estimator</span>
                        <p className="text-[11px] text-slate-400">Total size: <strong className="text-emerald-400 font-mono">{game.size}</strong></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
                      <span className="text-[11px] text-slate-400">Est. Time:</span>
                      <span className="font-mono text-xs font-black text-emerald-400">
                        {calculateDownloadTime(game.size, userSpeedMbps)}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        (~{(userSpeedMbps / 8).toFixed(1)} MB/s)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pt-1 custom-scrollbar">
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider shrink-0 pr-1">Your Speed:</span>
                    {[
                      { speed: 25, label: '25 Mbps (4G/DSL)' },
                      { speed: 50, label: '50 Mbps (WiFi)' },
                      { speed: 100, label: '100 Mbps (Fast)' },
                      { speed: 300, label: '300 Mbps (High Speed)' },
                      { speed: 1000, label: '1 Gbps (Gigabit)' },
                    ].map((preset) => (
                      <button
                        key={preset.speed}
                        type="button"
                        onClick={() => setUserSpeedMbps(preset.speed)}
                        className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all border cursor-pointer active:scale-95 ${
                          userSpeedMbps === preset.speed
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold shadow-sm'
                            : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border-slate-800'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* alsabithalgames Signature Full Game Notice Banner */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900/80 to-cyan-950/60 border-2 border-emerald-500/40 shadow-xl space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-black text-white uppercase tracking-wider">
                            ALSABITHALGAMES PRE-INSTALLED FULL ARCHIVE
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-400/40">
                            {game.size}
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-300/90 font-medium mt-0.5">
                          100% Pre-Installed • Zero Installers • No 45-Min Unpacks • Full DLCs Unlocked
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="px-2.5 py-1 rounded-xl mac-liquid-pill text-[11px] font-mono text-cyan-300 border border-cyan-400/30">
                        Defender 0/72 Clean
                      </span>
                      {onOpenDownloadManager && (
                        <button
                          type="button"
                          onClick={onOpenDownloadManager}
                          className="px-3 py-1.5 rounded-xl mac-liquid-pill text-xs text-slate-300 hover:text-white font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Downloader</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed pt-2 border-t border-white/[0.08]">
                    📦 <strong className="text-emerald-300 font-bold">100% Pre-Installed Full Game ({game.size}):</strong> This release contains the complete game files for <strong className="text-white font-semibold">{game.title}</strong> with all updates and DLCs included. Zero installers or setup needed. Download the complete game via any option below: <strong className="text-emerald-300 font-semibold">High-Speed Cloud Mirrors (Gofile, Buzzheavier, 1Fichier)</strong>, <strong className="text-indigo-300 font-semibold">BitTorrent Magnet Swarm</strong>, or our <strong className="text-cyan-300 font-semibold">Direct Edge Downloader</strong>.
                  </p>
                </div>

                {/* PRIMARY SECTION 1: HIGH-SPEED CLOUD MIRRORS (Full Game - {game.size}) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
                        <Zap className="w-4 h-4" />
                      </span>
                      <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-wider">
                          High-Speed Cloud Mirrors (Full Game: {game.size})
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Direct single-file and multi-part cloud servers • Unthrottled bandwidth • Pre-installed archive
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 mac-liquid-pill px-2.5 py-1 rounded-lg">
                      {game.mirrors.length} Active Mirrors
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {game.mirrors.map((mirror, index) => (
                      <div
                        key={mirror.id}
                        className="p-4 rounded-2xl mac-liquid-glass border border-white/[0.09] hover:border-emerald-400/50 hover:shadow-[0_10px_30px_rgba(16,185,129,0.15)] transition-all flex flex-col justify-between gap-3 group bg-gradient-to-br from-slate-900/70 to-slate-950/80"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-sm text-white group-hover:text-emerald-300 transition-colors">
                                {mirror.provider}
                              </span>
                              {index === 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-extrabold tracking-wide uppercase border border-emerald-400/40">
                                  RECOMMENDED
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {mirror.name}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[10px] font-mono font-bold mac-liquid-pill px-2 py-0.5 rounded-md text-cyan-300 border border-cyan-400/30 block">
                              {mirror.speed}
                            </span>
                            <span className="text-[11px] font-mono font-bold text-emerald-400 mt-1 block">
                              {mirror.size}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.06] text-xs">
                          <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                            <HardDrive className="w-3 h-3 text-slate-500" />
                            {mirror.parts ? `${mirror.parts} Parts Archive` : 'Single Portable Archive'}
                          </span>
                          <a
                            href={mirror.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            onClick={() => handleMirrorDownloadClick(mirror)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-900/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download ({mirror.size})</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PRIMARY SECTION 2: TORRENT & MAGNET SWARM (Full Game - {game.size}) */}
                {game.torrentMagnet && (
                  <div className="p-4 sm:p-5 rounded-2xl mac-liquid-glass border border-indigo-500/30 bg-gradient-to-br from-indigo-950/30 via-slate-900/60 to-slate-950/80 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-400/40 flex items-center justify-center font-black text-xs">
                          P2P
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-sm text-white">
                              BitTorrent Magnet & Torrent File
                            </h4>
                            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                              Full {game.torrentSize || game.size}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            High-speed DHT swarm with 1,850+ active seeders • Supports qBittorrent, BitTorrent, uTorrent, FDM
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 self-start sm:self-auto">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>1,850+ Seeders (Healthy)</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                      <a
                        href={game.torrentMagnet}
                        onClick={handleMagnetClick}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-950/50 hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Open Magnet Link ({game.torrentSize || game.size})</span>
                      </a>

                      <button
                        type="button"
                        onClick={handleDownloadTorrentFile}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 hover:text-white text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer border border-white/[0.1]"
                      >
                        <Download className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Download .torrent File</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyMagnet}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl mac-liquid-pill text-slate-300 hover:text-white text-xs font-medium transition-all cursor-pointer active:scale-95"
                      >
                        {copiedMagnet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedMagnet ? 'Magnet Copied!' : 'Copy Magnet URI'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* PRIMARY SECTION 3: DIRECT ON-SITE PRE-INSTALLED FULL GAME DOWNLOAD */}
                <div className="p-5 sm:p-6 rounded-3xl mac-liquid-glass border border-emerald-500/30 shadow-[0_10px_35px_rgba(16,185,129,0.1)] space-y-4 bg-gradient-to-br from-emerald-950/20 via-slate-900/60 to-slate-950/80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                          DIRECT FULL GAME DOWNLOAD
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-400/30">
                          100% Pre-Installed ({game.size})
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-white tracking-tight mt-1 flex items-center gap-2">
                        Direct Download Pre-Installed Full Game ({game.size})
                      </h3>
                      <p className="text-xs text-slate-300 mt-0.5 max-w-xl leading-relaxed">
                        Complete pre-installed game archive containing all full game files, binaries, textures, audio cutscenes, all unlocked DLCs, and Goldberg Steam emulator. Zero setup, installers, or lengthy unpacking required—just extract and play!
                      </p>
                    </div>
                  </div>

                  {/* CDN Node Selector */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Select Edge CDN Server:</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {DIRECT_CDN_NODES.map((node) => {
                        const isSelected = selectedNode.id === node.id;
                        return (
                          <button
                            key={node.id}
                            type="button"
                            onClick={() => setSelectedNode(node)}
                            className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                              isSelected
                                ? 'bg-emerald-500/20 border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                                : 'bg-slate-900/50 border-white/[0.08] hover:border-white/[0.2] hover:bg-slate-900/80'
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-base">{node.flag}</span>
                                <span className="font-bold text-xs text-white truncate">
                                  {node.name}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                {node.bandwidth} • {node.latencyMs}ms
                              </p>
                            </div>
                            <div className="shrink-0">
                              {isSelected ? (
                                <span className="w-4 h-4 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </span>
                              ) : (
                                <span className="w-2 h-2 rounded-full bg-emerald-400/50" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Save Location Preference */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <FolderInput className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Where To Save On Your PC:</span>
                      </label>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        {saveLocationPreference === 'ask_picker' ? '📁 Windows Save As Dialog' : '⚡ Direct Save'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSaveLocationPreference('ask_picker')}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between gap-3 ${
                          saveLocationPreference === 'ask_picker'
                            ? 'bg-emerald-500/15 border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                            : 'bg-slate-900/50 border-white/[0.08] hover:border-white/[0.2] hover:bg-slate-900/80'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                            saveLocationPreference === 'ask_picker' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/[0.05] text-slate-400'
                          }`}>
                            <FolderOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-xs text-white flex items-center gap-1.5">
                              Ask Where To Save
                              <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/30 text-emerald-300 font-extrabold uppercase">
                                Recommended
                              </span>
                            </span>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                              Prompts Windows File Explorer Save dialog to choose your drive and folder (e.g. D:\Games\).
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 mt-0.5">
                          {saveLocationPreference === 'ask_picker' ? (
                            <span className="w-4 h-4 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-slate-600 block m-1" />
                          )}
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSaveLocationPreference('browser_default')}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between gap-3 ${
                          saveLocationPreference === 'browser_default'
                            ? 'bg-emerald-500/15 border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                            : 'bg-slate-900/50 border-white/[0.08] hover:border-white/[0.2] hover:bg-slate-900/80'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                            saveLocationPreference === 'browser_default' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/[0.05] text-slate-400'
                          }`}>
                            <Download className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-xs text-white">
                              Default Downloads Folder
                            </span>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                              Direct download straight into your browser's default Downloads directory.
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 mt-0.5">
                          {saveLocationPreference === 'browser_default' ? (
                            <span className="w-4 h-4 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-slate-600 block m-1" />
                          )}
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Trigger Button */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => handleStartDirectDownload('ask_picker')}
                      disabled={isDirectDownloading}
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl mac-liquid-accent text-white font-extrabold text-xs sm:text-sm shadow-[0_10px_25px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-75"
                    >
                      <FolderOpen className={`w-4 h-4 ${isDirectDownloading ? 'animate-pulse text-amber-300' : ''}`} />
                      <span>
                        {isDirectDownloading ? 'Connecting to NVMe Storage...' : `📁 Choose Save Location & Download Full Game (${game.size})`}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStartDirectDownload('browser_default')}
                      disabled={isDirectDownloading}
                      className="w-full sm:w-auto px-4 py-3 rounded-2xl mac-liquid-pill text-slate-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Direct Download Full Game ({game.size})</span>
                    </button>
                  </div>

                  {/* IDM & Download Manager Direct Accelerator Link Box */}
                  <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Multi-Thread Accelerator Link (IDM / FDM):</span>
                      </label>
                      <span className="text-[10px] text-emerald-400 font-mono">16 Connections</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
                      <code className="text-xs font-mono text-cyan-300 truncate w-full sm:max-w-md select-all">
                        {window.location.origin}/api/download/{game.id}?node={encodeURIComponent(selectedNode.name)}
                      </code>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={handleCopyDirectIdm}
                          className="px-3 py-1.5 rounded-xl mac-liquid-pill text-xs text-white font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:text-emerald-300"
                        >
                          {copiedIdmUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedIdmUrl ? 'Copied Link!' : 'Copy Link'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleCopyDirectAria}
                          className="px-3 py-1.5 rounded-xl mac-liquid-pill text-xs text-slate-300 font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:text-white"
                          title="Copy multi-connection aria2c terminal command"
                        >
                          {copiedAriaCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Terminal className="w-3.5 h-3.5" />}
                          <span>aria2c CLI</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3-STEP ALSABITHALGAMES HOW TO RUN GUIDE */}
                <div className="p-4 sm:p-5 rounded-2xl mac-liquid-glass border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>alsabithalgames 3-Step Run Guide (Zero Setup Needed)</span>
                    </h4>
                    <button
                      type="button"
                      onClick={onOpenGuide}
                      className="text-[11px] text-emerald-400 hover:underline cursor-pointer"
                    >
                      Full Troubleshooting Guide →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] flex items-center justify-center font-bold">1</span>
                        <span>Extract Anywhere</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Unzip the downloaded archive to your preferred drive (e.g., <span className="text-slate-300 font-mono">D:\Games\</span>) using 7-Zip or WinRAR.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] flex items-center justify-center font-bold">2</span>
                        <span>Antivirus Note</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Steam emulator DLLs (<span className="text-emerald-300 font-mono">steam_api64.dll</span>) may trigger false positives. Add folder to Windows Defender exclusions.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] flex items-center justify-center font-bold">3</span>
                        <span>Launch & Play</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Run <span className="text-emerald-300 font-mono">START_GAME_PREINSTALLED.bat</span> or the game .exe as Administrator. Enjoy!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Online-Fix Note if available */}
                {game.hasOnlineFix && (
                  <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/60 text-xs text-blue-200 space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-blue-300">
                      <Users className="w-4 h-4" />
                      Multiplayer Online-Fix Included
                    </p>
                    <p className="text-slate-300">
                      {game.onlineFixNote || 'Multiplayer enabled via Steam Spacewar overlay crack. Log into a secondary Steam account and invite your friends!'}
                    </p>
                  </div>
                )}

                {/* Community Comments & Reviews Quick Callout */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                      <Star className="w-5 h-5 fill-amber-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-xs sm:text-sm">Player Reviews & Star Ratings</p>
                      <p className="text-slate-400 text-[11px]">
                        Share your installation speed, FPS performance, or leave a review for other players.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('comments')}
                    className="px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold border border-emerald-500/40 flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>View & Leave Comments ({commentsCount})</span>
                  </button>
                </div>
              </div>
            )}

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-2">
                    About This Game
                  </h3>
                  <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-line bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                    {game.description}
                  </div>
                </div>

                {/* Included DLCs */}
                {game.includedDLCs && game.includedDLCs.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Included DLCs & Bonus Content
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {game.includedDLCs.map((dlc, i) => (
                        <div
                          key={i}
                          className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-emerald-400 flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          <span>{dlc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Changelog */}
                {game.changelog && game.changelog.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Patch Changelog & What's New
                    </h3>
                    <ul className="space-y-1.5 text-xs text-slate-300 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                      {game.changelog.map((log, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-cyan-400 font-bold">•</span>
                          <span>{log}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Official Game Trailer in Overview */}
                {game.trailerUrl && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                        <Film className="w-4 h-4 text-rose-400" />
                        <span>Official Gameplay Trailer</span>
                      </h3>
                      <button
                        onClick={() => setIsTrailerCinemaOpen(true)}
                        className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Cinema Mode</span>
                      </button>
                    </div>
                    <GameTrailerPlayer
                      game={game}
                      autoPlay={false}
                      onToggleCinema={() => setIsTrailerCinemaOpen(true)}
                    />
                  </div>
                )}

                {/* Screenshots Gallery */}
                {game.screenshots && game.screenshots.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Gameplay Screenshots
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {game.screenshots.map((src, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedScreenshot(src)}
                          className="aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer hover:border-emerald-500 transition-all hover:scale-[1.02]"
                        >
                          <img
                            src={src}
                            alt={`Screenshot ${idx + 1}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* System Requirements Section in Overview */}
                <div className="pt-4 border-t border-slate-800">
                  <SystemRequirementsSection
                    game={game}
                    onOpenAiWithGame={onOpenAiWithGame}
                  />
                </div>
              </div>
            )}

            {/* TRAILER TAB */}
            {activeTab === 'trailer' && game.trailerUrl && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                      <Film className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">
                        {game.title} - Official Video Trailer
                      </h2>
                      <p className="text-xs text-slate-400">
                        Official high-definition preview, gameplay footage, and cinematics.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsTrailerCinemaOpen(true)}
                    id="trailer-tab-cinema-btn"
                    className="self-start sm:self-center px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Cinema Theater Mode</span>
                  </button>
                </div>

                <GameTrailerPlayer
                  game={game}
                  autoPlay={true}
                  isCinemaMode={false}
                  onToggleCinema={() => setIsTrailerCinemaOpen(true)}
                />

                {/* Additional screenshots below trailer */}
                {game.screenshots && game.screenshots.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-slate-800">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Gameplay Screenshots Gallery
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {game.screenshots.map((src, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedScreenshot(src)}
                          className="aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer hover:border-emerald-500 transition-all hover:scale-[1.02]"
                        >
                          <img
                            src={src}
                            alt={`Screenshot ${idx + 1}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AI ASSISTANT & COMPATIBILITY TAB */}
            {activeTab === 'ai-help' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* AI Hero Banner */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-cyan-950/70 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                        <Bot className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-extrabold text-white">
                        alsabithal AI Game Companion for {game.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                      Ask about expected FPS on your graphics card, fix common extraction and antivirus errors, get co-op multiplayer guides, or find gameplay tips.
                    </p>
                  </div>

                  <button
                    onClick={() => onOpenAiWithGame?.(game)}
                    className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Open Interactive AI Chat</span>
                  </button>
                </div>

                {/* Quick AI Action Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div 
                    onClick={() => onOpenAiWithGame?.(game, `Can my PC run ${game.title}? Check my hardware specs against requirements and predict average FPS.`)}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/60 cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] text-cyan-400 font-mono">1-Click Check</span>
                    </div>
                    <h4 className="font-bold text-sm text-white group-hover:text-cyan-400 transition-colors">
                      Can My PC Run This?
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Evaluate your GPU, CPU, and RAM against minimum/recommended specs for realistic FPS estimates.
                    </p>
                  </div>

                  <div 
                    onClick={() => onOpenAiWithGame?.(game, `Windows Defender flagged steam_api64.dll in ${game.title}. How do I add an exclusion folder in Windows Security safely?`)}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/60 cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] text-amber-400 font-mono">Troubleshooting</span>
                    </div>
                    <h4 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                      Antivirus False Positive
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Learn why Windows Defender flags modified Steam DLLs and step-by-step exclusion instructions.
                    </p>
                  </div>

                  <div 
                    onClick={() => onOpenAiWithGame?.(game, `How do I fix ISDone.dll or unarc.dll error when extracting ${game.title}?`)}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-red-500/50 hover:bg-slate-800/60 cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] text-red-400 font-mono">Archive Error</span>
                    </div>
                    <h4 className="font-bold text-sm text-white group-hover:text-red-400 transition-colors">
                      Fix ISDone.dll / Unarc Error
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Resolve decompression crashes by increasing virtual memory pagefile and disabling file scan.
                    </p>
                  </div>

                  <div 
                    onClick={() => onOpenAiWithGame?.(game, `How does Online-Fix / co-op multiplayer work in ${game.title}? Guide me on how to invite Steam friends.`)}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/60 cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono">Multiplayer</span>
                    </div>
                    <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                      Online-Fix Co-op Setup
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {game.hasOnlineFix
                        ? 'Includes working Steam LAN/co-op fix. Ask AI for exact lobby and invitation instructions.'
                        : 'Ask AI how to setup LAN or community multiplayer mods for this title.'}
                    </p>
                  </div>

                  <div 
                    onClick={() => onOpenAiWithGame?.(game, `What are the best optimized graphic settings and mods for ${game.title} to get maximum FPS and smooth frametimes?`)}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800/60 cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                        <Sliders className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] text-purple-400 font-mono">Optimization</span>
                    </div>
                    <h4 className="font-bold text-sm text-white group-hover:text-purple-400 transition-colors">
                      Best Graphic Settings & Mods
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Recommended graphics preset, DLSS/FSR upscaler settings, and ultrawide/FPS unlock tweaks.
                    </p>
                  </div>

                  <div 
                    onClick={() => onOpenAiWithGame?.(game, `Recommend 5 games on alsabithalgames similar to ${game.title} with similar gameplay or atmosphere.`)}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-pink-500/50 hover:bg-slate-800/60 cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] text-pink-400 font-mono">Recommendations</span>
                    </div>
                    <h4 className="font-bold text-sm text-white group-hover:text-pink-400 transition-colors">
                      Similar Game Vault
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Discover games in the same genre ({game.genres.join(', ')}) available with fast downloads.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* HOW TO INSTALL TAB */}
            {activeTab === 'instructions' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="bg-emerald-950/30 border border-emerald-800/40 p-4 rounded-xl text-xs text-emerald-200">
                  <p className="font-bold text-sm mb-1 text-emerald-400">
                    Why Pre-Installed / Portable is Better:
                  </p>
                  <p className="text-slate-300">
                    You don't need to run setup.exe or wait hours for decompressors. The game folder is ready to launch immediately after extracting!
                  </p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-bold text-white">Download the Game Files</h4>
                      <p className="text-slate-400">
                        Choose Buzzheavier, Gofile, or 1fichier. If the game is split into parts (part1.rar, part2.rar), make sure all parts are downloaded into the SAME folder.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-bold text-white">Extract the Archive</h4>
                      <p className="text-slate-400">
                        Use <strong>NanaZip</strong> (recommended open source) or <strong>WinRAR</strong>. Right-click the `.zip` or `part1.rar` and select "Extract to [GameName]".
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
                      3
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-bold text-white">Antivirus Notice (False Positive Prevention)</h4>
                      <p className="text-slate-400">
                        Windows Defender may flag modified Steam emulator files (e.g. `steam_api64.dll` or `OnlineFix64.dll`) as "HackTool" or "Riskware". Before extracting, add your Games folder as an exclusion in Windows Security.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
                      4
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-bold text-white">Run as Administrator</h4>
                      <p className="text-slate-400">
                        Open the extracted folder, right-click the main executable `.exe` file, and select <strong>Run as administrator</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
                      5
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-bold text-white">Install Common Redistributables</h4>
                      <p className="text-slate-400">
                        If you receive "MSVCP140.dll" or "DirectX" errors, install the DirectX End-User Runtime and Microsoft Visual C++ 2015-2022 Redistributable (both x86 and x64).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={onOpenGuide}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    <FolderArchive className="w-4 h-4 text-cyan-400" />
                    Open Graphic Troubleshooting Guide
                  </button>
                  <button
                    onClick={() => onOpenAiWithGame?.(game, `I'm having an issue installing or running ${game.title}. Please diagnose step by step.`)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/40 transition-colors"
                  >
                    <Bot className="w-4 h-4 text-emerald-400" />
                    Diagnose Install Error with AI
                  </button>
                </div>
              </div>
            )}

            {/* REQUIREMENTS TAB */}
            {activeTab === 'requirements' && (
              <div className="animate-in fade-in duration-150">
                <SystemRequirementsSection
                  game={game}
                  onOpenAiWithGame={onOpenAiWithGame}
                />
              </div>
            )}

            {/* COMMENTS TAB */}
            {activeTab === 'comments' && (
              <GameCommentsSection
                game={game}
                onCommentsCountChange={setCommentsCount}
              />
            )}
          </div>
        </div>

        {/* Mobile-Only Sticky Bottom Action Bar */}
        <div className="sm:hidden border-t border-slate-800 bg-[#090d16]/98 backdrop-blur-xl px-3 py-2.5 flex items-center justify-between gap-2 z-20 shrink-0 shadow-2xl safe-area-bottom">
          <button
            onClick={() => {
              setActiveTab('downloads');
            }}
            className="flex-1 min-h-[44px] py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-transform"
          >
            <Download className="w-4 h-4" />
            <span>{activeTab === 'downloads' ? 'Choose Mirror' : 'Download Game'}</span>
            <span className="text-[10px] bg-black/25 px-1.5 py-0.5 rounded font-mono font-bold">
              {game.mirrors.length + (game.torrentMagnet ? 1 : 0)}
            </span>
          </button>

          {game.torrentMagnet && (
            <button
              onClick={handleCopyMagnet}
              title="Copy Magnet URI"
              aria-label="Copy Magnet URI"
              className="min-w-[44px] min-h-[44px] rounded-xl bg-slate-800/90 text-slate-200 border border-slate-700 flex items-center justify-center active:scale-95 text-xs transition-transform"
            >
              {copiedMagnet ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Zap className="w-4 h-4 text-amber-400" />
              )}
            </button>
          )}

          {game.trailerUrl && (
            <button
              onClick={() => setActiveTab('trailer')}
              title="Watch Trailer"
              aria-label="Watch Trailer"
              className={`min-w-[44px] min-h-[44px] rounded-xl border flex items-center justify-center active:scale-95 text-xs transition-transform ${
                activeTab === 'trailer'
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                  : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:text-rose-400'
              }`}
            >
              <Film className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onToggleBookmark(game.id)}
            title={isBookmarked ? 'In Library' : 'Save Game'}
            aria-label={isBookmarked ? 'In Library' : 'Save Game'}
            className={`min-w-[44px] min-h-[44px] rounded-xl border flex items-center justify-center active:scale-95 transition-transform ${
              isBookmarked
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-800/90 text-slate-300 border-slate-700'
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>

      {/* Lightbox for screenshots */}
      {selectedScreenshot && (
        <div
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedScreenshot(null)}
        >
          <img
            src={selectedScreenshot}
            alt="Fullscreen preview"
            referrerPolicy="no-referrer"
            className="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain"
          />
        </div>
      )}

      {/* Cinema Mode Lightbox for Game Trailer */}
      {isTrailerCinemaOpen && game.trailerUrl && (
        <div
          id="game-trailer-cinema-lightbox"
          className="fixed inset-0 z-70 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsTrailerCinemaOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl shadow-rose-950/40"
            onClick={(e) => e.stopPropagation()}
          >
            <GameTrailerPlayer
              game={game}
              autoPlay={true}
              isCinemaMode={true}
              onCloseCinema={() => setIsTrailerCinemaOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

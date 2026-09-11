import React, { useState } from 'react';
import { Play, Film, ExternalLink, Maximize2, RotateCcw, AlertCircle, Sparkles, X } from 'lucide-react';
import { Game } from '../types';

interface GameTrailerPlayerProps {
  game: Game;
  autoPlay?: boolean;
  isCinemaMode?: boolean;
  onCloseCinema?: () => void;
  onToggleCinema?: () => void;
}

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : null;
}

export function getEmbedUrl(url: string, autoPlay: boolean = true): string | null {
  const youtubeId = extractYouTubeId(url);
  if (youtubeId) {
    return `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=${autoPlay ? 1 : 0}&rel=0&modestbranding=1&playsinline=1`;
  }
  return null;
}

export const GameTrailerPlayer: React.FC<GameTrailerPlayerProps> = ({
  game,
  autoPlay = false,
  isCinemaMode = false,
  onCloseCinema,
  onToggleCinema,
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [hasError, setHasError] = useState(false);

  if (!game.trailerUrl) {
    return null;
  }

  const youtubeId = extractYouTubeId(game.trailerUrl);
  const isDirectVideo = /\.(mp4|webm|ogg|m4v)($|\?)/i.test(game.trailerUrl);
  const embedUrl = getEmbedUrl(game.trailerUrl, isPlaying);

  return (
    <div
      id="game-trailer-player-container"
      className={`relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl transition-all ${
        isCinemaMode ? 'ring-2 ring-emerald-500/50 shadow-emerald-500/10' : ''
      }`}
    >
      {/* Top Bar / Header */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Film className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-white tracking-wide">
              Official Gameplay Trailer
            </span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
              • {game.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onToggleCinema && (
            <button
              onClick={onToggleCinema}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title={isCinemaMode ? 'Exit Cinema Mode' : 'Expand Cinema Mode'}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}

          <a
            href={game.trailerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px] font-medium"
            title="Watch in high quality on YouTube"
          >
            <span>External</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          {isCinemaMode && onCloseCinema && (
            <button
              onClick={onCloseCinema}
              className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors ml-1"
              title="Close Trailer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Video Viewport Area (16:9 ratio) */}
      <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
        {isPlaying ? (
          <>
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={`${game.title} Official Trailer`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onError={() => setHasError(true)}
              />
            ) : isDirectVideo ? (
              <video
                src={game.trailerUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
                onError={() => setHasError(true)}
              >
                Your browser does not support HTML5 video.
              </video>
            ) : (
              <div className="p-8 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                <p className="text-sm text-slate-300">
                  This trailer cannot be embedded directly.
                </p>
                <a
                  href={game.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg"
                >
                  <ExternalLink className="w-4 h-4" />
                  Watch Video on YouTube
                </a>
              </div>
            )}
          </>
        ) : (
          /* Thumbnail preview with Big Play Button */
          <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsPlaying(true)}>
            <img
              src={game.bannerUrl || game.posterUrl}
              alt={`${game.title} Trailer Preview`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

            {/* Glowing Big Play Button */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-rose-500/30 blur-md group-hover:bg-rose-500/60 group-hover:scale-110 transition-all" />
                <button
                  id="play-game-trailer-btn"
                  className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 text-white flex items-center justify-center shadow-2xl shadow-rose-600/50 group-hover:scale-110 active:scale-95 transition-all border border-rose-300/40"
                  title="Click to play trailer"
                >
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                </button>
              </div>

              <div className="text-center space-y-1">
                <span className="text-xs sm:text-sm font-extrabold text-white tracking-wider uppercase drop-shadow-md flex items-center justify-center gap-1.5">
                  <span>Watch Official 4K Trailer</span>
                  <Sparkles className="w-4 h-4 text-rose-400" />
                </span>
                <span className="text-[11px] text-slate-300 font-medium block">
                  Click to start video with sound
                </span>
              </div>
            </div>

            {/* Bottom meta tag */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-300">
              <span className="bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-slate-800">
                1080p / 4K UHD 60FPS
              </span>
              <span className="bg-rose-600/80 backdrop-blur-sm text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                Official
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Error fallback */}
      {hasError && (
        <div className="p-4 bg-amber-950/40 border-t border-amber-500/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>If video fails to embed due to browser restrictions, watch directly:</span>
          </div>
          <a
            href={game.trailerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold shrink-0 flex items-center gap-1.5"
          >
            <span>Open Link</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </div>
  );
};

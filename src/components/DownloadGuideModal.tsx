import React from 'react';
import { X, Download, ShieldCheck, FolderArchive, Terminal, AlertTriangle, CheckCircle2, Cpu } from 'lucide-react';

interface DownloadGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadGuideModal: React.FC<DownloadGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl mac-liquid-glass border border-white/[0.14] rounded-3xl p-6 sm:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.85)] space-y-6 max-h-[92vh] overflow-y-auto text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl mac-liquid-accent flex items-center justify-center text-white shadow-sm">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">How to Download & Run Portable PC Games</h2>
              <p className="text-xs text-slate-400">Step-by-step tutorial for hassle-free gaming</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full mac-dot-red inline-block cursor-pointer" onClick={onClose} />
            <span className="w-3 h-3 rounded-full mac-dot-yellow inline-block" />
            <span className="w-3 h-3 rounded-full mac-dot-green inline-block" />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4 text-xs sm:text-sm">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl mac-liquid-subtle space-y-2">
            <div className="flex items-center gap-2.5 text-emerald-300 font-bold">
              <span className="w-6 h-6 rounded-full mac-liquid-accent flex items-center justify-center text-xs text-white">1</span>
              <span>Use a Download Manager for Maximum Speed</span>
            </div>
            <p className="text-slate-300 pl-8 leading-relaxed">
              Standard web browsers often cap download speeds and can fail on large 50GB+ files if your internet connection drops.
              We recommend installing <strong>Free Download Manager (FDM)</strong> or <strong>Internet Download Manager (IDM)</strong>. They enable multi-threaded downloads from Buzzheavier and Gofile to utilize your full bandwidth.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl mac-liquid-subtle space-y-2">
            <div className="flex items-center gap-2.5 text-cyan-300 font-bold">
              <span className="w-6 h-6 rounded-full bg-cyan-500/30 border border-cyan-400/40 flex items-center justify-center text-xs text-cyan-200">2</span>
              <span>Extract Archives with NanaZip or WinRAR</span>
            </div>
            <p className="text-slate-300 pl-8 leading-relaxed">
              Games come compressed in `.zip`, `.rar`, or multi-part archives (`part1.rar`, `part2.rar`).
              Do NOT use Windows default zip utility as it corrupts long file paths.
              Download <strong>NanaZip</strong> (free on Microsoft Store) or <strong>WinRAR</strong>.
              Right-click the downloaded file (or part1.rar if split) and choose: <em>Extract to [Game Folder]</em>.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2.5 text-amber-300 font-bold">
              <span className="w-6 h-6 rounded-full bg-amber-500/30 border border-amber-400/40 flex items-center justify-center text-xs text-amber-200">3</span>
              <span>Set Windows Defender Antivirus Exclusion (Crucial!)</span>
            </div>
            <div className="pl-8 text-slate-300 space-y-1.5 leading-relaxed">
              <p>
                Windows Defender may mistake crack DLLs (such as <code className="text-amber-300 font-mono">steam_api64.dll</code>, <code className="text-amber-300 font-mono">OnlineFix64.dll</code>, or <code className="text-amber-300 font-mono">Goldberg</code>) for malware because they bypass Steam DRM. This is a 100% false positive.
              </p>
              <div className="mac-liquid-pill p-3 rounded-xl border border-white/[0.08] font-mono text-[11px] text-slate-200 space-y-1">
                <p>1. Open <strong>Windows Security</strong> → <strong>Virus & threat protection</strong></p>
                <p>2. Under <em>Virus & threat protection settings</em>, click <strong>Manage settings</strong></p>
                <p>3. Scroll down to <em>Exclusions</em>, click <strong>Add or remove exclusions</strong></p>
                <p>4. Click <strong>Add an exclusion</strong> → select <strong>Folder</strong> → select your Games folder!</p>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-2xl mac-liquid-subtle space-y-2">
            <div className="flex items-center gap-2.5 text-purple-300 font-bold">
              <span className="w-6 h-6 rounded-full bg-purple-500/30 border border-purple-400/40 flex items-center justify-center text-xs text-purple-200">4</span>
              <span>Always Run the Game .exe as Administrator</span>
            </div>
            <p className="text-slate-300 pl-8 leading-relaxed">
              Open the extracted game folder, locate the primary game `.exe` file (usually inside the root or a subfolder named `Binaries/Win64`), right-click it, and select <strong>Run as administrator</strong>. This ensures the game has write permissions to save your progress and access graphics drivers.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-4 rounded-2xl mac-liquid-subtle space-y-2">
            <div className="flex items-center gap-2.5 text-blue-300 font-bold">
              <span className="w-6 h-6 rounded-full bg-blue-500/30 border border-blue-400/40 flex items-center justify-center text-xs text-blue-200">5</span>
              <span>Missing DLLs? Install Common Gaming Runtimes</span>
            </div>
            <p className="text-slate-300 pl-8 leading-relaxed">
              If the game does not start or complains of <code className="text-blue-300 font-mono">VCRUNTIME140.dll</code> or <code className="text-blue-300 font-mono">D3DCOMPILER_47.dll</code>, download and install:
              <br />• <strong>Visual C++ Redistributable All-in-One</strong> (from TechPowerUp or Microsoft)
              <br />• <strong>DirectX End-User Runtime Web Installer</strong>
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl mac-liquid-accent text-white font-bold text-xs cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            Got It, Back to Games
          </button>
        </div>
      </div>
    </div>
  );
};

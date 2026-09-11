import React, { useState } from 'react';
import { Game, SystemRequirements } from '../types';
import {
  Cpu,
  HardDrive,
  Monitor,
  Zap,
  Sparkles,
  Copy,
  Check,
  Bot,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface SystemRequirementsSectionProps {
  game: Game;
  onOpenAiWithGame?: (game: Game, prompt?: string) => void;
  compact?: boolean;
}

interface ParsedSpec {
  raw: string;
  highlight?: string;
  tags?: string[];
}

interface ParsedRequirements {
  os: ParsedSpec;
  cpu: ParsedSpec;
  ram: ParsedSpec;
  gpu: ParsedSpec;
  directX: ParsedSpec;
  storage: ParsedSpec;
  notes?: string;
}

export const SystemRequirementsSection: React.FC<SystemRequirementsSectionProps> = ({
  game,
  onOpenAiWithGame,
  compact = false,
}) => {
  const [activeView, setActiveView] = useState<'both' | 'minimum' | 'recommended'>('both');
  const [copiedSpecs, setCopiedSpecs] = useState(false);

  const minReq = game.requirements?.minimum;
  const recReq = game.requirements?.recommended;

  if (!minReq && !recReq) {
    return null;
  }

  // Parse helper to extract key metrics
  const parseSpecData = (req?: SystemRequirements): ParsedRequirements | null => {
    if (!req) return null;

    // Parse RAM amount
    const ramMatch = req.memory?.match(/(\d+)\s*(GB|MB)/i);
    const ramHighlight = ramMatch ? `${ramMatch[1]} ${ramMatch[2].toUpperCase()}` : undefined;

    // Parse Storage amount
    const storageMatch = req.storage?.match(/(\d+)\s*(GB|MB|TB)/i);
    const storageHighlight = storageMatch ? `${storageMatch[1]} ${storageMatch[2].toUpperCase()}` : undefined;
    const isSSD = /ssd/i.test(req.storage || '') || /ssd/i.test(req.additionalNotes || '');

    // Parse DirectX
    const dxMatch = req.directX?.match(/(?:version\s*|directx\s*)?(\d+)/i);
    const dxHighlight = dxMatch ? `DirectX ${dxMatch[1]}` : req.directX;

    // Parse CPU
    const cpuTags: string[] = [];
    if (/intel/i.test(req.processor || '')) cpuTags.push('Intel');
    if (/amd|ryzen/i.test(req.processor || '')) cpuTags.push('AMD');

    // Parse GPU
    const gpuTags: string[] = [];
    if (/nvidia|geforce|gtx|rtx/i.test(req.graphics || '')) gpuTags.push('NVIDIA');
    if (/radeon|rx|vega/i.test(req.graphics || '')) gpuTags.push('AMD');
    if (/intel|arc/i.test(req.graphics || '')) gpuTags.push('Intel');

    const vramMatch = req.graphics?.match(/(\d+)\s*GB/i);
    const gpuHighlight = vramMatch ? `${vramMatch[1]} GB VRAM` : undefined;

    return {
      os: {
        raw: req.os || 'Windows 10 64-bit',
        highlight: /64-bit/i.test(req.os || '') ? '64-bit OS' : undefined,
      },
      cpu: {
        raw: req.processor || 'Dual-core processor or better',
        tags: cpuTags,
      },
      ram: {
        raw: req.memory || '8 GB RAM',
        highlight: ramHighlight,
      },
      gpu: {
        raw: req.graphics || 'Dedicated 3D Graphics Accelerator',
        highlight: gpuHighlight,
        tags: gpuTags,
      },
      directX: {
        raw: req.directX || 'Version 11 or 12',
        highlight: dxHighlight,
      },
      storage: {
        raw: req.storage || game.size || 'Available space required',
        highlight: storageHighlight,
        tags: isSSD ? ['SSD Recommended'] : undefined,
      },
      notes: req.additionalNotes,
    };
  };

  const parsedMin = parseSpecData(minReq);
  const parsedRec = parseSpecData(recReq);

  // Estimate general hardware tier for the game
  const getGameHardwareTier = () => {
    const rawGpu = (minReq?.graphics || '').toLowerCase();
    const rawRam = (minReq?.memory || '').toLowerCase();
    const rawRecGpu = (recReq?.graphics || '').toLowerCase();

    if (/rtx 40|rtx 3080|rtx 3070|rx 6800|rx 7800/i.test(rawRecGpu) || /32\s*gb/i.test(rawRam)) {
      return {
        label: 'Heavyweight / Next-Gen',
        color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
        desc: 'Demands modern dedicated GPU with 8GB+ VRAM & fast multi-core CPU.',
      };
    }
    if (/gtx 1060|rx 580|rtx 2060|gtx 1660|16\s*gb/i.test(rawGpu) || /rtx 2070|rtx 3060/i.test(rawRecGpu)) {
      return {
        label: 'Mid-Range Gaming Rig',
        color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
        desc: 'Runs smoothly on standard 6GB/8GB graphics cards at 1080p/1440p.',
      };
    }
    return {
      label: 'Accessible / Wide Compatibility',
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      desc: 'Optimized to run on modest hardware, older laptops, and budget GPUs.',
    };
  };

  const tier = getGameHardwareTier();

  const handleCopySpecs = () => {
    let text = `=== ${game.title} - System Requirements ===\n\n`;
    if (minReq) {
      text += `[MINIMUM SPECS]\n`;
      text += `OS: ${minReq.os}\n`;
      text += `CPU: ${minReq.processor}\n`;
      text += `RAM: ${minReq.memory}\n`;
      text += `GPU: ${minReq.graphics}\n`;
      text += `DirectX: ${minReq.directX}\n`;
      text += `Storage: ${minReq.storage}\n`;
      if (minReq.additionalNotes) text += `Notes: ${minReq.additionalNotes}\n`;
      text += `\n`;
    }
    if (recReq) {
      text += `[RECOMMENDED SPECS]\n`;
      text += `OS: ${recReq.os}\n`;
      text += `CPU: ${recReq.processor}\n`;
      text += `RAM: ${recReq.memory}\n`;
      text += `GPU: ${recReq.graphics}\n`;
      text += `DirectX: ${recReq.directX}\n`;
      text += `Storage: ${recReq.storage}\n`;
      if (recReq.additionalNotes) text += `Notes: ${recReq.additionalNotes}\n`;
    }

    navigator.clipboard.writeText(text);
    setCopiedSpecs(true);
    setTimeout(() => setCopiedSpecs(false), 2000);
  };

  return (
    <div className="space-y-4" id="system-requirements-section">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <span>System Requirements</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${tier.color}`}>
                {tier.label}
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Hardware specifications parsed for {game.title} (v{game.version})
          </p>
        </div>

        {/* View mode toggle & Copy Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setActiveView('both')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeView === 'both'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Side by Side
            </button>
            <button
              onClick={() => setActiveView('minimum')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeView === 'minimum'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Minimum
            </button>
            <button
              onClick={() => setActiveView('recommended')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeView === 'recommended'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Recommended
            </button>
          </div>

          <button
            onClick={handleCopySpecs}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
            title="Copy requirements text to clipboard"
          >
            {copiedSpecs ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Specs</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hardware Specifications Cards */}
      <div className={`grid gap-4 ${activeView === 'both' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Minimum Specs Column */}
        {(activeView === 'both' || activeView === 'minimum') && parsedMin && (
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-sm flex flex-col">
            {/* Header Badge */}
            <div className="px-4 py-3 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
                <h4 className="font-extrabold text-xs sm:text-sm text-amber-300 uppercase tracking-wider">
                  Minimum Specifications
                </h4>
              </div>
              <span className="text-[10px] text-slate-400 font-mono bg-slate-800/80 px-2 py-0.5 rounded">
                Target: 720p - 1080p @ 30 FPS
              </span>
            </div>

            {/* Spec Rows */}
            <div className="p-4 space-y-3 divide-y divide-slate-800/50 text-xs">
              {/* OS */}
              <div className="pt-2 first:pt-0 flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-slate-800 text-slate-400 shrink-0 mt-0.5">
                  <Monitor className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Operating System
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                    <span className="font-semibold text-slate-200">{parsedMin.os.raw}</span>
                    {parsedMin.os.highlight && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                        {parsedMin.os.highlight}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* CPU */}
              <div className="pt-2 flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-slate-800 text-slate-400 shrink-0 mt-0.5">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Processor (CPU)
                  </span>
                  <p className="font-semibold text-slate-200 mt-0.5">{parsedMin.cpu.raw}</p>
                  {parsedMin.cpu.tags && parsedMin.cpu.tags.length > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      {parsedMin.cpu.tags.map((t, idx) => (
                        <span key={idx} className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800/80 text-amber-300/90 font-mono">
                          {t} Compatible
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* RAM */}
              <div className="pt-2 flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-slate-800 text-slate-400 shrink-0 mt-0.5">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Memory (RAM)
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-semibold text-slate-200">{parsedMin.ram.raw}</span>
                    {parsedMin.ram.highlight && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold font-mono">
                        {parsedMin.ram.highlight}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* GPU */}
              <div className="pt-2 flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-slate-800 text-slate-400 shrink-0 mt-0.5">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Graphics Card (GPU)
                  </span>
                  <p className="font-semibold text-slate-200 mt-0.5">{parsedMin.gpu.raw}</p>
                  {parsedMin.gpu.highlight && (
                    <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-amber-300 font-mono">
                      Min {parsedMin.gpu.highlight}
                    </span>
                  )}
                </div>
              </div>

              {/* DirectX */}
              <div className="pt-2 flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-slate-800 text-slate-400 shrink-0 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    DirectX API
                  </span>
                  <span className="font-semibold text-slate-200 mt-0.5 block">{parsedMin.directX.raw}</span>
                </div>
              </div>

              {/* Storage */}
              <div className="pt-2 flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-slate-800 text-slate-400 shrink-0 mt-0.5">
                  <HardDrive className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Storage Space
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-semibold text-slate-200">{parsedMin.storage.raw}</span>
                    {parsedMin.storage.tags?.map((tag, idx) => (
                      <span key={idx} className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {parsedMin.notes && (
                <div className="pt-2 flex items-start gap-3">
                  <div className="p-1.5 rounded-md bg-slate-800 text-amber-400 shrink-0 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Additional Notes
                    </span>
                    <p className="text-slate-300 text-xs italic mt-0.5 leading-relaxed">
                      {parsedMin.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recommended Specs Column */}
        {(activeView === 'both' || activeView === 'recommended') && parsedRec && (
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-sm flex flex-col">
            {/* Header Badge */}
            <div className="px-4 py-3 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                <h4 className="font-extrabold text-xs sm:text-sm text-emerald-300 uppercase tracking-wider">
                  Recommended Specifications
                </h4>
              </div>
              <span className="text-[10px] text-emerald-300 font-mono bg-emerald-500/20 px-2 py-0.5 rounded font-bold">
                Target: 1080p / 1440p @ 60 FPS
              </span>
            </div>

            {/* Spec Rows */}
            <div className="p-4 space-y-3 divide-y divide-slate-800/50 text-xs">
              {/* OS */}
              <div className="pt-2 first:pt-0 flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-slate-800 text-slate-400 shrink-0 mt-0.5">
                  <Monitor className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Operating System
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                    <span className="font-semibold text-slate-200">{parsedRec.os.raw}</span>
                    {parsedRec.os.highlight && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                        {parsedRec.os.highlight}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* CPU */}
              <div className="pt-2 flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-slate-800 text-slate-400 shrink-0 mt-0.5">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Processor (CPU)
                  </span>
                  <p className="font-semibold text-slate-200 mt-0.5">{parsedRec.cpu.raw}</p>
                  {parsedRec.cpu.tags && parsedRec.cpu.tags.length > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      {parsedRec.cpu.tags.map((t, idx) => (
                        <span key={idx} className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 font-mono font-semibold">
                          {t} Optimized
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* RAM */}
              <div className="pt-2 flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-slate-800 text-slate-400 shrink-0 mt-0.5">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Memory (RAM)
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-semibold text-slate-200">{parsedRec.ram.raw}</span>
                    {parsedRec.ram.highlight && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold font-mono">
                        {parsedRec.ram.highlight}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* GPU */}
              <div className="pt-2 flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-slate-800 text-slate-400 shrink-0 mt-0.5">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Graphics Card (GPU)
                  </span>
                  <p className="font-semibold text-slate-200 mt-0.5">{parsedRec.gpu.raw}</p>
                  {parsedRec.gpu.highlight && (
                    <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                      {parsedRec.gpu.highlight}
                    </span>
                  )}
                </div>
              </div>

              {/* DirectX */}
              <div className="pt-2 flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-slate-800 text-slate-400 shrink-0 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    DirectX API
                  </span>
                  <span className="font-semibold text-slate-200 mt-0.5 block">{parsedRec.directX.raw}</span>
                </div>
              </div>

              {/* Storage */}
              <div className="pt-2 flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-slate-800 text-slate-400 shrink-0 mt-0.5">
                  <HardDrive className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Storage Space
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-semibold text-slate-200">{parsedRec.storage.raw}</span>
                    {parsedRec.storage.tags?.map((tag, idx) => (
                      <span key={idx} className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {parsedRec.notes && (
                <div className="pt-2 flex items-start gap-3">
                  <div className="p-1.5 rounded-md bg-slate-800 text-slate-400 shrink-0 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Additional Notes
                    </span>
                    <p className="text-slate-300 text-xs italic mt-0.5 leading-relaxed">
                      {parsedRec.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Interactive AI Hardware Evaluation Banner */}
      {onOpenAiWithGame && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-1.5">
                <span>Can Your PC Run {game.title}?</span>
                <span className="text-[9px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.2 rounded font-mono uppercase">
                  AI Benchmark
                </span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Test your specific graphics card, CPU, and RAM with alsabithal AI for expected FPS and graphics preset advice.
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenAiWithGame(game, `Can my PC run ${game.title}? Here are the requirements: Minimum ${minReq?.graphics}, Recommended ${recReq?.graphics}. My PC specs are:`)}
            className="shrink-0 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Check My PC with AI</span>
          </button>
        </div>
      )}
    </div>
  );
};

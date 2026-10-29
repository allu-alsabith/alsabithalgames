import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  RefreshCw, 
  Copy, 
  Check, 
  Cpu, 
  ShieldCheck, 
  AlertTriangle, 
  HardDrive, 
  Gamepad2, 
  Zap, 
  ChevronDown, 
  Search, 
  Minimize2, 
  Maximize2,
  ExternalLink,
  Sliders,
  HelpCircle,
  Clock
} from 'lucide-react';
import Markdown from 'react-markdown';
import { Game, ChatMessage, AiModelMode } from '../types';
import { GAMES_DATA } from '../data/gamesData';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGame?: Game | null;
  initialPrompt?: string;
  onSelectGame?: (game: Game) => void;
}

const PRESET_PROMPTS = [
  {
    label: 'Can my PC run this?',
    icon: Cpu,
    color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20',
    prompt: 'Can you check if my PC can run this game? Here are my specs: Windows 11, Intel Core i5 / AMD Ryzen 5, 16GB RAM, and an NVIDIA GTX 1660 / RTX 3060. What resolution, graphics preset, and FPS should I expect?',
  },
  {
    label: 'Defender flagged steam_api64.dll',
    icon: ShieldCheck,
    color: 'text-amber-400 border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20',
    prompt: 'Windows Defender just flagged steam_api64.dll as HackTool:Win32/Crack. Is this a false positive, why does it happen on portable games, and how do I safely add an exclusion folder?',
  },
  {
    label: 'Fix ISDone.dll / Unarc.dll error',
    icon: AlertTriangle,
    color: 'text-red-400 border-red-500/30 bg-red-500/10 hover:bg-red-500/20',
    prompt: 'I am getting an ISDone.dll / Unarc.dll error code while extracting/installing. How do I fix this step-by-step?',
  },
  {
    label: 'Online-Fix Multiplayer Guide',
    icon: Zap,
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20',
    prompt: 'How does Online-Fix / LAN multiplayer work for this game? Explain the step-by-step guide to connect with friends via Steam overlay.',
  },
  {
    label: 'Best Graphic Settings & FPS',
    icon: Sliders,
    color: 'text-purple-400 border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20',
    prompt: 'What are the best optimized graphics settings for this game to maximize FPS without losing visual quality? Any mods or config tweaks?',
  },
  {
    label: 'Recommend Similar Games',
    icon: Gamepad2,
    color: 'text-pink-400 border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20',
    prompt: 'Can you recommend 5 top PC games available on alsabithalgames that are similar in gameplay, vibe, or genre to this game?',
  },
];

const INITIAL_GREETING: ChatMessage = {
  id: 'msg-init',
  role: 'model',
  content: `### Welcome to alsabithalgames AI Assistant! 🎮
I am your dedicated gaming and technical support companion on **alsabithalgames**.

Here is what I can assist you with:
* **PC System Compatibility**: Check your CPU, GPU, and RAM against game requirements for realistic FPS estimates.
* **Technical Fixes**: Troubleshoot Windows Defender false positives (\`steam_api64.dll\`), missing DLLs (\`vcruntime140.dll\`, DirectX), and \`ISDone.dll\` archive errors.
* **Online-Fix Multiplayer**: Step-by-step co-op setup, Steam overlay invites, and LAN workarounds.
* **Game Guides & Walkthroughs**: Story summaries, DLC lists, controls, secret unlocks, and graphic optimization tweaks.

Click any quick prompt below or type your question to get started!`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  modelUsed: 'gemini-3.5-flash',
};

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  initialGame,
  initialPrompt,
  onSelectGame,
}) => {
  // Attached Game Context
  const [activeGame, setActiveGame] = useState<Game | null>(initialGame || null);
  const [gameSearchOpen, setGameSearchOpen] = useState(false);
  const [gameSearchQuery, setGameSearchQuery] = useState('');

  // Model Mode: fast, smart, complex
  const [modelMode, setModelMode] = useState<AiModelMode>('smart');

  // Multi-turn Chat history state with localStorage persistence
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('alsabithal_ai_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [INITIAL_GREETING];
  });

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);

  // Quick PC Specs Form Modal / Drawer
  const [showSpecsHelper, setShowSpecsHelper] = useState(false);
  const [specGpu, setSpecGpu] = useState('NVIDIA GeForce RTX 3060 12GB');
  const [specCpu, setSpecCpu] = useState('AMD Ryzen 5 5600X / Intel Core i5-12400');
  const [specRam, setSpecRam] = useState('16 GB');
  const [specResolution, setSpecResolution] = useState('1080p (Full HD)');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Sync initial game prop when opened with a specific game
  useEffect(() => {
    if (initialGame) {
      setActiveGame(initialGame);
    }
  }, [initialGame]);

  // Sync initial prompt if passed
  useEffect(() => {
    if (initialPrompt && isOpen) {
      setInputText(initialPrompt);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [initialPrompt, isOpen]);

  // Persist messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('alsabithal_ai_chat_history', JSON.stringify(messages));
    } catch (e) {
      console.error(e);
    }
  }, [messages]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputText).trim();
    if (!text || isLoading) return;

    setErrorMsg(null);
    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      gameTitle: activeGame?.title,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    try {
      // Prepare payload for server API
      // Send conversation history (filter to role and content)
      const payloadMessages = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          mode: modelMode,
          gameContext: activeGame
            ? {
                title: activeGame.title,
                version: activeGame.version,
                size: activeGame.size,
                developer: activeGame.developer,
                publisher: activeGame.publisher,
                genres: activeGame.genres,
                hasOnlineFix: activeGame.hasOnlineFix,
                onlineFixNote: activeGame.onlineFixNote,
                requirements: activeGame.requirements,
                includedDLCs: activeGame.includedDLCs,
                features: [
                  activeGame.cleanStatus,
                  `Steam App ID: ${activeGame.steamAppId}`,
                  `Total Views: ${activeGame.viewsCount}`,
                ],
              }
            : null,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to get response from Gemini AI.');
      }

      const modelMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'model',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || 'gemini-3.5-flash',
        gameTitle: activeGame?.title,
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (err: unknown) {
      console.error('Chat error:', err);
      const errMsg = err instanceof Error ? err.message : 'An error occurred while communicating with Gemini.';
      setErrorMsg(errMsg);
      const fallbackMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `⚠️ **Connection Issue**: ${errMsg}\n\n*Tip: You can re-try with Fast Lite mode or ask again.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'system-fallback',
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Clear your conversation history with alsabithal AI?')) {
      setMessages([INITIAL_GREETING]);
      try {
        localStorage.removeItem('alsabithal_ai_chat_history');
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleCopyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleApplySpecsCheck = () => {
    const gameName = activeGame?.title || 'this game';
    const prompt = `Please do a comprehensive PC System Compatibility & Performance check for **${gameName}** with my hardware:
• GPU: ${specGpu}
• CPU: ${specCpu}
• RAM: ${specRam}
• Target Resolution: ${specResolution}

Please provide:
1. Compatibility Verdict: (Below Minimum / Meets Minimum / Recommended / High-End)
2. Estimated Average FPS & Frametime Stability (at Low, Medium, and High/Ultra settings)
3. Best recommended settings & upscaling (DLSS/FSR/XeSS)
4. Any bottleneck or RAM/VRAM warnings`;

    setShowSpecsHelper(false);
    handleSendMessage(prompt);
  };

  const filteredGamesForSearch = GAMES_DATA.filter((g) =>
    g.title.toLowerCase().includes(gameSearchQuery.toLowerCase()) ||
    g.genres.some((genre) => genre.toLowerCase().includes(gameSearchQuery.toLowerCase()))
  ).slice(0, 8);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className={`relative w-full rounded-2xl bg-[#090e17] border border-slate-700/80 shadow-2xl flex flex-col overflow-hidden text-slate-200 transition-all duration-200 ${
          isMaximized 
            ? 'h-[98vh] max-w-[96vw]' 
            : 'h-[90vh] max-h-[820px] max-w-4xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#0d1422] select-none">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/40">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0d1422] animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                  alsabithal <span className="text-emerald-400">AI Assistant</span>
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Gemini
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Gaming Intelligence & Technical Troubleshooting Companion
              </p>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-2">
            {/* Model Mode Selector */}
            <div className="hidden sm:flex items-center bg-slate-900 border border-slate-700/80 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setModelMode('fast')}
                title="Fast Lite (gemini-3.1-flash-lite) - Quick response"
                className={`px-2 py-1 rounded font-medium flex items-center gap-1 transition-all ${
                  modelMode === 'fast'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>Fast</span>
              </button>
              <button
                onClick={() => setModelMode('smart')}
                title="Smart Flash (gemini-3.5-flash) - Balanced intelligence"
                className={`px-2 py-1 rounded font-medium flex items-center gap-1 transition-all ${
                  modelMode === 'smart'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Smart</span>
              </button>
              <button
                onClick={() => setModelMode('complex')}
                title="Deep Technical (gemini-3.1-pro-preview / fallback) - In-depth analysis"
                className={`px-2 py-1 rounded font-medium flex items-center gap-1 transition-all ${
                  modelMode === 'complex'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Cpu className="w-3 h-3" />
                <span>Pro</span>
              </button>
            </div>

            {/* Clear Chat Button */}
            <button
              onClick={handleClearChat}
              title="Clear conversation"
              className="p-2 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Maximize Toggle */}
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              title={isMaximized ? 'Restore size' : 'Maximize'}
              className="p-2 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700 hidden sm:block"
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/40 transition-colors border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Game Context Bar */}
        <div className="px-4 py-2 bg-[#0b101c] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-slate-400 font-medium shrink-0">Game Context:</span>
            {activeGame ? (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-2.5 py-1 text-emerald-300 truncate max-w-sm sm:max-w-md">
                <img
                  src={activeGame.posterUrl}
                  alt={activeGame.title}
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded object-cover shrink-0"
                />
                <span className="font-bold truncate">{activeGame.title}</span>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">({activeGame.size})</span>
                <button
                  onClick={() => setActiveGame(null)}
                  title="Remove game context"
                  className="text-slate-400 hover:text-red-400 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <span className="text-slate-400 italic">None (General Gaming & Tech Support)</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Attach Game Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setGameSearchOpen(!gameSearchOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{activeGame ? 'Change Game' : 'Attach Game'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {gameSearchOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50"
                  onMouseLeave={() => setGameSearchOpen(false)}
                >
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search game title..."
                      value={gameSearchQuery}
                      onChange={(e) => setGameSearchQuery(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-56 overflow-y-auto custom-scrollbar flex flex-col gap-1">
                    {filteredGamesForSearch.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => {
                          setActiveGame(g);
                          setGameSearchOpen(false);
                          setGameSearchQuery('');
                        }}
                        className={`w-full text-left p-2 rounded-lg flex items-center gap-2 transition-colors ${
                          activeGame?.id === g.id
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <img
                          src={g.posterUrl}
                          alt={g.title}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded object-cover shrink-0"
                        />
                        <div className="truncate">
                          <p className="font-semibold text-xs truncate text-white">{g.title}</p>
                          <p className="text-[10px] text-slate-400">{g.size} • {g.developer}</p>
                        </div>
                      </button>
                    ))}
                    {filteredGamesForSearch.length === 0 && (
                      <p className="p-3 text-center text-xs text-slate-400">No matching games found.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick PC Hardware Compatibility Modal Trigger */}
            <button
              onClick={() => setShowSpecsHelper(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-medium transition-colors"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden xs:inline">Check PC Specs</span>
            </button>
          </div>
        </div>

        {/* Scrollable Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar bg-[#080c14]">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div className="shrink-0">
                  {isUser ? (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-700 flex items-center justify-center text-white font-bold text-xs shadow">
                      U
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-600 flex items-center justify-center text-white shadow">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Message Content Bubble */}
                <div
                  className={`relative rounded-2xl p-4 text-sm leading-relaxed border transition-all ${
                    isUser
                      ? 'bg-emerald-950/40 text-emerald-100 border-emerald-500/40 rounded-tr-none'
                      : 'bg-[#101726] text-slate-200 border-slate-800 rounded-tl-none shadow-lg'
                  }`}
                >
                  {/* Context Header for User Message if Game Context was present */}
                  {isUser && msg.gameTitle && (
                    <div className="text-[10px] text-emerald-400/80 font-mono mb-1.5 flex items-center gap-1">
                      <Gamepad2 className="w-3 h-3" />
                      <span>About: {msg.gameTitle}</span>
                    </div>
                  )}

                  {/* Render Message Body with Markdown */}
                  <div className="prose prose-invert prose-sm max-w-none text-slate-200 space-y-2 prose-pre:bg-slate-900/90 prose-pre:border prose-pre:border-slate-800 prose-code:text-emerald-300 prose-code:bg-slate-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-a:text-cyan-400">
                    <Markdown>{msg.content}</Markdown>
                  </div>

                  {/* Footer Meta info: timestamp, model badge, copy button */}
                  <div className="flex items-center justify-between gap-4 mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {msg.timestamp}
                      </span>
                      {msg.modelUsed && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">
                          {msg.modelUsed}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleCopyMessage(msg.content, msg.id)}
                      className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-3xl mr-auto">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-600 flex items-center justify-center text-white shadow shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="rounded-2xl p-4 bg-[#101726] border border-slate-800 rounded-tl-none text-slate-400 text-xs flex items-center gap-3 shadow-lg">
                <div className="flex gap-1.5 items-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                </div>
                <span>alsabithal AI is analyzing game data and preparing your answer...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Preset Prompt Action Chips */}
        <div className="px-4 py-2.5 bg-[#0b101c] border-t border-slate-800/80 overflow-x-auto custom-scrollbar flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            Quick Helps:
          </span>
          {PRESET_PROMPTS.map((preset, idx) => {
            const Icon = preset.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSendMessage(preset.prompt)}
                disabled={isLoading}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${preset.color} disabled:opacity-50`}
              >
                <Icon className="w-3 h-3" />
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>

        {/* Message Input Form */}
        <div className="p-3 sm:p-4 bg-[#0d1422] border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2"
          >
            <div className="relative flex-1 rounded-xl bg-slate-900 border border-slate-700/80 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  activeGame
                    ? `Ask anything about ${activeGame.title} (gameplay, specs, error fixes)...`
                    : 'Ask about any game, troubleshoot errors, check PC specs...'
                }
                rows={2}
                className="w-full bg-transparent px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none resize-none custom-scrollbar"
              />
              <div className="flex items-center justify-between px-3 pb-2 text-[10px] text-slate-400">
                <span className="hidden sm:inline">Press Enter to send, Shift+Enter for new line</span>
                <span className="font-mono">{inputText.length} chars</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="h-12 px-4 sm:px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
              ) : (
                <>
                  <span>Send</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[10px] text-slate-400 mt-2">
            alsabithal AI is powered by Google Gemini. Provides real-time compatibility checks, installation guides, and troubleshooting assistance.
          </p>
        </div>

        {/* Quick PC Specs Form Modal/Drawer */}
        {showSpecsHelper && (
          <div 
            className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setShowSpecsHelper(false)}
          >
            <div 
              className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-base text-white">Can My PC Run This Game?</h3>
                </div>
                <button
                  onClick={() => setShowSpecsHelper(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300">
                Enter your PC hardware specs to ask Gemini for a detailed compatibility check, target FPS, and optimized graphic settings.
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Graphics Card (GPU)</label>
                  <input
                    type="text"
                    value={specGpu}
                    onChange={(e) => setSpecGpu(e.target.value)}
                    placeholder="e.g. NVIDIA RTX 3060, GTX 1650, Radeon RX 6600"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Processor (CPU)</label>
                  <input
                    type="text"
                    value={specCpu}
                    onChange={(e) => setSpecCpu(e.target.value)}
                    placeholder="e.g. AMD Ryzen 5 5600, Intel Core i5-12400"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">RAM Memory</label>
                    <select
                      value={specRam}
                      onChange={(e) => setSpecRam(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="8 GB">8 GB RAM</option>
                      <option value="16 GB">16 GB RAM</option>
                      <option value="32 GB">32 GB RAM</option>
                      <option value="64 GB">64 GB RAM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Target Resolution</label>
                    <select
                      value={specResolution}
                      onChange={(e) => setSpecResolution(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="1080p (Full HD)">1080p (Full HD)</option>
                      <option value="1440p (2K)">1440p (2K)</option>
                      <option value="4K (2160p)">4K (2160p)</option>
                      <option value="Steam Deck (800p)">Steam Deck (800p)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSpecsHelper(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplySpecsCheck}
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze Compatibility</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

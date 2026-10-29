import React, { useState, useRef } from 'react';
import {
  X,
  User,
  ShieldCheck,
  Bookmark,
  Download,
  Settings,
  Database,
  HardDrive,
  Trash2,
  Check,
  Upload,
  FileDown,
  Volume2,
  VolumeX,
  Copy,
  ExternalLink,
  Sparkles,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  History,
  Clock,
  Layers,
} from 'lucide-react';
import { useUserData } from '../hooks/useUserData';
import { DownloadRecord } from '../types';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  username: string;
  email?: string;
  onLogin: (name: string, email?: string) => void;
  onLogout: () => void;
  bookmarksCount: number;
  onViewBookmarks: () => void;
  onSelectGameById?: (gameId: string) => void;
}

const AVATAR_COLORS = [
  { name: 'Emerald', class: 'bg-emerald-600' },
  { name: 'Teal', class: 'bg-teal-600' },
  { name: 'Cyan', class: 'bg-cyan-600' },
  { name: 'Blue', class: 'bg-blue-600' },
  { name: 'Indigo', class: 'bg-indigo-600' },
  { name: 'Purple', class: 'bg-purple-600' },
  { name: 'Pink', class: 'bg-pink-600' },
  { name: 'Amber', class: 'bg-amber-600' },
];

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  isLoggedIn: propIsLoggedIn,
  username: propUsername,
  email: propEmail = 'amhereitsmeal@gmail.com',
  onLogin,
  onLogout,
  bookmarksCount,
  onViewBookmarks,
  onSelectGameById,
}) => {
  const {
    profile,
    settings,
    downloads,
    votedRequestIds,
    storageUsage,
    updateProfile,
    updateSettings,
    removeDownload,
    clearDownloads,
    exportData,
    importData,
    clearAll,
  } = useUserData();

  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'settings' | 'backup'>('profile');
  const [inputName, setInputName] = useState(profile.username || propUsername || 'AlsabithalPlayer');
  const [inputEmail, setInputEmail] = useState(profile.email || propEmail || 'amhereitsmeal@gmail.com');
  const [inputBio, setInputBio] = useState(profile.customBio || 'PC Gaming enthusiast & repacks archivist.');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Import / Export Feedback
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentIsLoggedIn = profile.isLoggedIn || propIsLoggedIn;
  const currentUsername = profile.username || propUsername || 'AlsabithalPlayer';
  const currentEmail = profile.email || propEmail || 'amhereitsmeal@gmail.com';

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) return;

    if (!currentIsLoggedIn) {
      onLogin(inputName.trim(), inputEmail.trim());
    } else {
      updateProfile({
        username: inputName.trim(),
        email: inputEmail.trim(),
        customBio: inputBio.trim(),
      });
    }

    setIsEditingProfile(false);
    setProfileSaveSuccess(true);
    setTimeout(() => setProfileSaveSuccess(false), 2500);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = importData(content);
        if (result.success) {
          setImportStatus({ type: 'success', message: result.message });
        } else {
          setImportStatus({ type: 'error', message: result.message });
        }
        setTimeout(() => setImportStatus(null), 4000);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResetData = () => {
    clearAll();
    setConfirmClearOpen(false);
    onLogout();
    setImportStatus({ type: 'success', message: 'All user data and local cache reset successfully.' });
    setTimeout(() => setImportStatus(null), 3000);
  };

  // Calculate approximate total download traffic logged
  const totalTrafficFormatted = (() => {
    let sumGb = 0;
    downloads.forEach((d) => {
      const match = d.fileSize.match(/([\d.]+)\s*(GB|MB)/i);
      if (match) {
        const val = parseFloat(match[1]);
        const unit = match[2].toUpperCase();
        if (unit === 'GB') sumGb += val;
        else if (unit === 'MB') sumGb += val / 1024;
      }
    });
    return sumGb > 0 ? `${sumGb.toFixed(1)} GB` : '0 GB';
  })();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl mac-liquid-glass border border-white/[0.14] rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col max-h-[90vh] text-slate-200"
        onClick={(e) => e.stopPropagation()}
        id="user-account-modal"
      >
        {/* macOS Window Titlebar */}
        <div className="px-4 py-2 bg-white/[0.03] border-b border-white/[0.06] flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full mac-dot-red inline-block cursor-pointer" onClick={onClose} />
            <span className="w-3 h-3 rounded-full mac-dot-yellow inline-block" />
            <span className="w-3 h-3 rounded-full mac-dot-green inline-block" />
            <span className="ml-2 text-xs font-mono text-slate-400">Settings & Profile</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Esc to close</span>
        </div>

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl ${
                profile.avatarColor || 'bg-emerald-600'
              } text-white font-black flex items-center justify-center text-base shadow-md uppercase shrink-0 border border-white/20`}
            >
              {currentUsername ? currentUsername.charAt(0) : 'G'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {currentUsername}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full mac-liquid-pill text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {currentIsLoggedIn ? 'Verified User' : 'Local Guest'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                User Library & Persistent Game Data Center
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl mac-liquid-pill text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/[0.08] mac-liquid-subtle px-4 sm:px-6 overflow-x-auto text-xs font-semibold gap-2 sm:gap-4 no-scrollbar">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-2 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'profile'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            Profile & Stats
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-2 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'history'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            Downloads History ({downloads.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-2 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            Preferences & Torrent
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`py-3 px-2 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'backup'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            Backup & Storage
          </button>
        </div>

        {/* Global Toast Message */}
        {importStatus && (
          <div
            className={`mx-4 sm:mx-6 mt-4 p-3 rounded-xl border text-xs flex items-center gap-2 animate-in fade-in ${
              importStatus.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                : 'bg-red-950/40 border-red-500/50 text-red-300'
            }`}
          >
            {importStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{importStatus.message}</span>
          </div>
        )}

        {/* Tab Contents */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: PROFILE & STATS */}
          {activeTab === 'profile' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
                  <Bookmark className="w-4 h-4 text-amber-400 mx-auto" />
                  <p className="text-xl font-black text-white">{bookmarksCount}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Saved Games</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
                  <Download className="w-4 h-4 text-emerald-400 mx-auto" />
                  <p className="text-xl font-black text-white">{downloads.length}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Downloads Logged</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
                  <HardDrive className="w-4 h-4 text-cyan-400 mx-auto" />
                  <p className="text-xl font-black text-white">{totalTrafficFormatted}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Logged Game Size</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
                  <Sparkles className="w-4 h-4 text-purple-400 mx-auto" />
                  <p className="text-xl font-black text-white">{votedRequestIds.length}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Votes Cast</p>
                </div>
              </div>

              {/* Profile Details Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    User Information
                  </h3>
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                  >
                    {isEditingProfile ? 'Cancel Editing' : 'Edit Profile'}
                  </button>
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Gamer Nickname</label>
                      <input
                        type="text"
                        required
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={inputEmail}
                        onChange={(e) => setInputEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Bio / Gamer Tagline</label>
                      <input
                        type="text"
                        value={inputBio}
                        onChange={(e) => setInputBio(e.target.value)}
                        maxLength={80}
                        placeholder="e.g. RPG and indie survival games enthusiast"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    {/* Avatar Color Picker */}
                    <div>
                      <label className="block text-slate-400 font-medium mb-1.5">Avatar Color</label>
                      <div className="flex items-center gap-2">
                        {AVATAR_COLORS.map((col) => (
                          <button
                            type="button"
                            key={col.name}
                            onClick={() => updateProfile({ avatarColor: col.class })}
                            className={`w-7 h-7 rounded-lg ${col.class} transition-all cursor-pointer flex items-center justify-center ${
                              profile.avatarColor === col.class
                                ? 'ring-2 ring-white scale-110'
                                : 'opacity-70 hover:opacity-100'
                            }`}
                            title={col.name}
                          >
                            {profile.avatarColor === col.class && <Check className="w-3.5 h-3.5 text-white" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                      >
                        Save Profile Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Status:</span>
                      <span className="font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {profile.membershipLevel || 'Verified Member'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Account Email:</span>
                      <span className="text-slate-200 font-mono text-[11px]">{currentEmail}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Member Since:</span>
                      <span className="text-slate-300">{profile.joinedDate || 'September 2026'}</span>
                    </div>

                    <div className="flex items-start justify-between py-1">
                      <span className="text-slate-400">Bio:</span>
                      <span className="text-slate-300 text-right max-w-xs italic">
                        "{profile.customBio || 'PC Gaming enthusiast & repacks archivist.'}"
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onViewBookmarks();
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
                >
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  View Saved Games ({bookmarksCount})
                </button>

                {currentIsLoggedIn ? (
                  <button
                    onClick={() => {
                      onLogout();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-red-950/40 hover:bg-red-900/40 text-red-400 border border-red-800/40 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out to Guest Mode
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    Sign In / Set Name
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DOWNLOADS HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Logged Downloads & Torrents
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Automatically recorded when you click direct mirrors or magnet links
                  </p>
                </div>

                {downloads.length > 0 && (
                  <button
                    onClick={clearDownloads}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-800/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear History
                  </button>
                )}
              </div>

              {downloads.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-2">
                  <Download className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-sm font-bold text-slate-300">No downloads logged yet</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    When you click download mirrors or copy magnet URIs on any game page, they will automatically appear here for convenient re-access.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                  {downloads.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 text-xs transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.gameCover && (
                          <img
                            src={item.gameCover}
                            alt={item.gameTitle}
                            className="w-10 h-12 object-cover rounded-lg shrink-0 border border-slate-800"
                            loading="lazy"
                          />
                        )}
                        <div className="min-w-0">
                          <button
                            onClick={() => {
                              if (onSelectGameById) onSelectGameById(item.gameId);
                              onClose();
                            }}
                            className="font-bold text-white hover:text-emerald-400 transition-colors text-left truncate block text-xs cursor-pointer"
                            title={item.gameTitle}
                          >
                            {item.gameTitle}
                          </button>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span className="px-1.5 py-0.2 rounded bg-slate-800 font-mono text-cyan-300 font-bold">
                              {item.mirrorName}
                            </span>
                            <span>•</span>
                            <span className="font-mono text-slate-300">{item.fileSize}</span>
                            <span>•</span>
                            <span className="text-slate-500">{item.formattedDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.downloadUrl && (
                          <a
                            href={item.downloadUrl}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-colors"
                            title="Re-open Download Link"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => removeDownload(item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Remove from history"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PREFERENCES & TORRENT */}
          {activeTab === 'settings' && (
            <div className="space-y-4 animate-in fade-in duration-150 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2">
                  Download & Mirror Preferences
                </h3>

                {/* Preferred Mirror */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Preferred Cloud Host</label>
                  <select
                    value={settings.preferredMirror}
                    onChange={(e) => updateSettings({ preferredMirror: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-emerald-400"
                  >
                    <option value="all">Show All Available Mirrors (Recommended)</option>
                    <option value="megadb">Prioritize MegaDB (Fastest Direct)</option>
                    <option value="1fichier">Prioritize 1fichier (High Capacity)</option>
                    <option value="qiwi">Prioritize Qiwi.gg</option>
                    <option value="torrent">Prioritize BitTorrent / Magnet</option>
                  </select>
                </div>

                {/* Preferred BitTorrent Client */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Preferred BitTorrent Client</label>
                  <select
                    value={settings.preferredTorrentClient}
                    onChange={(e) => updateSettings({ preferredTorrentClient: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-emerald-400"
                  >
                    <option value="qbittorrent">qBittorrent (Open Source, Ad-Free)</option>
                    <option value="transmission">Transmission (Lightweight)</option>
                    <option value="deluge">Deluge</option>
                    <option value="utorrent">uTorrent Classic</option>
                  </select>
                </div>

                {/* Auto Copy Magnet */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <div>
                    <p className="font-semibold text-white">Auto-Copy Magnet URI</p>
                    <p className="text-[11px] text-slate-400">
                      Copy magnet link to clipboard immediately when clicking open magnet
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateSettings({ autoCopyMagnet: !settings.autoCopyMagnet })}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      settings.autoCopyMagnet ? 'bg-emerald-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                        settings.autoCopyMagnet ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Download Audio Chime */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    {settings.downloadNotificationSound ? (
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-slate-500" />
                    )}
                    <div>
                      <p className="font-semibold text-white">Download Chime Tone</p>
                      <p className="text-[11px] text-slate-400">
                        Plays a pleasant confirmation chime when a download link is triggered
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateSettings({ downloadNotificationSound: !settings.downloadNotificationSound })}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      settings.downloadNotificationSound ? 'bg-emerald-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                        settings.downloadNotificationSound ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BACKUP & STORAGE */}
          {activeTab === 'backup' && (
            <div className="space-y-4 animate-in fade-in duration-150 text-xs">
              {/* Storage Usage Metric Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Browser Storage Footprint</h4>
                    <p className="text-slate-400 text-[11px]">
                      Encrypted and isolated in your local browser sandbox.
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-lg font-black text-emerald-400 font-mono">
                    {storageUsage.formattedSize}
                  </span>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">
                    {storageUsage.itemsCount} State Modules
                  </p>
                </div>
              </div>

              {/* Data Portability (Backup / Restore) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                  Backup & Restore (Data Portability)
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Export all your saved games, download history, game request votes, and custom preferences into a lightweight JSON file. You can import it on another computer or mobile device to sync your library anytime.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={exportData}
                    className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                  >
                    <FileDown className="w-4 h-4" />
                    Export Backup (JSON)
                  </button>

                  <label className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer">
                    <Upload className="w-4 h-4 text-cyan-400" />
                    <span>Import Backup (JSON)</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleFileImport}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Reset Data Warning Card */}
              <div className="p-4 rounded-2xl bg-red-950/20 border border-red-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-red-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    Reset All Saved User Data
                  </h4>

                  {!confirmClearOpen ? (
                    <button
                      onClick={() => setConfirmClearOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 text-red-400 border border-red-800/60 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Clear Data
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleResetData}
                        className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors cursor-pointer"
                      >
                        Confirm Wipe
                      </button>
                      <button
                        onClick={() => setConfirmClearOpen(false)}
                        className="px-2 py-1.5 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Permanently clears your saved games bookmarks, download history records, and voting flags on this browser.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

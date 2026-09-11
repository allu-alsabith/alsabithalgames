import { UserProfile, UserSettings, DownloadRecord, UserDataBackup, GameRequest } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'alsabithal_user_profile',
  SETTINGS: 'alsabithal_user_settings',
  BOOKMARKS: 'alsabithalgames_bookmarks',
  DOWNLOADS: 'alsabithal_download_history',
  VOTES: 'alsabithal_request_votes',
  USER_REQUESTS: 'alsabithal_user_requests',
};

const DEFAULT_PROFILE: UserProfile = {
  isLoggedIn: false,
  username: 'AlsabithalPlayer',
  email: 'amhereitsmeal@gmail.com',
  avatarColor: 'bg-emerald-600',
  joinedDate: 'September 2026',
  membershipLevel: 'Verified Free Member',
  customBio: 'PC Gaming enthusiast & repacks archivist.',
};

const DEFAULT_SETTINGS: UserSettings = {
  preferredMirror: 'all',
  preferredTorrentClient: 'qbittorrent',
  autoCopyMagnet: true,
  downloadNotificationSound: true,
};

const notifySubscribers = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('alsabithal_userdata_changed'));
  }
};

// Safe JSON Helpers
function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Failed to parse localStorage key ${key}`, e);
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifySubscribers();
  } catch (e) {
    console.error(`Failed to set localStorage key ${key}`, e);
  }
}

export const userDataService = {
  // 1. Profile Management
  getProfile(): UserProfile {
    return safeGet<UserProfile>(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
  },

  updateProfile(partial: Partial<UserProfile>): UserProfile {
    const current = this.getProfile();
    const updated: UserProfile = { ...current, ...partial };
    safeSet(STORAGE_KEYS.PROFILE, updated);
    return updated;
  },

  login(username: string, email?: string): UserProfile {
    const current = this.getProfile();
    const updated: UserProfile = {
      ...current,
      isLoggedIn: true,
      username: username.trim() || 'GamerPro',
      email: email?.trim() || current.email || 'amhereitsmeal@gmail.com',
    };
    safeSet(STORAGE_KEYS.PROFILE, updated);
    return updated;
  },

  logout(): UserProfile {
    const current = this.getProfile();
    const updated: UserProfile = {
      ...current,
      isLoggedIn: false,
    };
    safeSet(STORAGE_KEYS.PROFILE, updated);
    return updated;
  },

  // 2. Settings Management
  getSettings(): UserSettings {
    return safeGet<UserSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },

  updateSettings(partial: Partial<UserSettings>): UserSettings {
    const current = this.getSettings();
    const updated: UserSettings = { ...current, ...partial };
    safeSet(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  // 3. Bookmarks Management
  getBookmarks(): string[] {
    return safeGet<string[]>(STORAGE_KEYS.BOOKMARKS, ['game-1', 'game-2']);
  },

  setBookmarks(bookmarks: string[]): void {
    safeSet(STORAGE_KEYS.BOOKMARKS, bookmarks);
  },

  toggleBookmark(gameId: string): boolean {
    const current = this.getBookmarks();
    let updated: string[];
    const isNowBookmarked = !current.includes(gameId);
    if (isNowBookmarked) {
      updated = [...current, gameId];
    } else {
      updated = current.filter((id) => id !== gameId);
    }
    this.setBookmarks(updated);
    return isNowBookmarked;
  },

  isBookmarked(gameId: string): boolean {
    return this.getBookmarks().includes(gameId);
  },

  // 4. Download & Magnet History Management
  getDownloads(): DownloadRecord[] {
    return safeGet<DownloadRecord[]>(STORAGE_KEYS.DOWNLOADS, []);
  },

  logDownload(record: Omit<DownloadRecord, 'id' | 'timestamp' | 'formattedDate'>): DownloadRecord {
    const current = this.getDownloads();
    const newRecord: DownloadRecord = {
      ...record,
      id: `dl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      formattedDate: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    // Filter out duplicates of same mirror within last 5 seconds
    const filtered = current.filter(
      (d) => !(d.gameId === record.gameId && d.mirrorName === record.mirrorName && Date.now() - d.timestamp < 5000)
    );

    // Keep up to 100 recent downloads
    const updated = [newRecord, ...filtered].slice(0, 100);
    safeSet(STORAGE_KEYS.DOWNLOADS, updated);

    // Optional audio cue
    const settings = this.getSettings();
    if (settings.downloadNotificationSound) {
      this.playDownloadChime();
    }

    return newRecord;
  },

  removeDownloadRecord(id: string): void {
    const current = this.getDownloads();
    const updated = current.filter((d) => d.id !== id);
    safeSet(STORAGE_KEYS.DOWNLOADS, updated);
  },

  clearDownloads(): void {
    safeSet(STORAGE_KEYS.DOWNLOADS, []);
  },

  // 5. Game Request Votes Persistence
  getVotedRequestIds(): string[] {
    return safeGet<string[]>(STORAGE_KEYS.VOTES, []);
  },

  getVotedRequests(): string[] {
    return this.getVotedRequestIds();
  },

  hasVoted(requestId: string): boolean {
    return this.getVotedRequestIds().includes(requestId);
  },

  voteForRequest(requestId: string): boolean {
    const current = this.getVotedRequestIds();
    if (current.includes(requestId)) return false;
    const updated = [...current, requestId];
    safeSet(STORAGE_KEYS.VOTES, updated);
    return true;
  },

  toggleRequestVote(requestId: string): boolean {
    return this.voteForRequest(requestId);
  },

  // 6. User Custom Submitted Requests
  getUserRequests(): GameRequest[] {
    return safeGet<GameRequest[]>(STORAGE_KEYS.USER_REQUESTS, []);
  },

  getCustomRequests(): GameRequest[] {
    return this.getUserRequests();
  },

  addUserRequest(request: GameRequest): void {
    const current = this.getUserRequests();
    const updated = [request, ...current];
    safeSet(STORAGE_KEYS.USER_REQUESTS, updated);
  },

  saveCustomRequest(request: GameRequest): void {
    this.addUserRequest(request);
  },

  // 7. Data Portability: Export Backup JSON
  exportData(): void {
    const backup: UserDataBackup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      profile: this.getProfile(),
      settings: this.getSettings(),
      bookmarks: this.getBookmarks(),
      downloads: this.getDownloads(),
      votedRequestIds: this.getVotedRequestIds(),
      userRequests: this.getUserRequests(),
    };

    const jsonString = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alsabithalgames_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // 8. Data Portability: Import Backup JSON
  importData(jsonString: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonString) as Partial<UserDataBackup>;
      if (!data || typeof data !== 'object') {
        return { success: false, message: 'Invalid backup file format.' };
      }

      if (data.profile) safeSet(STORAGE_KEYS.PROFILE, data.profile);
      if (data.settings) safeSet(STORAGE_KEYS.SETTINGS, data.settings);
      if (Array.isArray(data.bookmarks)) safeSet(STORAGE_KEYS.BOOKMARKS, data.bookmarks);
      if (Array.isArray(data.downloads)) safeSet(STORAGE_KEYS.DOWNLOADS, data.downloads);
      if (Array.isArray(data.votedRequestIds)) safeSet(STORAGE_KEYS.VOTES, data.votedRequestIds);
      if (Array.isArray(data.userRequests)) safeSet(STORAGE_KEYS.USER_REQUESTS, data.userRequests);

      notifySubscribers();
      return { success: true, message: 'User data and library successfully restored!' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Error parsing backup file.' };
    }
  },

  // 9. Storage Metric
  getStorageUsage(): { usedBytes: number; formattedSize: string; itemsCount: number } {
    let totalBytes = 0;
    let itemsCount = 0;

    Object.values(STORAGE_KEYS).forEach((key) => {
      const raw = localStorage.getItem(key);
      if (raw) {
        totalBytes += raw.length * 2; // Approximate UTF-16 bytes
        itemsCount++;
      }
    });

    const formattedSize =
      totalBytes < 1024
        ? `${totalBytes} B`
        : totalBytes < 1024 * 1024
        ? `${(totalBytes / 1024).toFixed(1)} KB`
        : `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`;

    return { usedBytes: totalBytes, formattedSize, itemsCount };
  },

  // 10. Factory Reset
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
    // Also clear individual comments keys
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('alsabithal_') || k.startsWith('ankergames_'))) {
          localStorage.removeItem(k);
        }
      }
    } catch {
      // ignore
    }
    notifySubscribers();
  },

  // 11. Subtle Audio Chime for Download Initiation
  playDownloadChime(): void {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // Audio playback failed or blocked by autoplay policy
    }
  },
};

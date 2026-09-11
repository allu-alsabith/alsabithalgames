import { useState, useEffect, useCallback } from 'react';
import { userDataService } from '../services/userDataService';
import { UserProfile, UserSettings, DownloadRecord } from '../types';

export function useUserData() {
  const [profile, setProfile] = useState<UserProfile>(() => userDataService.getProfile());
  const [settings, setSettings] = useState<UserSettings>(() => userDataService.getSettings());
  const [bookmarks, setBookmarks] = useState<string[]>(() => userDataService.getBookmarks());
  const [downloads, setDownloads] = useState<DownloadRecord[]>(() => userDataService.getDownloads());
  const [votedRequestIds, setVotedRequestIds] = useState<string[]>(() => userDataService.getVotedRequestIds());
  const [storageUsage, setStorageUsage] = useState(() => userDataService.getStorageUsage());

  const syncState = useCallback(() => {
    setProfile(userDataService.getProfile());
    setSettings(userDataService.getSettings());
    setBookmarks(userDataService.getBookmarks());
    setDownloads(userDataService.getDownloads());
    setVotedRequestIds(userDataService.getVotedRequestIds());
    setStorageUsage(userDataService.getStorageUsage());
  }, []);

  useEffect(() => {
    const handleDataChange = () => {
      syncState();
    };

    window.addEventListener('alsabithal_userdata_changed', handleDataChange);
    window.addEventListener('storage', handleDataChange);

    return () => {
      window.removeEventListener('alsabithal_userdata_changed', handleDataChange);
      window.removeEventListener('storage', handleDataChange);
    };
  }, [syncState]);

  return {
    profile,
    settings,
    bookmarks,
    downloads,
    votedRequestIds,
    storageUsage,
    // Actions
    login: (name: string, email?: string) => userDataService.login(name, email),
    logout: () => userDataService.logout(),
    updateProfile: (partial: Partial<UserProfile>) => userDataService.updateProfile(partial),
    updateSettings: (partial: Partial<UserSettings>) => userDataService.updateSettings(partial),
    toggleBookmark: (gameId: string) => userDataService.toggleBookmark(gameId),
    logDownload: (record: Omit<DownloadRecord, 'id' | 'timestamp' | 'formattedDate'>) =>
      userDataService.logDownload(record),
    removeDownload: (id: string) => userDataService.removeDownloadRecord(id),
    clearDownloads: () => userDataService.clearDownloads(),
    voteRequest: (id: string) => userDataService.voteForRequest(id),
    exportData: () => userDataService.exportData(),
    importData: (json: string) => userDataService.importData(json),
    clearAll: () => userDataService.clearAll(),
    refresh: syncState,
  };
}

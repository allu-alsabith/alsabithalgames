export interface DownloadMirror {
  id: string;
  name: string;
  provider: 'Buzzheavier' | 'Gofile' | '1fichier' | 'MegaDB' | 'Torrent' | 'PixelDrain';
  speed: string;
  size: string;
  parts?: number;
  url: string;
  isDirect: boolean;
}

export interface SystemRequirements {
  os: string;
  processor: string;
  memory: string;
  graphics: string;
  directX: string;
  storage: string;
  additionalNotes?: string;
}

export interface Game {
  id: string;
  title: string;
  slug: string;
  version: string;
  size: string;
  rawSizeBytes: number; // for sorting
  releaseDate: string;
  lastUpdated: string;
  developer: string;
  publisher: string;
  genres: string[];
  steamAppId: number;
  posterUrl: string;
  bannerUrl: string;
  shortDescription: string;
  description: string;
  cleanStatus: string;
  sha256Hash: string;
  downloadsCount: number;
  rating: number; // 1-5
  viewsCount: number;
  hasOnlineFix: boolean;
  onlineFixNote?: string;
  steamUrl: string;
  isTrending?: boolean;
  isFeatured?: boolean;
  isRecentUpdate?: boolean;
  uploader: string;
  mirrors: DownloadMirror[];
  torrentMagnet?: string;
  torrentSize?: string;
  requirements: {
    minimum: SystemRequirements;
    recommended: SystemRequirements;
  };
  screenshots: string[];
  trailerUrl?: string;
  changelog?: string[];
  includedDLCs?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
  iconName: string;
  description: string;
  subGenres?: string[];
  filterTags?: string[];
  tagColor?: string;
}

export interface UpdateRecord {
  id: string;
  gameId: string;
  gameTitle: string;
  version: string;
  updateDate: string;
  timeAgo: string;
  uploader: string;
  size: string;
  posterUrl: string;
  changelogSummary: string;
  genres: string[];
}

export interface GameRequest {
  id: string;
  gameTitle: string;
  steamUrl: string;
  votes: number;
  maxVotes: number; // 20
  status: 'voting' | 'in-review' | 'approved' | 'added';
  requestedDate: string;
  requestedBy: string;
  genre: string;
  notes?: string;
}

export interface Publisher {
  id: string;
  name: string;
  country: string;
  gameCount: number;
  description: string;
  notableGames: string[];
}

export interface Comment {
  id: string;
  gameId: string;
  author: string;
  avatarColor: string;
  date: string;
  content: string;
  likes: number;
  rating?: number;
  isPinned?: boolean;
  isStaff?: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'download' | 'antivirus' | 'troubleshooting' | 'multiplayer' | 'general';
}

export interface Collection {
  id: string;
  title: string;
  subtitle: string;
  gameCount: number;
  bannerUrl: string;
  featuredGameTitles: string[];
  description: string;
  tag: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatarColor: string;
  points: number;
  approvedRequests: number;
  testedGames: number;
  badge: 'Diamond Contributor' | 'Emerald Master' | 'Platinum Uploader' | 'Gold Reviewer' | 'Silver Supporter';
  joinedDate: string;
}

export type ViewTab = 
  | 'home' 
  | 'browse' 
  | 'trending' 
  | 'collections' 
  | 'updates' 
  | 'leaderboard' 
  | 'requests' 
  | 'publishers' 
  | 'faq' 
  | 'bookmarks'
  | 'ai-assistant';

export type AiModelMode = 'fast' | 'smart' | 'complex';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
  gameTitle?: string;
}

export interface UserProfile {
  isLoggedIn: boolean;
  username: string;
  email: string;
  avatarColor: string;
  joinedDate: string;
  membershipLevel: string;
  customBio?: string;
}

export interface UserSettings {
  preferredMirror: 'all' | 'megadb' | '1fichier' | 'qiwi' | 'gofile' | 'torrent';
  preferredTorrentClient: 'qbittorrent' | 'utorrent' | 'transmission' | 'deluge';
  autoCopyMagnet: boolean;
  downloadNotificationSound: boolean;
}

export interface DownloadRecord {
  id: string;
  gameId: string;
  gameTitle: string;
  gameCover: string;
  fileSize: string;
  type: 'magnet' | 'direct' | 'torrent_file';
  mirrorName: string;
  downloadUrl?: string;
  timestamp: number;
  formattedDate: string;
}

export interface UserDataBackup {
  version: number;
  exportedAt: string;
  profile: UserProfile;
  settings: UserSettings;
  bookmarks: string[];
  downloads: DownloadRecord[];
  votedRequestIds: string[];
  userRequests: GameRequest[];
}


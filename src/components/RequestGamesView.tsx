import React, { useState, useEffect } from 'react';
import { MessageSquarePlus, ThumbsUp, CheckCircle2, Clock, AlertCircle, ExternalLink, Plus, Search, Sparkles } from 'lucide-react';
import { GameRequest } from '../types';
import { INITIAL_REQUESTS } from '../data/requestsData';
import { userDataService } from '../services/userDataService';

interface RequestGamesViewProps {
  isLoggedIn: boolean;
  onOpenAccount: () => void;
}

export const RequestGamesView: React.FC<RequestGamesViewProps> = ({
  isLoggedIn,
  onOpenAccount,
}) => {
  const [requests, setRequests] = useState<GameRequest[]>(() => {
    const custom = userDataService.getCustomRequests();
    return [...custom, ...INITIAL_REQUESTS];
  });
  const [activeFilter, setActiveFilter] = useState<'all' | 'voting' | 'in-review' | 'approved' | 'added'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [votedIds, setVotedIds] = useState<Set<string>>(() => {
    return new Set(userDataService.getVotedRequests());
  });

  // Sync state if userDataService emits updates
  useEffect(() => {
    const handleUpdate = () => {
      const custom = userDataService.getCustomRequests();
      setRequests([...custom, ...INITIAL_REQUESTS]);
      setVotedIds(new Set(userDataService.getVotedRequests()));
    };
    window.addEventListener('alsabithal_userdata_changed', handleUpdate);
    return () => window.removeEventListener('alsabithal_userdata_changed', handleUpdate);
  }, []);

  // Form states
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSteamUrl, setNewSteamUrl] = useState('');
  const [newGenre, setNewGenre] = useState('Action');

  const handleVote = (reqId: string) => {
    if (!isLoggedIn) {
      onOpenAccount();
      return;
    }

    if (votedIds.has(reqId)) return;

    userDataService.toggleRequestVote(reqId);
    setVotedIds(new Set([...votedIds, reqId]));

    setRequests(
      requests.map((r) => {
        if (r.id === reqId) {
          const updatedVotes = r.votes + 1;
          const updatedStatus = updatedVotes >= r.maxVotes && r.status === 'voting' ? 'in-review' : r.status;
          return {
            ...r,
            votes: updatedVotes,
            status: updatedStatus,
          };
        }
        return r;
      })
    );
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSteamUrl.trim()) return;

    const profile = userDataService.getProfile();
    const newReq: GameRequest = {
      id: `req-${Date.now()}`,
      gameTitle: newTitle.trim(),
      steamUrl: newSteamUrl.trim(),
      votes: 1,
      maxVotes: 20,
      status: 'voting',
      requestedDate: 'Today',
      requestedBy: profile.username || 'You',
      genre: newGenre,
      notes: 'Newly requested game',
    };

    userDataService.saveCustomRequest(newReq);
    userDataService.toggleRequestVote(newReq.id);
    setRequests([newReq, ...requests]);
    setVotedIds(new Set([...votedIds, newReq.id]));
    setNewTitle('');
    setNewSteamUrl('');
    setShowSubmitModal(false);
  };

  const filteredRequests = requests.filter((r) => {
    const matchesFilter = activeFilter === 'all' || r.status === activeFilter;
    const matchesSearch = r.gameTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.genre.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 p-6 border border-amber-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
              <MessageSquarePlus className="w-3.5 h-3.5" />
              Community Driven Requests
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Request PC Games & Vote
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Want a game added to alsabithalgames? Submit the official Steam store link! When a request reaches <strong>20 community upvotes</strong>, our team verifies and tests the portable build. Approved games are uploaded within 24 hours.
            </p>
          </div>

          <button
            onClick={() => {
              if (!isLoggedIn) {
                onOpenAccount();
              } else {
                setShowSubmitModal(true);
              }
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            Submit New Game Request
          </button>
        </div>
      </div>

      {/* Rules Notice */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
          <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">
            1
          </span>
          <div>
            <strong className="text-slate-200">Steam Link Only</strong>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Submit valid PC Steam store URLs so metadata and requirements can be retrieved.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
          <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0">
            2
          </span>
          <div>
            <strong className="text-slate-200">20 Votes Threshold</strong>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Community upvotes prioritize demand and prevent spam requests.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
          <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
            3
          </span>
          <div>
            <strong className="text-slate-200">24h Upload Guarantee</strong>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Once greenlit and verified, portable archives are posted to high-speed cloud mirrors.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs font-semibold pb-1 sm:pb-0">
          {(['all', 'voting', 'in-review', 'approved', 'added'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`px-3 py-1.5 rounded-lg capitalize whitespace-nowrap transition-colors ${
                activeFilter === status
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {status === 'all' ? 'All Requests' : status.replace('-', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search requested games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRequests.map((req) => {
          const hasVoted = votedIds.has(req.id);
          const percent = Math.min(100, Math.round((req.votes / req.maxVotes) * 100));

          return (
            <div
              key={req.id}
              className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base text-white hover:text-amber-400 transition-colors">
                      {req.gameTitle}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{req.genre}</span>
                      <span>•</span>
                      <span>Requested by {req.requestedBy}</span>
                      <span>•</span>
                      <span>{req.requestedDate}</span>
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {req.status === 'added' && (
                      <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> ADDED
                      </span>
                    )}
                    {req.status === 'approved' && (
                      <span className="px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-extrabold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> APPROVED
                      </span>
                    )}
                    {req.status === 'in-review' && (
                      <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> IN REVIEW
                      </span>
                    )}
                    {req.status === 'voting' && (
                      <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold">
                        VOTING ({req.votes}/{req.maxVotes})
                      </span>
                    )}
                  </div>
                </div>

                {req.notes && (
                  <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                    {req.notes}
                  </p>
                )}

                {/* Progress bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Community Votes</span>
                    <span className="font-mono text-amber-400 font-bold">
                      {req.votes} / {req.maxVotes} votes ({percent}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-300 ${
                        percent >= 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-amber-400'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <a
                  href={req.steamUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                  View Steam Store
                </a>

                {req.status !== 'added' && (
                  <button
                    onClick={() => handleVote(req.id)}
                    disabled={hasVoted}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      hasVoted
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    {hasVoted ? 'Voted' : 'Upvote (+1)'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Submitting New Request */}
      {showSubmitModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowSubmitModal(false)}
        >
          <div
            className="w-full max-w-md bg-[#0f172a] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-white">
                Request a New Game
              </h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Game Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. S.T.A.L.K.E.R. 2: Heart of Chornobyl"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Steam Store Link
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://store.steampowered.com/app/..."
                  value={newSteamUrl}
                  onChange={(e) => setNewSteamUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Primary Genre
                </label>
                <select
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="Action">Action</option>
                  <option value="RPG">RPG</option>
                  <option value="Open World">Open World</option>
                  <option value="Horror">Horror</option>
                  <option value="Strategy">Strategy</option>
                  <option value="Simulation">Simulation</option>
                  <option value="Indie">Indie</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

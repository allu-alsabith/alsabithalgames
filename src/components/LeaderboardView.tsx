import React from 'react';
import { Trophy, Medal, Award, CheckCircle2, Star, ShieldCheck, Flame, Users, Sparkles, HelpCircle } from 'lucide-react';
import { LEADERBOARD_DATA } from '../data/leaderboardData';

interface LeaderboardViewProps {
  onOpenRequests: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ onOpenRequests }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-r from-amber-950/50 via-slate-900 to-emerald-950/50 p-6 sm:p-8">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold">
            <Trophy className="w-3.5 h-3.5" />
            Community Leaderboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Top Contributors & Archivists
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Recognizing community members who test pre-installed releases, maintain high-speed cloud mirrors, submit verified game requests, and verify Microsoft Defender clean signatures.
          </p>
        </div>

        {/* Top 3 Podium Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {LEADERBOARD_DATA.slice(0, 3).map((user, idx) => {
            const isFirst = idx === 0;
            return (
              <div
                key={user.rank}
                className={`relative rounded-xl p-4 border transition-all ${
                  isFirst
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-950/30 ring-1 ring-amber-500/30'
                    : idx === 1
                    ? 'bg-slate-800/60 border-slate-700'
                    : 'bg-amber-900/10 border-amber-700/40'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                      isFirst
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : idx === 1
                        ? 'bg-slate-300 text-slate-900'
                        : 'bg-amber-700 text-amber-100'
                    }`}
                  >
                    #{user.rank}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900/80 text-amber-400 font-bold border border-amber-500/30">
                    {user.badge}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${user.avatarColor} flex items-center justify-center font-black text-white text-base shadow`}>
                    {user.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">{user.username}</h3>
                    <p className="text-[11px] text-amber-400 font-bold font-mono">
                      {user.points.toLocaleString()} PTS
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Requests Approved</span>
                    <strong className="font-bold text-slate-200">{user.approvedRequests}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Games Verified</span>
                    <strong className="font-bold text-slate-200">{user.testedGames}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Rankings Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#0c121e] overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900/50">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Medal className="w-4 h-4 text-emerald-400" />
              Global Contributor Standings
            </h2>
            <p className="text-xs text-slate-400">Rankings update dynamically based on verified community actions</p>
          </div>

          <button
            onClick={onOpenRequests}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-all cursor-pointer"
          >
            Submit a Game Request
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Rank</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Contributor Tier</th>
                <th className="py-3 px-4 text-right">Points</th>
                <th className="py-3 px-4 text-center">Approved Requests</th>
                <th className="py-3 px-4 text-center">Verified Clean</th>
                <th className="py-3 px-4 text-right">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {LEADERBOARD_DATA.map((entry) => (
                <tr
                  key={entry.rank}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    entry.rank === 1 ? 'bg-amber-500/5' : ''
                  }`}
                >
                  <td className="py-3 px-4 text-center font-bold text-slate-400">
                    {entry.rank === 1 ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
                        1
                      </span>
                    ) : entry.rank === 2 ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-300 text-slate-950 font-black text-[10px]">
                        2
                      </span>
                    ) : entry.rank === 3 ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-700 text-white font-black text-[10px]">
                        3
                      </span>
                    ) : (
                      `#${entry.rank}`
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${entry.avatarColor} flex items-center justify-center font-bold text-white text-xs shrink-0`}>
                        {entry.username.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-200">{entry.username}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-medium text-[10px] border border-slate-700">
                      {entry.badge}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-amber-400">
                    {entry.points.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-slate-200">
                    {entry.approvedRequests}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-emerald-400">
                    {entry.testedGames}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-500">
                    {entry.joinedDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* How to earn points info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4" />
            Approved Game Request (+30 pts)
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Submit Steam games to the Request board that receive 20 community votes and get uploaded by staff.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
            Archive Verification (+15 pts)
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Verify SHA256 checksums and test online fixes across Steam Spacewar for new releases.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <Star className="w-4 h-4" />
            Quality Community Reviews (+10 pts)
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Post confirmed performance reports (e.g. Steam Deck settings, FPS marks, controller compatibility).
          </p>
        </div>
      </div>
    </div>
  );
};

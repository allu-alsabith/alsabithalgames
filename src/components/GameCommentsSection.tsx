import React, { useState, useEffect } from 'react';
import { Game, Comment } from '../types';
import { Star, ThumbsUp, Send, CheckCircle2, MessageSquare, ShieldCheck, Flame } from 'lucide-react';
import { INITIAL_COMMENTS } from '../data/commentsData';

interface GameCommentsSectionProps {
  game: Game;
  onCommentsCountChange?: (count: number) => void;
}

const RATING_DESCRIPTIONS: Record<number, string> = {
  1: 'Poor / Buggy',
  2: 'Fair / Needs Patches',
  3: 'Good / Decent Experience',
  4: 'Great / Highly Recommended',
  5: 'Masterpiece / 100% Working!',
};

const AVATAR_COLORS = [
  'bg-emerald-600',
  'bg-teal-600',
  'bg-cyan-600',
  'bg-blue-600',
  'bg-indigo-600',
  'bg-purple-600',
  'bg-pink-600',
  'bg-amber-600',
];

export const GameCommentsSection: React.FC<GameCommentsSectionProps> = ({
  game,
  onCommentsCountChange,
}) => {
  const storageKey = `alsabithal_comments_${game.id}`;
  const likedKey = `alsabithal_comment_likes_${game.id}`;

  const [comments, setComments] = useState<Comment[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_COMMENTS[game.id] || [
      {
        id: `seed-1-${game.id}`,
        gameId: game.id,
        author: 'AlsabithalTeam',
        avatarColor: 'bg-emerald-600',
        date: 'Verified Release',
        content: `Portable archive verified clean with Windows Defender. All latest DLCs included. Extract and run the game launcher as administrator for best compatibility.`,
        likes: 18,
        rating: 5,
        isPinned: true,
        isStaff: true,
      },
    ];
  });

  const [userLikedMap, setUserLikedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(likedKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {};
  });

  const [authorName, setAuthorName] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'highest'>('newest');

  // Notify parent of comments count
  useEffect(() => {
    onCommentsCountChange?.(comments.length);
  }, [comments.length, onCommentsCountChange]);

  // Persist comments when updated
  const saveComments = (newComments: Comment[]) => {
    setComments(newComments);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newComments));
    } catch {
      // ignore
    }
  };

  const handleRatingClick = (star: number) => {
    setSelectedRating(star);
  };

  const handleLike = (commentId: string) => {
    const isAlreadyLiked = userLikedMap[commentId];
    const newLikedMap = {
      ...userLikedMap,
      [commentId]: !isAlreadyLiked,
    };
    setUserLikedMap(newLikedMap);
    try {
      localStorage.setItem(likedKey, JSON.stringify(newLikedMap));
    } catch {
      // ignore
    }

    const updated = comments.map((c) => {
      if (c.id === commentId) {
        return {
          ...c,
          likes: isAlreadyLiked ? Math.max(0, (c.likes || 0) - 1) : (c.likes || 0) + 1,
        };
      }
      return c;
    });
    saveComments(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    setIsSubmitting(true);

    const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    const displayName = authorName.trim() || 'Verified Gamer';

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      gameId: game.id,
      author: displayName,
      avatarColor: randomColor,
      date: 'Just now',
      content: commentContent.trim(),
      likes: 1,
      rating: selectedRating,
      isStaff: false,
    };

    // Keep pinned comments on top, new comment right after
    const pinned = comments.filter((c) => c.isPinned);
    const unpinned = comments.filter((c) => !c.isPinned);
    const newCommentsList = [...pinned, newComment, ...unpinned];

    saveComments(newCommentsList);
    setCommentContent('');
    setIsSubmitting(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3500);
  };

  // Calculate average rating
  const ratingsList = comments.filter((c) => typeof c.rating === 'number').map((c) => c.rating as number);
  const avgRating =
    ratingsList.length > 0
      ? (ratingsList.reduce((acc, curr) => acc + curr, 0) / ratingsList.length).toFixed(1)
      : game.rating.toFixed(1);

  // Rating distribution counts
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = ratingsList.filter((r) => r === stars).length;
    const percentage = ratingsList.length > 0 ? (count / ratingsList.length) * 100 : 0;
    return { stars, count, percentage };
  });

  const sortedComments = [...comments].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (sortBy === 'highest') {
      return (b.rating || 0) - (a.rating || 0);
    }
    return 0; // Default order (most recent on top)
  });

  const currentDisplayRating = hoverRating !== null ? hoverRating : selectedRating;

  return (
    <div className="space-y-6 animate-in fade-in duration-150" id="game-comments-section">
      {/* Community Rating Summary Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center justify-center shrink-0 shadow-inner">
            <span className="text-3xl font-black text-emerald-400 leading-none">{avgRating}</span>
            <div className="flex items-center gap-0.5 mt-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-2.5 h-2.5 ${
                    i < Math.round(Number(avgRating)) ? 'fill-amber-400' : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 tracking-wide">
              {comments.length} {comments.length === 1 ? 'Review' : 'Reviews'}
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
              <span>Player Verified Reviews</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                100% Genuine
              </span>
            </h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Community feedback regarding installation, compatibility, and performance for {game.title}.
            </p>
          </div>
        </div>

        {/* Rating Bars Distribution */}
        <div className="w-full sm:w-56 space-y-1 text-xs">
          {ratingDistribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-2 text-slate-400 text-[11px]">
              <span className="w-6 font-mono font-semibold flex items-center gap-0.5 justify-end">
                {item.stars} <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              </span>
              <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="w-6 text-right font-mono text-slate-500">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Leave a Comment & Star Rating Form */}
      <form
        onSubmit={handleSubmit}
        className="p-5 rounded-2xl bg-[#0b121e] border border-slate-700/80 shadow-2xl space-y-4"
        id="comment-form"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white tracking-tight">
              Leave a Comment & Star Rating
            </h4>
          </div>
          <span className="text-[11px] text-slate-400">
            Posting as a verified community member
          </span>
        </div>

        {/* Star Rating Selector & Nickname Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nickname Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Your Nickname <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. ShadowHunter99, Anonymous Gamer"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              maxLength={30}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
            />
          </div>

          {/* Interactive Star Rating Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Your Star Rating:</span>
              <span className="text-amber-400 font-medium text-[11px]">
                {RATING_DESCRIPTIONS[currentDisplayRating]}
              </span>
            </label>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 rounded-md hover:scale-125 focus:outline-none transition-transform cursor-pointer"
                  title={`Rate ${star} Stars`}
                >
                  <Star
                    className={`w-5 h-5 transition-colors ${
                      star <= currentDisplayRating
                        ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                        : 'text-slate-600 hover:text-slate-400'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-extrabold text-amber-400 font-mono ml-2">
                {currentDisplayRating}/5 Stars
              </span>
            </div>
          </div>
        </div>

        {/* Textarea */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
            <span>Comment & Review Text</span>
            <span className="text-[10px] text-slate-500 font-mono">
              {commentContent.length}/600
            </span>
          </label>
          <textarea
            rows={3}
            placeholder="Share your download speed, controller setup, compatibility, or gameplay impressions with other players..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value.slice(0, 600))}
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all resize-none leading-relaxed"
          />
        </div>

        {/* Action Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Instant publication — no signup required</span>
          </div>

          <div className="flex items-center gap-3">
            {showSuccessToast && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                Comment posted successfully!
              </span>
            )}

            <button
              type="submit"
              disabled={!commentContent.trim() || isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-lg shadow-emerald-950/50 hover:shadow-emerald-900/60 transition-all active:scale-95 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Posting...' : 'Post Comment & Rating'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Comments List Header with Sorting */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            User Comments ({comments.length})
          </h4>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'highest')}
            className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-400"
          >
            <option value="newest">Newest First</option>
            <option value="highest">Highest Rating</option>
          </select>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {sortedComments.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No comments yet</p>
            <p className="text-xs text-slate-500">
              Be the first to download and share your experience with other gamers!
            </p>
          </div>
        ) : (
          sortedComments.map((c) => {
            const isLiked = userLikedMap[c.id];
            return (
              <div
                key={c.id}
                className={`p-4 sm:p-5 rounded-2xl border text-xs space-y-2.5 transition-all ${
                  c.isPinned
                    ? 'bg-emerald-950/25 border-emerald-500/40 shadow-lg shadow-emerald-950/30'
                    : 'bg-slate-900/80 border-slate-800/90 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {/* Author Initial Avatar */}
                    <div
                      className={`w-8 h-8 rounded-xl ${
                        c.avatarColor || 'bg-emerald-600'
                      } text-white font-black flex items-center justify-center text-xs shadow-sm uppercase shrink-0`}
                    >
                      {c.author ? c.author.charAt(0) : 'G'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100 text-sm">{c.author}</span>
                        {c.isStaff && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] border border-emerald-500/40 flex items-center gap-1">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            STAFF
                          </span>
                        )}
                        {c.isPinned && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/40">
                            📌 Pinned
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500">{c.date}</span>
                    </div>
                  </div>

                  {/* Star Rating for this comment */}
                  {typeof c.rating === 'number' && (
                    <div className="flex items-center gap-1 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < (c.rating || 0)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-extrabold text-amber-400 font-mono ml-1">
                        {c.rating}.0
                      </span>
                    </div>
                  )}
                </div>

                {/* Comment Content */}
                <p className="text-slate-200 text-xs sm:text-[13px] leading-relaxed whitespace-pre-line pl-10 sm:pl-10">
                  {c.content}
                </p>

                {/* Footer Bar / Helpful button */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 pl-10 text-[11px]">
                  <span className="text-slate-500">Verified Game Comment</span>

                  <button
                    type="button"
                    onClick={() => handleLike(c.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      isLiked
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                    title="Mark comment as helpful"
                  >
                    <ThumbsUp className={`w-3 h-3 ${isLiked ? 'fill-current text-emerald-400' : ''}`} />
                    <span>Helpful ({c.likes || 0})</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

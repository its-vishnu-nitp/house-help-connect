import React, { useEffect, useState } from 'react';
import { reviewService } from '../../services/review.service';

/** Shared worker profile modal (used by HomeFeed + ProfessionalsView). */
const WorkerProfileModal = ({ worker, onClose, onBookWorker, isSaved, onToggleSave, onMessageWorker }) => {
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const workerUserId = worker?.userId?._id || worker?.userId;

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!workerUserId) { setLoadingReviews(false); return; }
      try {
        const res = await reviewService.getWorkerReviews(workerUserId);
        if (!cancelled) setReviews(res.reviews || []);
      } catch {
        if (!cancelled) setReviews([]);
      } finally {
        if (!cancelled) setLoadingReviews(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [workerUserId]);

  if (!worker) return null;

  const rating = Number(worker.rating) || 0;
  const totalReviews = worker.totalReviews ?? reviews.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-lg p-8 border shadow-2xl bg-surface-card rounded-[2.5rem] border-surface-border space-y-6 max-h-[90vh] overflow-y-auto animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 text-2xl font-black rounded-2xl bg-brand/10 text-brand">
              {(worker.userId?.name || 'P').charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-black text-ink-main">
                {worker.userId?.name || 'Professional'}
              </h2>
              <p className="text-sm font-medium text-ink-muted">
                📍 {worker.userId?.location?.city || 'Local Area'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onToggleSave && (
              <button
                type="button"
                onClick={() => onToggleSave(worker)}
                title={isSaved ? 'Remove from saved' : 'Save this professional'}
                className={`flex items-center justify-center w-9 h-9 border rounded-full cursor-pointer transition-all active:scale-90 ${
                  isSaved
                    ? 'bg-rose-50 border-rose-200 text-rose-500'
                    : 'bg-surface border-surface-border text-ink-muted hover:text-rose-500 hover:border-rose-200'
                }`}
              >
                {isSaved ? '❤️' : '🤍'}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center border rounded-full cursor-pointer w-9 h-9 bg-surface border-surface-border text-ink-muted hover:text-ink-main"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 p-4 text-center border rounded-2xl bg-surface border-surface-border">
          <div>
            <span className="block text-xs font-bold uppercase text-ink-muted">Rate</span>
            <span className="text-lg font-black text-brand">₹{worker.hourlyRate || 250}/hr</span>
          </div>
          <div>
            <span className="block text-xs font-bold uppercase text-ink-muted">Rating</span>
            <span className="text-lg font-black text-amber-600">
              {rating > 0 ? `★ ${rating.toFixed(1)}` : 'New'}
            </span>
            {totalReviews > 0 && (
              <span className="block text-[11px] font-semibold text-ink-muted">{totalReviews} reviews</span>
            )}
          </div>
          <div>
            <span className="block text-xs font-bold uppercase text-ink-muted">Experience</span>
            <span className="text-lg font-black text-ink-main">{worker.experience || 1}+ Yrs</span>
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-xs font-bold tracking-wider uppercase text-ink-muted">
            Skills & Services
          </h4>
          <div className="flex flex-wrap gap-2">
            {(worker.services?.length ? worker.services : [worker.serviceCategory || 'General Assistance']).map((s) => (
              <span
                key={s}
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-brand/10 text-brand border border-brand/20"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-xs font-bold tracking-wider uppercase text-ink-muted">
            About Professional
          </h4>
          <p className="p-4 text-sm font-medium leading-relaxed whitespace-pre-line border rounded-2xl bg-surface border-surface-border text-ink-main">
            {worker.bio || 'Verified domestic home care specialist with proven service track records.'}
          </p>
        </div>

        {/* Real reviews from completed bookings */}
        <div>
          <h4 className="mb-3 text-xs font-bold tracking-wider uppercase text-ink-muted">
            Client Reviews {reviews.length > 0 && `(${reviews.length})`}
          </h4>
          {loadingReviews ? (
            <p className="text-sm font-medium animate-pulse text-ink-muted">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="p-4 text-sm font-medium border border-dashed rounded-2xl border-surface-border text-ink-muted">
              No reviews yet — be the first to book and review this professional.
            </p>
          ) : (
            <div className="space-y-3">
              {reviews.slice(0, 5).map((r) => (
                <div key={r._id} className="p-4 border rounded-2xl bg-surface border-surface-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-ink-main">{r.reviewer?.name || 'Client'}</span>
                    <span className="text-sm font-black text-amber-500">
                      {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                    </span>
                  </div>
                  {r.comment && <p className="text-sm leading-relaxed text-ink-muted">“{r.comment}”</p>}
                  <p className="mt-1 text-[11px] font-semibold text-ink-muted">
                    {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t border-surface-border">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 text-sm font-semibold transition-colors border cursor-pointer rounded-xl border-surface-border text-ink-muted hover:bg-surface"
          >
            Close
          </button>
          {onMessageWorker && workerUserId && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onMessageWorker(worker);
              }}
              className="flex-1 py-3 text-sm font-bold transition-all border cursor-pointer rounded-xl border-brand/40 text-brand bg-brand/5 hover:bg-brand/10 active:scale-95"
            >
              💬 Message
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onBookWorker) onBookWorker(worker);
            }}
            className="flex-1 py-3 text-sm font-bold text-white transition-all shadow-md cursor-pointer rounded-xl bg-brand hover:bg-brand-dark shadow-brand/20 active:scale-95"
          >
            Book This Pro
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfileModal;

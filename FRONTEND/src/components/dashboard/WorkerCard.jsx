import React, { useState } from 'react';
import WorkerProfileModal from './WorkerProfileModal';

/**
 * Worker card — same markup as the HomeFeed / Professionals cards.
 * Used by the Saved view (the feeds keep their inline copies).
 */
const WorkerCard = ({ worker, onBookWorker, isSaved = false, onToggleSave, onMessageWorker }) => {
  const [showProfile, setShowProfile] = useState(false);
  const servicesList =
    worker.services && worker.services.length > 0
      ? worker.services
      : [worker.serviceCategory || 'Home Care'];

  return (
    <>
      <div className="relative flex flex-col justify-between p-6 transition-all duration-300 border bg-surface-card rounded-3xl border-surface-border shadow-modern hover:shadow-xl hover:-translate-y-1">
        {onToggleSave && (
          <button
            type="button"
            onClick={() => onToggleSave(worker)}
            title={isSaved ? 'Remove from saved' : 'Save this professional'}
            className={`absolute top-4 right-4 z-10 flex items-center justify-center w-9 h-9 text-base border rounded-full transition-all active:scale-90 ${
              isSaved
                ? 'bg-rose-50 border-rose-200'
                : 'bg-surface border-surface-border hover:border-rose-200'
            }`}
          >
            {isSaved ? '❤️' : '🤍'}
          </button>
        )}
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center w-16 h-16 overflow-hidden text-2xl rounded-2xl bg-brand/10 text-brand">
              {worker.userId?.profilePicture && worker.userId.profilePicture !== 'default-avatar.png' ? (
                <img src={worker.userId.profilePicture} alt="Profile" className="object-cover w-full h-full rounded-2xl" />
              ) : (
                worker.userId?.name?.charAt(0) || '👤'
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-ink-main">{worker.userId?.name || 'Unknown Pro'}</h3>
              <p className="text-xs text-ink-muted">📍 {worker.userId?.location?.city || 'Local Area'}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {servicesList.slice(0, 3).map((srv) => (
              <span key={srv} className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-brand/10 text-brand">
                {srv}
              </span>
            ))}
            {servicesList.length > 3 && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-surface text-ink-muted">
                +{servicesList.length - 3}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between py-3 my-2 text-sm font-semibold border-t border-b border-surface-border text-ink-muted">
            <span className="flex items-center gap-1">
              {Number(worker.rating) > 0
                ? <>⭐ {Number(worker.rating).toFixed(1)} <span className="text-xs font-medium">({worker.totalReviews || 0})</span></>
                : <span className="text-xs font-bold text-brand">✦ New Pro</span>}
            </span>
            <span className="font-bold text-ink-main">₹{worker.hourlyRate > 0 ? worker.hourlyRate : 250}/hr</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            type="button"
            onClick={() => setShowProfile(true)}
            className="py-2.5 text-xs font-bold border border-surface-border rounded-xl text-ink-main bg-surface hover:bg-surface-border/50 transition-colors cursor-pointer text-center"
          >
            View Profile
          </button>
          <button
            type="button"
            onClick={() => onBookWorker && onBookWorker(worker)}
            className="py-2.5 text-xs font-bold text-white transition-colors cursor-pointer bg-brand rounded-xl hover:bg-brand-dark active:scale-95 text-center shadow-md shadow-brand/20"
          >
            Book Now
          </button>
        </div>
      </div>

      {showProfile && (
        <WorkerProfileModal
          worker={worker}
          onClose={() => setShowProfile(false)}
          onBookWorker={onBookWorker}
          isSaved={isSaved}
          onToggleSave={onToggleSave}
          onMessageWorker={onMessageWorker}
        />
      )}
    </>
  );
};

export default WorkerCard;

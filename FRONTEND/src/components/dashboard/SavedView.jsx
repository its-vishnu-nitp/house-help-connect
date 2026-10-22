import React, { useState, useEffect } from 'react';
import { profileService } from '../../services/profile.service';
import WorkerCard from './WorkerCard';

/**
 * "Saved" view — the client's saved professionals. The saved HelperProfile
 * ids/documents persist on the EmployerProfile (GET /profiles/me populates
 * them); names/cities live on the linked User, so each saved profile is
 * enriched from worker search results when available.
 */
const SavedView = ({ onBookWorker, onToggleSave, onMessageWorker, onBrowse }) => {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const profileRes = await profileService.getMyProfile();
        const savedProfiles = (profileRes.profile?.savedProfessionals || []).filter(
          (s) => s && typeof s === 'object'
        );
        if (cancelled) return;
        if (savedProfiles.length === 0) {
          setSaved([]);
          return;
        }

        // Enrich with populated userId (name / city / picture) from search
        let byId = {};
        try {
          let page = 1;
          let hasMore = true;
          while (hasMore && page <= 10) {
            const res = await profileService.searchWorkers('', '', page, 24);
            (res.workers || []).forEach((w) => { byId[w._id] = w; });
            hasMore = Boolean(res.hasMore);
            page += 1;
          }
        } catch {
          /* enrichment is best-effort — cards still render profile data */
        }
        if (cancelled) return;
        setSaved(savedProfiles.map((s) => {
          const rich = byId[s._id];
          return rich ? { ...s, userId: rich.userId } : s;
        }));
      } catch (err) {
        console.error('Failed to load saved professionals', err);
        if (!cancelled) setSaved([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const handleToggleSave = async (worker) => {
    if (onToggleSave) await onToggleSave(worker);
    // Unsave removes the card immediately (this view only lists saved pros)
    setSaved((prev) => prev.filter((s) => s._id !== worker._id));
  };

  return (
    <div className="w-full space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-main">Saved Professionals</h1>
        <p className="mt-1 text-ink-muted">Your favourite professionals, one tap away from a booking.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <p className="text-base font-semibold animate-pulse text-brand">Loading saved professionals...</p>
        </div>
      ) : saved.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed text-ink-muted bg-surface-card rounded-[2rem] border-surface-border">
          <p className="mb-2 text-4xl">🤍</p>
          <p className="text-lg font-bold text-ink-main">No saved professionals yet</p>
          <p className="max-w-md mx-auto mt-1 font-medium">
            Tap the heart on any professional's card and they'll be waiting for you here.
          </p>
          {onBrowse && (
            <button
              type="button"
              onClick={onBrowse}
              className="px-6 py-3 mt-6 text-sm font-bold text-white transition-all bg-brand rounded-xl hover:bg-brand-dark active:scale-95"
            >
              Browse Professionals
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {saved.map((worker) => (
            <WorkerCard
              key={worker._id}
              worker={worker}
              onBookWorker={onBookWorker}
              isSaved
              onToggleSave={handleToggleSave}
              onMessageWorker={onMessageWorker}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedView;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { profileService } from '../../services/profile.service';

const ProfessionalsView = ({ onBookWorker }) => {
  const [workers, setWorkers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null); // Profile Preview Modal State
  const observerTarget = useRef(null);
  const loadingRef = useRef(false);

  const loadWorkers = useCallback(async (pageNum) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    try {
      const data = await profileService.searchWorkers('', '', pageNum, 6);
      setWorkers((prev) => (pageNum === 1 ? data.workers : [...prev, ...data.workers]));
      setHasMore(data.hasMore);
    } catch (err) {
      console.error("Failed to load workers", err);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkers(page);
  }, [page, loadWorkers]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.2 }
    );

    const target = observerTarget.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasMore]);

  return (
    <div className="w-full space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-main">
          All Available Professionals
        </h1>
        <p className="mt-1 text-ink-muted">
          Browse verified helpers ready for hire in your area.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workers.map((worker) => {
          const servicesList =
            worker.services && worker.services.length > 0
              ? worker.services
              : [worker.serviceCategory || 'Home Care'];

          return (
            <div
              key={worker._id}
              className="flex flex-col justify-between p-6 transition-all duration-300 border bg-surface-card rounded-3xl border-surface-border shadow-modern hover:shadow-lg"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center overflow-hidden text-2xl font-bold w-14 h-14 rounded-2xl bg-brand/10 text-brand">
                    {worker.userId?.profilePicture && worker.userId.profilePicture !== 'default-avatar.png' ? (
                      <img
                        src={worker.userId.profilePicture}
                        alt={worker.userId?.name || 'Worker'}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      worker.userId?.name?.charAt(0) || 'W'
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold leading-tight text-ink-main">
                      {worker.userId?.name || 'Professional'}
                    </h3>
                    <p className="text-xs text-ink-muted">
                      📍 {worker.userId?.location?.city || 'Local Area'}
                    </p>
                  </div>
                </div>

                {/* Multiple Services Badges */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {servicesList.slice(0, 3).map((srv) => (
                    <span
                      key={srv}
                      className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-brand/10 text-brand"
                    >
                      {srv}
                    </span>
                  ))}
                  {servicesList.length > 3 && (
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-surface text-ink-muted">
                      +{servicesList.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between py-3 my-2 text-sm font-semibold border-t border-b border-surface-border text-ink-muted">
                  <span>⭐ {worker.rating || '4.9'}</span>
                  <span className="font-bold text-ink-main">₹{worker.hourlyRate}/hr</span>
                </div>
              </div>

              {/* Dual Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setSelectedWorker(worker)}
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
          );
        })}
      </div>

      <div ref={observerTarget} className="flex justify-center py-6">
        {loading && (
          <p className="text-sm font-bold tracking-wide animate-pulse text-brand">
            Loading more professionals...
          </p>
        )}
        {!hasMore && workers.length > 0 && (
          <p className="text-sm text-ink-muted">
            You've viewed all available professionals.
          </p>
        )}
      </div>

      {/* Profile Detail Preview Modal */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg p-8 border shadow-2xl bg-surface-card rounded-[2.5rem] border-surface-border space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 text-2xl font-black rounded-2xl bg-brand/10 text-brand">
                  {(selectedWorker.userId?.name || 'P').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-ink-main">
                    {selectedWorker.userId?.name || 'Professional'}
                  </h2>
                  <p className="text-sm font-medium text-ink-muted">
                    📍 {selectedWorker.userId?.location?.city || 'Local Area'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedWorker(null)}
                className="flex items-center justify-center border rounded-full cursor-pointer w-9 h-9 bg-surface border-surface-border text-ink-muted hover:text-ink-main"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 text-center border rounded-2xl bg-surface border-surface-border">
              <div>
                <span className="block text-xs font-bold uppercase text-ink-muted">Rate</span>
                <span className="text-lg font-black text-brand">₹{selectedWorker.hourlyRate || 250}/hr</span>
              </div>
              <div>
                <span className="block text-xs font-bold uppercase text-ink-muted">Rating</span>
                <span className="text-lg font-black text-amber-600">★ {selectedWorker.rating || 4.9}</span>
              </div>
              <div>
                <span className="block text-xs font-bold uppercase text-ink-muted">Experience</span>
                <span className="text-lg font-black text-ink-main">{selectedWorker.experience || 1}+ Yrs</span>
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-xs font-bold tracking-wider uppercase text-ink-muted">
                Skills & Services
              </h4>
              <div className="flex flex-wrap gap-2">
                {(selectedWorker.services || [selectedWorker.serviceCategory || 'General Assistance']).map((s) => (
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
                {selectedWorker.bio || 'Verified domestic home care specialist with proven service track records.'}
              </p>
            </div>

            <div className="flex gap-3 pt-4 border-t border-surface-border">
              <button
                type="button"
                onClick={() => setSelectedWorker(null)}
                className="flex-1 py-3 text-sm font-semibold transition-colors border cursor-pointer rounded-xl border-surface-border text-ink-muted hover:bg-surface"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const toBook = selectedWorker;
                  setSelectedWorker(null);
                  if (onBookWorker) onBookWorker(toBook);
                }}
                className="flex-1 py-3 text-sm font-bold text-white transition-all shadow-md cursor-pointer rounded-xl bg-brand hover:bg-brand-dark shadow-brand/20 active:scale-95"
              >
                Book This Pro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalsView;
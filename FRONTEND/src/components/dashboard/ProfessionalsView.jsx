import React, { useState, useEffect, useRef, useCallback } from 'react';
import { profileService } from '../../services/profile.service';
import WorkerProfileModal from './WorkerProfileModal';

const ProfessionalsView = ({ onBookWorker, savedIds = [], onToggleSave, onMessageWorker }) => {
  const [workers, setWorkers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null); // Profile Preview Modal State
  const [categoryInput, setCategoryInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const observerTarget = useRef(null);
  const loadingRef = useRef(false);
  const filtersRef = useRef({ category: '', city: '' });

  const loadWorkers = useCallback(async (pageNum) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    try {
      const { category, city } = filtersRef.current;
      const data = await profileService.searchWorkers(category, city, pageNum, 6);
      setWorkers((prev) => (pageNum === 1 ? data.workers : [...prev, ...data.workers]));
      setHasMore(data.hasMore);
    } catch (err) {
      console.error("Failed to load workers", err);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  // Apply (or clear) the category/city filters and restart pagination
  const applyFilters = (category, city) => {
    filtersRef.current = { category: category.trim(), city: city.trim() };
    setWorkers([]);
    setHasMore(true);
    if (page !== 1) {
      setPage(1); // the page effect reloads page 1 with the new filters
    } else {
      loadWorkers(1);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    applyFilters(categoryInput, cityInput);
  };

  const handleClearFilters = () => {
    setCategoryInput('');
    setCityInput('');
    applyFilters('', '');
  };

  const filtersActive = filtersRef.current.category !== '' || filtersRef.current.city !== '';

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

      {/* Category + City filters (both are sent to the search API) */}
      <form onSubmit={handleFilterSubmit} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 flex items-center pointer-events-none left-4 text-ink-muted">🔍</span>
          <input
            type="text"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            placeholder="Filter by service (e.g. Plumbing, Cleaning)..."
            className="w-full py-3.5 pl-11 pr-4 font-medium border outline-none rounded-2xl border-surface-border bg-surface-card text-ink-main focus:ring-2 focus:ring-brand"
          />
        </div>
        <div className="relative sm:w-56">
          <span className="absolute inset-y-0 flex items-center pointer-events-none left-4 text-ink-muted">📍</span>
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder="City (e.g. Mumbai)"
            aria-label="Filter by city"
            className="w-full py-3.5 pl-11 pr-4 font-medium border outline-none rounded-2xl border-surface-border bg-surface-card text-ink-main focus:ring-2 focus:ring-brand"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3.5 text-sm font-bold text-white transition-all bg-brand rounded-2xl hover:bg-brand-dark active:scale-95"
        >
          Apply Filters
        </button>
        {filtersActive && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="px-5 py-3.5 text-sm font-bold transition-colors border rounded-2xl border-surface-border text-ink-muted hover:text-ink-main bg-surface-card"
          >
            Clear
          </button>
        )}
      </form>

      {!loading && workers.length === 0 && (
        <div className="py-12 text-center border text-ink-muted bg-surface-card rounded-3xl border-surface-border">
          <p className="text-lg">No professionals match these filters yet. Try another service or city.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workers.map((worker) => {
          const servicesList =
            worker.services && worker.services.length > 0
              ? worker.services
              : [worker.serviceCategory || 'Home Care'];

          return (
            <div
              key={worker._id}
              className="relative flex flex-col justify-between p-6 transition-all duration-300 border bg-surface-card rounded-3xl border-surface-border shadow-modern hover:shadow-xl hover:-translate-y-1"
            >
              {onToggleSave && (
                <button
                  type="button"
                  onClick={() => onToggleSave(worker)}
                  title={savedIds.includes(worker._id) ? 'Remove from saved' : 'Save this professional'}
                  className={`absolute top-4 right-4 z-10 flex items-center justify-center w-9 h-9 text-base border rounded-full transition-all active:scale-90 ${
                    savedIds.includes(worker._id)
                      ? 'bg-rose-50 border-rose-200'
                      : 'bg-surface border-surface-border hover:border-rose-200'
                  }`}
                >
                  {savedIds.includes(worker._id) ? '❤️' : '🤍'}
                </button>
              )}
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
                  <span>
                    {Number(worker.rating) > 0
                      ? <>⭐ {Number(worker.rating).toFixed(1)} <span className="text-xs font-medium">({worker.totalReviews || 0})</span></>
                      : <span className="text-xs font-bold text-brand">✦ New Pro</span>}
                  </span>
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
        <WorkerProfileModal
          worker={selectedWorker}
          onClose={() => setSelectedWorker(null)}
          onBookWorker={onBookWorker}
          isSaved={savedIds.includes(selectedWorker._id)}
          onToggleSave={onToggleSave}
          onMessageWorker={onMessageWorker}
        />
      )}
    </div>
  );
};

export default ProfessionalsView;
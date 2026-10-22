import React, { useState, useRef, useEffect } from 'react';
import { categories } from '../../data/mockData';
import WorkerProfileModal from './WorkerProfileModal';

const HomeFeed = ({ user, onSearch, professionals = [], isSearching, onBookWorker, savedIds = [], onToggleSave, onMessageWorker }) => {
  const [searchInput, setSearchInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [shouldScroll, setShouldScroll] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null); // Profile Preview Modal State
  const resultsRef = useRef(null);

  // Auto-scroll ONLY when a search action is explicitly executed
  useEffect(() => {
    if (shouldScroll && !isSearching && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setShouldScroll(false);
      }, 100);
    }
  }, [shouldScroll, isSearching]);

  // Execute search only when Enter key is pressed
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchInput.trim() !== "") {
      setShouldScroll(true);
      onSearch(searchInput.trim(), cityInput.trim());
    }
  };

  const handleCityKeyDown = (e) => {
    if (e.key === 'Enter') {
      setShouldScroll(true);
      onSearch(searchInput.trim(), cityInput.trim());
    }
  };

  // Execute search when category card is clicked
  const handleCategoryClick = (categoryName) => {
    setSearchInput(categoryName);
    setShouldScroll(true);
    onSearch(categoryName, cityInput.trim());
  };

  return (
    <div className="w-full space-y-10 animate-fade-in">
      {/* Premium Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-brand to-brand-dark rounded-[2rem] p-8 md:p-12 shadow-modern text-white">
        <div className="absolute top-0 right-0 w-64 h-64 translate-x-10 -translate-y-10 rounded-full pointer-events-none bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 w-40 h-40 translate-y-10 rounded-full pointer-events-none right-20 bg-brand-accent/20 blur-2xl"></div>

        <div className="relative z-10 max-w-2xl">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="mb-8 text-lg font-medium text-emerald-50 md:text-xl">
            Find trusted professionals for your home instantly.
          </p>
          
          <div className="flex flex-col max-w-xl gap-3 sm:flex-row">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 flex items-center text-xl pointer-events-none left-4 text-ink-muted">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search for services (e.g. Plumber, Cleaning)..."
                className="w-full py-4 pl-12 pr-4 text-lg font-medium transition-all shadow-inner outline-none bg-surface-card rounded-2xl text-ink-main placeholder-ink-muted focus:ring-4 focus:ring-white/30"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="relative sm:w-48">
              <span className="absolute inset-y-0 flex items-center text-lg pointer-events-none left-4 text-ink-muted">
                📍
              </span>
              <input
                type="text"
                placeholder="City"
                aria-label="Filter by city"
                className="w-full py-4 pl-11 pr-4 text-lg font-medium transition-all shadow-inner outline-none bg-surface-card rounded-2xl text-ink-main placeholder-ink-muted focus:ring-4 focus:ring-white/30"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                onKeyDown={handleCityKeyDown}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Service Categories Horizontal Rotator */}
      <div>
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-ink-main">Service Categories</h2>
        <div className="flex gap-4 pb-4 overflow-x-auto md:gap-6 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {categories.map((cat, idx) => (
            <button 
              key={idx}
              onClick={() => handleCategoryClick(cat.name)}
              className="flex-shrink-0 w-40 md:w-48 group flex flex-col items-center justify-center p-6 bg-surface-card rounded-[2rem] border border-surface-border shadow-modern hover:shadow-lg hover:-translate-y-1 transition-all duration-300 snap-start cursor-pointer"
            >
              <div className="flex items-center justify-center w-16 h-16 mb-4 text-3xl transition-all duration-300 bg-surface rounded-2xl group-hover:scale-110 group-hover:bg-brand-light">
                {cat.icon}
              </div>
              <span className="font-bold text-center transition-colors text-ink-main group-hover:text-brand">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Results Display Area */}
      <div ref={resultsRef} className="pt-4 scroll-mt-24"> 
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-ink-main">
          {searchInput ? `Results for "${searchInput}"` : "Available Professionals"}
        </h2>
        
        {isSearching ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading professionals">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-6 border bg-surface-card rounded-3xl border-surface-border shadow-soft animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-surface-border/70"></div>
                  <div className="flex-1">
                    <div className="h-4 mb-2 rounded bg-surface-border/70 w-3/4"></div>
                    <div className="h-3 rounded bg-surface-border/50 w-1/2"></div>
                  </div>
                </div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 rounded-full bg-surface-border/60 w-20"></div>
                  <div className="h-6 rounded-full bg-surface-border/60 w-16"></div>
                </div>
                <div className="h-4 mb-5 rounded bg-surface-border/50 w-2/3"></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-10 rounded-xl bg-surface-border/60"></div>
                  <div className="h-10 rounded-xl bg-surface-border/60"></div>
                </div>
              </div>
            ))}
          </div>
        ) : professionals.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {professionals.map((pro) => {
              const servicesList =
                pro.services && pro.services.length > 0
                  ? pro.services
                  : [pro.serviceCategory || 'Home Care'];

              return (
                <div key={pro._id} className="relative flex flex-col justify-between p-6 transition-all duration-300 border bg-surface-card rounded-3xl border-surface-border shadow-modern hover:shadow-xl hover:-translate-y-1">
                  {onToggleSave && (
                    <button
                      type="button"
                      onClick={() => onToggleSave(pro)}
                      title={savedIds.includes(pro._id) ? 'Remove from saved' : 'Save this professional'}
                      className={`absolute top-4 right-4 z-10 flex items-center justify-center w-9 h-9 text-base border rounded-full transition-all active:scale-90 ${
                        savedIds.includes(pro._id)
                          ? 'bg-rose-50 border-rose-200'
                          : 'bg-surface border-surface-border hover:border-rose-200'
                      }`}
                    >
                      {savedIds.includes(pro._id) ? '❤️' : '🤍'}
                    </button>
                  )}
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center justify-center w-16 h-16 overflow-hidden text-2xl rounded-2xl bg-brand/10 text-brand">
                        {pro.userId?.profilePicture && pro.userId.profilePicture !== "default-avatar.png" ? (
                          <img src={pro.userId.profilePicture} alt="Profile" className="object-cover w-full h-full rounded-2xl"/>
                        ) : (
                          pro.userId?.name?.charAt(0) || '👤'
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-ink-main">{pro.userId?.name || 'Unknown Pro'}</h3>
                        <p className="text-xs text-ink-muted">📍 {pro.userId?.location?.city || 'Local Area'}</p>
                      </div>
                    </div>

                    {/* Services Chips */}
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
                        {Number(pro.rating) > 0
                          ? <>⭐ {Number(pro.rating).toFixed(1)} <span className="text-xs font-medium">({pro.totalReviews || 0})</span></>
                          : <span className="text-xs font-bold text-brand">✦ New Pro</span>}
                      </span>
                      <span className="font-bold text-ink-main">₹{pro.hourlyRate}/hr</span>
                    </div>
                  </div>
                  
                  {/* Dual Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button 
                      type="button"
                      onClick={() => setSelectedWorker(pro)}
                      className="py-2.5 text-xs font-bold border border-surface-border rounded-xl text-ink-main bg-surface hover:bg-surface-border/50 transition-colors cursor-pointer text-center"
                    >
                      View Profile
                    </button>
                    <button 
                      type="button"
                      onClick={() => onBookWorker && onBookWorker(pro)}
                      className="py-2.5 text-xs font-bold text-white transition-colors cursor-pointer bg-brand rounded-xl hover:bg-brand-dark active:scale-95 text-center shadow-md shadow-brand/20"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center border text-ink-muted bg-surface-card rounded-3xl border-surface-border">
            <p className="text-lg">No professionals found for this category yet.</p>
          </div>
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

export default HomeFeed;
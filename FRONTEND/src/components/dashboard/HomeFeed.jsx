import React, { useState, useRef, useEffect } from 'react';
import { categories } from '../../data/mockData';

const HomeFeed = ({ user, onSearch, professionals = [], isSearching, onBookWorker }) => {
  const [searchInput, setSearchInput] = useState("");
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
      onSearch(searchInput.trim());
    }
  };

  // Execute search when category card is clicked
  const handleCategoryClick = (categoryName) => {
    setSearchInput(categoryName);
    setShouldScroll(true);
    onSearch(categoryName);
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
          
          <div className="relative max-w-xl">
            <span className="absolute inset-y-0 flex items-center text-xl pointer-events-none left-4 text-ink-muted">
              🔍
            </span>
            <input 
              type="text" 
              placeholder="Search for services (e.g. Plumber, Cleaning)..." 
              className="w-full py-4 pl-12 pr-6 text-lg font-medium transition-all shadow-inner outline-none bg-surface-card rounded-2xl text-ink-main placeholder-ink-muted focus:ring-4 focus:ring-white/30"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
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
          <div className="flex items-center justify-center py-10">
            <p className="text-lg font-semibold animate-pulse text-brand">Searching professionals...</p>
          </div>
        ) : professionals.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {professionals.map((pro) => {
              const servicesList =
                pro.services && pro.services.length > 0
                  ? pro.services
                  : [pro.serviceCategory || 'Home Care'];

              return (
                <div key={pro._id} className="flex flex-col justify-between p-6 transition-all duration-300 border bg-surface-card rounded-3xl border-surface-border shadow-modern hover:shadow-lg">
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
                      <span className="flex items-center gap-1">⭐ {pro.rating || '4.9'}</span>
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

export default HomeFeed;
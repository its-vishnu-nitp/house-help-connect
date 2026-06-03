import React, { useState, useEffect } from 'react';
import { categories, allRecommendedWorkers } from '../../data/mockData';

const HomeFeed = ({ user }) => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const [isViewingAll, setIsViewingAll] = useState(false);
  const initialCategoryCount = 8; 

  useEffect(() => {
    const handleScroll = () => {
      if (isViewingAll || visibleCount >= allRecommendedWorkers.length) return;
      const isAtBottom = window.innerHeight + document.documentElement.scrollTop + 100 >= document.documentElement.offsetHeight;
      if (isAtBottom) {
        setVisibleCount((prev) => Math.min(prev + 4, allRecommendedWorkers.length));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleCount, isViewingAll]);

  return (
    <div className="animate-fade-in">
      {/* BRAND BANNER */}
      <div className="relative flex items-center justify-between p-8 mb-10 overflow-hidden bg-brand rounded-3xl shadow-modern">
        <div className="z-10 w-full md:w-2/3">
          <h1 className="mb-2 text-3xl font-bold text-white">Welcome back, {user?.name || 'Vishnu'}!</h1>
          <p className="mb-6 text-brand-light">Find trusted professionals for your home.</p>
          <div className="relative max-w-md">
            <input type="text" placeholder="Search for services..." className="w-full py-3.5 pr-4 text-sm text-ink-main shadow-sm pl-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-light border-0" />
          </div>
        </div>
        <div className="absolute hidden right-10 -bottom-8 opacity-20 text-9xl md:block">✨</div>
      </div>

      {/* CATEGORIES - USING MODERN CARD */}
      <div className="mb-12">
        <h2 className="mb-6 text-xl">Service Categories</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {categories.slice(0, showAllCategories ? categories.length : initialCategoryCount).map((cat, i) => (
            <button key={i} className="flex flex-col items-center justify-center p-6 modern-card group">
              <div className="mb-4 text-4xl transition-transform duration-300 transform group-hover:-translate-y-2">{cat.icon}</div>
              <span className="text-sm font-semibold text-ink-main">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* RECOMMENDED - USING MODERN CARD */}
      <div>
        <h2 className="mb-6 text-xl">Recommended for You</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {allRecommendedWorkers.slice(0, visibleCount).map((worker) => (
            <div key={worker.id} className="flex flex-col items-center p-6 text-center modern-card group">
              <div className="flex justify-end w-full mb-2">
                <span className="flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-lg bg-surface text-ink-main">{worker.rating} ⭐</span>
              </div>
              <div className="flex items-center justify-center w-20 h-20 mb-4 text-4xl rounded-full bg-brand-light text-brand">{worker.avatar}</div>
              <h3 className="mb-1">{worker.name}</h3>
              <p className="text-sm text-ink-muted">{worker.role}</p>
              <button className="w-full mt-6 border-none btn-outline bg-surface group-hover:bg-brand group-hover:text-white">
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeFeed;
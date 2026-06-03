import React from 'react';

const Sidebar = ({ currentView, setCurrentView }) => {
  const getButtonClass = (viewName) => {
    const isActive = currentView === viewName;
    return `p-3 rounded-xl transition-all duration-200 text-2xl focus:outline-none ${
      isActive 
        ? 'bg-brand-light text-brand ring-2 ring-brand/30 scale-110 shadow-sm' 
        : 'text-ink-muted hover:bg-surface-border hover:scale-105'
    }`;
  };

  return (
    <div className="fixed top-0 left-0 z-20 flex flex-col items-center w-16 h-screen pt-24 pb-6 border-r bg-surface-card border-surface-border shadow-modern md:w-20">
      <div className="flex flex-col items-center flex-1 w-full space-y-8">
        <button onClick={() => setCurrentView('home')} title="Home" className={getButtonClass('home')}>🏠</button>
        <button onClick={() => setCurrentView('professionals')} title="Network" className={getButtonClass('professionals')}>👥</button>
        <button onClick={() => setCurrentView('bookings')} title="Bookings" className={getButtonClass('bookings')}>📅</button>
      </div>
      <div className="flex justify-center w-full mt-auto">
        <button onClick={() => setCurrentView('settings')} title="Settings" className={getButtonClass('settings')}>⚙️</button>
      </div>
    </div>
  );
};

export default Sidebar;
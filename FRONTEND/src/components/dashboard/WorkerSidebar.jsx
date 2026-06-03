import React from 'react';

const WorkerSidebar = ({ currentView, setCurrentView }) => {
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
        <button onClick={() => setCurrentView('home')} title="Job Feed & Earnings" className={getButtonClass('home')}>🏠</button>
        <button onClick={() => setCurrentView('clients')} title="My Clients" className={getButtonClass('clients')}>👥</button>
        <button onClick={() => setCurrentView('verification')} title="Background Verification" className={getButtonClass('verification')}>🛡️</button>
      </div>
      <div className="flex justify-center w-full mt-auto">
        <button onClick={() => setCurrentView('settings')} title="Settings" className={getButtonClass('settings')}>⚙️</button>
      </div>
    </div>
  );
};

export default WorkerSidebar;
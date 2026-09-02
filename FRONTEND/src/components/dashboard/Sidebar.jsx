import React from 'react';

const Sidebar = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'professionals', icon: '👥', label: 'Network' },
    { id: 'bookings', icon: '📅', label: 'Bookings' },
  ];

  return (
    <aside className="fixed top-0 left-0 z-40 flex flex-col items-center w-20 h-screen pt-24 pb-8 border-r shadow-modern bg-surface-card md:w-24 border-surface-border">
      {/* The logo has been removed from here because it now lives in the AuthHeader */}

      <nav className="flex flex-col flex-1 w-full gap-6 px-4 mt-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            title={item.label}
            className={`relative flex items-center justify-center w-full aspect-square rounded-2xl transition-all duration-300 group ${
              currentView === item.id 
                ? 'bg-brand text-white shadow-lg shadow-brand/30' 
                : 'text-ink-muted hover:bg-brand-light hover:text-brand'
            }`}
          >
            <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
              {item.icon}
            </span>
          </button>
        ))}
      </nav>

      <div className="w-full px-4 mt-auto">
        <button
          onClick={() => setCurrentView('settings')}
          title="Settings"
          className={`flex items-center justify-center w-full aspect-square rounded-2xl transition-all duration-300 group ${
            currentView === 'settings' 
              ? 'bg-ink-main text-white shadow-lg shadow-ink-main/30' 
              : 'text-ink-muted hover:bg-surface hover:text-ink-main'
          }`}
        >
          <span className="text-2xl transition-transform duration-300 group-hover:rotate-90">⚙️</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
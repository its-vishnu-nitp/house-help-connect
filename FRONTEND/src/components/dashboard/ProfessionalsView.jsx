import React, { useState } from 'react';

const ProfessionalsView = ({ professionals, bookings }) => {
  const [activeTab, setActiveTab] = useState('saved');

  const activeHires = bookings.filter(b => b.status === 'active').map(b => ({
    id: b.id, name: b.professional, role: b.service, rating: b.rating, avatar: b.avatar, status: 'active', activeJob: b.service, nextVisit: `${b.date} at ${b.time}`
  }));

  const requestedHires = bookings.filter(b => b.status === 'upcoming').map(b => ({
    id: b.id, name: b.professional, role: b.service, rating: b.rating, avatar: b.avatar, status: 'requested', service: b.service, requestDate: b.scheduleStatus === 'pending_client' ? 'Action Required' : 'Awaiting Pro'
  }));

  const allProfessionals = [...professionals, ...activeHires, ...requestedHires];
  const filteredProfessionals = allProfessionals.filter(pro => pro.status === activeTab);

  const renderCardActions = (pro) => {
    switch (activeTab) {
      case 'saved': return (
        <div className="flex w-full gap-3 pt-5 mt-auto border-t border-surface-border">
          <button className="flex-1 btn-brand !py-2 !text-sm">Book</button>
          <button className="flex-1 btn-outline !py-2 !text-sm">Message</button>
        </div>
      );
      case 'active': return (
        <div className="flex flex-col w-full gap-3 pt-5 mt-auto border-t border-surface-border">
           <div className="mb-1 text-center badge-success">🟢 Job in Progress</div>
           <button className="w-full btn-outline !py-2 !text-sm">Manage</button>
        </div>
      );
      // Add other cases using similar btn-brand and btn-outline classes
      default: return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl">My Network</h2>
        <p className="mt-1 text-ink-muted">Manage your saved, pending, and hired professionals.</p>
      </div>

      <div className="flex gap-3 pb-2 mb-8 overflow-x-auto border-b border-surface-border hide-scrollbar">
        {[
          { id: 'saved', label: '❤️ Saved', count: professionals.filter(p => p.status === 'saved').length },
          { id: 'requested', label: '⏳ Requested', count: requestedHires.length },
          { id: 'active', label: '🟢 Active Hires', count: activeHires.length },
          { id: 'past', label: '📜 Past Hires', count: professionals.filter(p => p.status === 'past').length },
        ].map((tab) => (
          <button 
            key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-t-xl font-semibold text-sm transition-all relative ${activeTab === tab.id ? 'text-brand bg-brand-light/50' : 'text-ink-muted hover:text-ink-main hover:bg-surface'}`}
          >
            {tab.label} <span className="ml-2 bg-white shadow-sm text-ink-main py-0.5 px-2.5 rounded-full text-xs">{tab.count}</span>
            {activeTab === tab.id && <span className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-brand"></span>}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProfessionals.length === 0 ? (
          <div className="p-10 text-center col-span-full modern-card text-ink-muted">No professionals found.</div>
        ) : (
          filteredProfessionals.map((worker) => (
            <div key={worker.id} className="flex flex-col items-center p-6 text-center modern-card">
              <div className="flex items-center justify-center w-24 h-24 mb-4 text-4xl rounded-full bg-surface text-brand">{worker.avatar}</div>
              <h3 className="text-xl">{worker.name}</h3>
              <p className="mb-3 text-sm text-ink-muted">{worker.role}</p>
              
              <div className="flex items-center gap-1 mb-6">
                <span className="text-yellow-400">⭐</span><span className="text-sm font-semibold text-ink-main">{worker.rating} Rating</span>
              </div>
              
              {renderCardActions(worker)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProfessionalsView;
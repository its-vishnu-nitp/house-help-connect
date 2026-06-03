import React, { useState } from 'react';

const WorkerClientsView = () => {
  const [activeTab, setActiveTab] = useState('past');

  const clients = [
    { id: 1, name: 'Anjali T.', location: 'Civil Lines', rating: '5.0', jobsDone: 3, totalEarned: '₹4,500', status: 'past' },
    { id: 2, name: 'Rahul S.', location: 'Kankarbagh', rating: '4.8', jobsDone: 1, totalEarned: '₹1,200', status: 'past' },
    { id: 3, name: 'Priya M.', location: 'Boring Road', rating: 'New', jobsDone: 0, totalEarned: '₹0', status: 'upcoming' },
  ];

  const filteredClients = clients.filter(c => c.status === activeTab);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl text-ink-main">My Clients</h2>
        <p className="mt-1 text-ink-muted">Manage upcoming appointments and review past clients.</p>
      </div>

      <div className="flex gap-4 pb-2 mb-8 border-b border-surface-border">
        {['upcoming', 'past'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-t-xl font-semibold text-sm transition-all relative capitalize ${activeTab === tab ? 'text-brand bg-brand-light/50' : 'text-ink-muted hover:bg-surface'}`}
          >
            {tab} Clients
            {activeTab === tab && <span className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-brand"></span>}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.length === 0 ? (
          <div className="p-10 text-center col-span-full modern-card text-ink-muted">No clients found.</div>
        ) : (
          filteredClients.map((client) => (
            <div key={client.id} className="flex flex-col items-center p-6 text-center modern-card">
              <div className="flex items-start justify-between w-full mb-2">
                <span className="badge-success">Earned {client.totalEarned}</span>
              </div>
              
              <div className="flex items-center justify-center w-20 h-20 mt-2 mb-4 text-3xl font-bold rounded-full text-brand bg-brand-light">
                {client.name.charAt(0)}
              </div>
              <h3 className="text-xl text-ink-main">{client.name}</h3>
              <p className="mb-3 text-sm text-ink-muted">📍 {client.location}</p>
              
              <div className="flex items-center gap-1 mb-6">
                <span className="text-sm font-medium text-ink-muted">Jobs Completed: {client.jobsDone}</span>
              </div>

              <div className="flex w-full gap-3 pt-5 mt-auto border-t border-surface-border">
                <button className="flex-1 btn-brand !py-2 !text-sm">Message</button>
                <button className="flex-1 btn-outline !py-2 !text-sm">History</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WorkerClientsView;
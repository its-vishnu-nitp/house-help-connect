import React, { useState } from 'react';
import WorkerSidebar from '../components/dashboard/WorkerSidebar';
import WorkerHomeFeed from '../components/dashboard/WorkerHomeFeed';
import WorkerClientsView from '../components/dashboard/WorkerClientsView';
import WorkerVerificationTab from '../components/dashboard/WorkerVerificationTab';
import SettingsView from '../components/dashboard/SettingsView';

const WorkerDashboard = ({ user }) => {
  const [currentView, setCurrentView] = useState('home');

  const renderView = () => {
    switch (currentView) {
      case 'home': return <WorkerHomeFeed user={user} />;
      case 'clients': return <WorkerClientsView />;
      case 'verification': return <WorkerVerificationTab />;
      case 'settings': return <SettingsView user={user} />;
      default: return <WorkerHomeFeed user={user} />;
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-surface">
      <WorkerSidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      {/* 1. Outer container handling the left sidebar offset */}
      <div className="flex-1 w-full ml-20 md:ml-24">
        {/* 2. Main content container centered with auto margins */}
        <main className="w-full p-6 pb-12 mx-auto transition-all duration-300 max-w-7xl md:p-10 pt-28 md:pt-32">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default WorkerDashboard;
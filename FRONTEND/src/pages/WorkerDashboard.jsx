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
    <div className="flex min-h-screen bg-surface">
      <WorkerSidebar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-1 w-full max-w-6xl p-6 pb-10 pl-20 mx-auto md:p-8 md:pl-28">
        {renderView()}
      </div>
    </div>
  );
};

export default WorkerDashboard;
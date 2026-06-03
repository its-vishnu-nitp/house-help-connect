import React, { useState } from 'react';
import ProfileTab from './settings/ProfileTab';
import VerificationTab from './settings/VerificationTab';
import PaymentsTab from './settings/PaymentsTab';
import NotificationsTab from './settings/NotificationsTab';

const SettingsView = ({ user }) => {
  const [activeTab, setActiveTab] = useState('profile');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileTab user={user} />;
      case 'verification': return <VerificationTab />;
      case 'payments': return <PaymentsTab />;
      case 'notifications': return <NotificationsTab />;
      default: return <ProfileTab user={user} />;
    }
  };

  return (
    <div className="flex flex-col w-full gap-8 md:flex-row animate-fade-in">
      
      {/* Settings Sidebar */}
      <div className="w-full space-y-2 md:w-64 shrink-0">
        <h2 className="mb-6 text-2xl">Settings</h2>
        
        {[
          { id: 'profile', icon: '👤', label: 'Profile Details' },
          { id: 'verification', icon: '🛡️', label: 'Account Verification' },
          { id: 'payments', icon: '💳', label: 'Payment Methods' },
          { id: 'notifications', icon: '🔔', label: 'Notifications' },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)} 
            className={`w-full text-left px-5 py-3.5 rounded-xl font-semibold transition-all ${activeTab === tab.id ? 'bg-brand text-white shadow-md' : 'text-ink-muted hover:bg-white hover:shadow-sm hover:text-ink-main'}`}
          >
            <span className="mr-3">{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Settings Content Area */}
      <div className="flex-1 p-6 md:p-10 min-h-[500px] modern-card">
        {renderTabContent()}
      </div>
      
    </div>
  );
};

export default SettingsView;
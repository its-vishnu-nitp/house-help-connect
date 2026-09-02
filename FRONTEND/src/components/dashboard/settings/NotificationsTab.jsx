import React from 'react';

const NotificationsTab = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h3 className="pb-4 text-xl border-b text-ink-main border-surface-border">Notification Preferences</h3>
      
      <div className="flex items-center justify-between pb-5 border-b border-surface-border">
        <div>
          <p className="font-semibold text-ink-main">Email Alerts</p>
          <p className="text-sm text-ink-muted">Receive booking confirmations via email.</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" defaultChecked />
          <div className="w-11 h-6 bg-surface-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-card after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
        </label>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-ink-main">SMS / WhatsApp Alerts</p>
          <p className="text-sm text-ink-muted">Get real-time updates when your professional arrives.</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" defaultChecked />
          <div className="w-11 h-6 bg-surface-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-card after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
        </label>
      </div>
    </div>
  );
};

export default NotificationsTab;
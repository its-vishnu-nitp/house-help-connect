import React from 'react';

const ProfileTab = ({ user }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h3 className="pb-4 text-xl border-b text-ink-main border-surface-border">Profile Details</h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-semibold text-ink-muted">Full Name</label>
          <input type="text" defaultValue={user?.name || ''} className="w-full px-4 py-3 border outline-none rounded-xl border-surface-border focus:ring-2 focus:ring-brand bg-surface" />
        </div>
        <div>
          <label className="block mb-2 text-sm font-semibold text-ink-muted">Email Address</label>
          <input type="email" defaultValue={user?.email || ''} className="w-full px-4 py-3 border outline-none rounded-xl border-surface-border focus:ring-2 focus:ring-brand bg-surface" />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-2 text-sm font-semibold text-ink-muted">Phone Number</label>
          <input type="tel" placeholder="+91 XXXXX XXXXX" className="w-full px-4 py-3 border outline-none rounded-xl border-surface-border focus:ring-2 focus:ring-brand bg-surface" />
        </div>
      </div>
      <div className="flex justify-end pt-6">
        <button className="px-8 btn-brand">Save Changes</button>
      </div>
    </div>
  );
};

export default ProfileTab;
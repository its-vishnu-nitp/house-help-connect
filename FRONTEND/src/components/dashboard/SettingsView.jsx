import React, { useState, useEffect } from 'react';
import { profileService } from '../../services/profile.service';

const AVAILABLE_SERVICES = [
  'Deep Cleaning',
  'Cooking',
  'Plumbing',
  'Electrician',
  'Babysitting',
  'Elderly Care',
  'Gardening',
  'Carpentry'
];

const SettingsView = ({ user }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  const isWorker = user?.role === 'worker';

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.location?.city || '',
    bio: '',
    hourlyRate: '',
    services: ['Deep Cleaning'], // Multi-role list
    experience: ''
  });

  const [savedData, setSavedData] = useState({ ...formData });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const tabs = [
    { id: 'profile', icon: '👤', label: 'Profile Details' },
    { id: 'verification', icon: '🛡️', label: 'Account Verification' },
    { id: 'payments', icon: '💳', label: 'Payment Methods' },
    { id: 'notifications', icon: '🔔', label: 'Notifications' },
  ];

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoadingProfile(true);
        const res = await profileService.getMyProfile();
        const profile = res.profile || {};
        const userData = res.user || user || {};

        // Resolve services array (handling legacy string fallback)
        let resolvedServices = ['Deep Cleaning'];
        if (Array.isArray(profile.services) && profile.services.length > 0) {
          resolvedServices = profile.services;
        } else if (profile.serviceCategory) {
          resolvedServices = [profile.serviceCategory];
        }

        const initial = {
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          city: userData.location?.city || '',
          bio: profile.bio || '',
          hourlyRate: profile.hourlyRate ?? '',
          services: resolvedServices,
          experience: profile.experience ?? ''
        };

        setFormData(initial);
        setSavedData(initial);
      } catch (err) {
        console.error('Failed to load profile settings', err);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle skill selection on click
  const toggleService = (service) => {
    setFormData((prev) => {
      const exists = prev.services.includes(service);
      if (exists) {
        if (prev.services.length === 1) return prev; // Keep at least one skill selected
        return { ...prev, services: prev.services.filter((s) => s !== service) };
      }
      return { ...prev, services: [...prev.services, service] };
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await profileService.updateMyProfile(formData);
      const updatedUser = res.user || {};
      const updatedProfile = res.profile || {};

      const synced = {
        name: updatedUser.name || formData.name,
        email: updatedUser.email || formData.email,
        phone: updatedUser.phone || formData.phone,
        city: updatedUser.location?.city || formData.city,
        bio: updatedProfile.bio !== undefined ? updatedProfile.bio : formData.bio,
        hourlyRate: updatedProfile.hourlyRate !== undefined ? updatedProfile.hourlyRate : formData.hourlyRate,
        services: updatedProfile.services || formData.services,
        experience: updatedProfile.experience !== undefined ? updatedProfile.experience : formData.experience
      };

      setSavedData(synced);
      setFormData(synced);
      setIsEditing(false);
      setMessage({ text: 'Profile updated and saved permanently!', type: 'success' });
    } catch (err) {
      console.error('Profile update failed', err);
      setMessage({
        text: err.response?.data?.message || 'Failed to update profile. Please try again.',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData(savedData);
    setIsEditing(false);
    setMessage({ text: '', type: '' });
  };

  return (
    <div className="w-full pt-4 font-sans animate-fade-in">
      <div className="flex flex-col gap-10 md:flex-row">

        {/* Navigation Sidebar */}
        <div className="w-full md:w-72 shrink-0">
          <h1 className="pl-4 mb-8 text-3xl font-extrabold tracking-tight text-ink-main">Settings</h1>
          <div className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMessage({ text: '', type: '' });
                }}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-left transition-all duration-300 cursor-pointer ${activeTab === tab.id
                    ? 'bg-brand text-white shadow-lg shadow-brand/30 translate-x-2 md:translate-x-4'
                    : 'text-ink-muted hover:bg-surface hover:shadow-md hover:text-ink-main'
                  }`}
              >
                <span className="text-xl">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-surface-card rounded-[2rem] border border-surface-border shadow-modern p-8 md:p-12">

          {/* TAB 1: PROFILE DETAILS */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col justify-between gap-4 pb-4 border-b md:flex-row md:items-center border-surface-border">
                <div>
                  <h2 className="text-2xl font-extrabold text-ink-main">
                    {isWorker ? 'Provider Profile Details' : 'Client Profile Details'}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-ink-muted">
                    {isWorker
                      ? 'Select your skills, rates, and active contact information.'
                      : 'Your contact details and default booking location.'}
                  </p>
                </div>

                {!isEditing && !loadingProfile && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(true);
                      setMessage({ text: '', type: '' });
                    }}
                    className="px-6 py-2.5 text-sm font-bold text-brand bg-brand/10 hover:bg-brand hover:text-white rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    ✏️ Modify Profile
                  </button>
                )}
              </div>

              {/* Notification Message */}
              {message.text && (
                <div
                  className={`p-4 rounded-2xl text-sm font-bold border transition-all ${message.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                >
                  {message.text}
                </div>
              )}

              {loadingProfile ? (
                <div className="flex items-center justify-center py-16">
                  <p className="font-semibold text-brand animate-pulse">Loading profile data...</p>
                </div>
              ) : isEditing ? (
                /* --- EDIT FORM MODE --- */
                <form onSubmit={handleSaveProfile} className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-xs font-bold tracking-wider uppercase text-ink-muted">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-3.5 border outline-none rounded-xl border-surface-border bg-surface text-ink-main focus:ring-2 focus:ring-brand font-medium"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-xs font-bold tracking-wider uppercase text-ink-muted">
                        Email Address
                      </label>
                      <input
                        type="email"
                        disabled
                        value={formData.email}
                        className="w-full p-3.5 border rounded-xl border-surface-border bg-surface/50 text-ink-muted cursor-not-allowed font-medium"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-xs font-bold tracking-wider uppercase text-ink-muted">
                        Phone Number (10 Digits)
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        maxLength={10}
                        pattern="[0-9]{10}"
                        value={formData.phone}
                        onChange={(e) => {
                          // Allow only numbers
                          const numericVal = e.target.value.replace(/\D/g, "");
                          setFormData((prev) => ({ ...prev, phone: numericVal }));
                        }}
                        placeholder="9876543210"
                        className="w-full p-3.5 border outline-none rounded-xl border-surface-border bg-surface text-ink-main focus:ring-2 focus:ring-brand font-medium"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-xs font-bold tracking-wider uppercase text-ink-muted">
                        City / Location
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Mumbai, Patna, Delhi"
                        className="w-full p-3.5 border outline-none rounded-xl border-surface-border bg-surface text-ink-main focus:ring-2 focus:ring-brand font-medium"
                      />
                    </div>
                  </div>

                  {isWorker && (
                    <div className="pt-6 space-y-6 border-t border-surface-border">
                      {/* Multi-Select Roles / Skills */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold tracking-wider uppercase text-ink-muted">
                            Services Provided (Select Multiple)
                          </label>
                          <span className="text-xs text-ink-muted">
                            {formData.services.length} selected
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2.5 pt-1">
                          {AVAILABLE_SERVICES.map((srv) => {
                            const isSelected = formData.services.includes(srv);
                            return (
                              <button
                                key={srv}
                                type="button"
                                onClick={() => toggleService(srv)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${isSelected
                                    ? 'bg-brand border-brand text-white shadow-md shadow-brand/20'
                                    : 'bg-surface border-surface-border text-ink-muted hover:border-brand/40'
                                  }`}
                              >
                                <span>{srv}</span>
                                {isSelected ? '✓' : '+'}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <label className="block mb-2 text-xs font-bold tracking-wider uppercase text-ink-muted">
                            Hourly Rate (₹)
                          </label>
                          <input
                            type="number"
                            name="hourlyRate"
                            min="0"
                            value={formData.hourlyRate}
                            onChange={handleInputChange}
                            placeholder="250"
                            className="w-full p-3.5 border outline-none rounded-xl border-surface-border bg-surface text-ink-main focus:ring-2 focus:ring-brand font-medium"
                          />
                        </div>

                        <div>
                          <label className="block mb-2 text-xs font-bold tracking-wider uppercase text-ink-muted">
                            Experience (Years)
                          </label>
                          <input
                            type="number"
                            name="experience"
                            min="0"
                            value={formData.experience}
                            onChange={handleInputChange}
                            placeholder="3"
                            className="w-full p-3.5 border outline-none rounded-xl border-surface-border bg-surface text-ink-main focus:ring-2 focus:ring-brand font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block mb-2 text-xs font-bold tracking-wider uppercase text-ink-muted">
                          Professional Bio
                        </label>
                        <textarea
                          name="bio"
                          rows="4"
                          value={formData.bio}
                          onChange={handleInputChange}
                          placeholder="Briefly describe your experience, specialties, and schedule..."
                          className="w-full p-3.5 text-sm border outline-none rounded-xl border-surface-border bg-surface text-ink-main focus:ring-2 focus:ring-brand font-medium"
                        ></textarea>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-6 py-3.5 font-bold rounded-xl border border-surface-border text-ink-muted hover:text-ink-main hover:bg-surface transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-8 py-3.5 bg-brand text-white font-bold rounded-xl shadow-lg shadow-brand/30 hover:bg-brand-dark transition-all disabled:opacity-50 cursor-pointer active:scale-95"
                    >
                      {saving ? 'Saving...' : 'Save & Persist'}
                    </button>
                  </div>
                </form>
              ) : (
                /* --- SAVED / READ-ONLY DISPLAY MODE --- */
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 gap-4 p-6 border sm:grid-cols-2 rounded-2xl bg-surface border-surface-border">
                    <div>
                      <p className="text-xs font-bold tracking-wider uppercase text-ink-muted">Full Name</p>
                      <p className="mt-1 text-lg font-bold text-ink-main">{savedData.name || 'Not specified'}</p>
                    </div>

                    <div>
                      <p className="text-xs font-bold tracking-wider uppercase text-ink-muted">Email Address</p>
                      <p className="mt-1 text-base font-semibold text-ink-main">{savedData.email || 'N/A'}</p>
                    </div>

                    <div>
                      <p className="text-xs font-bold tracking-wider uppercase text-ink-muted">Phone Number</p>
                      <p className="mt-1 text-base font-semibold text-ink-main">{savedData.phone || 'Not added yet'}</p>
                    </div>

                    <div>
                      <p className="text-xs font-bold tracking-wider uppercase text-ink-muted">Location / City</p>
                      <p className="mt-1 text-base font-semibold text-ink-main">{savedData.city || 'Not specified'}</p>
                    </div>
                  </div>

                  {isWorker && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-ink-main">Service Details</h3>

                      {/* Multiple Roles Rendered as Badges */}
                      <div className="p-6 border rounded-2xl bg-surface border-surface-border">
                        <p className="mb-3 text-xs font-bold tracking-wider uppercase text-ink-muted">Services Offered</p>
                        <div className="flex flex-wrap gap-2">
                          {savedData.services && savedData.services.length > 0 ? (
                            savedData.services.map((srv) => (
                              <span
                                key={srv}
                                className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-brand/10 text-brand border border-brand/20"
                              >
                                {srv}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-ink-muted">No services added</span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 p-6 border sm:grid-cols-2 rounded-2xl bg-surface border-surface-border">
                        <div>
                          <p className="text-xs font-bold tracking-wider uppercase text-ink-muted">Standard Rate</p>
                          <p className="mt-1 text-base font-bold text-ink-main">
                            ₹{savedData.hourlyRate ? Number(savedData.hourlyRate).toLocaleString() : 0}/hr
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold tracking-wider uppercase text-ink-muted">Experience</p>
                          <p className="mt-1 text-base font-bold text-ink-main">
                            {savedData.experience ? `${savedData.experience} Years` : 'Fresh / New'}
                          </p>
                        </div>
                      </div>

                      {savedData.bio && (
                        <div className="p-6 border rounded-2xl bg-surface border-surface-border">
                          <p className="mb-2 text-xs font-bold tracking-wider uppercase text-ink-muted">About / Bio</p>
                          <p className="text-sm font-medium leading-relaxed whitespace-pre-line text-ink-main">
                            {savedData.bio}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="pb-4 mb-6 text-2xl font-extrabold border-b text-ink-main border-surface-border">
                Notification Preferences
              </h2>

              <div className="flex items-center justify-between py-2">
                <div className="pr-8">
                  <h3 className="mb-1 text-lg font-bold text-ink-main">Email Alerts</h3>
                  <p className="font-medium text-ink-muted">Receive booking confirmations and receipts via email.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`relative w-14 h-8 shrink-0 rounded-full transition-colors duration-300 cursor-pointer ${emailAlerts ? 'bg-brand' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 left-1 bg-surface-card w-6 h-6 rounded-full shadow-sm transition-transform duration-300 ${emailAlerts ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="pr-8">
                  <h3 className="mb-1 text-lg font-bold text-ink-main">SMS / WhatsApp Alerts</h3>
                  <p className="font-medium text-ink-muted">Get real-time updates when service status changes.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSmsAlerts(!smsAlerts)}
                  className={`relative w-14 h-8 shrink-0 rounded-full transition-colors duration-300 cursor-pointer ${smsAlerts ? 'bg-brand' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 left-1 bg-surface-card w-6 h-6 rounded-full shadow-sm transition-transform duration-300 ${smsAlerts ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3 & 4: OTHER PLACEHOLDER TABS */}
          {activeTab !== 'profile' && activeTab !== 'notifications' && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
              <span className="mb-4 text-5xl opacity-50">🚧</span>
              <h2 className="mb-2 text-2xl font-bold text-ink-main">Under Construction</h2>
              <p className="font-medium text-ink-muted">This settings panel will be available in the next update.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsView;
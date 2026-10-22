import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { profileService } from "../services/profile.service";

/**
 * Account overview — now backed by the real profile API instead of only
 * localStorage (which previously let it show a fake "✓ Verified" seal
 * for every account regardless of actual verification state).
 */
const Profile = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await profileService.getMyProfile();
        setData(res);
      } catch {
        const storedUser = JSON.parse(localStorage.getItem("currentUser"));
        if (storedUser) setData({ user: storedUser, profile: {} });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <p className="font-semibold animate-pulse text-brand">Loading profile...</p>
      </div>
    );
  }

  const user = data?.user;
  const profile = data?.profile || {};
  if (!user) return null;

  const isWorker = user.role === 'worker';

  return (
    <div className="min-h-screen px-6 pt-32 pb-12 font-sans bg-surface">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-ink-main">Account Profile Overview</h1>
          <button onClick={() => navigate("/dashboard")} className="btn-outline !py-2 !text-sm">
            ← Back to Dashboard
          </button>
        </div>

        <div className="flex flex-col items-center gap-8 p-8 modern-card md:flex-row md:items-start bg-surface-card border border-surface-border rounded-[2rem] shadow-modern">
          <div className="flex items-center justify-center w-24 h-24 text-3xl font-bold shadow-inner rounded-2xl bg-brand-light text-brand shrink-0">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div className="w-full space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-ink-main">{user.name}</h2>
              <p className="text-sm font-semibold text-brand uppercase tracking-wider mt-0.5 capitalize">{user.role} Account</p>
            </div>

            <div className="grid grid-cols-1 gap-6 pt-4 border-t md:grid-cols-2 border-surface-border">
              <div>
                <span className="text-xs font-bold tracking-wider uppercase text-ink-muted">Email</span>
                <p className="mt-1 text-base font-semibold text-ink-main">{user.email}</p>
              </div>
              <div>
                <span className="text-xs font-bold tracking-wider uppercase text-ink-muted">Phone</span>
                <p className="mt-1 text-base font-semibold text-ink-main">{user.phone || user.phoneNumber || 'Not added yet'}</p>
              </div>
              <div>
                <span className="text-xs font-bold tracking-wider uppercase text-ink-muted">City</span>
                <p className="mt-1 text-base font-semibold text-ink-main">{user.location?.city || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-xs font-bold tracking-wider uppercase text-ink-muted">Identity Verification</span>
                {user.isAadhaarVerified ? (
                  <p className="mt-1 text-base font-semibold text-status-success">✓ Aadhaar Verified</p>
                ) : (
                  <p className="mt-1 text-base font-semibold text-status-warning">
                    Not verified —{' '}
                    <Link to="/dashboard" className="underline text-brand">complete verification</Link>
                  </p>
                )}
              </div>

              {isWorker && (
                <>
                  <div>
                    <span className="text-xs font-bold tracking-wider uppercase text-ink-muted">Rating</span>
                    <p className="mt-1 text-base font-semibold text-ink-main">
                      {Number(profile.rating) > 0
                        ? `⭐ ${Number(profile.rating).toFixed(1)} (${profile.totalReviews || 0} reviews)`
                        : 'No reviews yet'}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-bold tracking-wider uppercase text-ink-muted">Hourly Rate</span>
                    <p className="mt-1 text-base font-semibold text-ink-main">
                      {profile.hourlyRate ? `₹${profile.hourlyRate}/hr` : 'Not set'}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-xs font-bold tracking-wider uppercase text-ink-muted">Services</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(profile.services?.length ? profile.services : [profile.serviceCategory]).filter(Boolean).map((s) => (
                        <span key={s} className="px-3 py-1 text-xs font-bold rounded-full bg-brand/10 text-brand">{s}</span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

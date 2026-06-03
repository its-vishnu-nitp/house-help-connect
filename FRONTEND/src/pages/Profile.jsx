import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) setUser(storedUser);
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen px-6 py-12 bg-surface">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl text-ink-main">Account Profile Overview</h1>
          <button onClick={() => navigate("/dashboard")} className="btn-outline !py-2 !text-sm">
            ← Back to Canvas Workspace
          </button>
        </div>

        <div className="flex flex-col items-center gap-8 p-8 modern-card md:flex-row md:items-start">
          <div className="flex items-center justify-center w-24 h-24 text-3xl font-bold shadow-inner rounded-2xl bg-brand-light text-brand shrink-0">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          
          <div className="w-full space-y-6">
            <div>
              <h2 className="text-2xl text-ink-main">{user.name}</h2>
              <p className="text-sm font-semibold text-brand uppercase tracking-wider mt-0.5">{user.role} Account Context</p>
            </div>

            <div className="grid grid-cols-1 gap-6 pt-4 border-t md:grid-cols-2 border-surface-border">
              <div>
                <span className="text-xs font-bold tracking-wider uppercase text-ink-muted">Email Communication Pipe</span>
                <p className="mt-1 text-base font-semibold text-ink-main">{user.email}</p>
              </div>
              <div>
                <span className="text-xs font-bold tracking-wider uppercase text-ink-muted">Identity Integrity Seal</span>
                <p className="mt-1 text-base font-semibold text-status-success">✓ Active Verified Status</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
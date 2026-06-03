import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientDashboard from './ClientDashboard';
import WorkerDashboard from './WorkerDashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Fallback redirect if an unauthenticated context slips past client guards
      navigate('/login');
    }
  }, [navigate]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="text-sm font-semibold tracking-wide text-ink-muted animate-pulse">
          Loading dashboard terminal...
        </div>
      </div>
    );
  }

  // Handle runtime execution routing split dynamically by role type
  return (
    <>
      {user.role === 'client' ? (
        <ClientDashboard user={user} />
      ) : user.role === 'worker' ? (
        <WorkerDashboard user={user} />
      ) : (
        <div className="flex items-center justify-center min-h-screen px-4 bg-surface">
          <div className="max-w-sm p-8 text-center modern-card">
            <h2 className="mb-2 text-xl text-status-error">Access Restriction</h2>
            <p className="text-sm text-ink-muted">Invalid account profile properties detected. Please authenticate again.</p>
            <button onClick={() => navigate('/login')} className="w-full mt-6 btn-brand">Return to Login</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
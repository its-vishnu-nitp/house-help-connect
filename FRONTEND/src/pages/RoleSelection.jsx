import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleSelection = (role) => {
    navigate(`/register?role=${role}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-surface px-4 mb-20">
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-4xl text-ink-main">Join House Help Connect</h1>
        <p className="text-lg text-ink-muted">How would you like to use our platform?</p>
      </div>

      <div className="flex flex-col justify-center w-full max-w-4xl gap-8 md:flex-row">
        {/* Client / Hire Card */}
        <button 
          onClick={() => handleSelection('client')}
          className="flex flex-col items-center w-full p-10 border-2 border-transparent group modern-card hover:border-brand md:w-80"
        >
          <div className="flex items-center justify-center w-32 h-32 mb-8 text-5xl transition-transform rounded-2xl bg-brand-light text-brand group-hover:scale-110">
            👨‍👩‍👧‍👦
          </div>
          <h2 className="mb-3 text-xl tracking-wide uppercase text-ink-main">I Want to Hire</h2>
          <p className="font-medium text-ink-muted">Find trusted helpers for your home.</p>
        </button>

        {/* Worker / Service Provider Card */}
        <button 
          onClick={() => handleSelection('worker')}
          className="flex flex-col items-center w-full p-10 border-2 border-transparent group modern-card hover:border-status-success md:w-80"
        >
          <div className="flex items-center justify-center w-32 h-32 mb-8 text-5xl transition-transform rounded-2xl bg-status-success/20 text-status-success group-hover:scale-110">
            🛠️
          </div>
          <h2 className="mb-3 text-xl tracking-wide uppercase text-ink-main">I Want to Work</h2>
          <p className="font-medium text-ink-muted">Find local jobs and manage your schedule.</p>
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
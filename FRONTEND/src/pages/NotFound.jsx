import React from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/auth.service';

const NotFound = () => {
  const isAuthed = authService.isAuthenticated();
  return (
    <div className="flex items-center justify-center min-h-[85vh] px-6 bg-surface font-sans">
      <div className="w-full max-w-md p-10 text-center border bg-surface-card rounded-[2rem] border-surface-border shadow-modern">
        <p className="mb-3 text-6xl font-black text-brand">404</p>
        <h1 className="mb-2 text-2xl font-extrabold text-ink-main">Page not found</h1>
        <p className="mb-8 font-medium text-ink-muted">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <div className="flex flex-col gap-3">
          <Link to={isAuthed ? '/dashboard' : '/'} className="btn-brand w-full py-3.5">
            {isAuthed ? 'Go to Dashboard' : 'Go to Home'}
          </Link>
          {isAuthed && (
            <Link to="/" className="btn-outline w-full py-3.5">
              Back to Home
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;

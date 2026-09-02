import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';

const AuthHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (authService?.logout) {
      authService.logout();
    } else {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("token");
    }
    navigate('/');
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "C";

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b shadow-sm bg-surface-card border-surface-border">
      <div className="flex items-center justify-between w-full px-6 py-4 mx-auto max-w-7xl">
        
        {/* Identical Logo from Landing Header */}
        <Link to="/dashboard" className="flex items-center text-2xl font-bold text-brand">
          <svg viewBox="0 0 100 65" xmlns="http://www.w3.org/2000/svg" className="w-auto h-10 mr-2">
            <path 
              d="M 5 35 L 22 25.2 V 10 H 30 V 20.6 L 50 9 L 95 35" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="6" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            <text 
              x="50" 
              y="58" 
              fontFamily="Arial, sans-serif" 
              fontSize="30" 
              fontWeight="900" 
              fill="currentColor" 
              textAnchor="middle" 
              letterSpacing="1"
            >
              HHC
            </text>
          </svg>
        </Link>

        {/* Authenticated Controls: Notification Bell + Avatar */}
        <div className="flex items-center gap-5">
          <button className="relative p-2 transition-colors rounded-full text-ink-muted hover:text-brand hover:bg-brand-light focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-status-error border-2 border-surface-card rounded-full"></span>
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center w-10 h-10 text-base font-bold text-white transition-all duration-300 rounded-full shadow-md bg-brand hover:bg-brand-dark hover:shadow-lg"
            >
              {initial}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 z-50 w-64 py-2 mt-3 border bg-surface-card border-surface-border shadow-modern rounded-2xl animate-fade-in">
                <div className="px-4 py-3 mb-1 border-b border-surface-border">
                  <p className="text-sm font-bold truncate text-ink-main">{user?.name || "User Account"}</p>
                  <p className="text-xs text-ink-muted truncate mt-0.5">{user?.email || "user@service.com"}</p>
                </div>

                <Link
                  to="/dashboard/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full text-left px-4 py-2.5 text-sm font-semibold text-ink-muted hover:text-brand hover:bg-brand-light transition-colors flex items-center gap-2"
                >
                  <span className="text-lg">👤</span> My Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm font-semibold text-status-error hover:bg-status-error/10 transition-colors flex items-center gap-2 border-t border-surface-border mt-1 pt-2"
                >
                  <span className="text-lg">🚪</span> Logout Securely
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};

export default AuthHeader;
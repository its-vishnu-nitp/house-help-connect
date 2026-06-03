import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// 1. Import the exact same logo file used in Header.jsx
import logo from '../assets/logo.png'; 

const AuthHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
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
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    navigate('/login');
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-100 shadow-sm">
      {/* 2. Matched the container width (max-w-7xl) and padding (px-6) to perfectly align with Header.jsx */}
      <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
        
        {/* ================= LEFT SIDE (Logo) ================= */}
        <Link to="/dashboard" className="flex items-center transition-opacity hover:opacity-90">
          {/* 3. Used the exact same img tag and classes as Header.jsx */}
<svg viewBox="0 0 100 65" xmlns="http://www.w3.org/2000/svg" className="w-auto h-10">
  {/* Continuous Roof and Chimney Path */}
  <path 
    d="M 5 35 L 22 25.2 V 10 H 30 V 20.6 L 50 9 L 95 35" 
    fill="none" 
    stroke="#2563eb" /* <--- Updated to your blue */
    strokeWidth="5.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
  />
  {/* Bold HHC Text */}
  <text 
    x="50" 
    y="58" 
    fontFamily="Arial, sans-serif" 
    fontSize="30" 
    fontWeight="900" 
    fill="#2563eb" /* <--- Updated to your blue */
    textAnchor="middle" 
    letterSpacing="1"
  >
    HHC
  </text>
</svg>
        </Link>

        {/* ================= RIGHT SIDE (Notifications & Profile) ================= */}
        <div className="flex items-center gap-4">
          
          {/* Notification Bell */}
          <button 
            className="relative p-2 text-gray-500 transition-colors rounded-full hover:text-blue-600 hover:bg-blue-50 focus:outline-none"
            title="Notifications"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
          </button>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center w-10 h-10 text-lg font-bold text-white transition-colors bg-blue-600 rounded-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
            >
              {initial}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 w-56 py-2 mt-2 bg-white border border-gray-100 shadow-lg rounded-xl animate-fade-in">
                <div className="px-4 py-2 mb-1 border-b border-gray-100">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-sm text-gray-500 truncate mt-0.5">
                    {user?.email || "user@example.com"}
                  </p>
                </div>

                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <span>🚪</span> Logout
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
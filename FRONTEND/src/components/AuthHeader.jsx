import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { notificationService } from '../services/notification.service';

const AuthHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user] = useState(() => {
    try {
      const storedUser = localStorage.getItem("currentUser");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  const loadNotifications = async () => {
    try {
      const res = await notificationService.getMyNotifications();
      setNotifications(res.notifications || []);
      setUnreadCount(res.unreadCount || 0);
    } catch {
      /* notifications are non-critical chrome */
    }
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await notificationService.getMyNotifications();
        if (!cancelled) {
          setNotifications(res.notifications || []);
          setUnreadCount(res.unreadCount || 0);
        }
      } catch {
        /* notifications are non-critical chrome */
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const handleOpenNotifications = async () => {
    const opening = !isNotifOpen;
    setIsNotifOpen(opening);
    setIsDropdownOpen(false);
    if (opening) {
      await loadNotifications();
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      /* ignore */
    }
  };

  // Clicking a single unread notification marks just that one read
  const handleNotificationClick = async (notification) => {
    if (notification.isRead) return;
    // Optimistic update — the badge and highlight clear immediately
    setNotifications((prev) =>
      prev.map((n) => (n._id === notification._id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    try {
      await notificationService.markAsRead(notification._id);
    } catch {
      /* the optimistic state is corrected on the next load */
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    const handleNotifClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('mousedown', handleNotifClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousedown', handleNotifClickOutside);
    };
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
          <div className="relative" ref={notifRef}>
            <button
              onClick={handleOpenNotifications}
              aria-label="Notifications"
              className="relative p-2 transition-colors rounded-full text-ink-muted hover:text-brand hover:bg-brand-light focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-status-error text-white text-[11px] font-black border-2 border-surface-card rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 z-50 mt-3 overflow-hidden border w-80 bg-surface-card border-surface-border shadow-modern rounded-2xl animate-pop-in">
                <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
                  <p className="text-sm font-bold text-ink-main">Notifications</p>
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAllRead} className="text-xs font-bold text-brand hover:underline">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="overflow-y-auto max-h-80">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-8 text-sm font-medium text-center text-ink-muted">
                      No notifications yet. Booking updates will appear here.
                    </p>
                  ) : (
                    notifications.slice(0, 10).map((n) => (
                      <div
                        key={n._id}
                        onClick={() => handleNotificationClick(n)}
                        className={`px-4 py-3 border-b border-surface-border/60 ${n.isRead ? '' : 'bg-brand-light/30 cursor-pointer hover:bg-brand-light/50'}`}
                        title={n.isRead ? undefined : 'Click to mark as read'}
                      >
                        <p className="text-sm font-bold text-ink-main">{n.title}</p>
                        <p className="text-xs leading-relaxed text-ink-muted">{n.message}</p>
                        <p className="mt-1 text-[11px] font-semibold text-ink-muted">
                          {new Date(n.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

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
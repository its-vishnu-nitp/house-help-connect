import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/booking.service';

const WorkerClientsView = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getMyBookings();
      setBookings(res.bookings || []);
    } catch (err) {
      console.error('Failed to load worker bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Format date helper (e.g. 2026-09-10T00:00:00.000Z -> 10 Sep 2026)
  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Safe total fee calculation
  const calculateTotal = (job) => {
    const base = job.pricing?.basePrice ?? job.basePrice ?? 0;
    const tip = job.pricing?.tip ?? job.tip ?? 0;
    return base + tip;
  };

  const handleDecision = async (bookingId, decision) => {
    try {
      setActionLoading(bookingId);
      const newStatus = decision === 'accept' ? 'confirmed' : 'rejected';
      
      await bookingService.updateBookingStatus(bookingId, {
        scheduleStatus: newStatus,
        status: decision === 'accept' ? 'upcoming' : 'cancelled'
      });

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId
            ? { ...b, scheduleStatus: newStatus, status: decision === 'accept' ? 'upcoming' : 'cancelled' }
            : b
        )
      );
    } catch (err) {
      console.error(`Failed to ${decision} booking`, err);
    } finally {
      setActionLoading(null);
    }
  };

  // --- TAB FILTERING LOGIC ---
  // 1. Pending inbound requests
  const pendingRequests = bookings.filter(
    (b) => b.scheduleStatus === 'pending_worker' || b.scheduleStatus === 'pending_pro'
  );

  // 2. Confirmed upcoming jobs (keeps them here even if already paid in advance)
  const upcomingJobs = bookings.filter(
    (b) => b.scheduleStatus === 'confirmed' && b.status !== 'cancelled'
  );

  // 3. Past or rejected jobs
  const pastJobs = bookings.filter(
    (b) => b.status === 'cancelled' || b.scheduleStatus === 'rejected'
  );

  return (
    <div className="w-full pt-4 space-y-8 font-sans animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight md:text-4xl text-ink-main">
          Job Requests & Clients
        </h1>
        <p className="text-lg text-ink-muted">
          Accept new client requests, track scheduled jobs, and monitor incoming earnings.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-surface-border">
        {[
          { id: 'requests', label: 'New Requests', count: pendingRequests.length },
          { id: 'upcoming', label: 'Upcoming Jobs', count: upcomingJobs.length },
          { id: 'past', label: 'Past Jobs', count: pastJobs.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-sm font-bold tracking-wider transition-all duration-300 relative flex items-center gap-2 ${
              activeTab === tab.id ? 'text-brand' : 'text-ink-muted hover:text-ink-main'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span
                className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                  activeTab === tab.id
                    ? 'bg-brand text-white'
                    : 'bg-surface-border text-ink-muted'
                }`}
              >
                {tab.count}
              </span>
            )}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-1 rounded-t-full bg-brand animate-fade-in"></span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <p className="text-base font-semibold animate-pulse text-brand">Loading records...</p>
        </div>
      ) : (
        <div>
          {/* TAB 1: PENDING REQUESTS */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              {pendingRequests.length === 0 ? (
                <div className="p-12 text-center text-ink-muted bg-surface-card rounded-[2rem] border border-surface-border shadow-sm">
                  No new client requests right now.
                </div>
              ) : (
                pendingRequests.map((job) => {
                  const client = typeof job.client === 'object' && job.client !== null ? job.client : {};
                  const clientName = client.name || 'Client';
                  const clientInitial = clientName.charAt(0).toUpperCase();
                  const location = client.location?.city || 'Local Area';
                  const total = calculateTotal(job);

                  return (
                    <div
                      key={job._id}
                      className="flex flex-col justify-between gap-6 p-6 transition-all border lg:flex-row lg:items-center bg-surface-card rounded-3xl border-surface-border shadow-modern"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center flex-shrink-0 w-16 h-16 text-2xl font-black rounded-2xl bg-brand/10 text-brand">
                          {clientInitial}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-ink-main">{clientName}</h3>
                            <span className="px-3 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-800">
                              Pending Response
                            </span>
                          </div>
                          <p className="font-semibold text-brand">{job.service || job.serviceCategory}</p>
                          <p className="text-sm font-medium text-ink-muted">
                            📍 {location} &nbsp;•&nbsp; 📅 {formatDate(job.date)} at ⏰ {job.time}
                          </p>
                          {job.notes && (
                            <p className="pt-1 text-xs italic text-ink-muted">
                              Client Note: "{job.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs font-bold text-ink-muted">Fare</p>
                          <p className="text-lg font-black text-ink-main">₹{total.toLocaleString()}</p>
                        </div>
                        <button
                          onClick={() => handleDecision(job._id, 'reject')}
                          disabled={actionLoading === job._id}
                          className="px-5 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors disabled:opacity-50"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleDecision(job._id, 'accept')}
                          disabled={actionLoading === job._id}
                          className="px-6 py-2.5 text-sm font-bold text-white bg-brand hover:bg-brand-dark rounded-xl transition-colors shadow-sm disabled:opacity-50"
                        >
                          {actionLoading === job._id ? 'Updating...' : 'Accept Job'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: UPCOMING CONFIRMED JOBS */}
          {activeTab === 'upcoming' && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {upcomingJobs.length === 0 ? (
                <div className="col-span-full p-12 text-center text-ink-muted bg-surface-card rounded-[2rem] border border-surface-border shadow-sm">
                  No upcoming confirmed jobs scheduled.
                </div>
              ) : (
                upcomingJobs.map((job) => {
                  const client = typeof job.client === 'object' && job.client !== null ? job.client : {};
                  const clientName = client.name || 'Client';
                  const clientInitial = clientName.charAt(0).toUpperCase();
                  const location = client.location?.city || 'Local Area';
                  const isPaid = job.paymentStatus === 'paid';
                  const total = calculateTotal(job);

                  return (
                    <div
                      key={job._id}
                      className="relative bg-surface-card p-6 rounded-[2rem] border border-surface-border shadow-modern flex flex-col items-center text-center"
                    >
                      {/* Status Badges */}
                      <div className="absolute flex gap-1 top-4 left-4">
                        <span className="px-3 py-1 text-xs font-bold border rounded-full bg-emerald-50 border-emerald-200 text-emerald-700">
                          Confirmed
                        </span>
                        {isPaid && (
                          <span className="px-2 py-1 text-xs font-bold text-blue-700 border border-blue-200 rounded-full bg-blue-50">
                            Paid ✓
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-center w-16 h-16 mt-6 mb-4 text-2xl font-black rounded-full shadow-inner bg-brand/10 text-brand">
                        {clientInitial}
                      </div>

                      <h3 className="mb-1 text-xl font-bold text-ink-main">{clientName}</h3>
                      <p className="mb-2 text-xs font-semibold text-brand">{job.service || job.serviceCategory}</p>
                      <p className="mb-1 text-sm font-medium text-ink-muted">📍 {location}</p>
                      <p className="mb-6 text-xs text-ink-muted">
                        📅 {formatDate(job.date)} at ⏰ {job.time}
                      </p>

                      <div className="flex items-center justify-between w-full pt-4 mt-auto border-t border-surface-border">
                        <span className="text-xs font-bold text-ink-muted">Earnings:</span>
                        <span className="text-xl font-black text-ink-main">
                          ₹{total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 3: PAST JOBS */}
          {activeTab === 'past' && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {pastJobs.length === 0 ? (
                <div className="col-span-full p-12 text-center text-ink-muted bg-surface-card rounded-[2rem] border border-surface-border shadow-sm">
                  No past or cancelled jobs recorded.
                </div>
              ) : (
                pastJobs.map((job) => {
                  const client = typeof job.client === 'object' && job.client !== null ? job.client : {};
                  const clientName = client.name || 'Client';
                  const clientInitial = clientName.charAt(0).toUpperCase();
                  const location = client.location?.city || 'Local Area';
                  const total = calculateTotal(job);

                  return (
                    <div
                      key={job._id}
                      className="relative bg-surface-card p-6 rounded-[2rem] border border-surface-border shadow-modern flex flex-col items-center text-center opacity-85"
                    >
                      <div className="absolute px-3 py-1 border rounded-full top-4 left-4 bg-surface border-surface-border">
                        <span className="text-xs font-bold capitalize text-ink-muted">
                          {job.scheduleStatus || job.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-center w-16 h-16 mt-6 mb-4 text-2xl font-black rounded-full shadow-inner bg-slate-100 text-ink-muted">
                        {clientInitial}
                      </div>

                      <h3 className="mb-1 text-xl font-bold text-ink-main">{clientName}</h3>
                      <p className="mb-1 text-sm font-medium text-ink-muted">📍 {location}</p>
                      <p className="mb-4 text-xs text-ink-muted">📅 {formatDate(job.date)}</p>

                      <div className="flex items-center justify-between w-full pt-4 mt-auto border-t border-surface-border">
                        <span className="text-xs font-bold text-ink-muted">Total:</span>
                        <span className="text-sm font-bold text-ink-main">
                          ₹{total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkerClientsView;
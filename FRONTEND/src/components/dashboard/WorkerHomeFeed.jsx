import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/booking.service';

const WorkerHomeFeed = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const fetchWorkerBookings = async () => {
      try {
        const response = await bookingService.getMyBookings();
        setBookings(response.bookings || []);
      } catch (err) {
        console.error("Failed to fetch live worker assignments", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkerBookings();
  }, []);

  const handleDecision = async (bookingId, decision) => {
    try {
      setActionLoading(bookingId);
      const newStatus = decision === 'accept' ? 'confirmed' : 'rejected';
      
      await bookingService.updateBookingStatus(bookingId, { 
        scheduleStatus: newStatus,
        status: decision === 'accept' ? 'upcoming' : 'cancelled'
      });

      setBookings(bookings.map(b => 
        (b._id === bookingId || b.id === bookingId) 
          ? { ...b, scheduleStatus: newStatus, status: decision === 'accept' ? 'upcoming' : 'cancelled' } 
          : b
      ));
    } catch (err) {
      console.error(`Failed to ${decision} contract`, err);
    } finally {
      setActionLoading(null);
    }
  };

  const activeBookings = bookings.filter(b => b.status === 'upcoming' || b.status === 'active');

  return (
    <div className="w-full pt-4 space-y-10 animate-fade-in">
      <div className="flex flex-col justify-between gap-4 pb-6 border-b md:flex-row md:items-end border-surface-border">
        <div>
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight md:text-4xl text-ink-main">Provider Command Canvas</h1>
          <p className="text-lg text-ink-muted">Review live operational updates and active workflow dispatch sheets.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 font-bold border rounded-full shadow-sm bg-status-success/10 text-status-success border-status-success/20">
          <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-pulse"></span>
          Dispatch Online
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="p-8 bg-surface-card rounded-[2rem] border border-surface-border shadow-modern flex items-center justify-between">
          <div>
            <p className="mb-1 text-xs font-bold tracking-wider uppercase text-ink-muted">Total Assignments</p>
            <h3 className="text-3xl font-extrabold text-ink-main">{bookings.length} Jobs</h3>
          </div>
          <div className="flex items-center justify-center text-2xl w-14 h-14 rounded-2xl bg-brand-light">💼</div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-ink-main">Live Open Inbound Contracts</h2>
        
        {loading ? (
          <div className="p-12 text-center text-ink-muted bg-surface-card rounded-[2rem] border border-surface-border">
            Fetching dispatch updates...
          </div>
        ) : activeBookings.length === 0 ? (
          <div className="w-full p-12 border-2 border-dashed border-surface-border rounded-[2rem] bg-surface flex flex-col items-center justify-center text-center">
            <p className="max-w-md font-medium text-ink-muted">
              No inbound service requests at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeBookings.map((job) => {
              const jobId = job._id || job.id;
              const isConfirmed = job.scheduleStatus === 'confirmed';
              const isRejected = job.scheduleStatus === 'rejected';
              const isProcessing = actionLoading === jobId;

              return (
                <div 
                  key={jobId} 
                  className="bg-surface-card p-8 rounded-[2rem] border border-surface-border shadow-modern flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all duration-300"
                >
                  <div>
                    <span 
                      className={`inline-block px-3 py-1 mb-3 text-xs font-bold tracking-wider uppercase border rounded-full ${
                        isConfirmed 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : isRejected
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {job.scheduleStatus || 'Pending Acceptance'}
                    </span>
                    <h3 className="mb-1 text-2xl font-bold text-ink-main">{job.service || job.serviceCategory}</h3>
                    <p className="font-medium text-ink-muted">
                      Client: <span className="font-semibold text-ink-main">{job.client?.name || 'Customer'}</span>
                    </p>
                    <p className="mt-1 text-xs text-ink-muted">
                      📅 {job.date} at ⏰ {job.time}
                    </p>
                  </div>

                  {/* Two Action Buttons: Decline & Accept */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDecision(jobId, 'reject')}
                      disabled={isConfirmed || isRejected || isProcessing}
                      className={`px-5 py-3 text-sm font-bold rounded-xl border transition-all ${
                        isConfirmed || isRejected
                          ? 'opacity-40 cursor-not-allowed border-surface-border text-ink-muted bg-surface'
                          : 'text-rose-600 hover:bg-rose-50 border-rose-200 cursor-pointer active:scale-95'
                      }`}
                    >
                      Decline
                    </button>

                    <button 
                      onClick={() => handleDecision(jobId, 'accept')}
                      disabled={isConfirmed || isRejected || isProcessing}
                      className={`px-6 py-3 text-sm font-bold rounded-xl transition-all shadow-sm ${
                        isConfirmed
                          ? 'opacity-60 cursor-not-allowed bg-emerald-600 text-white'
                          : isRejected
                          ? 'opacity-40 cursor-not-allowed bg-slate-400 text-white'
                          : 'bg-brand hover:bg-brand-dark text-white cursor-pointer active:scale-95 shadow-brand/20'
                      }`}
                    >
                      {isProcessing 
                        ? 'Updating...' 
                        : isConfirmed 
                        ? 'Accepted ✓' 
                        : isRejected 
                        ? 'Declined' 
                        : 'Accept Contract'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerHomeFeed;
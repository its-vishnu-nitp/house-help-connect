import React, { useState } from 'react';
import { bookingService } from '../../services/booking.service';

const BookingsView = ({ bookings = [], onUpdateTip }) => {
  const [localBookings, setLocalBookings] = useState(bookings);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedPaymentJob, setSelectedPaymentJob] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Sync state if parent props update
  React.useEffect(() => {
    setLocalBookings(bookings);
  }, [bookings]);

  // Format messy ISO date strings (e.g. 2026-09-10T00:00:00.000Z -> 10 Sep 2026)
  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // --- 1. CANCEL JOB HANDLER ---
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      setActionLoading(bookingId);
      await bookingService.updateBookingStatus(bookingId, {
        status: 'cancelled',
        scheduleStatus: 'rejected'
      });
      setLocalBookings((prev) =>
        prev.map((b) => ((b._id === bookingId || b.id === bookingId) ? { ...b, status: 'cancelled', scheduleStatus: 'rejected' } : b))
      );
    } catch (err) {
      console.error("Failed to cancel job", err);
      alert("Failed to cancel the booking. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  // --- 2. DUMMY PAYMENT HANDLER ---
  const handleProcessPayment = async (job) => {
    setPaymentProcessing(true);

    /* =========================================================================
       FUTURE PAYMENT GATEWAY INTEGRATION (Razorpay / Stripe / Escrow)
       -------------------------------------------------------------------------
       1. Call backend API to create an order:
          const order = await paymentService.createOrder({ bookingId: job._id, amount: totalAmount });
       
       2. Initialize Razorpay / Stripe SDK:
          const rzp = new window.Razorpay({
             key: process.env.REACT_APP_RAZORPAY_KEY,
             amount: order.amount,
             order_id: order.id,
             handler: async (response) => {
                await paymentService.verifyPayment(response);
             }
          });
          rzp.open();
       ========================================================================= */

    // Simulated 1.5-second payment processing delay
    setTimeout(async () => {
      try {
        const bookingId = job._id || job.id;
        await bookingService.updateBookingStatus(bookingId, {
          paymentStatus: 'paid'
        });

        setLocalBookings((prev) =>
          prev.map((b) => ((b._id === bookingId || b.id === bookingId) ? { ...b, paymentStatus: 'paid' } : b))
        );
        setSelectedPaymentJob(null);
        alert(`Payment of ₹${job.calculatedTotal} received successfully!`);
      } catch (err) {
        console.error("Payment failed", err);
      } finally {
        setPaymentProcessing(false);
      }
    }, 1500);
  };

  const displayBookings = localBookings.filter((b) => {
    if (activeTab === 'active') return b.status === 'active' || b.scheduleStatus === 'in_progress';
    if (activeTab === 'upcoming') return b.status === 'upcoming' || b.scheduleStatus === 'pending_pro' || b.scheduleStatus === 'confirmed';
    return b.status === 'completed' || b.status === 'cancelled' || b.scheduleStatus === 'rejected';
  });

  return (
    <div className="w-full pt-4 space-y-8 font-sans animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight md:text-4xl text-ink-main">Job Management</h1>
        <p className="text-lg text-ink-muted">Track active hires, confirm dates, and manage payments.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-surface-border">
        {['active', 'upcoming', 'past'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all duration-300 relative ${
              activeTab === tab ? 'text-brand' : 'text-ink-muted hover:text-ink-main'
            }`}
          >
            {tab === 'active' ? 'Active Hires' : tab === 'upcoming' ? 'Upcoming Jobs' : 'Past & Cancelled'}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-1 rounded-t-full bg-brand animate-fade-in"></span>
            )}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {displayBookings.length === 0 ? (
          <div className="p-12 text-center text-ink-muted bg-surface-card rounded-[2rem] border border-surface-border shadow-sm">
            No jobs found in this category.
          </div>
        ) : (
          displayBookings.map((job) => {
            const bookingId = job._id || job.id;
            const proName =
              typeof job.professional === 'object' && job.professional !== null
                ? job.professional.name || job.professional.userId?.name || 'Professional'
                : job.professional || 'Professional';

            const serviceName = job.service || job.serviceCategory || 'Home Service';
            const baseFare = job.pricing?.basePrice ?? job.basePrice ?? 500;
            const currentTip = job.pricing?.tip ?? job.tip ?? 0;
            const totalAmount = baseFare + currentTip;
            const isConfirmed = job.scheduleStatus === 'confirmed';
            const isPaid = job.paymentStatus === 'paid';
            const isCancelled = job.status === 'cancelled' || job.scheduleStatus === 'rejected';

            return (
              <div
                key={bookingId}
                className="bg-surface-card rounded-[2rem] border border-surface-border shadow-modern overflow-hidden flex flex-col md:flex-row transition-all duration-300 hover:shadow-xl"
              >
                {/* Left Column: Job Details */}
                <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-surface-border">
                  <div className="flex items-start justify-between mb-6">
                    <p className="text-xs font-bold tracking-wider text-ink-muted">
                      ID: {bookingId ? String(bookingId).slice(-6).toUpperCase() : 'N/A'}
                    </p>
                    <span
                      className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border flex items-center gap-1 ${
                        isPaid
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : isConfirmed
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : isCancelled
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {isPaid ? 'PAID ✓' : isConfirmed ? '✓ CONFIRMED' : job.scheduleStatus || job.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center justify-center text-2xl rounded-full shadow-inner w-14 h-14 bg-slate-100">
                      🧑‍🔧
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-ink-main">{serviceName}</h3>
                      <p className="font-medium text-ink-muted">
                        Pro: <span className="font-semibold text-ink-main">{proName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-5 border bg-surface rounded-2xl border-surface-border">
                    <p className="mb-2 text-xs font-bold tracking-wider uppercase text-ink-muted">Scheduled For</p>
                    <p className="flex items-center gap-2 font-medium text-ink-main">
                      📅 {formatDate(job.date)} at ⏰ {job.time || 'TBD'}
                    </p>
                    {job.notes && (
                      <p className="mt-2 text-xs italic text-ink-muted">Notes: "{job.notes}"</p>
                    )}
                  </div>
                </div>

                {/* Right Column: Payment Details */}
                <div className="flex flex-col justify-between w-full p-8 md:w-80 bg-surface/50">
                  <div>
                    <p className="mb-4 text-xs font-bold tracking-wider uppercase text-ink-main">Payment Details</p>

                    <div className="flex justify-between mb-4 font-medium text-ink-muted">
                      <span>Base Fare:</span>
                      <span className="font-semibold text-ink-main">₹{baseFare.toLocaleString()}</span>
                    </div>

                    {!isPaid && !isCancelled && (
                      <div className="mb-6">
                        <p className="mb-2 text-sm font-medium text-ink-muted">Add a Tip:</p>
                        <div className="flex gap-2">
                          {[0, 50, 100, 200].map((tipVal) => (
                            <button
                              key={tipVal}
                              type="button"
                              onClick={() => onUpdateTip && onUpdateTip(bookingId, tipVal)}
                              className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                                currentTip === tipVal
                                  ? 'bg-brand border-brand text-white shadow-md'
                                  : 'bg-surface-card border-surface-border text-ink-muted hover:border-brand/40'
                              }`}
                            >
                              {tipVal === 0 ? 'No' : `₹${tipVal}`}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 mb-8 border-t border-surface-border">
                      <span className="font-bold text-ink-main">Total:</span>
                      <span className="text-3xl font-extrabold text-ink-main">
                        ₹{totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-auto">
                    {!isPaid && !isCancelled && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleCancelBooking(bookingId)}
                          disabled={actionLoading === bookingId}
                          className="flex-1 py-3 text-sm font-bold transition-colors border cursor-pointer text-rose-500 bg-surface-card border-rose-200 rounded-xl hover:bg-rose-50 disabled:opacity-50"
                        >
                          {actionLoading === bookingId ? 'Cancelling...' : 'Cancel Job'}
                        </button>

                        {/* Pay Now Button: Strictly disabled until scheduleStatus === 'confirmed' */}
                        <button
                          type="button"
                          disabled={!isConfirmed}
                          onClick={() => setSelectedPaymentJob({ ...job, calculatedTotal: totalAmount })}
                          className={`flex-[1.5] py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1 ${
                            isConfirmed
                              ? 'bg-brand text-white shadow-lg shadow-brand/30 hover:bg-brand-dark cursor-pointer active:scale-95'
                              : 'bg-surface-border text-ink-muted cursor-not-allowed opacity-60'
                          }`}
                          title={!isConfirmed ? 'Payment unlocks once the provider accepts your request' : 'Proceed to payment'}
                        >
                          {isConfirmed ? '🔒 Pay Now' : 'Awaiting Approval'}
                        </button>
                      </>
                    )}

                    {isPaid && (
                      <div className="w-full py-3 text-sm font-bold text-center border text-emerald-700 bg-emerald-50 border-emerald-200 rounded-xl">
                        Paid Successfully ✓
                      </div>
                    )}

                    {isCancelled && (
                      <div className="w-full py-3 text-sm font-bold text-center border text-rose-600 bg-rose-50 border-rose-200 rounded-xl">
                        Job Cancelled
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* --- DUMMY PAYMENT MODAL --- */}
      {selectedPaymentJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 space-y-6 border shadow-2xl bg-surface-card rounded-3xl border-surface-border">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-3 text-3xl rounded-full bg-brand/10">
                💳
              </div>
              <h2 className="text-2xl font-black text-ink-main">Complete Payment</h2>
              <p className="mt-1 text-sm text-ink-muted">
                Simulated Test Checkout (Sandbox Mode)
              </p>
            </div>

            <div className="p-4 space-y-2 border rounded-2xl border-surface-border bg-surface">
              <div className="flex justify-between text-sm">
                <span className="text-ink-muted">Service</span>
                <span className="font-bold text-ink-main">
                  {selectedPaymentJob.service || selectedPaymentJob.serviceCategory}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-muted">Total Payable</span>
                <span className="text-lg font-black text-brand">
                  ₹{selectedPaymentJob.calculatedTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Placeholder for Card/UPI input fields */}
            <div className="p-3 text-xs text-center border border-dashed border-surface-border rounded-xl text-ink-muted">
              🔒 Card & UPI inputs will load here in production.
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                disabled={paymentProcessing}
                onClick={() => setSelectedPaymentJob(null)}
                className="flex-1 py-3 font-semibold transition-colors border rounded-xl border-surface-border text-ink-main hover:bg-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={paymentProcessing}
                onClick={() => handleProcessPayment(selectedPaymentJob)}
                className="flex-1 py-3 font-bold text-white transition-all bg-brand rounded-xl hover:bg-brand-dark disabled:opacity-50"
              >
                {paymentProcessing ? 'Processing...' : `Pay ₹${selectedPaymentJob.calculatedTotal}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsView;
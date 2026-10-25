import React, { useState } from 'react';
import { bookingService } from '../../services/booking.service';
import { reviewService } from '../../services/review.service';
import { paymentService } from '../../services/payment.service';
import RescheduleModal from './RescheduleModal';
import { showToast } from '../../utils/toast';

const BookingsView = ({ bookings = [], onUpdateTip, onMessage }) => {
  const [localBookings, setLocalBookings] = useState(bookings);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedPaymentJob, setSelectedPaymentJob] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [actionLoading, setActionLoading] = useState(null);
  const [reviewedIds, setReviewedIds] = useState([]);
  const [reviewDrafts, setReviewDrafts] = useState({});
  const [reviewSubmitting, setReviewSubmitting] = useState(null);
  const [receipts, setReceipts] = useState({});
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const fetchedReceiptsRef = React.useRef(new Set());
  const fetchedReviewsRef = React.useRef(new Set());

  // Sync state if parent props update
  React.useEffect(() => {
    setLocalBookings(bookings);
  }, [bookings]);

  // Server-derived state that must survive refresh:
  //  - full payment receipts for paid bookings (GET /payments/:bookingId),
  //    falling back to the booking's own mirrored receipt fields on failure
  //  - "already reviewed" for completed bookings (GET /reviews/booking/:id),
  //    instead of relying on local state from this session only
  React.useEffect(() => {
    bookings.forEach((b) => {
      const id = b._id || b.id;
      if (!id) return;
      if (b.paymentStatus === 'paid' && !fetchedReceiptsRef.current.has(id)) {
        fetchedReceiptsRef.current.add(id);
        paymentService.getPaymentByBooking(id)
          .then((res) => {
            if (res.payment) setReceipts((prev) => ({ ...prev, [id]: res.payment }));
          })
          .catch(() => { /* booking's own payment fields are the fallback */ });
      }
      if (b.status === 'completed' && !fetchedReviewsRef.current.has(id)) {
        fetchedReviewsRef.current.add(id);
        reviewService.getReviewByBooking(id)
          .then((res) => {
            if (res.review) {
              setReviewedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
            }
          })
          .catch(() => { /* leave the review form available */ });
      }
    });
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
      showToast('Failed to cancel the booking. Please try again.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // --- 2. DEMO PAYMENT HANDLER ---
  // The payment itself is simulated (no real gateway), but the RESULT is
  // persisted on the server via POST /bookings/:id/pay — so after paying,
  // a page refresh re-reads paymentStatus: 'paid' from the database and
  // the pay options never reappear. (Previously this called the generic
  // status endpoint with a paymentStatus field that the backend ignored,
  // which is exactly why payments "didn't stick".)
  const handleProcessPayment = async (job) => {
    const bookingId = job._id || job.id;
    setPaymentProcessing(true);
    try {
      // Short simulated gateway delay for realism
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const res = await bookingService.payBooking(bookingId, paymentMethod);
      const updated = res.booking;
      setLocalBookings((prev) =>
        prev.map((b) => ((b._id === bookingId || b.id === bookingId) ? { ...b, ...updated } : b))
      );
      setSelectedPaymentJob(null);
      showToast(`Demo payment of ₹${job.calculatedTotal} recorded successfully!`, 'success');
    } catch (err) {
      console.error("Payment failed", err);
      showToast(err.response?.data?.message || 'Payment failed. Please try again.', 'error');
    } finally {
      setPaymentProcessing(false);
    }
  };

  // --- 3. REVIEW HANDLER (completed jobs only; backend enforces one per booking) ---
  const handleSubmitReview = async (job) => {
    const bookingId = job._id || job.id;
    const draft = reviewDrafts[bookingId] || {};
    if (!draft.rating) {
      showToast('Please pick a star rating first.', 'error');
      return;
    }
    setReviewSubmitting(bookingId);
    try {
      await reviewService.createReview({
        bookingId,
        rating: draft.rating,
        comment: draft.comment || ''
      });
      setReviewedIds((prev) => [...prev, bookingId]);
      showToast('Thanks! Your review has been submitted.', 'success');
    } catch (err) {
      // Most common case: already reviewed in an earlier session
      if (err.response?.status === 400 && /already reviewed/i.test(err.response?.data?.message || '')) {
        setReviewedIds((prev) => [...prev, bookingId]);
        showToast('You have already reviewed this job.', 'success');
      } else {
        showToast(err.response?.data?.message || 'Could not submit the review.', 'error');
      }
    } finally {
      setReviewSubmitting(null);
    }
  };

  // One bucket per tab, keyed on the booking `status` alone — previously
  // scheduleStatus leaked into the filters, so a completed booking (whose
  // scheduleStatus stays 'confirmed') appeared in BOTH Upcoming and Past,
  // and the Active tab matched values the backend never produces.
  const displayBookings = localBookings.filter((b) => {
    if (activeTab === 'active') return b.status === 'active';
    if (activeTab === 'upcoming') return b.status === 'upcoming';
    return b.status === 'completed' || b.status === 'cancelled';
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
            // Never render a raw Mongo ObjectId as a name: populate leaves
            // the id behind when the referenced user no longer exists
            // (e.g. stale/seeded bookings), so fall back to a clean label.
            const isObjectId = (v) => typeof v === 'string' && /^[0-9a-f]{24}$/i.test(v);
            const proName =
              typeof job.professional === 'object' && job.professional !== null
                ? job.professional.name || job.professional.userId?.name || 'Professional'
                : isObjectId(job.professional)
                  ? 'Professional'
                  : job.professional || 'Professional';

            const serviceName = job.service || job.serviceCategory || 'Home Service';
            const baseFare = job.pricing?.basePrice ?? job.basePrice ?? 500;
            const currentTip = job.pricing?.tip ?? job.tip ?? 0;
            const totalAmount = baseFare + currentTip;
            const isConfirmed = job.scheduleStatus === 'confirmed';
            const isPaid = job.paymentStatus === 'paid';
            const isCancelled = job.status === 'cancelled' || job.scheduleStatus === 'rejected';
            const proUserId =
              typeof job.professional === 'object' && job.professional !== null
                ? job.professional._id || job.professional.userId?._id || job.professional.userId
                : job.professional;
            // Full receipt from the payments API, with the booking's own
            // mirrored fields as fallback when that fetch didn't succeed
            const receipt = receipts[bookingId];
            const receiptAmount = receipt?.amount ?? totalAmount;
            const receiptMethod = receipt?.paymentMethod || job.paymentMethod || 'UPI';
            const receiptTxn = receipt?.transactionId || job.transactionId;
            const receiptDate = receipt?.createdAt || job.paidAt;

            return (
              <div
                key={bookingId}
                className="bg-surface-card rounded-[2rem] border border-surface-border shadow-modern overflow-hidden flex flex-col md:grid md:grid-cols-[1fr_20rem] transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
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

                  {/* Message + Reschedule actions */}
                  <div className="flex flex-wrap gap-2.5 mt-4">
                    {onMessage && proUserId && (
                      <button
                        type="button"
                        onClick={() => onMessage({ userId: proUserId, name: proName, bookingId })}
                        className="px-4 py-2.5 text-xs font-bold transition-all border rounded-xl border-brand/40 text-brand bg-brand/5 hover:bg-brand/10 active:scale-95"
                      >
                        💬 Message {proName}
                      </button>
                    )}
                    {job.status === 'upcoming' && !isCancelled && (
                      <button
                        type="button"
                        onClick={() => setRescheduleTarget(job)}
                        className="px-4 py-2.5 text-xs font-bold transition-all border rounded-xl border-surface-border text-ink-main bg-surface-card hover:border-brand/40 hover:text-brand active:scale-95"
                      >
                        📅 Reschedule
                      </button>
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

                    {isPaid && (
                      <div className="p-4 mb-6 space-y-1.5 text-sm border border-emerald-200 rounded-2xl bg-emerald-50/70">
                        <p className="flex items-center gap-2 text-xs font-black tracking-wider uppercase text-emerald-800">
                          🧾 Payment Receipt <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-600 text-white">DEMO</span>
                        </p>
                        <p className="flex justify-between"><span className="text-ink-muted">Amount Paid</span><span className="font-bold text-ink-main">₹{receiptAmount.toLocaleString()}</span></p>
                        <p className="flex justify-between"><span className="text-ink-muted">Method</span><span className="font-bold text-ink-main">{receiptMethod}</span></p>
                        {receiptTxn && (
                          <p className="flex justify-between gap-2"><span className="text-ink-muted">Txn ID</span><span className="font-mono text-xs font-bold text-ink-main">{receiptTxn}</span></p>
                        )}
                        {receiptDate && (
                          <p className="flex justify-between"><span className="text-ink-muted">Paid On</span><span className="font-bold text-ink-main">{formatDate(receiptDate)}</span></p>
                        )}
                        {receipt?.status && (
                          <p className="flex justify-between"><span className="text-ink-muted">Status</span><span className="font-bold capitalize text-emerald-700">{receipt.status}</span></p>
                        )}
                      </div>
                    )}
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

                {/* Review strip — only for completed jobs, hidden once reviewed */}
                {job.status === 'completed' && !reviewedIds.includes(bookingId) && (
                  <div className="p-6 border-t md:col-span-2 border-surface-border bg-surface/60 md:flex md:items-center md:gap-6">
                    <div className="mb-3 md:mb-0 shrink-0">
                      <p className="text-sm font-bold text-ink-main">How was the service?</p>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewDrafts((prev) => ({ ...prev, [bookingId]: { ...prev[bookingId], rating: star } }))}
                            className={`text-2xl transition-transform hover:scale-125 active:scale-95 ${(reviewDrafts[bookingId]?.rating || 0) >= star ? 'text-amber-500' : 'text-slate-300'}`}
                            aria-label={`${star} star${star > 1 ? 's' : ''}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Add a short comment (optional)"
                      value={reviewDrafts[bookingId]?.comment || ''}
                      onChange={(e) => setReviewDrafts((prev) => ({ ...prev, [bookingId]: { ...prev[bookingId], comment: e.target.value } }))}
                      className="flex-1 w-full p-3 mb-3 text-sm border outline-none md:mb-0 rounded-xl border-surface-border bg-surface-card text-ink-main focus:ring-2 focus:ring-brand"
                    />
                    <button
                      type="button"
                      disabled={reviewSubmitting === bookingId}
                      onClick={() => handleSubmitReview(job)}
                      className="px-5 py-3 text-sm font-bold text-white transition-all shrink-0 bg-brand rounded-xl hover:bg-brand-dark active:scale-95 disabled:opacity-50"
                    >
                      {reviewSubmitting === bookingId ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                )}
                {job.status === 'completed' && reviewedIds.includes(bookingId) && (
                  <div className="px-6 py-3 text-sm font-bold border-t text-emerald-700 border-surface-border bg-emerald-50/60 md:col-span-2">
                    ✓ Review submitted — thank you!
                  </div>
                )}
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

            {/* Demo payment-method picker (no real gateway is charged) */}
            <div>
              <p className="mb-2 text-sm font-bold text-ink-main">Pay using</p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'UPI', icon: '📱' },
                  { id: 'Card', icon: '💳' },
                  { id: 'Net Banking', icon: '🏦' },
                  { id: 'Wallet', icon: '👛' }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`flex flex-col items-center gap-1 py-3 text-[11px] font-bold rounded-xl border transition-all ${
                      paymentMethod === m.id
                        ? 'bg-brand/10 border-brand text-brand shadow-sm'
                        : 'bg-surface border-surface-border text-ink-muted hover:border-brand/40'
                    }`}
                  >
                    <span className="text-xl">{m.icon}</span>
                    {m.id}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-center text-ink-muted">
                🔒 This is a <strong>demo payment</strong> — no real money is charged.
                The payment is recorded on your booking, so it stays paid even after you refresh the page.
              </p>
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
      {/* --- RESCHEDULE MODAL --- */}
      {rescheduleTarget && (
        <RescheduleModal
          booking={rescheduleTarget}
          onClose={() => setRescheduleTarget(null)}
          onRescheduled={(updated) => {
            const uid = updated._id || updated.id;
            setLocalBookings((prev) =>
              prev.map((b) => ((b._id === uid || b.id === uid) ? { ...b, ...updated } : b))
            );
          }}
        />
      )}
    </div>
  );
};

export default BookingsView;
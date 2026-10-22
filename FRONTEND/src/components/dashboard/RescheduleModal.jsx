import React, { useState } from 'react';
import { bookingService } from '../../services/booking.service';
import { showToast } from '../../utils/toast';

const formatDate = (dateStr) => {
  if (!dateStr) return 'TBD';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const toDateInputValue = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
};

/**
 * Shared reschedule dialog (client + worker booking views). After a
 * reschedule the schedule returns to pending, so the other party has to
 * re-confirm — the copy below says exactly that.
 */
const RescheduleModal = ({ booking, onClose, onRescheduled }) => {
  const [date, setDate] = useState(toDateInputValue(booking?.date));
  const [time, setTime] = useState(booking?.time || '');
  const [submitting, setSubmitting] = useState(false);

  if (!booking) return null;
  const bookingId = booking._id || booking.id;
  const today = new Date().toISOString().slice(0, 10);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !time) {
      showToast('Please pick both a new date and a time.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const res = await bookingService.rescheduleBooking(bookingId, { date, time });
      showToast(res.message || 'Reschedule requested. Waiting for the other party to re-confirm.', 'success');
      if (onRescheduled) onRescheduled(res.booking || { ...booking, date, time });
      onClose();
    } catch (err) {
      console.error('Failed to reschedule booking', err);
      showToast(err.response?.data?.message || 'Could not reschedule this booking.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-md p-6 space-y-5 border shadow-2xl bg-surface-card rounded-3xl border-surface-border animate-pop-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Reschedule booking"
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 mb-3 text-2xl rounded-full bg-brand/10">📅</div>
          <h2 className="text-2xl font-black text-ink-main">Reschedule Booking</h2>
          <p className="mt-1 text-sm text-ink-muted">
            {booking.service || booking.serviceCategory || 'Home Service'} · currently {formatDate(booking.date)} at {booking.time || 'TBD'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reschedule-date" className="block mb-2 text-xs font-bold tracking-wider uppercase text-ink-muted">
              New Date
            </label>
            <input
              id="reschedule-date"
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3.5 border outline-none rounded-xl border-surface-border bg-surface text-ink-main focus:ring-2 focus:ring-brand font-medium"
              required
            />
          </div>
          <div>
            <label htmlFor="reschedule-time" className="block mb-2 text-xs font-bold tracking-wider uppercase text-ink-muted">
              New Time
            </label>
            <input
              id="reschedule-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3.5 border outline-none rounded-xl border-surface-border bg-surface text-ink-main focus:ring-2 focus:ring-brand font-medium"
              required
            />
          </div>

          <p className="p-3.5 text-xs font-medium leading-relaxed border rounded-xl bg-amber-50 border-amber-200 text-amber-800">
            Heads up: rescheduling sends this booking back to <strong>Pending Confirmation</strong> —
            the other party has to re-confirm the new date and time before it is confirmed again.
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-3 font-semibold transition-colors border rounded-xl border-surface-border text-ink-main hover:bg-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 font-bold text-white transition-all bg-brand rounded-xl hover:bg-brand-dark disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Request Reschedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RescheduleModal;

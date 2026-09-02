import React, { useState } from 'react';

const BookingModal = ({ worker, onClose, onSubmit }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!worker) return null;

  const rate = Number(worker.hourlyRate) > 0 ? Number(worker.hourlyRate) : 250;
  const calculatedBasePrice = rate * 2; // Standard 2-hour minimum service charge

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !time) return;

    setSubmitting(true);
    try {
      await onSubmit({
        professionalId: worker.userId?._id || worker.userId,
        service: worker.serviceCategory, // Matches bookingSchema "service"
        serviceCategory: worker.serviceCategory,
        basePrice: calculatedBasePrice, // Passes valid non-zero pricing
        hourlyRate: rate,
        date,
        time,
        notes
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md p-6 border shadow-2xl bg-surface-card rounded-3xl border-surface-border">
        <h2 className="text-xl font-bold text-ink-main">
          Book {worker.userId?.name || 'Professional'}
        </h2>
        <p className="mb-4 text-sm text-ink-muted">
          One-time request for <span className="font-semibold text-brand">{worker.serviceCategory}</span> (₹{rate}/hr)
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-xs font-semibold text-ink-muted">Service Date</label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border outline-none rounded-xl border-surface-border bg-surface text-ink-main focus:ring-2 focus:ring-brand"
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold text-ink-muted">Preferred Time</label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3 border outline-none rounded-xl border-surface-border bg-surface text-ink-main focus:ring-2 focus:ring-brand"
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold text-ink-muted">Job Details / Notes</label>
            <textarea
              rows="3"
              placeholder="e.g. 2-bedroom deep clean, 3rd floor..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 text-sm border outline-none rounded-xl border-surface-border bg-surface text-ink-main focus:ring-2 focus:ring-brand"
            ></textarea>
          </div>

          <div className="p-3 border rounded-xl bg-surface border-surface-border">
            <div className="flex justify-between text-xs font-semibold text-ink-muted">
              <span>Estimated Base Price (2 hrs):</span>
              <span className="font-bold text-ink-main">₹{calculatedBasePrice.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 font-semibold transition-colors border rounded-xl border-surface-border text-ink-main hover:bg-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 font-semibold text-white transition-colors bg-brand rounded-xl hover:bg-brand-dark disabled:opacity-50"
            >
              {submitting ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
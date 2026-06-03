import React, { useState } from 'react';

const BookingsView = ({ bookings, onUpdateTip, onAcceptDate, onProposeNewDate }) => {
  const [activeTab, setActiveTab] = useState('active');
  const [editingDateId, setEditingDateId] = useState(null);
  const [proposedDate, setProposedDate] = useState('');
  const [proposedTime, setProposedTime] = useState('');

  const filteredBookings = bookings.filter(b => b.status === activeTab || (activeTab === 'completed' && b.status === 'cancelled'));

  const handleProposeSubmit = (id) => {
    if (proposedDate && proposedTime) {
      onProposeNewDate(id, proposedDate, proposedTime);
      setEditingDateId(null);
    }
  };

  return (
    <div className="pb-10 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl">Job Management</h2>
        <p className="mt-1 text-ink-muted">Track active hires, confirm dates, and manage payments.</p>
      </div>

      {/* Modern Tabs */}
      <div className="flex gap-6 mb-8 overflow-x-auto border-b border-surface-border hide-scrollbar">
        {['active', 'upcoming', 'completed'].map((tab) => (
          <button 
            key={tab} onClick={() => setActiveTab(tab)}
            className={`pb-4 font-semibold text-sm transition-colors relative capitalize whitespace-nowrap ${activeTab === tab ? 'text-brand' : 'text-ink-muted hover:text-ink-main'}`}
          >
            {tab === 'active' ? '🟢 Active Hires' : tab === 'completed' ? 'Past & Cancelled' : 'Upcoming Jobs'}
            {activeTab === tab && <span className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-brand rounded-t-md"></span>}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredBookings.length === 0 ? (
          <div className="p-10 text-center modern-card text-ink-muted">No {activeTab} bookings found.</div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="p-6 modern-card">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-border">
                <span className="font-mono text-sm text-ink-muted">ID: {booking.id}</span>
                {booking.status === 'cancelled' && <span className="badge-error">❌ Cancelled</span>}
                {booking.status !== 'cancelled' && booking.scheduleStatus === 'pending_client' && <span className="badge-warning animate-pulse">⚠️ Action Required</span>}
                {booking.status !== 'cancelled' && booking.scheduleStatus === 'pending_pro' && <span className="badge-warning">⏳ Awaiting Pro</span>}
                {booking.status !== 'cancelled' && booking.scheduleStatus === 'confirmed' && <span className="badge-success">✅ Confirmed</span>}
              </div>

              {/* Main Grid */}
              <div className="flex flex-col justify-between gap-8 lg:flex-row">
                
                {/* Left Side: Professional & Schedule */}
                <div className="flex flex-1 gap-5">
                  <div className="flex items-center justify-center w-16 h-16 text-3xl rounded-full bg-brand-light text-brand shrink-0">{booking.avatar}</div>
                  <div className="w-full">
                    <h3 className="text-lg">{booking.service}</h3>
                    <p className="mt-1 text-sm text-ink-muted">Pro: <span className="font-semibold text-ink-main">{booking.professional}</span></p>
                    
                    <div className={`mt-5 p-4 rounded-xl border ${booking.scheduleStatus === 'pending_client' && booking.status !== 'cancelled' ? 'border-status-warning/50 bg-status-warning/5' : 'border-surface-border bg-surface'}`}>
                      {/* Schedule Logic Remains the same, utilizing standard tailwind layout classes */}
                      {editingDateId !== booking.id ? (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="mb-1 text-xs font-bold uppercase text-ink-muted">{booking.scheduleStatus === 'pending_client' ? 'Proposed:' : 'Scheduled For:'}</p>
                            <p className={`font-medium ${booking.status === 'cancelled' ? 'text-ink-muted line-through' : 'text-ink-main'}`}>📅 {booking.date} at ⏰ {booking.time}</p>
                          </div>
                          {booking.scheduleStatus === 'pending_client' && booking.status !== 'cancelled' && (
                            <div className="flex gap-2">
                              <button onClick={() => setEditingDateId(booking.id)} className="btn-outline !py-1.5 !px-3 !text-sm">Suggest New</button>
                              <button onClick={() => onAcceptDate(booking.id)} className="btn-brand !py-1.5 !px-4 !text-sm !bg-status-success hover:!bg-emerald-600">Accept</button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                           {/* Propose Form */}
                           <p className="text-sm font-bold text-ink-main">Propose New Time:</p>
                           <div className="flex gap-3">
                             <input type="date" className="flex-1 p-2 border rounded-lg border-surface-border" onChange={(e) => setProposedDate(e.target.value)} />
                             <input type="time" className="flex-1 p-2 border rounded-lg border-surface-border" onChange={(e) => setProposedTime(e.target.value)} />
                           </div>
                           <div className="flex justify-end gap-3 mt-2">
                             <button onClick={() => setEditingDateId(null)} className="text-sm text-ink-muted hover:underline">Cancel</button>
                             <button onClick={() => handleProposeSubmit(booking.id)} className="btn-brand !py-1.5 !px-4 !text-sm">Send</button>
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side: Payment Details */}
                <div className="flex flex-col p-5 bg-surface rounded-xl lg:min-w-[280px]">
                  <h4 className="pb-3 mb-4 text-sm uppercase border-b text-ink-main border-surface-border">Payment Details</h4>
                  <div className="flex justify-between mb-3 text-sm text-ink-muted"><span>Base Fare:</span><span className="font-semibold text-ink-main">₹{booking.basePrice.toLocaleString('en-IN')}</span></div>

                  {booking.paymentStatus === 'pending' && booking.status !== 'cancelled' ? (
                    <div className="mb-4">
                      <span className="block mb-2 text-sm text-ink-muted">Add a Tip:</span>
                      <div className="flex gap-2">
                        {[0, 50, 100, 200].map(amount => (
                          <button 
                            key={amount} onClick={() => onUpdateTip(booking.id, amount)}
                            className={`flex-1 py-1.5 rounded-lg border text-sm font-semibold transition-colors ${booking.tip === amount ? 'bg-status-success/10 border-status-success text-status-success' : 'bg-white border-surface-border text-ink-muted hover:bg-surface'}`}
                          >
                            {amount === 0 ? 'No' : `₹${amount}`}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between mb-3 text-sm text-ink-muted">
                      <span>Tip Added:</span>
                      <span className={`font-medium ${booking.status === 'cancelled' ? 'text-ink-muted' : 'text-status-success'}`}>+₹{booking.tip}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 mt-auto border-t border-surface-border">
                    <span className="font-bold text-ink-main">Total:</span>
                    <span className={`text-2xl font-bold ${booking.status === 'cancelled' ? 'text-ink-muted line-through' : 'text-ink-main'}`}>
                      ₹{(booking.basePrice + booking.tip).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-wrap justify-end gap-3 pt-5 mt-6 border-t border-surface-border">
                {(booking.status === 'upcoming' || booking.status === 'active') && booking.paymentStatus === 'pending' && (
                  <>
                    <button className="text-status-error btn-outline hover:border-status-error hover:text-status-error hover:bg-red-50">Cancel Job</button>
                    {booking.scheduleStatus === 'confirmed' && (
                      <button className="btn-brand">🔒 Pay Now</button>
                    )}
                  </>
                )}
                {booking.paymentStatus === 'paid' && (
                  <>
                    <button className="btn-outline">Leave a Review</button>
                    <button className="btn-outline text-ink-muted">📄 Invoice</button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingsView;
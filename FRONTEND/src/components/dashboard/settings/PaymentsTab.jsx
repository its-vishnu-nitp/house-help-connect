import React from 'react';

const PaymentsTab = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h3 className="pb-4 text-xl border-b text-ink-main border-surface-border">Payment Methods</h3>
      <p className="text-sm text-center text-ink-muted">Save your cards for faster bookings.</p>
      
      <button className="flex flex-col items-center justify-center w-full gap-3 p-10 font-semibold transition-colors border-2 border-dashed rounded-xl text-brand border-brand/30 hover:bg-brand-light/30">
        <span className="text-4xl">➕</span> 
        <span>Add New Credit / Debit Card</span>
      </button>
    </div>
  );
};

export default PaymentsTab;
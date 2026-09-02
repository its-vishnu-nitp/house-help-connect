import React, { useState } from 'react';

const WorkerVerificationTab = () => {
  const [aadhaar, setAadhaar] = useState('');

  // Auto-format Aadhaar with spaces (XXXX XXXX XXXX)
  const handleAadhaarChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 12) val = val.substring(0, 12);
    const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    setAadhaar(formatted);
  };

  return (
    <div className="w-full max-w-3xl pt-4 mx-auto space-y-8 font-sans animate-fade-in">
      {/* Header */}
      <div className="pb-6 text-center border-b border-surface-BORDER md:text-left">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight md:text-4xl text-ink-MAIN">Background Verification (e-KYC)</h1>
        <p className="text-lg text-ink-MUTED">Securely verify your identity to start accepting jobs.</p>
      </div>

      {/* Warning Banner */}
      <div className="flex items-start gap-4 p-6 border shadow-sm bg-amber-50 border-amber-200 rounded-2xl">
        <div className="text-amber-500 text-2xl mt-0.5">⚠️</div>
        <div>
          <h3 className="mb-1 text-lg font-bold text-amber-800">Verification Required</h3>
          <p className="font-medium leading-relaxed text-amber-700">
            Complete your Aadhaar verification and background check to activate your provider account.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-10">
        {/* Step 1: File Upload */}
        <div className="space-y-3">
          <label className="ml-1 text-sm font-bold tracking-wider uppercase text-slate-700">
            1. Upload Government ID
          </label>
          <button className="w-full flex flex-col items-center justify-center p-12 bg-surface/50 border-2 border-dashed border-slate-300 rounded-[2rem] hover:bg-brand-LIGHT/50 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 group">
            <div className="flex items-center justify-center w-16 h-16 mb-4 transition-transform duration-300 bg-surface-card shadow-sm rounded-2xl group-hover:scale-110">
              <span className="text-3xl transition-opacity opacity-50 group-hover:opacity-100">📄</span>
            </div>
            <p className="text-lg font-bold transition-colors text-slate-700 group-hover:text-brand">Upload Aadhaar or PAN Card</p>
            <p className="mt-2 text-sm font-medium text-ink-MUTED">JPEG, PNG, or PDF up to 5MB</p>
          </button>
        </div>

        {/* Step 2: Aadhaar Input */}
        <div className="space-y-3">
          <label className="ml-1 text-sm font-bold tracking-wider uppercase text-slate-700">
            2. Enter 12-Digit Aadhaar Number
          </label>
          <input 
            type="text" 
            value={aadhaar}
            onChange={handleAadhaarChange}
            placeholder="XXXX XXXX XXXX" 
            className="w-full p-5 text-center text-2xl tracking-[0.2em] bg-surface-card border border-surface-BORDER outline-none rounded-2xl text-ink-MAIN font-bold transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm"
          />
        </div>

        {/* Action Button */}
        <button className="w-full py-5 text-xl font-bold text-white transition-all duration-300 bg-brand shadow-xl hover:bg-brand-DARK rounded-2xl shadow-blue-600/30 hover:-translate-y-1">
          Verify Identity
        </button>
      </div>
    </div>
  );
};

export default WorkerVerificationTab;
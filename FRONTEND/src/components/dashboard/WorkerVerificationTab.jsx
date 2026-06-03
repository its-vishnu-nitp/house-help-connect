import React, { useState } from 'react';

const WorkerVerificationTab = () => {
  const [verificationStep, setVerificationStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationStep(3); 
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h3 className="pb-4 text-xl border-b text-ink-main border-surface-border">Background Verification (e-KYC)</h3>
      
      {verificationStep === 1 && (
        <div className="max-w-md mx-auto animate-fade-in">
          <div className="p-5 mb-6 border rounded-xl border-status-warning/30 bg-status-warning/10">
            <h4 className="flex items-center gap-2 mb-2 font-bold text-status-warning">⚠️ Verification Required</h4>
            <p className="text-sm text-ink-muted">Complete your Aadhaar verification and background check to activate your provider account.</p>
          </div>
          
          <form onSubmit={handleVerify}>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-semibold text-ink-muted">1. Upload Government ID</label>
              <div className="p-8 text-center border-2 border-dashed cursor-pointer rounded-xl border-surface-border bg-surface hover:bg-surface-border/30">
                 <span className="block mb-3 text-3xl">📄</span>
                 <p className="font-medium text-ink-main">Upload Aadhaar or PAN Card</p>
              </div>
            </div>

            <div className="mb-2">
              <label className="block mb-2 text-sm font-semibold text-ink-muted">2. Enter 12-Digit Aadhaar Number</label>
              <input type="text" placeholder="XXXX XXXX XXXX" className="w-full px-4 py-3 text-lg tracking-widest text-center border outline-none rounded-xl border-surface-border focus:ring-2 focus:ring-brand bg-surface" />
            </div>
            
            <button type="submit" disabled={isVerifying} className="w-full mt-6 btn-brand disabled:opacity-50">
              {isVerifying ? 'Processing...' : 'Verify Identity'}
            </button>
          </form>
        </div>
      )}

      {verificationStep === 3 && (
        <div className="flex flex-col items-center justify-center max-w-md p-8 mx-auto text-center border rounded-2xl border-status-success/30 bg-status-success/5">
          <div className="flex items-center justify-center w-20 h-20 mb-4 text-4xl rounded-full text-status-success bg-status-success/20">✓</div>
          <h3 className="mb-2 text-2xl font-bold text-ink-main">Background Check Passed</h3>
          <p className="text-ink-muted">Your provider profile is now active. You can start accepting jobs and earning money.</p>
        </div>
      )}
    </div>
  );
};

export default WorkerVerificationTab;
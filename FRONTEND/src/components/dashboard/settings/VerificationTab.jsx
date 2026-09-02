import React, { useState } from 'react';

const VerificationTab = () => {
  const [verificationStep, setVerificationStep] = useState(1);
  const [idDocument, setIdDocument] = useState(null);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setError('');
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setIdDocument(file);
    } else if (file) {
      setError('File size must be less than 5MB');
    }
  };

  const handleSendOTP = (e) => {
    e.preventDefault();
    setError('');
    if (!idDocument) return setError('Please upload a copy of your Government ID first.');
    if (aadhaarNumber.replace(/\D/g, '').length !== 12) return setError('Please enter a valid 12-digit Aadhaar Number.');

    setIsVerifying(true);
    setTimeout(() => { setIsVerifying(false); setVerificationStep(2); }, 2000);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setError('');
    if (otp.length !== 6) return setError('Please enter a valid 6-digit OTP');

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (otp === '123456') setVerificationStep(3);
      else setError('Invalid OTP. Please try 123456 for testing.');
    }, 1500);
  };

  const handleAadhaarChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); 
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) formattedValue += ' ';
      formattedValue += value[i];
    }
    setAadhaarNumber(formattedValue.slice(0, 14)); 
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h3 className="pb-4 text-xl border-b text-ink-main border-surface-border">Trust & Verification (e-KYC)</h3>
      
      {verificationStep === 1 && (
        <div className="max-w-md mx-auto animate-fade-in">
          <div className="p-4 mb-6 border rounded-xl border-brand-light bg-brand-light/30">
            <p className="text-sm text-center text-brand-dark"><strong>Secure Verification:</strong> ID upload followed by Aadhaar OTP required.</p>
          </div>
          
          <form onSubmit={handleSendOTP}>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-semibold text-ink-muted">1. Upload Government ID</label>
              <div className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${idDocument ? 'border-status-success bg-status-success/5' : 'border-surface-border bg-surface hover:bg-surface-border/30'}`}>
                <input type="file" onChange={handleFileChange} accept="image/png, image/jpeg, application/pdf" className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer" />
                {idDocument ? (
                  <div><span className="block mb-2 text-3xl">✅</span><p className="font-bold text-status-success">{idDocument.name}</p></div>
                ) : (
                  <div><span className="block mb-2 text-3xl">📄</span><p className="font-medium text-ink-main">Click or drag file</p><p className="mt-1 text-xs text-ink-muted">Aadhaar, PAN, or DL (Max 5MB)</p></div>
                )}
              </div>
            </div>

            <div className="mb-2">
              <label className="block mb-2 text-sm font-semibold text-ink-muted">2. Enter 12-Digit Aadhaar Number</label>
              <input type="text" value={aadhaarNumber} onChange={handleAadhaarChange} placeholder="XXXX XXXX XXXX" className="w-full px-4 py-3 text-lg tracking-widest text-center border outline-none rounded-xl border-surface-border focus:ring-2 focus:ring-brand bg-surface" />
            </div>

            {error && <p className="mt-2 text-sm text-center text-status-error">{error}</p>}
            <button type="submit" disabled={isVerifying} className="w-full mt-6 btn-brand disabled:opacity-50">{isVerifying ? 'Sending Request...' : 'Upload & Send OTP'}</button>
          </form>
        </div>
      )}

      {verificationStep === 2 && (
        <div className="max-w-md mx-auto animate-fade-in">
          <div className="p-4 mb-6 text-center border rounded-xl border-status-success/30 bg-status-success/10">
             <p className="text-sm text-status-success">OTP sent to mobile linked with Aadhaar ending in <strong>{aadhaarNumber.slice(-4)}</strong>.</p>
          </div>
          <form onSubmit={handleVerifyOTP}>
            <label className="block mb-2 text-sm font-semibold text-center text-ink-muted">Enter 6-Digit OTP</label>
            <input type="text" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="------" className="w-full px-4 py-4 mb-2 text-3xl tracking-[1em] text-center border rounded-xl border-surface-border focus:ring-2 focus:ring-brand outline-none bg-surface" />
            {error && <p className="mb-4 text-sm text-center text-status-error">{error}</p>}
            <button type="submit" disabled={isVerifying} className="w-full mt-4 btn-brand !bg-status-success hover:!bg-brand">{isVerifying ? 'Verifying...' : 'Verify & Continue'}</button>
          </form>
        </div>
      )}

      {verificationStep === 3 && (
        <div className="flex flex-col items-center justify-center max-w-md p-8 mx-auto text-center border rounded-2xl border-status-success/30 bg-status-success/5 animate-fade-in">
          <div className="flex items-center justify-center w-20 h-20 mb-4 text-4xl rounded-full text-status-success bg-status-success/20">✓</div>
          <h3 className="mb-2 text-2xl">Account Verified</h3>
          <p className="mb-4 text-ink-muted">Identity verified via Aadhaar e-KYC.</p>
        </div>
      )}
    </div>
  );
};

export default VerificationTab;
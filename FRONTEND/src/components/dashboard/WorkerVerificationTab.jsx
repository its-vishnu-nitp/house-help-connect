import React, { useState, useEffect } from 'react';
import { profileService } from '../../services/profile.service';
import { showToast } from '../../utils/toast';

/**
 * Aadhaar e-KYC (demo-grade): the number is validated for format and
 * PERSISTED via PUT /profiles/verify-aadhaar, which sets
 * isAadhaarVerified on the account. Verification is by Aadhaar NUMBER
 * only — no document is uploaded or reviewed anywhere in this flow.
 */
const WorkerVerificationTab = () => {
  const [aadhaar, setAadhaar] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await profileService.getMyProfile();
        setIsVerified(Boolean(res.user?.isAadhaarVerified));
      } catch {
        /* leave unverified state */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Auto-format Aadhaar with spaces (XXXX XXXX XXXX)
  const handleAadhaarChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 12) val = val.substring(0, 12);
    const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    setAadhaar(formatted);
  };

  const handleVerify = async () => {
    const digits = aadhaar.replace(/\D/g, '');
    if (digits.length !== 12) {
      showToast('Please enter a valid 12-digit Aadhaar number.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await profileService.verifyAadhaar(digits);
      setIsVerified(true);
      showToast('Aadhaar verified and saved to your account!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Verification failed. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl pt-4 mx-auto space-y-8 font-sans animate-fade-in">
      {/* Header */}
      <div className="pb-6 text-center border-b border-surface-border md:text-left">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight md:text-4xl text-ink-main">Background Verification (e-KYC)</h1>
        <p className="text-lg text-ink-muted">Securely verify your identity to start accepting jobs.</p>
      </div>

      {loading ? (
        <p className="font-semibold animate-pulse text-brand">Checking verification status...</p>
      ) : isVerified ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-emerald-200 bg-emerald-50 rounded-[2rem] animate-fade-in">
          <div className="flex items-center justify-center w-20 h-20 mb-4 text-4xl text-emerald-600 bg-emerald-100 rounded-full">✓</div>
          <h3 className="mb-2 text-2xl font-extrabold text-ink-main">Identity Verified</h3>
          <p className="max-w-md font-medium text-ink-muted">
            Your Aadhaar verification is saved on your account. Clients see a verified
            badge on your profile, and you can accept jobs without restrictions.
          </p>
        </div>
      ) : (
        <>
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
            {/* Aadhaar Number Input */}
            <div className="space-y-3">
              <label className="ml-1 text-sm font-bold tracking-wider uppercase text-slate-700">
                Enter Your 12-Digit Aadhaar Number
              </label>
              <input
                type="text"
                value={aadhaar}
                onChange={handleAadhaarChange}
                placeholder="XXXX XXXX XXXX"
                className="w-full p-5 text-center text-2xl tracking-[0.2em] bg-surface-card border border-surface-border outline-none rounded-2xl text-ink-main font-bold transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/15 shadow-sm"
              />
              <p className="text-xs font-medium text-center text-ink-muted">
                Your Aadhaar number is verified and stored securely on your account —
                that's all this step needs. No document upload is required
                (demo verification: format-checked locally; a production build
                would verify it against the UIDAI API).
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={handleVerify}
              disabled={submitting}
              className="w-full py-5 text-xl font-bold text-white transition-all duration-300 bg-brand shadow-xl hover:bg-brand-dark rounded-2xl shadow-primary-600/30 hover:-translate-y-1 active:scale-[0.99] disabled:opacity-50"
            >
              {submitting ? 'Verifying...' : 'Verify Identity'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkerVerificationTab;

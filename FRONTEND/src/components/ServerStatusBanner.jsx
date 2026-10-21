import { useEffect, useState } from 'react';
import { onServerSlowChange } from '../services/api';

/**
 * Slim top banner shown while an API request is unusually slow —
 * usually because the free-tier backend is waking up from sleep.
 */
const ServerStatusBanner = () => {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => onServerSlowChange(setIsSlow), []);

  if (!isSlow) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-2.5 bg-primary-700 px-4 py-2.5 text-center shadow-md animate-slide-down">
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75"></span>
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-500"></span>
      </span>
      <p className="text-sm font-semibold text-white">
        Waking up the server — the free tier takes a few seconds on the first request…
      </p>
    </div>
  );
};

export default ServerStatusBanner;

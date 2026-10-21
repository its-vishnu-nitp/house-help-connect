import { useEffect, useState } from 'react';

const TOAST_EVENT = 'hhc:toast';

/** Fire-and-forget toast, e.g. showToast('Booking cancelled', 'success') */
export const showToast = (message, type = 'success') => {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { message, type } }));
};

const STYLES = {
  success: 'bg-primary-700 text-white',
  error: 'bg-status-error text-white',
};

/** Renders toast notifications dispatched via showToast(). Mount once, in App. */
const Toast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (event) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, ...event.detail }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
    };
    window.addEventListener(TOAST_EVENT, handler);
    return () => window.removeEventListener(TOAST_EVENT, handler);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[110] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`max-w-sm rounded-2xl px-5 py-3.5 text-sm font-semibold shadow-xl animate-fade-in ${STYLES[toast.type] || STYLES.success}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default Toast;

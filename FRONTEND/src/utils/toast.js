export const TOAST_EVENT = 'hhc:toast';

/** Fire-and-forget toast, e.g. showToast('Booking cancelled', 'success') */
export const showToast = (message, type = 'success') => {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { message, type } }));
};

import { useEffect, useRef, useState } from 'react';

/**
 * Counts from 0 up to `target` when the element scrolls into view.
 * Returns [ref, displayValue]. Supports decimals (e.g. 4.8) — pass
 * `decimals` to control formatting. Runs once.
 */
export const useCountUp = (target, { duration = 1600, decimals = 0 } = {}) => {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const t0 = performance.now();
      const tick = (now) => {
        const progress = Math.min(1, (now - t0) / duration);
        // easeOutExpo — fast start, gentle settle
        const eased = 1 - Math.pow(2, -10 * progress);
        setValue(target * (progress === 1 ? 1 : eased));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (!('IntersectionObserver' in window)) {
      start();
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          start();
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [target, duration]);

  const display = decimals > 0
    ? value.toFixed(decimals)
    : Math.round(value).toLocaleString('en-IN');

  return [ref, display];
};

export default useCountUp;

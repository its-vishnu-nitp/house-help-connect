import { useEffect } from 'react';

/**
 * Global scroll-reveal: observes every `.reveal` element once and adds
 * `.is-visible` as it enters the viewport. Runs a MutationObserver so
 * elements mounted later (accordions, async sections) are covered too.
 * Dependency-free; disabled automatically for prefers-reduced-motion
 * via the CSS media query in index.css.
 */
export const useReveal = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const watch = (root = document) => {
      root.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => io.observe(el));
    };

    watch();
    const mo = new MutationObserver(() => watch());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
};

export default useReveal;

import { useEffect } from 'react';
import gsap from 'gsap';

/**
 * Ultra-Smooth GSAP Scroll Reveal Hook.
 * Gently floats elements into place as they enter the viewport,
 * avoiding any harsh or jumpy scroll shifts.
 */
export function useScrollReveal(dependencies = []) {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -30px 0px',
      threshold: 0.05,
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('active');

          // Gentle, effortless GSAP float
          gsap.fromTo(
            el,
            { opacity: 0, y: 14 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: 'power2.out',
              clearProps: 'transform',
            }
          );

          observer.unobserve(el);
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => {
      if (!el.classList.contains('active')) {
        revealObserver.observe(el);
      }
    });

    return () => {
      revealObserver.disconnect();
    };
  }, dependencies);
}

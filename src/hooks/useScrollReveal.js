import { useEffect } from 'react';

export function useScrollReveal(dependencies = []) {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.08,
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
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

import React, { useRef, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

/**
 * Ultra-Smooth Luxury Page Transition.
 * Provides a weightless GSAP crossfade and gentle micro-slide on route changes
 * without any heavy or jumpy screen overlays.
 */
export default function PageTransition({ children }) {
  const location = useLocation();
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    // 1. Reset scroll position on route switch
    window.scrollTo(0, 0);

    // 2. Silky smooth GSAP fade & gentle micro-slide
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 12, scale: 0.995 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          ease: 'power2.out',
          clearProps: 'transform',
        }
      );
    });

    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <div ref={containerRef} className="w-full">
      {children}
    </div>
  );
}

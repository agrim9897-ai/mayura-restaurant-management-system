import React, { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollWidth(scrolled);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      id="scroll-progress"
      className="fixed top-0 left-0 h-[2px] bg-[#e9c176] z-50 pointer-events-none transition-[width] duration-150 ease-out shadow-[0_0_8px_rgba(233,193,118,0.4)]"
      style={{ width: `${scrollWidth}%` }}
    />
  );
}

import { useEffect } from 'react';

export function useParallax() {
  useEffect(() => {
    function handleParallax(el, speed, scrolled) {
      if (!el) return;
      const section = el.closest('section');
      const limit = section ? section.offsetTop : el.parentElement?.offsetTop || 0;
      const parentHeight = section ? section.offsetHeight : el.parentElement?.offsetHeight || 0;
      if (scrolled >= limit - window.innerHeight && scrolled <= limit + parentHeight) {
        const yPos = -((scrolled - limit) * speed);
        el.style.transform = `translateY(${yPos}px)`;
      }
    }

    function onScroll() {
      const scrolled = window.scrollY;
      const parallaxBg = document.getElementById('parallax-bg');
      const whyChooseParallax = document.getElementById('why-choose-parallax-container');
      const reserveParallax = document.getElementById('reserve-parallax-container');
      
      handleParallax(parallaxBg, 0.15, scrolled);
      handleParallax(whyChooseParallax, 0.08, scrolled);
      handleParallax(reserveParallax, 0.08, scrolled);

      const experienceParallaxNodes = document.querySelectorAll('.experience-parallax');
      const viewportHeight = window.innerHeight;

      experienceParallaxNodes.forEach((el) => {
        const parent = el.closest('section');
        if (!parent) return;

        const parentTop = parent.offsetTop;
        const parentHeight = parent.offsetHeight;

        if (scrolled >= parentTop - viewportHeight && scrolled <= parentTop + parentHeight) {
          const relativeScroll = (scrolled + viewportHeight / 2) - (parentTop + parentHeight / 2);
          const yPos = -(relativeScroll * 0.12);
          el.style.transform = `translateY(${yPos}px)`;
        }
      });
    }

    window.addEventListener('scroll', onScroll);
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
}

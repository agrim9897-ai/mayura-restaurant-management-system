document.addEventListener('DOMContentLoaded', () => {
    const parallaxImages = document.querySelectorAll('.experience-parallax');

    function handleParallax() {
        const scrolled = window.scrollY;
        const viewportHeight = window.innerHeight;

        parallaxImages.forEach(el => {
            const parent = el.closest('section');
            if (!parent) return;

            const parentTop = parent.offsetTop;
            const parentHeight = parent.offsetHeight;

            // Check if section is currently visible in viewport
            if (scrolled >= parentTop - viewportHeight && scrolled <= parentTop + parentHeight) {
                // Calculate how far the section has scrolled relative to viewport center
                const relativeScroll = (scrolled + (viewportHeight / 2)) - (parentTop + (parentHeight / 2));
                // Parallax translation (shift up or down slowly)
                const yPos = -(relativeScroll * 0.12);
                el.style.transform = `translateY(${yPos}px)`;
            }
        });
    }

    // Scroll listener for smooth parallax updates
    window.addEventListener('scroll', handleParallax);
    // Initial call on page load
    handleParallax();
});

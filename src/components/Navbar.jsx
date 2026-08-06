import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path, hash) => {
    setMobileMenuOpen(false);
    if (location.pathname !== path) {
      navigate(path + (hash || ''));
    } else if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        id="navbar"
        className={`fixed w-full top-0 z-50 transition-all duration-500 py-6 ${
          isScrolled ? 'nav-scrolled' : ''
        }`}
      >
        <div class="flex justify-between items-center px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={() => handleNavClick('/', '')}
            className="font-display-lg text-headline-md text-primary-fixed-dim hover:text-primary transition-colors duration-300"
          >
            Mayura
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-gutter">
            <Link
              to="/"
              onClick={() => handleNavClick('/', '')}
              className={`nav-link font-button text-button uppercase tracking-[0.1em] transition-colors duration-300 ${
                location.pathname === '/' && !location.hash
                  ? 'text-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Home
            </Link>

            <Link
              to="/experience"
              onClick={() => handleNavClick('/experience', '')}
              className={`nav-link font-button text-button uppercase tracking-[0.1em] transition-colors duration-300 ${
                location.pathname === '/experience'
                  ? 'text-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Experience
            </Link>

            <Link
              to="/menu"
              onClick={() => handleNavClick('/menu', '')}
              className={`nav-link font-button text-button uppercase tracking-[0.1em] transition-colors duration-300 ${
                location.pathname === '/menu'
                  ? 'text-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Our Menu
            </Link>

            <button
              onClick={() => handleNavClick('/', '#contact')}
              className="nav-link font-button text-button uppercase tracking-[0.1em] text-on-surface-variant hover:text-primary transition-colors duration-300"
            >
              Contact
            </button>
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <button
              onClick={() => handleNavClick('/', '#reserve')}
              className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary font-button text-button uppercase tracking-[0.1em] rounded-12 hover:bg-primary hover:text-on-primary hover:shadow-[0_0_15px_rgba(233,193,118,0.3)] transition-all duration-300 hover:scale-[1.03]"
            >
              Reserve a Table
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-primary focus:outline-none transition-transform duration-300 active:scale-90"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Menu Overlay */}
      <div
        className={`fixed inset-0 bg-[#0f1f15] z-40 transition-transform duration-500 ease-in-out flex flex-col justify-center items-center ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="absolute top-8 right-margin-mobile text-primary focus:outline-none"
          aria-label="Close Menu"
        >
          <span className="material-symbols-outlined text-4xl">close</span>
        </button>

        <div className="flex flex-col items-center gap-8 text-center">
          <Link
            to="/"
            onClick={() => handleNavClick('/', '')}
            className={`text-2xl uppercase tracking-[0.2em] font-display-lg ${
              location.pathname === '/' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Home
          </Link>

          <Link
            to="/experience"
            onClick={() => handleNavClick('/experience', '')}
            className={`text-2xl uppercase tracking-[0.2em] font-display-lg ${
              location.pathname === '/experience' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Experience
          </Link>

          <Link
            to="/menu"
            onClick={() => handleNavClick('/menu', '')}
            className={`text-2xl uppercase tracking-[0.2em] font-display-lg ${
              location.pathname === '/menu' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Our Menu
          </Link>

          <button
            onClick={() => handleNavClick('/', '#contact')}
            className="text-2xl uppercase tracking-[0.2em] font-display-lg text-on-surface-variant hover:text-primary"
          >
            Contact
          </button>

          <button
            onClick={() => handleNavClick('/', '#reserve')}
            className="mt-4 inline-flex items-center justify-center px-8 py-4 border border-primary text-primary font-button text-button uppercase tracking-[0.15em] rounded-12 hover:bg-primary hover:text-on-primary transition-all duration-300"
          >
            Reserve a Table
          </button>
        </div>
      </div>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { fetchSettings } from '../services/api/settings.service';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState(null);
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

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await fetchSettings();
        if (data) setSettings(data);
      } catch (err) {
        console.error('Navbar settings fetch error:', err);
      }
    }
    loadSettings();
  }, []);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const brandName = settings?.restaurantName || 'Mayura';

  return (
    <>
      <nav
        id="navbar"
        className={`fixed w-full top-0 z-50 transition-all duration-500 py-6 ${
          isScrolled ? 'nav-scrolled' : ''
        }`}
      >
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="font-display-lg text-headline-md text-primary-fixed-dim hover:text-primary transition-colors duration-300 flex items-center gap-3"
          >
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt={brandName} className="h-10 w-auto object-contain" />
            ) : (
              <span>{brandName}</span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-gutter">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `nav-link font-button text-button uppercase tracking-[0.1em] transition-colors duration-300 ${
                  isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/experience"
              className={({ isActive }) =>
                `nav-link font-button text-button uppercase tracking-[0.1em] transition-colors duration-300 ${
                  isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                }`
              }
            >
              Experience
            </NavLink>

            <NavLink
              to="/menu"
              className={({ isActive }) =>
                `nav-link font-button text-button uppercase tracking-[0.1em] transition-colors duration-300 ${
                  isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                }`
              }
            >
              Our Menu
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `nav-link font-button text-button uppercase tracking-[0.1em] transition-colors duration-300 ${
                  isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                }`
              }
            >
              Contact
            </NavLink>
          </div>

          {/* CTA Reserve Table */}
          <div className="hidden md:block">
            <button
              onClick={() => navigate('/reservation')}
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
          onClick={closeMobileMenu}
          className="absolute top-8 right-margin-mobile text-primary focus:outline-none"
          aria-label="Close Menu"
        >
          <span className="material-symbols-outlined text-4xl">close</span>
        </button>

        <div className="flex flex-col items-center gap-8 text-center">
          <NavLink
            to="/"
            end
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `text-2xl uppercase tracking-[0.2em] font-display-lg ${
                isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/experience"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `text-2xl uppercase tracking-[0.2em] font-display-lg ${
                isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
              }`
            }
          >
            Experience
          </NavLink>

          <NavLink
            to="/menu"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `text-2xl uppercase tracking-[0.2em] font-display-lg ${
                isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
              }`
            }
          >
            Our Menu
          </NavLink>

          <NavLink
            to="/contact"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `text-2xl uppercase tracking-[0.2em] font-display-lg ${
                isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
              }`
            }
          >
            Contact
          </NavLink>

          <button
            onClick={() => {
              closeMobileMenu();
              navigate('/reservation');
            }}
            className="mt-4 inline-flex items-center justify-center px-8 py-4 border border-primary text-primary font-button text-button uppercase tracking-[0.15em] rounded-12 hover:bg-primary hover:text-on-primary transition-all duration-300"
          >
            Reserve a Table
          </button>
        </div>
      </div>
    </>
  );
}

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
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
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
        className={`fixed w-full top-0 z-40 transition-all duration-400 ease-out select-none ${
          isScrolled
            ? 'py-4 bg-[#FAF8F4]/80 backdrop-blur-xl backdrop-saturate-150 border-b border-[#E8E4DE]/60 shadow-2xs'
            : 'py-6 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="flex justify-between items-center px-6 md:px-12 w-full max-w-7xl mx-auto">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="font-serif text-2xl font-bold text-[#1A1A1A] hover:text-[#C5A059] transition-colors duration-300 flex items-center gap-3 tracking-tight"
          >
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt={brandName} className="h-9 w-auto object-contain" />
            ) : (
              <span>{brandName}</span>
            )}
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { to: '/', label: 'Home' },
              { to: '/experience', label: 'Experience' },
              { to: '/menu', label: 'Our Menu' },
              { to: '/contact', label: 'Contact' },
            ].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `relative py-1 text-xs uppercase tracking-widest font-semibold transition-colors duration-200 group ${
                    isActive ? 'text-[#C5A059]' : 'text-[#666666] hover:text-[#1A1A1A]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.label}</span>
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] bg-[#C5A059] transition-all duration-300 ease-out ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* CTA Reserve Table Button */}
          <div className="hidden md:block">
            <button
              onClick={() => navigate('/reservation')}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-[#C5A059] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#B59049] hover:-translate-y-0.5 shadow-2xs hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer"
            >
              Reserve a Table
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-[#1A1A1A] focus:outline-none transition-transform duration-200 active:scale-90"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      <div
        className={`fixed inset-0 bg-[#FAF8F4] z-50 transition-transform duration-400 ease-in-out flex flex-col justify-center items-center ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          onClick={closeMobileMenu}
          className="absolute top-6 right-6 text-[#1A1A1A] focus:outline-none"
          aria-label="Close Menu"
        >
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>

        <div className="flex flex-col items-center gap-7 text-center">
          {[
            { to: '/', label: 'Home' },
            { to: '/experience', label: 'Experience' },
            { to: '/menu', label: 'Our Menu' },
            { to: '/contact', label: 'Contact' },
          ].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `text-xl uppercase tracking-widest font-serif font-bold ${
                  isActive ? 'text-[#C5A059]' : 'text-[#1A1A1A] hover:text-[#C5A059]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <button
            onClick={() => {
              closeMobileMenu();
              navigate('/reservation');
            }}
            className="mt-4 inline-flex items-center justify-center px-7 py-3 bg-[#C5A059] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#B59049] active:scale-95 transition-all duration-200"
          >
            Reserve a Table
          </button>
        </div>
      </div>
    </>
  );
}

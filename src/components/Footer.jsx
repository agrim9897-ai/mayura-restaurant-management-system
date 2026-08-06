import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (path, hash) => {
    if (hash) {
      navigate(path);
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="bg-surface border-t border-outline-variant mt-section-padding">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop py-section-padding w-full max-w-container-max mx-auto">
        {/* Brand & Info */}
        <div className="md:col-span-1 reveal reveal-up">
          <Link to="/" onClick={(e) => { e.preventDefault(); handleLinkClick('/', ''); }} className="font-display-lg text-headline-md text-primary block mb-4">
            Mayura
          </Link>
          <p className="font-body-md text-body-md text-on-surface-variant mb-2">Good Food | Good Mood</p>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">Experience the art of fine dining.</p>
          <div className="flex gap-4 text-primary">
            <a href="#" className="hover:text-primary-fixed-dim transition-colors transform hover:scale-110 duration-300" aria-label="QR Code">
              <span className="material-symbols-outlined">qr_code_2</span>
            </a>
            <a href="#" className="hover:text-primary-fixed-dim transition-colors transform hover:scale-110 duration-300" aria-label="Gallery">
              <span className="material-symbols-outlined">photo_camera</span>
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="reveal reveal-up" style={{ transitionDelay: '100ms' }}>
          <h4 className="font-button text-button text-primary mb-6 uppercase tracking-[0.1em]">Quick Links</h4>
          <ul className="flex flex-col gap-3 font-body-md text-body-md">
            <li>
              <button onClick={() => handleLinkClick('/', '')} className="text-on-surface-variant hover:text-primary transition-colors duration-300 text-left">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('/experience', '')} className="text-on-surface-variant hover:text-primary transition-colors duration-300 text-left">
                Experience
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('/menu', '')} className="text-on-surface-variant hover:text-primary transition-colors duration-300 text-left">
                Our Menu
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('/', '#reserve')} className="text-on-surface-variant hover:text-primary transition-colors duration-300 text-left">
                Reservations
              </button>
            </li>
          </ul>
        </div>

        {/* Hours */}
        <div className="reveal reveal-up" style={{ transitionDelay: '200ms' }}>
          <h4 className="font-button text-button text-primary mb-6 uppercase tracking-[0.1em]">Opening Hours</h4>
          <ul className="flex flex-col gap-3 font-body-md text-body-md text-on-surface-variant">
            <li>Mon - Fri: 11:00 AM - 11:30 PM</li>
            <li>Sat - Sun: 10:00 AM - 12:00 AM</li>
            <li className="mt-2 text-primary-fixed-dim">We are open all days.</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="reveal reveal-up" style={{ transitionDelay: '300ms' }}>
          <h4 className="font-button text-button text-primary mb-6 uppercase tracking-[0.1em]">Contact Us</h4>
          <ul className="flex flex-col gap-3 font-body-md text-body-md text-on-surface-variant">
            <li>+91 98765 43210</li>
            <li>hello@mayurafinecuisine.com</li>
            <li className="mt-2">123, Green Avenue, New Delhi, India - 110001</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-outline-variant px-margin-mobile md:px-margin-desktop py-6 w-full max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center font-body-md text-body-md text-on-surface-variant text-sm">
        <p>© 2025 Mayura Fine Cuisine. All Rights Reserved.</p>
        <button onClick={scrollToTop} className="hover:text-primary transition-colors mt-4 md:mt-0 flex items-center gap-1 group">
          Back to Top
          <span className="material-symbols-outlined text-sm transform group-hover:translate-y-[-2px] transition-transform duration-300">
            keyboard_arrow_up
          </span>
        </button>
      </div>
    </footer>
  );
}

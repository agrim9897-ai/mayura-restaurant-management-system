import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchSettings } from '../services/api/settings.service';

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await fetchSettings();
        if (data) setSettings(data);
      } catch (err) {
        console.error('Footer settings fetch error:', err);
      }
    }
    loadSettings();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const brandName = settings?.restaurantName || 'Mayura Fine Cuisine';
  const phone = settings?.phone || '+91 98765 43210';
  const email = settings?.email || 'contact@mayurafinecuisine.com';
  const address = settings?.address || 'Plot 42, Executive Enclave, Golf Course Road, Gurgaon';
  const openingTime = settings?.openingTime || '11:00 AM';
  const closingTime = settings?.closingTime || '11:30 PM';
  const weekendHours = settings?.weekendHours || '11:00 AM - 12:00 AM';
  const copyright = settings?.footerCopyright || `© ${new Date().getFullYear()} ${brandName}. All Rights Reserved.`;

  return (
    <footer id="footer-section" className="bg-surface border-t border-outline-variant select-none">
      {/* 40% Vertically Compressed Footer Container */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop py-10 md:py-12 w-full max-w-container-max mx-auto items-start">
        {/* Brand & Info */}
        <div className="md:col-span-1 reveal reveal-up">
          <Link to="/" className="font-display-lg text-headline-md text-primary block mb-2">
            {brandName}
          </Link>
          <p className="font-body-md text-body-md text-on-surface-variant mb-1">
            {settings?.tagline || 'Good Food | Good Mood'}
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant mb-4 leading-relaxed">
            {settings?.footerAbout || 'Experience the art of authentic royal Indian dining.'}
          </p>

          <div className="flex gap-4 text-primary">
            {settings?.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary-fixed-dim transition-colors transform hover:scale-110 duration-300"
                aria-label="Instagram"
              >
                <span className="material-symbols-outlined">photo_camera</span>
              </a>
            )}
            {settings?.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary-fixed-dim transition-colors transform hover:scale-110 duration-300"
                aria-label="Facebook"
              >
                <span className="material-symbols-outlined">share</span>
              </a>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="reveal reveal-up" style={{ transitionDelay: '100ms' }}>
          <h4 className="font-button text-button text-primary mb-3 uppercase tracking-[0.1em]">Quick Links</h4>
          <ul className="flex flex-col gap-2 font-body-md text-body-md">
            <li>
              <Link to="/" className="text-on-surface-variant hover:text-primary transition-colors duration-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/experience" className="text-on-surface-variant hover:text-primary transition-colors duration-300">
                Experience
              </Link>
            </li>
            <li>
              <Link to="/menu" className="text-on-surface-variant hover:text-primary transition-colors duration-300">
                Our Menu
              </Link>
            </li>
            <li>
              <Link to="/reservation" className="text-on-surface-variant hover:text-primary transition-colors duration-300">
                Reservations
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-on-surface-variant hover:text-primary transition-colors duration-300">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Hours */}
        <div className="reveal reveal-up" style={{ transitionDelay: '200ms' }}>
          <h4 className="font-button text-button text-primary mb-3 uppercase tracking-[0.1em]">Opening Hours</h4>
          <ul className="flex flex-col gap-2 font-body-md text-body-md text-on-surface-variant">
            <li>Mon - Fri: {openingTime} - {closingTime}</li>
            <li>Sat - Sun: {weekendHours}</li>
            <li className="mt-1 text-primary-fixed-dim">We are open all days.</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="reveal reveal-up" style={{ transitionDelay: '300ms' }}>
          <h4 className="font-button text-button text-primary mb-3 uppercase tracking-[0.1em]">Contact Us</h4>
          <ul className="flex flex-col gap-2 font-body-md text-body-md text-on-surface-variant">
            <li>{phone}</li>
            <li>{email}</li>
            <li className="mt-1 leading-relaxed">{address}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-outline-variant px-margin-mobile md:px-margin-desktop py-4 w-full max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center font-body-md text-body-md text-on-surface-variant text-sm">
        <p>{copyright}</p>
        <button onClick={scrollToTop} className="hover:text-primary transition-colors mt-2 md:mt-0 flex items-center gap-1 group">
          Back to Top
          <span className="material-symbols-outlined text-sm transform group-hover:translate-y-[-2px] transition-transform duration-300">
            keyboard_arrow_up
          </span>
        </button>
      </div>
    </footer>
  );
}

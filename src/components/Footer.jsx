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
    <footer id="footer-section" className="bg-white border-t border-[#E8E4DE] select-none text-xs">
      {/* Compressed 40% Height Footer Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 md:px-12 py-10 w-full max-w-7xl mx-auto items-start">
        {/* Column 1: Restaurant Info */}
        <div className="space-y-2.5">
          <Link to="/" className="font-serif text-xl font-bold text-[#1A1A1A] block tracking-tight">
            {brandName}
          </Link>
          <p className="text-[#C5A059] font-medium text-[11px] uppercase tracking-wider">
            {settings?.tagline || 'Authentic Fine Dining'}
          </p>
          <p className="text-[#666666] leading-relaxed text-xs">
            {settings?.footerAbout || 'Experience the art of authentic royal Indian cuisine.'}
          </p>

          <div className="flex gap-3 text-[#1A1A1A] pt-1">
            {settings?.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-lg bg-[#FAF8F4] border border-[#E8E4DE] flex items-center justify-center hover:text-[#C5A059] hover:border-[#C5A059] transition-colors"
                aria-label="Instagram"
              >
                <span className="material-symbols-outlined text-sm">photo_camera</span>
              </a>
            )}
            {settings?.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-lg bg-[#FAF8F4] border border-[#E8E4DE] flex items-center justify-center hover:text-[#C5A059] hover:border-[#C5A059] transition-colors"
                aria-label="Facebook"
              >
                <span className="material-symbols-outlined text-sm">share</span>
              </a>
            )}
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-3">
          <h4 className="font-bold text-[#1A1A1A] uppercase tracking-wider text-[11px]">Quick Navigation</h4>
          <ul className="space-y-1.5 text-[#666666]">
            <li>
              <Link to="/" className="hover:text-[#C5A059] transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/experience" className="hover:text-[#C5A059] transition-colors">
                Experience
              </Link>
            </li>
            <li>
              <Link to="/menu" className="hover:text-[#C5A059] transition-colors">
                Our Menu
              </Link>
            </li>
            <li>
              <Link to="/reservation" className="hover:text-[#C5A059] transition-colors">
                Reservations
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#C5A059] transition-colors">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Opening Hours */}
        <div className="space-y-3">
          <h4 className="font-bold text-[#1A1A1A] uppercase tracking-wider text-[11px]">Operating Hours</h4>
          <ul className="space-y-1.5 text-[#666666]">
            <li>Mon - Fri: {openingTime} - {closingTime}</li>
            <li>Sat - Sun: {weekendHours}</li>
            <li className="text-[#C5A059] font-medium pt-1">Open 7 days a week</li>
          </ul>
        </div>

        {/* Column 4: Contact Info */}
        <div className="space-y-3">
          <h4 className="font-bold text-[#1A1A1A] uppercase tracking-wider text-[11px]">Contact & Address</h4>
          <ul className="space-y-1.5 text-[#666666]">
            <li className="font-mono">{phone}</li>
            <li>{email}</li>
            <li className="leading-relaxed pt-1">{address}</li>
          </ul>
        </div>
      </div>

      {/* Thin Bottom Bar */}
      <div className="border-t border-[#E8E4DE] px-6 md:px-12 py-4 w-full max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-[#666666] text-[11px] gap-2">
        <p>{copyright}</p>
        <button
          onClick={scrollToTop}
          className="hover:text-[#C5A059] transition-colors flex items-center gap-1 group font-semibold cursor-pointer"
        >
          <span>Back to Top</span>
          <span className="material-symbols-outlined text-sm transform group-hover:-translate-y-0.5 transition-transform duration-200">
            keyboard_arrow_up
          </span>
        </button>
      </div>
    </footer>
  );
}

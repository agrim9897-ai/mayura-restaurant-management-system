import React, { useState, useEffect } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { fetchSettings } from '../services/api/settings.service';
import { createContactMessage } from '../services/api/messages.service';

export default function Contact() {
  useScrollReveal();

  const [settings, setSettings] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await fetchSettings();
        if (data) setSettings(data);
      } catch (err) {
        console.error('Contact page settings fetch error:', err);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await createContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `${formData.subject ? `[${formData.subject}] ` : ''}${formData.message}`,
      });
      setIsSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  const address = settings?.address || '123, Green Avenue, Executive Enclave, New Delhi, India - 110001';
  const phone = settings?.phone || '+91 98765 43210';
  const email = settings?.email || 'hello@mayurafinecuisine.com';
  const openingTime = settings?.openingTime || '11:00 AM';
  const closingTime = settings?.closingTime || '11:30 PM';
  const weekendHours = settings?.weekendHours || '11:00 AM – 12:00 AM';

  return (
    <main className="pt-28">
      {/* Contact Header */}
      <section className="py-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="relative z-10 reveal reveal-up">
          <p className="font-label-caps text-label-caps text-primary-fixed-dim tracking-[0.2em] mb-4 uppercase">
            GET IN TOUCH
          </p>
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">
            Contact {settings?.restaurantName || 'Mayura'}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            {settings?.description ||
              'Have questions regarding private event bookings, dietary accommodations, or special arrangements? Reach out to our hospitality team.'}
          </p>
        </div>
      </section>

      {/* Info Cards Grid */}
      <section className="py-12 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Address */}
          <div className="bg-surface-container-lowest gold-border rounded-12 p-8 flex flex-col items-start gold-glow cursor-pointer icon-rotate-hover reveal reveal-up">
            <div className="w-12 h-12 rounded-full gold-border flex items-center justify-center mb-6 text-primary bg-surface-container-low">
              <span className="material-symbols-outlined text-2xl">location_on</span>
            </div>
            <p className="font-label-caps text-[10px] tracking-[0.2em] text-primary-fixed-dim mb-2 uppercase">LOCATION</p>
            <h3 className="font-headline-md text-xl text-primary mb-3">Our Address</h3>
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
              {address}
            </p>
          </div>

          {/* Phone */}
          <div className="bg-surface-container-lowest gold-border rounded-12 p-8 flex flex-col items-start gold-glow cursor-pointer icon-rotate-hover reveal reveal-up" style={{ transitionDelay: '100ms' }}>
            <div className="w-12 h-12 rounded-full gold-border flex items-center justify-center mb-6 text-primary bg-surface-container-low">
              <span className="material-symbols-outlined text-2xl">call</span>
            </div>
            <p className="font-label-caps text-[10px] tracking-[0.2em] text-primary-fixed-dim mb-2 uppercase">RESERVATIONS</p>
            <h3 className="font-headline-md text-xl text-primary mb-3">Phone & Direct</h3>
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed font-mono">
              {phone}
            </p>
          </div>

          {/* Email */}
          <div className="bg-surface-container-lowest gold-border rounded-12 p-8 flex flex-col items-start gold-glow cursor-pointer icon-rotate-hover reveal reveal-up" style={{ transitionDelay: '200ms' }}>
            <div className="w-12 h-12 rounded-full gold-border flex items-center justify-center mb-6 text-primary bg-surface-container-low">
              <span className="material-symbols-outlined text-2xl">mail</span>
            </div>
            <p className="font-label-caps text-[10px] tracking-[0.2em] text-primary-fixed-dim mb-2 uppercase">INQUIRIES</p>
            <h3 className="font-headline-md text-xl text-primary mb-3">Email Us</h3>
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
              {email}
            </p>
          </div>

          {/* Hours */}
          <div className="bg-surface-container-lowest gold-border rounded-12 p-8 flex flex-col items-start gold-glow cursor-pointer icon-rotate-hover reveal reveal-up" style={{ transitionDelay: '300ms' }}>
            <div className="w-12 h-12 rounded-full gold-border flex items-center justify-center mb-6 text-primary bg-surface-container-low">
              <span className="material-symbols-outlined text-2xl">schedule</span>
            </div>
            <p className="font-label-caps text-[10px] tracking-[0.2em] text-primary-fixed-dim mb-2 uppercase">DINING HOURS</p>
            <h3 className="font-headline-md text-xl text-primary mb-3">Operating Hours</h3>
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
              Mon – Fri: {openingTime} – {closingTime}<br />
              Sat – Sun: {weekendHours}
            </p>
          </div>
        </div>
      </section>

      {/* Main Contact Form Section */}
      <section className="py-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-stretch">
          {/* Left Intro Card */}
          <div className="md:col-span-5 bg-surface-container-lowest gold-border rounded-12 p-8 md:p-12 flex flex-col justify-between reveal reveal-left">
            <div>
              <p className="font-label-caps text-label-caps text-primary-fixed-dim tracking-[0.15em] mb-4">PERSONAL ASSISTANCE</p>
              <h2 className="font-headline-lg text-headline-lg text-primary mb-6">Send Us a Message</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-8">
                Whether you wish to discuss custom menus, private hall bookings, or share dining feedback, our concierge responds to all inquiries within 24 hours.
              </p>
            </div>

            <div className="space-y-6 pt-6 border-t border-outline-variant">
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-full gold-border flex items-center justify-center text-primary bg-surface-container-low shrink-0">
                  <span className="material-symbols-outlined text-xl">groups</span>
                </span>
                <div>
                  <h4 className="font-headline-md text-base text-primary">Private Parties</h4>
                  <p className="font-body-md text-xs text-on-surface-variant">Custom multi-course banquet menus available</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-full gold-border flex items-center justify-center text-primary bg-surface-container-low shrink-0">
                  <span className="material-symbols-outlined text-xl">restaurant_menu</span>
                </span>
                <div>
                  <h4 className="font-headline-md text-base text-primary">Dietary Consultations</h4>
                  <p className="font-body-md text-xs text-on-surface-variant">Jain, Vegan & Gluten-free tasting available</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="md:col-span-7 bg-surface-container-lowest gold-border rounded-12 p-8 md:p-12 relative overflow-hidden reveal reveal-right">
            {/* Success / Loading Overlay */}
            {(isSubmitting || isSubmitted) && (
              <div className="absolute inset-0 bg-[#0f1f15] z-30 flex flex-col items-center justify-center p-8 text-center">
                {isSubmitting && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                    <p className="font-label-caps text-primary-fixed-dim tracking-[0.1em]">Sending message...</p>
                  </div>
                )}

                {isSubmitted && (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full border border-primary flex items-center justify-center mb-6 text-primary animate-scale">
                      <span className="material-symbols-outlined text-4xl">check</span>
                    </div>
                    <h3 className="font-headline-md text-primary mb-4">Message Received</h3>
                    <p className="font-body-md text-on-surface-variant max-w-sm mb-8 leading-relaxed">
                      Thank you, <strong>{formData.name}</strong>. Your message has been routed to our management team. We will get back to you shortly.
                    </p>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="inline-flex items-center justify-center px-8 py-3 border border-primary text-primary font-button text-button uppercase tracking-[0.1em] rounded-12 hover:bg-primary hover:text-on-primary transition-all duration-300"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 bg-red-950/40 border border-red-500/30 text-red-400 p-3 rounded-12 text-xs text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
              {/* Name */}
              <div className="relative custom-focus border border-outline-variant rounded-12 bg-[#0f0e0c]">
                <input
                  type="text"
                  required
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="peer w-full h-12 bg-transparent rounded-12 px-4 text-on-surface placeholder-transparent focus:outline-none border-none focus:ring-0"
                />
                <label className="absolute left-3.5 top-3 text-on-surface-variant text-sm transition-all duration-300 pointer-events-none px-1.5 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-primary peer-focus:bg-[#0f0e0c] peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:bg-[#0f0e0c]">
                  Your Full Name
                </label>
              </div>

              {/* Email */}
              <div className="relative custom-focus border border-outline-variant rounded-12 bg-[#0f0e0c]">
                <input
                  type="email"
                  required
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="peer w-full h-12 bg-transparent rounded-12 px-4 text-on-surface placeholder-transparent focus:outline-none border-none focus:ring-0"
                />
                <label className="absolute left-3.5 top-3 text-on-surface-variant text-sm transition-all duration-300 pointer-events-none px-1.5 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-primary peer-focus:bg-[#0f0e0c] peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:bg-[#0f0e0c]">
                  Email Address
                </label>
              </div>

              {/* Phone */}
              <div className="relative custom-focus border border-outline-variant rounded-12 bg-[#0f0e0c]">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="peer w-full h-12 bg-transparent rounded-12 px-4 text-on-surface placeholder-transparent focus:outline-none border-none focus:ring-0"
                />
                <label className="absolute left-3.5 top-3 text-on-surface-variant text-sm transition-all duration-300 pointer-events-none px-1.5 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-primary peer-focus:bg-[#0f0e0c] peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:bg-[#0f0e0c]">
                  Phone Number (Optional)
                </label>
              </div>

              {/* Subject */}
              <div className="relative custom-focus border border-outline-variant rounded-12 bg-[#0f0e0c]">
                <input
                  type="text"
                  required
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="peer w-full h-12 bg-transparent rounded-12 px-4 text-on-surface placeholder-transparent focus:outline-none border-none focus:ring-0"
                />
                <label className="absolute left-3.5 top-3 text-on-surface-variant text-sm transition-all duration-300 pointer-events-none px-1.5 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-primary peer-focus:bg-[#0f0e0c] peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:bg-[#0f0e0c]">
                  Subject
                </label>
              </div>

              {/* Message */}
              <div className="relative custom-focus border border-outline-variant rounded-12 bg-[#0f0e0c] sm:col-span-2">
                <textarea
                  rows="4"
                  required
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  className="peer w-full bg-transparent rounded-12 px-4 py-3 text-on-surface placeholder-transparent focus:outline-none border-none focus:ring-0 resize-none"
                />
                <label className="absolute left-3.5 top-3 text-on-surface-variant text-sm transition-all duration-300 pointer-events-none px-1.5 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-primary peer-focus:bg-[#0f0e0c] peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:bg-[#0f0e0c]">
                  Your Message
                </label>
              </div>

              {/* Submit Button */}
              <div className="sm:col-span-2 mt-2">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center px-8 py-4 bg-primary text-on-primary font-button text-button uppercase tracking-[0.15em] rounded-12 hover:bg-primary-fixed hover:shadow-[0_0_20px_rgba(233,193,118,0.4)] hover:scale-[1.02] transition-all duration-300"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

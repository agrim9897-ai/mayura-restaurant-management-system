import React, { useState } from 'react';
import CustomDatePicker from './CustomDatePicker';
import CustomTimePicker from './CustomTimePicker';
import reservationTableImg from '../../images/dining.jpg';
import { createReservation } from '../services/api/reservations.service';

export default function ReservationSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '',
    date: '',
    time: '',
    occasion: '',
    seating: 'Indoor',
    requests: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSubmitted(false);
    setSubmitError('');

    try {
      await createReservation({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        reservationDate: formData.date,
        reservationTime: formData.time,
        guests: Number(formData.guests),
        occasion: formData.occasion || undefined,
        seatingPreference: formData.seating || undefined,
      });

      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(error.message || 'Unable to connect to the server. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setIsSubmitted(false);
    setSubmitError('');
    setFormData({
      name: '',
      email: '',
      phone: '',
      guests: '',
      date: '',
      time: '',
      occasion: '',
      seating: 'Indoor',
      requests: '',
    });
  };

  return (
    <section id="reserve" className="py-160 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto relative overflow-hidden">
      {/* Subtle radial glow behind the section */}
      <div className="absolute left-1/4 top-1/2 w-[500px] h-[500px] bg-primary opacity-5 rounded-full blur-[160px] pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-stretch">
        {/* Left Side (Compact cropped dining image) */}
        <div className="md:col-span-5 relative h-[320px] md:h-auto max-h-[460px] rounded-12 overflow-hidden gold-border reveal reveal-left group my-auto">
          <div id="reserve-parallax-container" className="w-full h-full">
            <div className="w-full h-full transition-transform duration-[1500ms] ease-out group-hover:scale-[1.04]">
              <img
                alt="Reservation Dining Ambience"
                className="w-full h-full object-cover object-top cinematic-img"
                src={reservationTableImg}
              />
            </div>
          </div>
        </div>

        {/* Right Side (55% on desktop) */}
        <div className="md:col-span-7 flex flex-col justify-between pl-0 md:pl-8 relative">
          {/* Heading Block */}
          <div className="mb-10 text-left reveal reveal-right">
            <p className="font-label-caps text-label-caps text-primary-fixed-dim tracking-[0.15em] mb-4">RESERVATIONS</p>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-6">Reserve Your Evening</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              Every reservation is carefully prepared to ensure an unforgettable dining experience. Select your preferred date and let us take care of the rest.
            </p>
          </div>

          {/* Custom Form Container */}
          <div className="bg-surface-container-lowest gold-border rounded-12 p-8 md:p-10 relative overflow-hidden reveal reveal-right delay-150">
            {/* Success / Loading Overlay */}
            {(isSubmitting || isSubmitted) && (
              <div id="reservation-success-overlay" className="absolute inset-0 bg-[#0f1f15] z-30 flex flex-col items-center justify-center p-8 text-center">
                {isSubmitting && (
                  <div className="spinner-container flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                    <p className="font-label-caps text-primary-fixed-dim tracking-[0.1em]">Securing your table...</p>
                  </div>
                )}

                {isSubmitted && (
                  <div className="success-content flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full border border-primary flex items-center justify-center mb-6 text-primary animate-scale">
                      <span className="material-symbols-outlined text-4xl">check</span>
                    </div>
                    <h3 className="font-headline-md text-primary mb-4">Reservation Requested</h3>
                    <p id="success-details" className="font-body-md text-on-surface-variant max-w-sm mb-8 leading-relaxed">
                      Thank you, <strong>{formData.name}</strong>. We have received your request for <strong>{formData.guests}</strong> guests on <strong>{formData.date}</strong> at <strong>{formData.time}</strong>. A confirmation has been sent to <strong>{formData.email}</strong>.
                    </p>
                    <button
                      type="button"
                      id="close-success-btn"
                      onClick={handleCloseSuccess}
                      className="inline-flex items-center justify-center px-8 py-3 border border-primary text-primary font-button text-button uppercase tracking-[0.1em] rounded-12 hover:bg-primary hover:text-on-primary transition-all duration-300"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Interactive Form */}
            <form id="reservation-form" onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
              {/* Guest Name */}
              <div className="relative custom-focus border border-outline-variant rounded-12 bg-[#0f0e0c] transition-all duration-300">
                <input
                  type="text"
                  id="reserve_name"
                  name="name"
                  required
                  placeholder="Guest Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="peer w-full h-12 bg-transparent rounded-12 px-4 text-on-surface placeholder-transparent focus:outline-none border-none focus:ring-0"
                />
                <label
                  htmlFor="reserve_name"
                  className="absolute left-3.5 top-3 text-on-surface-variant text-sm transition-all duration-300 pointer-events-none px-1.5
                             peer-placeholder-shown:text-base peer-placeholder-shown:top-3
                             peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-primary peer-focus:bg-[#0f0e0c]
                             peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:bg-[#0f0e0c]"
                >
                  Guest Name
                </label>
              </div>

              {/* Email Address */}
              <div className="relative custom-focus border border-outline-variant rounded-12 bg-[#0f0e0c] transition-all duration-300">
                <input
                  type="email"
                  id="reserve_email"
                  name="email"
                  required
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="peer w-full h-12 bg-transparent rounded-12 px-4 text-on-surface placeholder-transparent focus:outline-none border-none focus:ring-0"
                />
                <label
                  htmlFor="reserve_email"
                  className="absolute left-3.5 top-3 text-on-surface-variant text-sm transition-all duration-300 pointer-events-none px-1.5
                             peer-placeholder-shown:text-base peer-placeholder-shown:top-3
                             peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-primary peer-focus:bg-[#0f0e0c]
                             peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:bg-[#0f0e0c]"
                >
                  Email Address
                </label>
              </div>

              {/* Phone Number */}
              <div className="relative custom-focus border border-outline-variant rounded-12 bg-[#0f0e0c] transition-all duration-300">
                <input
                  type="tel"
                  id="reserve_phone"
                  name="phone"
                  required
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="peer w-full h-12 bg-transparent rounded-12 px-4 text-on-surface placeholder-transparent focus:outline-none border-none focus:ring-0"
                />
                <label
                  htmlFor="reserve_phone"
                  className="absolute left-3.5 top-3 text-on-surface-variant text-sm transition-all duration-300 pointer-events-none px-1.5
                             peer-placeholder-shown:text-base peer-placeholder-shown:top-3
                             peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-primary peer-focus:bg-[#0f0e0c]
                             peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:bg-[#0f0e0c]"
                >
                  Phone Number
                </label>
              </div>

              {/* Number of Guests */}
              <div className="relative custom-focus border border-outline-variant rounded-12 bg-[#0f0e0c] transition-all duration-300">
                <input
                  type="number"
                  id="reserve_guests"
                  name="guests"
                  min="1"
                  max="30"
                  required
                  placeholder="Number of Guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="peer w-full h-12 bg-transparent rounded-12 px-4 text-on-surface placeholder-transparent focus:outline-none border-none focus:ring-0"
                />
                <label
                  htmlFor="reserve_guests"
                  className="absolute left-3.5 top-3 text-on-surface-variant text-sm transition-all duration-300 pointer-events-none px-1.5
                             peer-placeholder-shown:text-base peer-placeholder-shown:top-3
                             peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-primary peer-focus:bg-[#0f0e0c]
                             peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:bg-[#0f0e0c]"
                >
                  Number of Guests
                </label>
              </div>

              {/* Reservation Date */}
              <CustomDatePicker
                value={formData.date}
                onChange={(dateStr) => setFormData((prev) => ({ ...prev, date: dateStr }))}
              />

              {/* Preferred Time */}
              <CustomTimePicker
                value={formData.time}
                onChange={(timeStr) => setFormData((prev) => ({ ...prev, time: timeStr }))}
              />

              {/* Occasion Dropdown */}
              <div className="relative custom-focus border border-outline-variant rounded-12 bg-[#0f0e0c] transition-all duration-300">
                <select
                  id="reserve_occasion"
                  name="occasion"
                  required
                  value={formData.occasion}
                  onChange={handleChange}
                  className="peer w-full h-12 bg-transparent rounded-12 pl-4 pr-10 text-on-surface focus:outline-none border-none focus:ring-0 appearance-none cursor-pointer"
                >
                  <option value="" disabled className="bg-[#1c1c19] text-on-surface-variant">Select Occasion</option>
                  <option value="Birthday" className="bg-[#1c1c19] text-on-surface">Birthday</option>
                  <option value="Anniversary" className="bg-[#1c1c19] text-on-surface">Anniversary</option>
                  <option value="Business Dinner" className="bg-[#1c1c19] text-on-surface">Business Dinner</option>
                  <option value="Family Gathering" className="bg-[#1c1c19] text-on-surface">Family Gathering</option>
                  <option value="Romantic Dinner" className="bg-[#1c1c19] text-on-surface">Romantic Dinner</option>
                  <option value="Other" className="bg-[#1c1c19] text-on-surface">Other</option>
                </select>
                <label
                  htmlFor="reserve_occasion"
                  className="absolute left-3.5 top-3 text-on-surface-variant text-sm transition-all duration-300 pointer-events-none px-1.5
                             peer-placeholder-shown:text-base peer-placeholder-shown:top-3
                             peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-primary peer-focus:bg-[#0f0e0c]
                             peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:bg-[#0f0e0c]"
                >
                  Occasion
                </label>
                <svg className="absolute right-4 top-3.5 w-5 h-5 text-on-surface-variant pointer-events-none transition-transform duration-300 peer-focus:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </div>

              {/* Preferred Seating */}
              <div className="sm:col-span-2">
                <p className="font-label-caps text-xs text-primary-fixed-dim mb-3 uppercase tracking-wider">Preferred Seating</p>
                <div className="grid grid-cols-3 gap-4">
                  {['Indoor', 'Outdoor', 'Private Dining'].map((option) => (
                    <label key={option} className="cursor-pointer">
                      <input
                        type="radio"
                        name="seating"
                        value={option}
                        checked={formData.seating === option}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-full text-center py-3 border border-outline-variant rounded-12 text-sm text-on-surface-variant hover:border-primary/50 peer-checked:border-primary peer-checked:text-primary transition-all duration-300">
                        {option}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              <div className="relative custom-focus border border-outline-variant rounded-12 bg-[#0f0e0c] transition-all duration-300 sm:col-span-2">
                <textarea
                  id="reserve_requests"
                  name="requests"
                  rows="3"
                  placeholder="Special Requests"
                  value={formData.requests}
                  onChange={handleChange}
                  className="peer w-full bg-transparent rounded-12 px-4 py-3 text-on-surface placeholder-transparent focus:outline-none border-none focus:ring-0 resize-none"
                />
                <label
                  htmlFor="reserve_requests"
                  className="absolute left-3.5 top-3 text-on-surface-variant text-sm transition-all duration-300 pointer-events-none px-1.5
                             peer-placeholder-shown:text-base peer-placeholder-shown:top-3
                             peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-primary peer-focus:bg-[#0f0e0c]
                             peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:bg-[#0f0e0c]"
                >
                  Special Requests (Dietary needs, seating preference, etc.)
                </label>
              </div>

              {/* Error Message */}
              {submitError && (
                <div className="sm:col-span-2 bg-red-900/20 border border-red-500/30 rounded-12 px-4 py-3 text-red-400 text-sm">
                  {submitError}
                </div>
              )}

              {/* Submit Button */}
              <div className="sm:col-span-2 mt-4">
                <button type="submit" disabled={isSubmitting} className="w-full inline-flex items-center justify-center px-8 py-4 bg-primary text-on-primary font-button text-button uppercase tracking-[0.15em] rounded-12 hover:bg-primary-fixed hover:shadow-[0_0_20px_rgba(233,193,118,0.4)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  Reserve My Table
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 max-w-container-max mx-auto">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest gold-border rounded-12 p-8 flex flex-col items-start gold-glow cursor-pointer icon-rotate-hover reveal reveal-up">
          <div className="w-12 h-12 rounded-full gold-border flex items-center justify-center mb-6 text-primary bg-surface-container-low">
            <span className="material-symbols-outlined text-2xl">schedule</span>
          </div>
          <h3 className="font-headline-md text-xl text-primary mb-3">Reservation Hours</h3>
          <p className="font-body-md text-sm text-on-surface-variant">
            Monday – Sunday<br />
            11:00 AM – 11:30 PM
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container-lowest gold-border rounded-12 p-8 flex flex-col items-start gold-glow cursor-pointer icon-rotate-hover reveal reveal-up" style={{ transitionDelay: '100ms' }}>
          <div className="w-12 h-12 rounded-full gold-border flex items-center justify-center mb-6 text-primary bg-surface-container-low">
            <span className="material-symbols-outlined text-2xl">gavel</span>
          </div>
          <h3 className="font-headline-md text-xl text-primary mb-3">Reservation Policy</h3>
          <p className="font-body-md text-sm text-on-surface-variant">
            Reservations are held for 15 minutes after the scheduled time. Please notify us if you are running late.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-lowest gold-border rounded-12 p-8 flex flex-col items-start gold-glow cursor-pointer icon-rotate-hover reveal reveal-up" style={{ transitionDelay: '200ms' }}>
          <div className="w-12 h-12 rounded-full gold-border flex items-center justify-center mb-6 text-primary bg-surface-container-low">
            <span className="material-symbols-outlined text-2xl">support_agent</span>
          </div>
          <h3 className="font-headline-md text-xl text-primary mb-3">Need Assistance?</h3>
          <p className="font-body-md text-sm text-on-surface-variant">
            +91 98765 43210<br />
            hello@mayurafinecuisine.com
          </p>
        </div>
      </div>
    </section>
  );
}

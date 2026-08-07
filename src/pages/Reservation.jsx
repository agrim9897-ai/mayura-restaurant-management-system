import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import ReservationSection from '../components/ReservationSection';

export default function Reservation() {
  useScrollReveal();

  return (
    <main className="pt-28">
      {/* Reservation Header */}
      <section className="py-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="relative z-10 reveal reveal-up">
          <p className="font-label-caps text-label-caps text-primary-fixed-dim tracking-[0.2em] mb-4 uppercase">
            TABLE BOOKING
          </p>
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">
            Reserve Your Experience
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Whether an intimate dinner for two, a family gathering, or a corporate dining occasion, reserve your table at Mayura for an unforgettable culinary journey.
          </p>
        </div>
      </section>

      {/* Main Reservation Section */}
      <ReservationSection />
    </main>
  );
}

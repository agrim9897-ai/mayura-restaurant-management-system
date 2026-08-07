import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useParallax } from '../hooks/useParallax';
import { fetchSettings } from '../services/api/settings.service';

import receptionImg from '../../images/reception.jpg';
import chefPlatingImg from '../../images/chef_plating.png';
import dessertSphereImg from '../../images/6.jpg';
import diningRoomImg from '../../images/dining.jpg';
import whyChooseTableImg from '../../images/why_choose_table.png';
import grandArrivalImg from '../../images/4.jpg';
import theWelcomeImg from '../../images/2nd.jpg';
import privateDiningImg from '../../images/private_dining.png';
import craftedBeveragesImg from '../../images/beverages.jpg';

export default function Home() {
  const [settings, setSettings] = useState(null);

  useScrollReveal();
  useParallax();

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await fetchSettings();
        if (data) setSettings(data);
      } catch (err) {
        console.error('Home settings fetch error:', err);
      }
    }
    loadSettings();
  }, []);

  const heroHeadline = settings?.heroTitle || 'Flavors Crafted for Moments';
  const heroSubtitle =
    settings?.heroSubtitle ||
    'Experience the perfect blend of tradition and taste. Where every dish tells a story, meticulously prepared to evoke an emotional response.';
  const heroImg = settings?.heroImageUrl || receptionImg;

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-32 pb-section-padding px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter items-center w-full">
          <div className="z-10 reveal reveal-left pr-0 md:pr-12">
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6 leading-tight">
              {heroHeadline}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-md">
              {heroSubtitle}
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-on-primary font-button text-button uppercase tracking-[0.1em] rounded-12 hover:bg-primary-fixed hover:shadow-[0_0_20px_rgba(233,193,118,0.4)] hover:scale-[1.03] transition-all duration-300 group"
            >
              Explore Our Menu
              <span className="material-symbols-outlined ml-2 text-sm transform group-hover:translate-x-1 transition-transform duration-300">
                arrow_forward_ios
              </span>
            </Link>
          </div>

          <div className="relative w-full h-[60vh] md:h-[80vh] reveal reveal-right hero-image-wrapper">
            <img
              alt="Mayura Reception Foyer"
              className="w-full h-full object-cover cinematic-img transition-transform duration-700 hover:scale-[1.03]"
              src={heroImg}
            />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div id="scroll-indicator" className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-float opacity-70 transition-opacity duration-300">
          <span className="material-symbols-outlined text-primary font-light text-3xl">
            keyboard_double_arrow_down
          </span>
        </div>
      </section>

      {/* Signature Specialties */}
      <section id="specialties" className="py-160 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-16 reveal reveal-up">
          Our Specialties
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-surface-container-lowest gold-border rounded-12 p-10 flex flex-col items-center gold-glow cursor-pointer icon-rotate-hover reveal reveal-up">
            <div className="w-16 h-16 rounded-full gold-border flex items-center justify-center mb-6 text-primary bg-surface-container-low">
              <span className="material-symbols-outlined text-3xl">restaurant_menu</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary mb-2">Classic Delicacies</h3>
            <p className="font-label-caps text-label-caps text-primary-fixed-dim mb-4">TIMELESS FLAVORS</p>
            <p className="font-body-md text-body-md text-on-surface-variant text-center">
              A tribute to age-old recipes crafted with authentic ingredients.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-surface-container-lowest gold-border rounded-12 p-10 flex flex-col items-center gold-glow cursor-pointer icon-rotate-hover reveal reveal-up delay-150">
            <div className="w-16 h-16 rounded-full gold-border flex items-center justify-center mb-6 text-primary bg-surface-container-low">
              <span className="material-symbols-outlined text-3xl">skillet</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary mb-2">Chef's Specials</h3>
            <p className="font-label-caps text-label-caps text-primary-fixed-dim mb-4">SIGNATURE CREATIONS</p>
            <p className="font-body-md text-body-md text-on-surface-variant text-center">
              Unique recipes curated by our chefs to surprise your palate.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-surface-container-lowest gold-border rounded-12 p-10 flex flex-col items-center gold-glow cursor-pointer icon-rotate-hover reveal reveal-up delay-300">
            <div className="w-16 h-16 rounded-full gold-border flex items-center justify-center mb-6 text-primary bg-surface-container-low">
              <span className="material-symbols-outlined text-3xl">agriculture</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary mb-2">Farm Fresh</h3>
            <p className="font-label-caps text-label-caps text-primary-fixed-dim mb-4">PURE & WHOLESOME</p>
            <p className="font-body-md text-body-md text-on-surface-variant text-center">
              We use the freshest produce straight from trusted local farms.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section id="story" className="py-160 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter items-center">
          <div className="order-2 md:order-1 h-[500px] reveal reveal-left image-vignette">
            <img
              alt="Chef's culinary artistry"
              className="w-full h-full object-cover cinematic-img hover:scale-[1.05]"
              src={chefPlatingImg}
            />
          </div>

          <div className="order-1 md:order-2 pl-0 md:pl-12 reveal reveal-right">
            <p className="font-label-caps text-label-caps text-primary-fixed-dim tracking-[0.15em] mb-4">A TASTE OF TRADITION</p>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-6">A Legacy of Excellence</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
              Made with passion, served with love. From rich curries to smoky grills, every dish is prepared with the finest ingredients and heartfelt dedication. We believe that fine dining is an art form that transcends the plate.
            </p>
            <Link
              to="/experience"
              className="inline-flex items-center text-primary font-button text-button uppercase tracking-[0.1em] hover:text-primary-fixed-dim transition-colors group"
            >
              Experience {settings?.restaurantName || 'Mayura'}
              <span className="material-symbols-outlined ml-2 transform group-hover:translate-x-2 transition-transform duration-300">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Experience Journey */}
      <section id="flavors" className="py-160 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto overflow-hidden">
        <div className="text-center mb-24 reveal reveal-up">
          <p className="font-label-caps text-label-caps text-primary-fixed-dim tracking-[0.2em] mb-4">THE EXPERIENCE JOURNEY</p>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-6">A Guided Tour of {settings?.restaurantName || 'Mayura'}</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Walk with us from the grand entrance to the sweet finale. Every step is an orchestrated celebration of atmosphere, craftsmanship, and hospitality.
          </p>
        </div>

        <div className="space-y-32 md:space-y-48">
          {/* 01. Grand Arrival */}
          <div className="reveal reveal-up my-16">
            <div className="relative w-full h-[55vh] md:h-[70vh] group overflow-hidden rounded-12 gold-border image-vignette cursor-pointer">
              <img alt="Grand arrival at Mayura" className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-[1.04]" src={grandArrivalImg} />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent opacity-85" />
              <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-xl">
                <p className="font-label-caps text-label-caps text-primary-fixed-dim mb-2">01. GRAND ARRIVAL</p>
                <h3 className="font-headline-md text-headline-md text-primary mb-3">Welcoming Dusk</h3>
                <p className="font-body-md text-sm text-on-surface-variant">
                  A stunning exterior facade at twilight welcoming you with warm architectural lighting and lush landscaping, hinting at the sensory journey that lies within.
                </p>
              </div>
            </div>
          </div>

          {/* 02. The Welcome */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-gutter items-center py-12">
            <div className="md:col-span-7 reveal reveal-left">
              <div className="relative w-full h-[350px] md:h-[500px] group overflow-hidden rounded-12 gold-border image-vignette cursor-pointer">
                <img alt="The welcome at reception" className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-[1.04]" src={theWelcomeImg} />
              </div>
            </div>
            <div className="md:col-span-5 reveal reveal-right pl-0 md:pl-8">
              <p className="font-label-caps text-label-caps text-primary-fixed-dim mb-3">02. THE WELCOME</p>
              <h3 className="font-headline-md text-headline-md text-primary mb-4">Sophisticated Reception</h3>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Step into a sanctuary of refined elegance. Our hosts welcome you into a sophisticated foyer detailed with polished oak wood, marble accents, and the gentle warmth of true hospitality.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-24 reveal reveal-up">
          <Link
            to="/menu"
            className="inline-flex items-center justify-center px-10 py-4 border border-primary text-primary font-button text-button uppercase tracking-[0.1em] rounded-12 hover:bg-primary hover:text-on-primary hover:scale-[1.03] hover:shadow-[0_0_15px_rgba(233,193,118,0.3)] transition-all duration-300"
          >
            Explore Full Menu
          </Link>
        </div>
      </section>

      {/* Reservation CTA Banner */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center relative overflow-hidden">
        <div className="bg-surface-container-lowest gold-border rounded-12 p-12 md:p-16 relative overflow-hidden gold-glow reveal reveal-up">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
          <p className="font-label-caps text-label-caps text-primary-fixed-dim tracking-[0.2em] mb-4 uppercase">
            JOIN US FOR AN UNFORGETTABLE EVENING
          </p>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-6">
            Ready to Reserve Your Table?
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto mb-10 leading-relaxed">
            Every reservation is carefully prepared to ensure an exceptional culinary journey. Select your preferred date, time, and seating arrangements.
          </p>
          <Link
            to="/reservation"
            className="inline-flex items-center justify-center px-10 py-4 bg-primary text-on-primary font-button text-button uppercase tracking-[0.15em] rounded-12 hover:bg-primary-fixed hover:shadow-[0_0_25px_rgba(233,193,118,0.4)] hover:scale-[1.03] transition-all duration-300 group"
          >
            Reserve Your Table
            <span className="material-symbols-outlined ml-2 text-sm transform group-hover:translate-x-1 transition-transform duration-300">
              calendar_month
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}

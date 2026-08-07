import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useParallax } from '../hooks/useParallax';

import grandArrivalImg from '../../images/4.jpg';
import theWelcomeImg from '../../images/reception.jpg';
import diningRoomImg from '../../images/dining.jpg';
import chefPlatingImg from '../../images/chef_plating.png';
import whyChooseTableImg from '../../images/why_choose_table.png';
import privateDiningImg from '../../images/private_dining.png';
import craftedBeveragesImg from '../../images/beverages.jpg';
import dessertSphereImg from '../../images/6.jpg';
import eveningAmbienceImg from '../../images/evening_ambience.png';

export default function Experience() {
  useScrollReveal();
  useParallax();

  return (
    <main className="relative">
      {/* Chapter 1: Arrival */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto border-b border-outline-variant/20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full">
          <div className="md:col-span-7 reveal reveal-left relative h-[50vh] md:h-[75vh] rounded-12 overflow-hidden gold-border image-vignette group cursor-pointer">
            <img alt="Exterior View of Mayura" className="w-full h-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-[1.05]" src={grandArrivalImg} />
          </div>
          <div className="md:col-span-5 reveal reveal-right pl-0 md:pl-10">
            <p className="font-label-caps text-label-caps text-primary-fixed-dim tracking-[0.15em] mb-4">CHAPTER ONE</p>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-6 leading-tight">The Grand Arrival</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              As dusk falls, the exterior facade of Mayura glows with warm, sophisticated architectural spotlights. Set against manicured greens, the grand entrance invites you into a world where gastronomy and fine architecture gracefully blend.
            </p>
          </div>
        </div>
      </section>

      {/* Chapter 2: Welcome */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto border-b border-outline-variant/20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full">
          <div className="md:col-span-5 order-2 md:order-1 reveal reveal-left pr-0 md:pr-10">
            <p className="font-label-caps text-label-caps text-primary-fixed-dim tracking-[0.15em] mb-4">CHAPTER TWO</p>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-6 leading-tight">The Reception</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Step inside to a quiet sanctuary of luxury. You are greeted at our custom oak and marble reception desk by hosts whose refined hospitality and sincere welcome immediately ease you into the evening.
            </p>
          </div>
          <div className="md:col-span-7 order-1 md:order-2 reveal reveal-right relative h-[50vh] md:h-[75vh] rounded-12 overflow-hidden gold-border image-vignette group cursor-pointer">
            <img alt="The welcome desk foyer" className="w-full h-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-[1.05]" src={theWelcomeImg} />
          </div>
        </div>
      </section>

      {/* Chapter 3: Dining Hall */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden py-24 border-b border-outline-variant/20">
        <div className="absolute inset-0 z-0">
          <div className="experience-parallax w-full h-[125%] absolute -top-[12%] bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${diningRoomImg})` }} />
          <div className="absolute inset-0 bg-[#0f1f15] mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f1f15] via-transparent to-[#0f1f15]" />
        </div>
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full flex justify-center md:justify-start">
          <div className="bg-[#0f1f15]/85 backdrop-filter backdrop-blur-md border border-outline-variant/40 p-8 md:p-12 rounded-12 max-w-xl reveal reveal-scale gold-border">
            <p className="font-label-caps text-label-caps text-primary-fixed-dim tracking-[0.15em] mb-4">CHAPTER THREE</p>
            <h2 className="font-headline-lg text-headline-md text-primary mb-6">The Dining Hall</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              The heart of Mayura beats inside our main dining room. Anchored by natural materials, cozy velvet textures, and custom lighting, the hall hums with the soft chatter of guests enjoying carefully curated sensory moments.
            </p>
          </div>
        </div>
      </section>

      {/* Chapter 4: Open Kitchen */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto border-b border-outline-variant/20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full">
          <div className="md:col-span-7 reveal reveal-left relative h-[50vh] md:h-[75vh] rounded-12 overflow-hidden gold-border image-vignette group cursor-pointer">
            <img alt="Chefs plating kitchen" className="w-full h-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-[1.05]" src={chefPlatingImg} />
          </div>
          <div className="md:col-span-5 reveal reveal-right pl-0 md:pl-10">
            <p className="font-label-caps text-label-caps text-primary-fixed-dim tracking-[0.15em] mb-4">CHAPTER FOUR</p>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-6 leading-tight">Culinary Theatre</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Witness culinary craftsmanship in motion. Our open, slate-trimmed kitchen showcases our master chefs preparing dishes with pinpoint precision, demonstrating their deep respect for ingredients and final execution.
            </p>
          </div>
        </div>
      </section>

      {/* Chapter 5: Signature Table Setting */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto border-b border-outline-variant/20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full">
          <div className="md:col-span-5 order-2 md:order-1 reveal reveal-left pr-0 md:pr-10">
            <p className="font-label-caps text-label-caps text-primary-fixed-dim tracking-[0.15em] mb-4">CHAPTER FIVE</p>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-6 leading-tight">Signature Setting</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              The details make the experience. Fine linen fabrics, fresh-cut florals, and polished custom dinnerware are arranged to frame every course. Gently glowing candles establish a calm and sophisticated table environment.
            </p>
          </div>
          <div className="md:col-span-7 order-1 md:order-2 reveal reveal-right relative h-[50vh] md:h-[75vh] rounded-12 overflow-hidden gold-border image-vignette group cursor-pointer">
            <img alt="Elegant table setup detail" className="w-full h-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-[1.05]" src={whyChooseTableImg} />
          </div>
        </div>
      </section>

      {/* Chapter 6: Private Dining */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden py-24 border-b border-outline-variant/20">
        <div className="absolute inset-0 z-0">
          <div className="experience-parallax w-full h-[125%] absolute -top-[12%] bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${privateDiningImg})` }} />
          <div className="absolute inset-0 bg-[#0f1f15] mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f1f15] via-transparent to-[#0f1f15]" />
        </div>
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full flex justify-center md:justify-end">
          <div className="bg-[#0f1f15]/85 backdrop-filter backdrop-blur-md border border-outline-variant/40 p-8 md:p-12 rounded-12 max-w-xl reveal reveal-scale gold-border">
            <p className="font-label-caps text-label-caps text-primary-fixed-dim tracking-[0.15em] mb-4">CHAPTER SIX</p>
            <h2 className="font-headline-lg text-headline-md text-primary mb-6">Private Dining</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Designed for private celebrations, corporate events, and exclusive gatherings, our private dining rooms offer custom curated menus, absolute discretion, and highly tailored hospitality.
            </p>
          </div>
        </div>
      </section>

      {/* Chapter 7: Beverage Experience */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto border-b border-outline-variant/20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full">
          <div className="md:col-span-7 reveal reveal-left relative h-[50vh] md:h-[75vh] rounded-12 overflow-hidden gold-border image-vignette group cursor-pointer">
            <img alt="Mixologist preparing cocktail" className="w-full h-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-[1.05]" src={craftedBeveragesImg} />
          </div>
          <div className="md:col-span-5 reveal reveal-right pl-0 md:pl-10">
            <p className="font-label-caps text-label-caps text-primary-fixed-dim tracking-[0.15em] mb-4">CHAPTER SEVEN</p>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-6 leading-tight">Artisanal Mixology</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Experience liquid art. Our expert bartenders combine hand-selected botanical infusions, fresh-pressed citrus juices, and custom garnishes, creating memorable mocktails and signature beverages.
            </p>
          </div>
        </div>
      </section>

      {/* Chapter 8: Dessert Experience */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto border-b border-outline-variant/20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full">
          <div className="md:col-span-5 order-2 md:order-1 reveal reveal-left pr-0 md:pr-10">
            <p className="font-label-caps text-label-caps text-primary-fixed-dim tracking-[0.15em] mb-4">CHAPTER EIGHT</p>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-6 leading-tight">Sweet Finale</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              End the night on a high note. Our signature desserts, like the molten chocolate sphere, are presented with elegance and table-side service, creating a beautiful concluding memory of your dinner.
            </p>
          </div>
          <div className="md:col-span-7 order-1 md:order-2 reveal reveal-right relative h-[50vh] md:h-[75vh] rounded-12 overflow-hidden gold-border image-vignette group cursor-pointer">
            <img alt="Plated dessert sphere" className="w-full h-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-[1.05]" src={dessertSphereImg} />
          </div>
        </div>
      </section>

      {/* Chapter 9: Evening Ambience */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden py-24 border-b border-outline-variant/20">
        <div className="absolute inset-0 z-0">
          <div className="experience-parallax w-full h-[125%] absolute -top-[12%] bg-cover bg-center opacity-35" style={{ backgroundImage: `url(${eveningAmbienceImg})` }} />
          <div className="absolute inset-0 bg-[#0f1f15] mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f1f15] via-transparent to-[#0f1f15]" />
        </div>
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full flex justify-center">
          <div className="bg-[#0f1f15]/85 backdrop-filter backdrop-blur-md border border-outline-variant/40 p-8 md:p-12 rounded-12 max-w-xl reveal reveal-scale text-center gold-border">
            <p className="font-label-caps text-label-caps text-primary-fixed-dim tracking-[0.15em] mb-4">CHAPTER NINE</p>
            <h2 className="font-headline-lg text-headline-md text-primary mb-6">Evening Ambience</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Under the stars, Mayura shines. The glowing windows, warm outdoor lamps, and calm atmosphere lock in a premium final impression that will stay with you long after the final course is served.
            </p>
          </div>
        </div>
      </section>

      {/* Chapter 10: Reservation CTA */}
      <section id="reserve" className="min-h-screen flex items-center justify-center py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center">
        <div className="border-y border-outline-variant py-24 w-full relative overflow-hidden reveal reveal-up">
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary opacity-5 rounded-full blur-3xl" />
          <p className="font-label-caps text-label-caps text-primary-fixed-dim tracking-[0.2em] mb-4">CHAPTER TEN</p>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-6 relative z-10">Begin Your Own Chapter</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-10 max-w-md mx-auto relative z-10">
            Join us for an unforgettable evening of luxury culinary craftsmanship. Reserve your dining experience today.
          </p>
          <Link
            to="/reservation"
            className="inline-flex items-center justify-center px-10 py-4 bg-primary text-on-primary font-button text-button uppercase tracking-[0.1em] rounded-12 hover:bg-primary-fixed hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(233,193,118,0.4)] transition-all duration-300 relative z-10"
          >
            Reserve a Table
          </Link>
        </div>
      </section>
    </main>
  );
}

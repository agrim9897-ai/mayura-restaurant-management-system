import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useParallax } from '../hooks/useParallax';
import ReservationSection from '../components/ReservationSection';

import heroDishImg from '../../images/hero_dish.png';
import chefPlatingImg from '../../images/chef_plating.png';
import dessertSphereImg from '../../images/dessert_sphere.png';
import diningRoomImg from '../../images/dining_room.png';
import whyChooseTableImg from '../../images/why_choose_table.png';
import grandArrivalImg from '../../images/grand_arrival.png';
import theWelcomeImg from '../../images/the_welcome.png';
import privateDiningImg from '../../images/private_dining.png';
import craftedBeveragesImg from '../../images/crafted_beverages.png';

export default function Home() {
  useScrollReveal();
  useParallax();

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-32 pb-section-padding px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter items-center w-full">
          <div className="z-10 reveal reveal-left pr-0 md:pr-12">
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6 leading-tight">
              Flavors Crafted for Moments
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-md">
              Experience the perfect blend of tradition and taste. Where every dish tells a story, meticulously prepared to evoke an emotional response.
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

          <div className="relative w-full h-[60vh] md:h-[80vh] reveal reveal-right image-vignette">
            <img
              alt="Gourmet Indian dish"
              className="w-full h-full object-cover cinematic-img hover:scale-[1.05]"
              src={heroDishImg}
            />
            <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#0f1f15] to-transparent hidden md:block" />
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
              Experience Mayura
              <span className="material-symbols-outlined ml-2 transform group-hover:translate-x-2 transition-transform duration-300">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Signature Menu Preview */}
      <section id="menu-preview" className="py-160 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="text-center mb-16 reveal reveal-up">
          <p className="font-label-caps text-label-caps text-primary-fixed-dim tracking-[0.2em] mb-4">
            CURATED SELECTION
          </p>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-6">
            Signature Menu Preview
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            A curated teaser of our culinary craftsmanship. Explore our complete collection of over 200 dishes on our dedicated menu page.
          </p>
        </div>

        {/* 6 Signature Dishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Dish 1: Truffle Burrata */}
          <div className="bg-surface-container-lowest gold-border rounded-12 p-8 flex flex-col justify-between gold-glow cursor-pointer reveal reveal-up">
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 rounded-xs border border-green-600 flex items-center justify-center p-0.5 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-green-600" />
                  </span>
                  <h3 className="font-headline-md text-xl text-on-surface hover:text-primary transition-colors">
                    Truffle Burrata
                  </h3>
                  <span className="font-label-caps text-[10px] text-primary-fixed-dim border border-primary/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Signature
                  </span>
                </div>
                <span className="font-headline-md text-xl text-primary font-semibold ml-4">
                  ₹525
                </span>
              </div>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                Creamy heirloom burrata served with a drizzle of white truffle oil, heirloom tomatoes, and aged balsamic glaze.
              </p>
            </div>
          </div>

          {/* Dish 2: Cognac Lobster Bisque */}
          <div className="bg-surface-container-lowest gold-border rounded-12 p-8 flex flex-col justify-between gold-glow cursor-pointer reveal reveal-up" style={{ transitionDelay: '100ms' }}>
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 rounded-xs border border-red-600 flex items-center justify-center p-0.5 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-red-600" />
                  </span>
                  <h3 className="font-headline-md text-xl text-on-surface hover:text-primary transition-colors">
                    Cognac Lobster Bisque
                  </h3>
                  <span className="font-label-caps text-[10px] text-primary-fixed-dim border border-primary/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Premium
                  </span>
                </div>
                <span className="font-headline-md text-xl text-primary font-semibold ml-4">
                  ₹545
                </span>
              </div>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                A luxurious, velvety smooth puree of roasted lobster shells, cream, fresh butter, and fine cognac.
              </p>
            </div>
          </div>

          {/* Dish 3: Butter Chicken Royale */}
          <div className="bg-surface-container-lowest gold-border rounded-12 p-8 flex flex-col justify-between gold-glow cursor-pointer reveal reveal-up" style={{ transitionDelay: '150ms' }}>
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 rounded-xs border border-red-600 flex items-center justify-center p-0.5 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-red-600" />
                  </span>
                  <h3 className="font-headline-md text-xl text-on-surface hover:text-primary transition-colors">
                    Butter Chicken Royale
                  </h3>
                  <span className="font-label-caps text-[10px] text-primary-fixed-dim border border-primary/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Bestseller
                  </span>
                </div>
                <span className="font-headline-md text-xl text-primary font-semibold ml-4">
                  ₹625
                </span>
              </div>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                Clay-oven charred tandoori chicken tikka simmered in our signature velvet tomato and cashew gravy with fresh cream.
              </p>
            </div>
          </div>

          {/* Dish 4: Pan-Seared Sea Bass */}
          <div className="bg-surface-container-lowest gold-border rounded-12 p-8 flex flex-col justify-between gold-glow cursor-pointer reveal reveal-up" style={{ transitionDelay: '200ms' }}>
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 rounded-xs border border-red-600 flex items-center justify-center p-0.5 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-red-600" />
                  </span>
                  <h3 className="font-headline-md text-xl text-on-surface hover:text-primary transition-colors">
                    Pan-Seared Sea Bass
                  </h3>
                  <span className="font-label-caps text-[10px] text-primary-fixed-dim border border-primary/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Chef's Special
                  </span>
                </div>
                <span className="font-headline-md text-xl text-primary font-semibold ml-4">
                  ₹925
                </span>
              </div>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                Fresh Chilean sea bass seared crisp with saffron beurre blanc, baby asparagus, and garlic confit.
              </p>
            </div>
          </div>

          {/* Dish 5: Slow-Cooked Lamb Shank */}
          <div className="bg-surface-container-lowest gold-border rounded-12 p-8 flex flex-col justify-between gold-glow cursor-pointer reveal reveal-up" style={{ transitionDelay: '250ms' }}>
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 rounded-xs border border-red-600 flex items-center justify-center p-0.5 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-red-600" />
                  </span>
                  <h3 className="font-headline-md text-xl text-on-surface hover:text-primary transition-colors">
                    Slow-Cooked Lamb Shank
                  </h3>
                  <span className="font-label-caps text-[10px] text-primary-fixed-dim border border-primary/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Signature
                  </span>
                </div>
                <span className="font-headline-md text-xl text-primary font-semibold ml-4">
                  ₹895
                </span>
              </div>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                8-hour slow-braised New Zealand lamb shank in rich rosemary red wine reduction with truffle mashed potatoes.
              </p>
            </div>
          </div>

          {/* Dish 6: Molten Chocolate Sphere */}
          <div className="bg-surface-container-lowest gold-border rounded-12 p-8 flex flex-col justify-between gold-glow cursor-pointer reveal reveal-up" style={{ transitionDelay: '300ms' }}>
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 rounded-xs border border-green-600 flex items-center justify-center p-0.5 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-green-600" />
                  </span>
                  <h3 className="font-headline-md text-xl text-on-surface hover:text-primary transition-colors">
                    Molten Chocolate Sphere
                  </h3>
                  <span className="font-label-caps text-[10px] text-primary-fixed-dim border border-primary/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Guest Favorite
                  </span>
                </div>
                <span className="font-headline-md text-xl text-primary font-semibold ml-4">
                  ₹475
                </span>
              </div>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                Warm Valrhona dark chocolate sphere filled with hazelnut mousse, melted table-side with hot caramel sauce.
              </p>
            </div>
          </div>
        </div>

        {/* Prominent CTA */}
        <div className="text-center reveal reveal-up">
          <Link
            to="/menu"
            className="inline-flex items-center justify-center px-10 py-4 bg-primary text-on-primary font-button text-button uppercase tracking-[0.15em] rounded-12 hover:bg-primary-fixed hover:shadow-[0_0_20px_rgba(233,193,118,0.4)] hover:scale-[1.03] transition-all duration-300 group"
          >
            View Complete Menu
            <span className="material-symbols-outlined ml-2 text-sm transform group-hover:translate-x-2 transition-transform duration-300">
              arrow_forward
            </span>
          </Link>
        </div>
      </section>

      {/* Experience Journey */}
      <section id="flavors" className="py-160 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto overflow-hidden">
        <div className="text-center mb-24 reveal reveal-up">
          <p className="font-label-caps text-label-caps text-primary-fixed-dim tracking-[0.2em] mb-4">THE EXPERIENCE JOURNEY</p>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-6">A Guided Tour of Mayura</h2>
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

          {/* 03. The Main Dining Hall */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-gutter items-center py-12">
            <div className="md:col-span-5 order-2 md:order-1 reveal reveal-left pr-0 md:pr-8">
              <p className="font-label-caps text-label-caps text-primary-fixed-dim mb-3">03. THE MAIN DINING HALL</p>
              <h3 className="font-headline-md text-headline-md text-primary mb-4">Curated Ambience</h3>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Settle into a spacious hall where premium furniture, soft ambient lights, and tasteful shadows create an intimate atmosphere, allowing conversation and fine dining to flow naturally.
              </p>
            </div>
            <div className="md:col-span-7 order-1 md:order-2 reveal reveal-right">
              <div className="relative w-full h-[350px] md:h-[500px] group overflow-hidden rounded-12 gold-border image-vignette cursor-pointer">
                <img alt="The Main Dining Hall" className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-[1.04]" src={diningRoomImg} />
              </div>
            </div>
          </div>

          {/* 04. Culinary Theatre */}
          <div className="max-w-4xl mx-auto py-12">
            <div className="reveal reveal-scale mb-8">
              <div className="relative w-full h-[300px] md:h-[450px] group overflow-hidden rounded-12 gold-border image-vignette cursor-pointer">
                <img alt="Culinary theatre plating" className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-[1.04]" src={chefPlatingImg} />
              </div>
            </div>
            <div className="text-center max-w-xl mx-auto reveal reveal-up">
              <p className="font-label-caps text-label-caps text-primary-fixed-dim mb-2">04. CULINARY THEATRE</p>
              <h3 className="font-headline-md text-headline-md text-primary mb-3">Craftsmanship in Motion</h3>
              <p className="font-body-md text-sm text-on-surface-variant">
                Witness the precision in our open kitchen, where chefs compose elements with artistic dedication, highlighting culinary excellence in every stroke.
              </p>
            </div>
          </div>

          {/* 05. Signature Table Setting */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-gutter items-center py-12">
            <div className="md:col-span-6 reveal reveal-left">
              <div className="relative w-full h-[350px] md:h-[480px] group overflow-hidden rounded-12 gold-border image-vignette cursor-pointer">
                <img alt="Signature table setting" className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-[1.04]" src={whyChooseTableImg} />
              </div>
            </div>
            <div className="md:col-span-6 reveal reveal-right pl-0 md:pl-10">
              <p className="font-label-caps text-label-caps text-primary-fixed-dim mb-3">05. SIGNATURE TABLE SETTING</p>
              <h3 className="font-headline-md text-headline-md text-primary mb-4">Quiet Luxury</h3>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Fine linen fabrics, flickering candlelight, and custom-crafted dinnerware set the stage. Here, the physical presentation is as carefully structured as the flavors on your plate.
              </p>
            </div>
          </div>

          {/* 06. Private Dining Experience */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-gutter items-center py-12">
            <div className="md:col-span-5 order-2 md:order-1 reveal reveal-left pr-0 md:pr-10">
              <p className="font-label-caps text-label-caps text-primary-fixed-dim mb-3">06. PRIVATE DINING EXPERIENCE</p>
              <h3 className="font-headline-md text-headline-md text-primary mb-4">An Intimate Sanctuary</h3>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Designed for exclusive celebrations and quiet business dinners, our private room offers seclusion, custom menus, and dedicated hospitality tailored to your preferences.
              </p>
            </div>
            <div className="md:col-span-7 order-1 md:order-2 reveal reveal-right">
              <div className="relative w-full h-[350px] md:h-[500px] group overflow-hidden rounded-12 gold-border image-vignette cursor-pointer">
                <img alt="Private dining room" className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-[1.04]" src={privateDiningImg} />
              </div>
            </div>
          </div>

          {/* 07. Crafted Beverages */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-gutter items-center py-12">
            <div className="md:col-span-7 reveal reveal-left">
              <div className="relative w-full h-[350px] md:h-[500px] group overflow-hidden rounded-12 gold-border image-vignette cursor-pointer">
                <img alt="Crafted mocktail preparation" className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-[1.04]" src={craftedBeveragesImg} />
              </div>
            </div>
            <div className="md:col-span-5 reveal reveal-right pl-0 md:pl-8">
              <p className="font-label-caps text-label-caps text-primary-fixed-dim mb-3">07. CRAFTED BEVERAGES</p>
              <h3 className="font-headline-md text-headline-md text-primary mb-4">Artisanal Mixology</h3>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Our bartenders combine botanical infusions, fresh citrus extracts, and delicate visual garnish presentation, crafting cocktails and mocktails that refresh the spirit.
              </p>
            </div>
          </div>

          {/* 08. Sweet Finale */}
          <div className="max-w-3xl mx-auto py-12">
            <div className="reveal reveal-scale mb-8">
              <div className="relative w-full h-[320px] md:h-[480px] group overflow-hidden rounded-12 gold-border image-vignette cursor-pointer">
                <img alt="Sweet finale chocolate sphere" className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-[1.04]" src={dessertSphereImg} />
              </div>
            </div>
            <div className="text-center max-w-xl mx-auto reveal reveal-up">
              <p className="font-label-caps text-label-caps text-primary-fixed-dim mb-2">08. SWEET FINALE</p>
              <h3 className="font-headline-md text-headline-md text-primary mb-3">Candle-lit Memories</h3>
              <p className="font-body-md text-sm text-on-surface-variant">
                Conclude your evening with our signature chocolate sphere, melted with hot caramel sauce right at your table for a memorable final course.
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

      {/* Chef's Recommendation */}
      <section className="py-160 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            id="parallax-bg"
            className="w-full h-[120%] absolute -top-[10%] bg-cover bg-center opacity-30 transition-transform duration-300"
            style={{ backgroundImage: `url(${diningRoomImg})` }}
          />
          <div className="absolute inset-0 bg-[#0f1f15] mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f15] via-transparent to-[#0f1f15]" />
        </div>

        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center reveal reveal-scale">
          <p className="font-label-caps text-label-caps text-primary-fixed-dim mb-4 tracking-[0.2em]">CHEF'S RECOMMENDATION</p>
          <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-8 max-w-3xl mx-auto">
            The Culinary Masterpiece
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10">
            An orchestrated symphony of textures and flavors, designed to challenge expectations and delight the senses. Available exclusively this season.
          </p>
        </div>
      </section>

      {/* Why Choose Mayura */}
      <section id="why-choose" className="py-160 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto relative overflow-hidden">
        <div className="absolute right-0 bottom-10 w-96 h-96 bg-primary opacity-5 rounded-full blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-stretch">
          {/* Left Side (40%) */}
          <div className="md:col-span-5 relative min-h-[400px] md:min-h-[600px] rounded-12 overflow-hidden gold-border image-vignette reveal reveal-left group">
            <div id="why-choose-parallax-container" className="absolute inset-0 w-full h-[120%] -top-[10%]">
              <div className="w-full h-full transition-transform duration-1000 ease-out group-hover:scale-[1.06]">
                <img alt="Elegant dining table setting" className="w-full h-full object-cover cinematic-img" src={whyChooseTableImg} />
              </div>
            </div>
          </div>

          {/* Right Side (60%) */}
          <div className="md:col-span-7 flex flex-col justify-between pl-0 md:pl-8">
            <div className="mb-12 text-left reveal reveal-right">
              <p className="font-label-caps text-label-caps text-primary-fixed-dim tracking-[0.15em] mb-4">WHY CHOOSE US</p>
              <h2 className="font-headline-lg text-headline-lg text-primary mb-6">An Experience Beyond Exceptional Dining</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                Every meal at Mayura is thoughtfully crafted—from carefully sourced ingredients to impeccable hospitality—creating moments that stay with you long after the last bite.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-surface-container-lowest gold-border rounded-12 p-8 flex flex-col items-start gold-glow cursor-pointer icon-rotate-hover reveal reveal-up">
                <div className="w-12 h-12 rounded-full gold-border flex items-center justify-center mb-6 text-primary bg-surface-container-low">
                  <span className="material-symbols-outlined text-2xl">eco</span>
                </div>
                <p className="font-label-caps text-[10px] tracking-[0.2em] text-primary-fixed-dim mb-2 uppercase">SOURCING</p>
                <h3 className="font-headline-md text-xl text-primary mb-3">Fresh Ingredients</h3>
                <p className="font-body-md text-sm text-on-surface-variant">
                  Locally sourced seasonal produce selected daily to ensure unmatched freshness and authentic flavor.
                </p>
              </div>

              <div className="bg-surface-container-lowest gold-border rounded-12 p-8 flex flex-col items-start gold-glow cursor-pointer icon-rotate-hover reveal reveal-up" style={{ transitionDelay: '100ms' }}>
                <div className="w-12 h-12 rounded-full gold-border flex items-center justify-center mb-6 text-primary bg-surface-container-low">
                  <span className="material-symbols-outlined text-2xl">restaurant</span>
                </div>
                <p className="font-label-caps text-[10px] tracking-[0.2em] text-primary-fixed-dim mb-2 uppercase">EXPERTISE</p>
                <h3 className="font-headline-md text-xl text-primary mb-3">Master Chefs</h3>
                <p className="font-body-md text-sm text-on-surface-variant">
                  Our experienced chefs combine traditional recipes with modern culinary craftsmanship.
                </p>
              </div>

              <div className="bg-surface-container-lowest gold-border rounded-12 p-8 flex flex-col items-start gold-glow cursor-pointer icon-rotate-hover reveal reveal-up" style={{ transitionDelay: '200ms' }}>
                <div className="w-12 h-12 rounded-full gold-border flex items-center justify-center mb-6 text-primary bg-surface-container-low">
                  <span className="material-symbols-outlined text-2xl">wine_bar</span>
                </div>
                <p className="font-label-caps text-[10px] tracking-[0.2em] text-primary-fixed-dim mb-2 uppercase">AMBIENCE</p>
                <h3 className="font-headline-md text-xl text-primary mb-3">Curated Experience</h3>
                <p className="font-body-md text-sm text-on-surface-variant">
                  Thoughtfully designed ambience, exceptional service, and carefully selected beverages for every occasion.
                </p>
              </div>

              <div className="bg-surface-container-lowest gold-border rounded-12 p-8 flex flex-col items-start gold-glow cursor-pointer icon-rotate-hover reveal reveal-up" style={{ transitionDelay: '300ms' }}>
                <div className="w-12 h-12 rounded-full gold-border flex items-center justify-center mb-6 text-primary bg-surface-container-low">
                  <span className="material-symbols-outlined text-2xl">verified</span>
                </div>
                <p className="font-label-caps text-[10px] tracking-[0.2em] text-primary-fixed-dim mb-2 uppercase">STANDARD</p>
                <h3 className="font-headline-md text-xl text-primary mb-3">Premium Quality</h3>
                <p className="font-body-md text-sm text-on-surface-variant">
                  Every dish is prepared with precision, premium ingredients, and uncompromising attention to detail.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation Section */}
      <ReservationSection />
    </main>
  );
}

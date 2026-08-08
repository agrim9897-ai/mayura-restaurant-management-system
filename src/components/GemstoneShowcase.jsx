import React, { useState } from 'react';

export default function GemstoneShowcase() {
  const [videoError, setVideoError] = useState(false);

  return (
    <section id="gemstone-showcase" className="py-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto border-b border-outline-variant/20">
      <div className="text-center mb-12 reveal reveal-up">
        <p className="font-label-caps text-label-caps text-primary-fixed-dim tracking-[0.2em] mb-3 uppercase">
          EXCLUSIVE PRESENTATION
        </p>
        <h2 className="font-headline-lg text-headline-lg text-primary mb-4">
          Watch the Gemstone
        </h2>
        <div className="w-24 h-0.5 bg-primary/40 mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center w-full">
        {/* Left Column: Premium Responsive Video Player */}
        <div className="md:col-span-7 reveal reveal-left">
          <div className="bg-surface-container-lowest gold-border rounded-12 p-3 shadow-2xl relative overflow-hidden group gold-glow">
            <div className="relative w-full aspect-video rounded-8 overflow-hidden bg-black flex items-center justify-center">
              {!videoError ? (
                <video
                  controls
                  preload="metadata"
                  playsInline
                  className="w-full h-full object-cover"
                  onError={() => setVideoError(true)}
                  aria-label="Gemstone Showcase Video Player"
                >
                  <source src="/videos/gemstonevideo.mp4" type="video/mp4" />
                  <source src="/videos/gemstone-demo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="p-8 text-center flex flex-col items-center justify-center gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl text-primary opacity-80">
                    movie
                  </span>
                  <p className="font-body-md text-sm text-primary-fixed-dim">
                    Place your video file at: <code className="text-primary bg-surface-container-low px-2 py-1 rounded">public/videos/gemstone-demo.mp4</code>
                  </p>
                  <span className="text-xs text-on-surface-variant/70">
                    Video controls will load automatically once the file is added.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Separate Product Information Section */}
        <div className="md:col-span-5 reveal reveal-right pl-0 md:pl-6">
          <span className="font-label-caps text-xs text-primary-fixed-dim border border-primary/30 px-3 py-1 rounded-full uppercase tracking-widest inline-block mb-4">
            ROYAL GEMSTONE SELECTION
          </span>
          <h3 className="font-headline-md text-2xl md:text-3xl text-primary mb-4 leading-tight">
            Exquisite Gemstone Craftsmanship
          </h3>
          
          <div className="space-y-4 text-on-surface-variant font-body-md text-body-md leading-relaxed mb-8">
            <p>
              Each gemstone in our private showcase represents the pinnacle of natural brilliance, hand-selected for its extraordinary clarity, rich color depth, and master-cut precision.
            </p>
            <p>
              Observed under focused illumination, the multi-faceted symmetry reflects light with incomparable fire and regal elegance.
            </p>
          </div>

          {/* Product Specification Grid */}
          <div className="grid grid-cols-2 gap-4 bg-surface-container-low/60 border border-outline-variant/40 p-4 rounded-12">
            <div>
              <span className="text-xs text-primary-fixed-dim font-label-caps uppercase block mb-1">Origin</span>
              <span className="text-sm font-semibold text-on-surface">Royal Mines</span>
            </div>
            <div>
              <span className="text-xs text-primary-fixed-dim font-label-caps uppercase block mb-1">Cut Grade</span>
              <span className="text-sm font-semibold text-on-surface">Master Precision</span>
            </div>
            <div>
              <span className="text-xs text-primary-fixed-dim font-label-caps uppercase block mb-1">Clarity</span>
              <span className="text-sm font-semibold text-on-surface">VVS Premium</span>
            </div>
            <div>
              <span className="text-xs text-primary-fixed-dim font-label-caps uppercase block mb-1">Certification</span>
              <span className="text-sm font-semibold text-on-surface">Authentic Gemological</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

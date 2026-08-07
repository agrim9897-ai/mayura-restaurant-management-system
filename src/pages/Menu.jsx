import React, { useState, useEffect, useMemo } from 'react';
import { fetchMenuItems } from '../services/api/menu.service';
import { menuData as fallbackMenuData, categoryTitles } from '../data/menuData';
import { useScrollReveal } from '../hooks/useScrollReveal';
import heroDishImg from '../../images/reception.jpg';

export default function Menu() {
  const [searchQuery, setSearchQuery] = useState('');
  const [vegFilter, setVegFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('default');
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch live dishes from PostgreSQL via API
  useEffect(() => {
    async function loadDishes() {
      setIsLoading(true);
      try {
        const res = await fetchMenuItems({ limit: 100 });
        if (res && res.data && res.data.length > 0) {
          const mapped = res.data.map((item) => ({
            id: item.id,
            name: item.name,
            desc: item.description || '',
            price: item.price,
            type: item.isVeg ? 'veg' : 'non-veg',
            cat: item.category || 'Main Course',
            imageUrl: item.imageUrl,
            badge: item.isFeatured ? "Chef's Special" : null,
            isAvailable: item.isAvailable,
          }));
          setDishes(mapped);
        } else {
          setDishes(fallbackMenuData);
        }
      } catch (err) {
        console.error('Failed to load menu items:', err);
        setDishes(fallbackMenuData);
      } finally {
        setIsLoading(false);
      }
    }

    loadDishes();
  }, []);

  const filteredDishes = useMemo(() => {
    let result = [...dishes];

    // Search filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) => item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)
      );
    }

    // Veg / Non-Veg filter
    if (vegFilter === 'veg') {
      result = result.filter((item) => item.type === 'veg');
    } else if (vegFilter === 'non-veg') {
      result = result.filter((item) => item.type === 'non-veg');
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((item) =>
        item.cat.toLowerCase() === selectedCategory.toLowerCase() ||
        (categoryTitles[selectedCategory] && categoryTitles[selectedCategory].toLowerCase().includes(item.cat.toLowerCase()))
      );
    }

    // Sort filter
    if (sortOption === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [dishes, searchQuery, vegFilter, selectedCategory, sortOption]);

  // Group dishes by category
  const groupedDishes = useMemo(() => {
    const groups = {};
    filteredDishes.forEach((dish) => {
      if (!groups[dish.cat]) {
        groups[dish.cat] = [];
      }
      groups[dish.cat].push(dish);
    });
    return groups;
  }, [filteredDishes]);

  // Available unique categories for dropdown
  const uniqueCategories = useMemo(() => {
    const set = new Set(dishes.map((d) => d.cat));
    return Array.from(set);
  }, [dishes]);

  useScrollReveal([filteredDishes]);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center pt-32 pb-section-padding px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter items-center w-full">
          <div className="z-10 reveal reveal-left pr-0 md:pr-12">
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6 leading-tight">
              Our Menu
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-md">
              Experience the perfect blend of tradition and taste. Where every dish tells a story, meticulously prepared to evoke an emotional response.
            </p>
            <a
              href="#menu-section"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-on-primary font-button text-button uppercase tracking-[0.1em] rounded-12 hover:bg-primary-fixed hover:shadow-[0_0_20px_rgba(233,193,118,0.4)] hover:scale-[1.03] transition-all duration-300 group"
            >
              Explore Dishes
              <span className="material-symbols-outlined ml-2 text-sm transform group-hover:translate-x-1 transition-transform duration-300">
                arrow_forward_ios
              </span>
            </a>
          </div>
          <div className="relative w-full h-[50vh] md:h-[65vh] reveal reveal-right hero-image-wrapper">
            <img
              alt="Gourmet Indian dish"
              className="w-full h-full object-cover cinematic-img transition-transform duration-700 hover:scale-[1.03]"
              src={heroDishImg}
            />
          </div>
        </div>
      </section>

      {/* Interactive Sticky Menu Section */}
      <section id="menu-section" className="py-160 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        {/* Sticky Filter Bar */}
        <div className="sticky top-24 z-30 bg-surface-container-lowest/90 backdrop-blur-md gold-border rounded-12 p-6 mb-16 shadow-2xl reveal reveal-down">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-4 relative">
              <span className="material-symbols-outlined absolute left-4 top-3.5 text-on-surface-variant text-xl">
                search
              </span>
              <input
                type="text"
                id="menu-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes or ingredients..."
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-12 pl-12 pr-4 py-3 text-sm text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Category Select */}
            <div className="md:col-span-3">
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-12 px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors cursor-pointer"
              >
                <option value="all">All Categories ({dishes.length})</option>
                {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div className="md:col-span-2">
              <select
                id="sort-filter"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-12 px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors cursor-pointer"
              >
                <option value="default">Sort By</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            {/* Segmented Veg/Non-Veg Toggle */}
            <div className="md:col-span-3 flex bg-surface-container-low p-1 rounded-12 border border-outline-variant/60">
              <button
                type="button"
                onClick={() => setVegFilter('all')}
                className={`flex-1 py-2 text-xs font-button uppercase tracking-wider rounded-12 transition-all duration-300 ${
                  vegFilter === 'all'
                    ? 'bg-primary text-on-primary font-semibold'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setVegFilter('veg')}
                className={`flex-1 py-2 text-xs font-button uppercase tracking-wider rounded-12 transition-all duration-300 ${
                  vegFilter === 'veg'
                    ? 'bg-primary text-on-primary font-semibold'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Veg
              </button>
              <button
                type="button"
                onClick={() => setVegFilter('non-veg')}
                className={`flex-1 py-2 text-xs font-button uppercase tracking-wider rounded-12 transition-all duration-300 ${
                  vegFilter === 'non-veg'
                    ? 'bg-primary text-on-primary font-semibold'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Non-Veg
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Menu Container */}
        <div id="menu-container" className="space-y-20">
          {isLoading ? (
            <div className="py-20 text-center text-[#e9c176] flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#e9c176]/20 border-t-[#e9c176] animate-spin" />
              <span className="text-xs uppercase tracking-widest">Loading Live Menu...</span>
            </div>
          ) : Object.keys(groupedDishes).length === 0 ? (
            <div className="text-center py-20 bg-surface-container-lowest gold-border rounded-12">
              <span className="material-symbols-outlined text-5xl text-primary mb-4">search_off</span>
              <h3 className="font-headline-md text-xl text-primary mb-2">No Dishes Found</h3>
              <p className="font-body-md text-on-surface-variant">
                Try adjusting your search criteria or resetting filters.
              </p>
            </div>
          ) : (
            Object.keys(groupedDishes).map((catKey) => {
              const catDishes = groupedDishes[catKey];

              return (
                <div key={catKey} className="menu-category-block">
                  <div className="flex items-center gap-4 mb-8 border-b border-outline-variant pb-4">
                    <h3 className="font-headline-md text-2xl text-primary tracking-wide">
                      {catKey}
                    </h3>
                    <span className="font-label-caps text-xs text-primary-fixed-dim bg-surface-container-low px-3 py-1 rounded-full border border-primary/20">
                      {catDishes.length} Items
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {catDishes.map((dish) => (
                      <div
                        key={dish.id || dish.name}
                        className="menu-item-row group flex items-start justify-between gap-4 p-4 rounded-12 hover:bg-surface-container-lowest/50 transition-all duration-300 reveal reveal-up"
                      >
                        {dish.imageUrl && (
                          <div className="w-20 h-20 rounded-12 overflow-hidden shrink-0 bg-surface-container-low">
                            <img
                              src={dish.imageUrl}
                              alt={dish.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        )}

                        <div className="flex-1 pr-4">
                          <div className="flex items-center gap-3 mb-2">
                            {/* Veg / Non-Veg Indicator */}
                            <span
                              className={`w-4 h-4 rounded-xs border flex items-center justify-center p-0.5 shrink-0 ${
                                dish.type === 'veg' ? 'border-green-600' : 'border-red-600'
                              }`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  dish.type === 'veg' ? 'bg-green-600' : 'bg-red-600'
                                }`}
                              />
                            </span>

                            <h4 className="font-headline-md text-lg text-on-surface group-hover:text-primary transition-colors duration-300">
                              {dish.name}
                            </h4>

                            {dish.badge && (
                              <span className="font-label-caps text-[10px] text-primary-fixed-dim border border-primary/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {dish.badge}
                              </span>
                            )}
                          </div>

                          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                            {dish.desc}
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <span className="font-headline-md text-lg text-primary font-semibold group-hover:scale-105 transition-transform inline-block">
                            ₹{dish.price}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}

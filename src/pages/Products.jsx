import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../services/api/products.service';
import { useScrollReveal } from '../hooks/useScrollReveal';

// Fallback mock items in case DB has no products yet
const fallbackProducts = [
  {
    id: 'demo-1',
    title: 'Royal Sapphire Cut Gemstone',
    description: 'A magnificent master-cut deep blue sapphire showcasing incredible fire and internal clarity.',
    category: 'Gemstones',
    price: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoId: 'dQw4w9WgXcQ',
    videoDescription: 'High-definition 360-degree rotation video under neutral laboratory lighting.',
    specifications: JSON.stringify({ Origin: 'Royal Ceylon', Cut: 'Oval Brilliant', Clarity: 'VVS1', Carat: '4.25 ct' }),
    isFeatured: true,
  },
  {
    id: 'demo-2',
    title: 'Imperial Emerald Cluster',
    description: 'Vibrant green Zambian emerald set with fine symmetry and high refraction.',
    category: 'Emeralds',
    price: 6200,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    videoUrl: null,
    videoId: null,
    videoDescription: null,
    specifications: JSON.stringify({ Origin: 'Zambia', Cut: 'Emerald Cut', Clarity: 'VS', Carat: '3.80 ct' }),
    isFeatured: false,
  },
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [onlyWithVideo, setOnlyWithVideo] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        const res = await fetchProducts({ limit: 100 });
        if (res && res.data && res.data.length > 0) {
          setProducts(res.data);
        } else {
          setProducts(fallbackProducts);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setProducts(fallbackProducts);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  // Filter products by search, category, and video filter
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === 'all' ||
        item.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchesVideo = !onlyWithVideo || Boolean(item.videoId || item.videoUrl);

      return matchesSearch && matchesCategory && matchesVideo;
    });
  }, [products, searchQuery, selectedCategory, onlyWithVideo]);

  // Unique categories
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return Array.from(set);
  }, [products]);

  useScrollReveal([filteredProducts]);

  return (
    <main className="min-h-screen pt-28 pb-24">
      {/* Header Banner */}
      <section className="py-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center border-b border-outline-variant/20">
        <div className="reveal reveal-up">
          <p className="font-label-caps text-label-caps text-primary-fixed-dim tracking-[0.25em] mb-4 uppercase">
            CURATED COLLECTION
          </p>
          <h1 className="font-headline-lg text-headline-lg md:text-5xl text-primary mb-6 leading-tight">
            Our Products Showcase
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Discover our masterfully selected collection of fine items, accompanied by detailed specifications and high-definition video presentations.
          </p>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="py-8 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="bg-surface-container-lowest gold-border rounded-12 p-6 shadow-xl reveal reveal-down">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <span className="material-symbols-outlined absolute left-4 top-3.5 text-on-surface-variant text-xl">
                search
              </span>
              <input
                type="text"
                id="product-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, materials, or features..."
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-12 pl-12 pr-4 py-3 text-sm text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Category Select */}
            <div className="md:col-span-4">
              <select
                id="product-category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-12 px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors cursor-pointer"
              >
                <option value="all">All Categories ({products.length})</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Video Filter Toggle */}
            <div className="md:col-span-3 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setOnlyWithVideo(!onlyWithVideo)}
                className={`w-full py-3 px-4 rounded-12 text-xs font-button uppercase tracking-wider border flex items-center justify-center gap-2 transition-all duration-300 ${
                  onlyWithVideo
                    ? 'bg-primary text-on-primary border-primary font-semibold shadow-lg'
                    : 'bg-surface-container-low text-on-surface-variant border-outline-variant/60 hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-sm">play_circle</span>
                {onlyWithVideo ? 'Showing Video Only' : 'Filter by Video'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-12 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        {isLoading ? (
          <div className="py-24 text-center text-[#e9c176] flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-[#e9c176]/20 border-t-[#e9c176] animate-spin" />
            <span className="text-xs uppercase tracking-widest">Loading Products...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-lowest gold-border rounded-12">
            <span className="material-symbols-outlined text-5xl text-primary mb-4">search_off</span>
            <h3 className="font-headline-md text-xl text-primary mb-2">No Products Found</h3>
            <p className="font-body-md text-on-surface-variant">
              Try adjusting your search criteria or resetting filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              const hasVideo = Boolean(product.videoId || product.videoUrl);

              let specsObj = {};
              if (product.specifications) {
                try {
                  specsObj = typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications;
                } catch {
                  // Fallback
                }
              }

              return (
                <div
                  key={product.id}
                  className="bg-surface-container-lowest gold-border rounded-12 overflow-hidden flex flex-col justify-between gold-glow group hover:border-primary/60 transition-all duration-500 reveal reveal-up"
                >
                  <div>
                    {/* Image Container with Video Badge */}
                    <div className="relative h-64 overflow-hidden bg-surface-container-low cursor-pointer">
                      <img
                        src={product.imageUrl || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent opacity-60" />

                      {/* Category Badge */}
                      <span className="absolute top-4 left-4 font-label-caps text-[10px] text-primary-fixed-dim bg-[#0f1f15]/90 backdrop-blur-md px-3 py-1 rounded-full border border-primary/30 uppercase tracking-widest">
                        {product.category || 'General'}
                      </span>

                      {/* Video Availability Indicator Badge */}
                      {hasVideo && (
                        <span className="absolute top-4 right-4 font-label-caps text-[10px] text-white bg-red-900/90 backdrop-blur-md border border-red-500/50 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">play_circle</span>
                          Video Available
                        </span>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <h3 className="font-headline-md text-xl text-primary mb-3 group-hover:text-primary-fixed-dim transition-colors">
                        {product.title}
                      </h3>

                      <p className="font-body-md text-sm text-on-surface-variant leading-relaxed line-clamp-3 mb-6">
                        {product.description || 'No description provided.'}
                      </p>

                      {/* Quick Specs Preview */}
                      {Object.keys(specsObj).length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6 pt-4 border-t border-outline-variant/30">
                          {Object.entries(specsObj).slice(0, 3).map(([key, val]) => (
                            <span
                              key={key}
                              className="text-[11px] bg-surface-container-low text-on-surface-variant px-2.5 py-1 rounded-6 border border-outline-variant/40"
                            >
                              <strong className="text-primary">{key}:</strong> {val}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-6 pt-0 border-t border-outline-variant/20 flex items-center justify-between">
                    {product.price > 0 ? (
                      <span className="font-headline-md text-lg text-primary font-semibold">
                        ₹{product.price.toLocaleString()}
                      </span>
                    ) : (
                      <span className="font-label-caps text-xs text-primary-fixed-dim uppercase tracking-wider">
                        Custom Showcase
                      </span>
                    )}

                    <Link
                      to={`/products/${product.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary font-button text-xs uppercase tracking-wider rounded-12 hover:bg-primary-fixed hover:scale-105 transition-all duration-300 shadow-md"
                    >
                      View Details
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

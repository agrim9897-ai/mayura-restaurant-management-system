import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById } from '../services/api/products.service';
import { extractYouTubeId, getSafeYouTubeEmbedUrl } from '../utils/youtube';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetchProductById(id);
        if (res && res.data) {
          setProduct(res.data);
          setActiveImage(res.data.imageUrl || '');
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
        setError('Unable to load product information.');
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      loadProduct();
    }
  }, [id]);

  if (isLoading) {
    return (
      <main className="min-h-screen pt-36 pb-24 text-center">
        <div className="flex flex-col items-center justify-center gap-4 text-[#e9c176]">
          <div className="w-12 h-12 rounded-full border-2 border-[#e9c176]/20 border-t-[#e9c176] animate-spin" />
          <span className="text-xs uppercase tracking-widest">Loading Product Details...</span>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen pt-36 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center">
        <div className="bg-surface-container-lowest gold-border rounded-12 p-12 max-w-lg mx-auto">
          <span className="material-symbols-outlined text-5xl text-primary mb-4">error_outline</span>
          <h2 className="font-headline-md text-2xl text-primary mb-3">Product Not Found</h2>
          <p className="font-body-md text-on-surface-variant mb-8">{error || 'The requested product could not be located.'}</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-on-primary font-button text-xs uppercase tracking-wider rounded-12 hover:bg-primary-fixed transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  // Parse specifications JSON or string
  let specificationsObj = {};
  if (product.specifications) {
    try {
      specificationsObj = typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications;
    } catch {
      // Fallback: parse formatted key:value text
      product.specifications.split('\n').forEach((line) => {
        const parts = line.split(':');
        if (parts.length >= 2) {
          specificationsObj[parts[0].trim()] = parts.slice(1).join(':').trim();
        }
      });
    }
  }

  // Extract YouTube ID & safe embed URL
  const safeEmbedUrl = getSafeYouTubeEmbedUrl(product.videoId || product.videoUrl);

  // Gallery images array
  const allImages = [
    product.imageUrl,
    ...(Array.isArray(product.images) ? product.images : []),
  ].filter(Boolean);

  const displayImage = activeImage || product.imageUrl || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80';

  return (
    <main className="min-h-screen pt-28 pb-24">
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm text-primary-fixed-dim hover:text-primary transition-colors font-button uppercase tracking-wider"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to All Products
          </Link>
        </div>

        {/* Product Showcase Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          {/* Left Column: Product Images */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-surface-container-lowest gold-border rounded-12 p-3 overflow-hidden shadow-2xl relative gold-glow">
              <div className="w-full aspect-square md:aspect-[4/3] rounded-8 overflow-hidden bg-surface-container-low">
                <img
                  src={displayImage}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-8 overflow-hidden border-2 shrink-0 transition-all ${
                      displayImage === img ? 'border-primary scale-105 shadow-md' : 'border-outline-variant/40 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Title, Category, Description & Specifications */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <span className="font-label-caps text-xs text-primary-fixed-dim border border-primary/30 px-3 py-1 rounded-full uppercase tracking-widest inline-block mb-4">
                {product.category || 'General'}
              </span>

              <h1 className="font-headline-lg text-3xl md:text-4xl text-primary mb-4 leading-tight">
                {product.title}
              </h1>

              {product.price > 0 && (
                <div className="text-2xl font-semibold text-primary mb-6">
                  ₹{product.price.toLocaleString()}
                </div>
              )}
            </div>

            {/* Product Description */}
            <div className="bg-surface-container-lowest gold-border rounded-12 p-6">
              <h2 className="font-headline-md text-lg text-primary mb-3">Product Description</h2>
              <p className="font-body-lg text-body-md text-on-surface-variant leading-relaxed whitespace-pre-line">
                {product.description || 'No detailed description available.'}
              </p>
            </div>

            {/* Product Information / Specifications */}
            {Object.keys(specificationsObj).length > 0 && (
              <div className="bg-surface-container-lowest gold-border rounded-12 p-6">
                <h2 className="font-headline-md text-lg text-primary mb-4">Product Specifications</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(specificationsObj).map(([key, val]) => (
                    <div
                      key={key}
                      className="bg-surface-container-low/70 border border-outline-variant/40 p-3.5 rounded-8"
                    >
                      <span className="text-xs text-primary-fixed-dim font-label-caps uppercase block mb-1">
                        {key}
                      </span>
                      <span className="text-sm font-semibold text-on-surface">
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Video Section (Rendered conditionally ONLY if valid safe YouTube Embed URL exists) */}
        {safeEmbedUrl && (
          <section id="product-video-section" className="mt-16 pt-16 border-t border-outline-variant/30">
            <div className="text-center mb-10">
              <p className="font-label-caps text-label-caps text-primary-fixed-dim tracking-[0.2em] mb-2 uppercase">
                VIDEO PRESENTATION
              </p>
              <h2 className="font-headline-lg text-2xl md:text-3xl text-primary">
                Watch Product Video
              </h2>
            </div>

            <div className="max-w-4xl mx-auto bg-surface-container-lowest gold-border rounded-12 p-4 shadow-2xl gold-glow overflow-hidden mb-8">
              <div className="relative w-full aspect-video rounded-8 overflow-hidden bg-black">
                <iframe
                  src={safeEmbedUrl}
                  title={`${product.title} YouTube Video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            </div>

            {/* Video Description */}
            {product.videoDescription && (
              <div className="max-w-4xl mx-auto bg-surface-container-low border border-outline-variant/50 p-6 rounded-12">
                <div className="flex items-center gap-2 text-primary font-headline-md text-base mb-2">
                  <span className="material-symbols-outlined text-xl">description</span>
                  <span>Video Description</span>
                </div>
                <p className="font-body-md text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
                  {product.videoDescription}
                </p>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

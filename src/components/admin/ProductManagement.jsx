import React, { useState, useEffect, useMemo } from 'react';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../services/api/products.service';
import { extractYouTubeId } from '../../utils/youtube';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Gemstones',
    price: '',
    imageUrl: '',
    videoUrl: '',
    videoDescription: '',
    specificationsText: '',
    isAvailable: true,
    isFeatured: false,
  });

  const loadData = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetchProducts({ limit: 100 });
      if (res && res.data) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error('Failed to load products in admin:', err);
      setErrorMsg('Failed to load products. Please refresh.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setSelectedProduct(null);
    setFormData({
      title: '',
      description: '',
      category: 'Gemstones',
      price: '',
      imageUrl: '',
      videoUrl: '',
      videoDescription: '',
      specificationsText: 'Origin: Royal Ceylon\nCut: Oval Brilliant\nClarity: VVS1\nCarat: 4.25 ct',
      isAvailable: true,
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);

    // Format specifications
    let specsText = '';
    if (product.specifications) {
      try {
        const obj = typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications;
        specsText = Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join('\n');
      } catch {
        specsText = product.specifications;
      }
    }

    setFormData({
      title: product.title || '',
      description: product.description || '',
      category: product.category || 'Gemstones',
      price: product.price ? String(product.price) : '',
      imageUrl: product.imageUrl || '',
      videoUrl: product.videoUrl || '',
      videoDescription: product.videoDescription || '',
      specificationsText: specsText,
      isAvailable: product.isAvailable !== false,
      isFeatured: Boolean(product.isFeatured),
    });

    setIsModalOpen(true);
  };

  const openDeleteConfirm = (product) => {
    setSelectedProduct(product);
    setIsDeleting(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMsg('Product Title is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    // Parse specifications text into JSON object
    const specsObj = {};
    if (formData.specificationsText.trim()) {
      formData.specificationsText.split('\n').forEach((line) => {
        const parts = line.split(':');
        if (parts.length >= 2) {
          specsObj[parts[0].trim()] = parts.slice(1).join(':').trim();
        }
      });
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      price: parseFloat(formData.price) || 0,
      imageUrl: formData.imageUrl.trim() || null,
      videoUrl: formData.videoUrl.trim() || null,
      videoDescription: formData.videoDescription.trim() || null,
      specifications: JSON.stringify(specsObj),
      isAvailable: formData.isAvailable,
      isFeatured: formData.isFeatured,
    };

    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, payload);
        setSuccessMsg('Product updated successfully!');
      } else {
        await createProduct(payload);
        setSuccessMsg('New product created successfully!');
      }

      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to save product:', err);
      setErrorMsg(err.message || 'Failed to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    setIsSubmitting(true);
    try {
      await deleteProduct(selectedProduct.id);
      setSuccessMsg('Product deleted successfully.');
      setIsDeleting(false);
      loadData();
    } catch (err) {
      console.error('Failed to delete product:', err);
      setErrorMsg('Failed to delete product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q);

      const matchesCat = categoryFilter === 'all' || p.category?.toLowerCase() === categoryFilter.toLowerCase();
      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, categoryFilter]);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return Array.from(set);
  }, [products]);

  // Extract preview YouTube ID
  const previewYouTubeId = extractYouTubeId(formData.videoUrl);

  return (
    <div className="space-y-6">
      {/* Header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest gold-border rounded-12 p-6">
        <div>
          <h2 className="font-headline-md text-2xl text-primary">Products Management (CMS)</h2>
          <p className="font-body-md text-xs text-on-surface-variant">
            Manage your customer products, specifications, and YouTube video embeds in real time.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-button text-xs uppercase tracking-wider rounded-12 hover:bg-primary-fixed transition-colors shadow-lg"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Add New Product
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-12 text-sm flex items-center justify-between">
          <span>{successMsg}</span>
          <button type="button" onClick={() => setSuccessMsg('')} className="text-emerald-300 hover:text-white">✕</button>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-950/80 border border-red-500/50 text-red-300 px-4 py-3 rounded-12 text-sm flex items-center justify-between">
          <span>{errorMsg}</span>
          <button type="button" onClick={() => setErrorMsg('')} className="text-red-300 hover:text-white">✕</button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        <div className="sm:col-span-8 relative">
          <span className="material-symbols-outlined absolute left-3.5 top-3 text-on-surface-variant text-lg">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by title, category..."
            className="w-full bg-surface-container-low border border-outline-variant/60 rounded-12 pl-10 pr-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant/60 rounded-12 px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-surface-container-lowest gold-border rounded-12 overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="py-16 text-center text-[#e9c176] flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-[#e9c176]/20 border-t-[#e9c176] animate-spin" />
            <span className="text-xs uppercase tracking-widest">Loading Products...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl text-primary/60 mb-2">inventory_2</span>
            <p className="font-headline-md text-lg text-primary">No Products Found</p>
            <p className="text-xs">Click "Add New Product" to create your first product entry.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-on-surface">
              <thead className="bg-surface-container-low border-b border-outline-variant/40 text-xs font-label-caps text-primary-fixed-dim uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">YouTube Video</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {filteredProducts.map((product) => {
                  const hasVideo = Boolean(product.videoId || product.videoUrl);
                  return (
                    <tr key={product.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imageUrl || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'}
                            alt={product.title}
                            className="w-12 h-12 rounded-8 object-cover bg-surface-container-low border border-outline-variant/40"
                          />
                          <div>
                            <div className="font-semibold text-primary">{product.title}</div>
                            <div className="text-xs text-on-surface-variant line-clamp-1">{product.description || 'No description'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-label-caps text-[11px] bg-surface-container-low border border-primary/20 px-2.5 py-1 rounded-full text-primary-fixed-dim">
                          {product.category || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {product.price > 0 ? `₹${product.price.toLocaleString()}` : 'Free / Showcase'}
                      </td>
                      <td className="px-6 py-4">
                        {hasVideo ? (
                          <span className="text-xs text-emerald-400 bg-emerald-950/80 border border-emerald-600/40 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">play_circle</span>
                            Embedded
                          </span>
                        ) : (
                          <span className="text-xs text-on-surface-variant/60">No Video</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full ${product.isAvailable ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                          {product.isAvailable ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(product)}
                          className="px-3 py-1.5 bg-surface-container-low hover:bg-primary hover:text-on-primary border border-outline-variant/50 rounded-8 text-xs font-button transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeleteConfirm(product)}
                          className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-700/50 rounded-8 text-xs font-button transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-surface-container-lowest gold-border rounded-12 max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
              <h3 className="font-headline-md text-xl text-primary">
                {selectedProduct ? 'Edit Product' : 'Create New Product'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-on-surface-variant hover:text-primary text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-label-caps text-primary-fixed-dim mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Royal Emerald Gemstone"
                    className="w-full bg-surface-container-low border border-outline-variant/60 rounded-8 px-3.5 py-2 text-sm text-on-surface focus:border-primary"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-label-caps text-primary-fixed-dim mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Gemstones, Jewelry, Exclusive"
                    className="w-full bg-surface-container-low border border-outline-variant/60 rounded-8 px-3.5 py-2 text-sm text-on-surface focus:border-primary"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-label-caps text-primary-fixed-dim mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0"
                    className="w-full bg-surface-container-low border border-outline-variant/60 rounded-8 px-3.5 py-2 text-sm text-on-surface focus:border-primary"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-xs font-label-caps text-primary-fixed-dim mb-1">Product Image URL</label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-surface-container-low border border-outline-variant/60 rounded-8 px-3.5 py-2 text-sm text-on-surface focus:border-primary"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-label-caps text-primary-fixed-dim mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the product..."
                  className="w-full bg-surface-container-low border border-outline-variant/60 rounded-8 p-3 text-sm text-on-surface focus:border-primary"
                />
              </div>

              {/* Product Specifications (Key: Value format) */}
              <div>
                <label className="block text-xs font-label-caps text-primary-fixed-dim mb-1">
                  Specifications (Enter as Key: Value, one per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.specificationsText}
                  onChange={(e) => setFormData({ ...formData, specificationsText: e.target.value })}
                  placeholder="Origin: Royal Ceylon&#10;Cut: Oval Brilliant&#10;Clarity: VVS1&#10;Carat: 4.25 ct"
                  className="w-full bg-surface-container-low border border-outline-variant/60 rounded-8 p-3 text-xs font-mono text-on-surface focus:border-primary"
                />
              </div>

              {/* YouTube Video Section */}
              <div className="bg-surface-container-low border border-outline-variant/40 p-4 rounded-8 space-y-4">
                <div className="font-headline-md text-sm text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">smart_display</span>
                  <span>YouTube Video Integration</span>
                </div>

                <div>
                  <label className="block text-xs font-label-caps text-primary-fixed-dim mb-1">YouTube Video URL</label>
                  <input
                    type="text"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    className="w-full bg-surface-container border border-outline-variant/60 rounded-8 px-3 py-2 text-sm text-on-surface focus:border-primary"
                  />
                  <span className="text-[11px] text-on-surface-variant/70 mt-1 block">
                    Paste any YouTube URL (watch, shorts, or share link). Leave empty to remove video.
                  </span>
                </div>

                {/* Live Video Preview in Admin Form */}
                {previewYouTubeId && (
                  <div className="space-y-2">
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      ✓ Valid YouTube ID detected: {previewYouTubeId} (Live Preview Below)
                    </span>
                    <div className="w-full aspect-video rounded-8 overflow-hidden bg-black max-w-sm mx-auto">
                      <iframe
                        src={`https://www.youtube.com/embed/${previewYouTubeId}?rel=0`}
                        title="Admin Live Video Preview"
                        className="w-full h-full border-0"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-label-caps text-primary-fixed-dim mb-1">Video Description</label>
                  <textarea
                    rows={2}
                    value={formData.videoDescription}
                    onChange={(e) => setFormData({ ...formData, videoDescription: e.target.value })}
                    placeholder="Explanatory text describing what is showcased in the video..."
                    className="w-full bg-surface-container border border-outline-variant/60 rounded-8 p-3 text-sm text-on-surface focus:border-primary"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-on-surface">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="rounded border-outline-variant bg-surface-container-low text-primary focus:ring-primary"
                  />
                  <span>Product Active / Visible</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-on-surface">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded border-outline-variant bg-surface-container-low text-primary focus:ring-primary"
                  />
                  <span>Featured Product</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 bg-surface-container-low hover:bg-surface-container-high rounded-8 text-xs font-button text-on-surface-variant transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-primary text-on-primary rounded-8 text-xs font-button uppercase tracking-wider hover:bg-primary-fixed transition-colors shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : selectedProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleting && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-surface-container-lowest gold-border rounded-12 max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <span className="material-symbols-outlined text-4xl text-red-400">warning</span>
            <h3 className="font-headline-md text-xl text-primary">Delete Product?</h3>
            <p className="font-body-md text-sm text-on-surface-variant">
              Are you sure you want to delete <strong className="text-primary">{selectedProduct.title}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleting(false)}
                className="px-5 py-2 bg-surface-container-low rounded-8 text-xs font-button text-on-surface-variant hover:text-on-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="px-5 py-2 bg-red-900 hover:bg-red-800 text-white rounded-8 text-xs font-button uppercase tracking-wider"
              >
                {isSubmitting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

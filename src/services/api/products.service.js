import { apiClient } from "./apiClient";

/**
 * Fetch all products from backend / Supabase with optional filters.
 */
export async function fetchProducts(params = {}) {
  const queryParams = new URLSearchParams();

  if (params.search) queryParams.append("search", params.search);
  if (params.category) queryParams.append("category", params.category);
  if (params.hasVideo !== undefined) queryParams.append("hasVideo", params.hasVideo);
  if (params.limit) queryParams.append("limit", params.limit);
  if (params.page) queryParams.append("page", params.page);

  const queryString = queryParams.toString();
  const endpoint = `/products${queryString ? `?${queryString}` : ""}`;

  return apiClient(endpoint);
}

/**
 * Fetch single product details by ID.
 */
export async function fetchProductById(id) {
  return apiClient(`/products/${id}`);
}

/**
 * Create a new product (Admin authentication required).
 */
export async function createProduct(productData) {
  return apiClient("/products", {
    method: "POST",
    body: productData,
  });
}

/**
 * Update an existing product by ID (Admin authentication required).
 */
export async function updateProduct(id, productData) {
  return apiClient(`/products/${id}`, {
    method: "PUT",
    body: productData,
  });
}

/**
 * Delete a product by ID (Admin authentication required).
 */
export async function deleteProduct(id) {
  return apiClient(`/products/${id}`, {
    method: "DELETE",
  });
}

import prisma from "../config/database.js";
import { extractYouTubeId } from "../utils/youtube.js";

/**
 * Get all products (Public).
 * Supports search, category filtering, and video availability filter.
 */
export async function getProducts(req, res) {
  try {
    const { search, category, hasVideo, limit = 50, page = 1 } = req.query;

    const where = {};

    if (search && search.trim() !== "") {
      const q = search.trim();
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } },
      ];
    }

    if (category && category.toLowerCase() !== "all") {
      where.category = { equals: category, mode: "insensitive" };
    }

    if (hasVideo === "true") {
      where.OR = [
        { videoUrl: { not: null } },
        { videoId: { not: null } },
      ];
    }

    const take = parseInt(limit, 10);
    const skip = (parseInt(page, 10) - 1) * take;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take,
        skip,
      }),
      prisma.product.count({ where }),
    ]);

    return res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: parseInt(page, 10),
        pages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products.",
      error: error.message,
    });
  }
}

/**
 * Get single product by ID (Public).
 */
export async function getProductById(req, res) {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product details.",
      error: error.message,
    });
  }
}

/**
 * Create new product (Admin Protected).
 */
export async function createProduct(req, res) {
  try {
    const {
      title,
      description,
      category = "General",
      price = 0,
      imageUrl,
      images = [],
      videoUrl,
      videoDescription,
      videoAspectRatio = "16:9",
      specifications,
      isAvailable = true,
      isFeatured = false,
    } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Product title is required.",
      });
    }

    const parsedVideoId = videoUrl ? extractYouTubeId(videoUrl) : null;

    const product = await prisma.product.create({
      data: {
        title: title.trim(),
        description: description ? description.trim() : null,
        category: category ? category.trim() : "General",
        price: parseFloat(price) || 0,
        imageUrl: imageUrl ? imageUrl.trim() : null,
        images: Array.isArray(images) ? images : [],
        videoUrl: videoUrl ? videoUrl.trim() : null,
        videoId: parsedVideoId,
        videoDescription: videoDescription ? videoDescription.trim() : null,
        videoAspectRatio: videoAspectRatio || "16:9",
        specifications: typeof specifications === "object" ? JSON.stringify(specifications) : specifications,
        isAvailable: Boolean(isAvailable),
        isFeatured: Boolean(isFeatured),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create product.",
      error: error.message,
    });
  }
}

/**
 * Update existing product (Admin Protected).
 */
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      price,
      imageUrl,
      images,
      videoUrl,
      videoDescription,
      videoAspectRatio,
      specifications,
      isAvailable,
      isFeatured,
    } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const updateData = {};

    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (category !== undefined) updateData.category = category ? category.trim() : "General";
    if (price !== undefined) updateData.price = parseFloat(price) || 0;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl ? imageUrl.trim() : null;
    if (images !== undefined) updateData.images = Array.isArray(images) ? images : [];
    if (videoDescription !== undefined) updateData.videoDescription = videoDescription ? videoDescription.trim() : null;
    if (videoAspectRatio !== undefined) updateData.videoAspectRatio = videoAspectRatio || "16:9";
    if (specifications !== undefined) updateData.specifications = typeof specifications === "object" ? JSON.stringify(specifications) : specifications;
    if (isAvailable !== undefined) updateData.isAvailable = Boolean(isAvailable);
    if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);

    if (videoUrl !== undefined) {
      const cleanVideoUrl = videoUrl ? videoUrl.trim() : null;
      updateData.videoUrl = cleanVideoUrl;
      updateData.videoId = cleanVideoUrl ? extractYouTubeId(cleanVideoUrl) : null;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return res.json({
      success: true,
      message: "Product updated successfully.",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update product.",
      error: error.message,
    });
  }
}

/**
 * Delete product (Admin Protected).
 */
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    await prisma.product.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete product.",
      error: error.message,
    });
  }
}

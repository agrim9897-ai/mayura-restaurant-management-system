import prisma from "../config/database.js";
import { extractYouTubeId } from "../utils/youtube.js";

/**
 * Get or create a MenuCategory by name.
 */
export async function getOrCreateCategory(categoryName) {
  let category = await prisma.menuCategory.findFirst({
    where: { name: categoryName },
  });

  if (!category) {
    category = await prisma.menuCategory.create({
      data: { name: categoryName },
    });
  }

  return category;
}

/**
 * Get all available categories.
 */
export async function getMenuCategories() {
  const categories = await prisma.menuCategory.findMany({
    include: {
      _count: {
        select: { items: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    itemCount: c._count.items,
  }));
}

/**
 * Get all menu items with search, filter, sort, and pagination support.
 */
export async function getAllMenuItems(options = {}) {
  const page = Math.max(1, parseInt(options.page || 1, 10));
  const limit = Math.max(1, parseInt(options.limit || 50, 10));
  const skip = (page - 1) * limit;

  const where = {};

  // Search filter
  if (options.search && options.search.trim() !== "") {
    const term = options.search.trim();
    where.OR = [
      { name: { contains: term, mode: "insensitive" } },
      { description: { contains: term, mode: "insensitive" } },
    ];
  }

  // Category filter
  if (options.category && options.category !== "ALL") {
    where.category = {
      name: { equals: options.category, mode: "insensitive" },
    };
  }

  // Veg / Non-Veg filter
  if (options.isVeg !== undefined && options.isVeg !== "ALL" && options.isVeg !== "") {
    where.isVeg = options.isVeg === "true" || options.isVeg === true;
  }

  // Availability filter
  if (options.isAvailable !== undefined && options.isAvailable !== "ALL" && options.isAvailable !== "") {
    where.isAvailable = options.isAvailable === "true" || options.isAvailable === true;
  }

  // Featured filter
  if (options.isFeatured !== undefined && options.isFeatured !== "ALL" && options.isFeatured !== "") {
    where.isFeatured = options.isFeatured === "true" || options.isFeatured === true;
  }

  // Sorting
  let orderBy = { name: "asc" };
  switch (options.sort) {
    case "price_asc":
      orderBy = { price: "asc" };
      break;
    case "price_desc":
      orderBy = { price: "desc" };
      break;
    case "name_desc":
      orderBy = { name: "desc" };
      break;
    case "newest":
      orderBy = { createdAt: "desc" };
      break;
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    case "name_asc":
    default:
      orderBy = { name: "asc" };
      break;
  }

  const [total, items] = await Promise.all([
    prisma.menuItem.count({ where }),
    prisma.menuItem.findMany({
      where,
      include: { category: true },
      orderBy,
      skip,
      take: limit,
    }),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  const formattedItems = items.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category.name,
    categoryId: item.categoryId,
    price: item.price,
    description: item.description || "",
    isVeg: item.isVeg,
    isAvailable: item.isAvailable,
    isFeatured: item.isFeatured,
    prepTime: item.prepTime || "15-20 mins",
    imageUrl: item.imageUrl,
    videoUrl: item.videoUrl,
    videoId: item.videoId,
    videoDescription: item.videoDescription,
    createdAt: item.createdAt,
  }));

  return {
    data: formattedItems,
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Create a new menu item.
 */
export async function createMenuItem(data) {
  const category = await getOrCreateCategory(data.category || "Main Course");

  const cleanVideoUrl = data.videoUrl ? data.videoUrl.trim() : null;
  const parsedVideoId = cleanVideoUrl ? extractYouTubeId(cleanVideoUrl) : null;

  const item = await prisma.menuItem.create({
    data: {
      name: data.name,
      categoryId: category.id,
      price: parseFloat(data.price),
      description: data.description || "",
      isVeg: data.isVeg === "true" || data.isVeg === true,
      isAvailable: data.isAvailable === undefined ? true : (data.isAvailable === "true" || data.isAvailable === true),
      isFeatured: data.isFeatured === "true" || data.isFeatured === true,
      prepTime: data.prepTime || "15-20 mins",
      imageUrl: data.imageUrl || "",
      videoUrl: cleanVideoUrl,
      videoId: parsedVideoId,
      videoDescription: data.videoDescription ? data.videoDescription.trim() : null,
    },
    include: {
      category: true,
    },
  });

  return {
    id: item.id,
    name: item.name,
    category: item.category.name,
    categoryId: item.categoryId,
    price: item.price,
    description: item.description,
    isVeg: item.isVeg,
    isAvailable: item.isAvailable,
    isFeatured: item.isFeatured,
    prepTime: item.prepTime,
    imageUrl: item.imageUrl,
    videoUrl: item.videoUrl,
    videoId: item.videoId,
    videoDescription: item.videoDescription,
  };
}

/**
 * Update an existing menu item.
 */
export async function updateMenuItem(id, data) {
  const updateData = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.price !== undefined) updateData.price = parseFloat(data.price);
  if (data.description !== undefined) updateData.description = data.description;
  if (data.isVeg !== undefined) updateData.isVeg = data.isVeg === "true" || data.isVeg === true;
  if (data.isAvailable !== undefined) updateData.isAvailable = data.isAvailable === "true" || data.isAvailable === true;
  if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured === "true" || data.isFeatured === true;
  if (data.prepTime !== undefined) updateData.prepTime = data.prepTime;
  if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
  if (data.videoDescription !== undefined) updateData.videoDescription = data.videoDescription ? data.videoDescription.trim() : null;

  if (data.videoUrl !== undefined) {
    const cleanVideoUrl = data.videoUrl ? data.videoUrl.trim() : null;
    updateData.videoUrl = cleanVideoUrl;
    updateData.videoId = cleanVideoUrl ? extractYouTubeId(cleanVideoUrl) : null;
  }

  if (data.category) {
    const category = await getOrCreateCategory(data.category);
    updateData.categoryId = category.id;
  }

  const item = await prisma.menuItem.update({
    where: { id },
    data: updateData,
    include: {
      category: true,
    },
  });

  return {
    id: item.id,
    name: item.name,
    category: item.category.name,
    categoryId: item.categoryId,
    price: item.price,
    description: item.description,
    isVeg: item.isVeg,
    isAvailable: item.isAvailable,
    isFeatured: item.isFeatured,
    prepTime: item.prepTime,
    imageUrl: item.imageUrl,
    videoUrl: item.videoUrl,
    videoId: item.videoId,
    videoDescription: item.videoDescription,
  };
}

/**
 * Delete a menu item.
 */
export async function deleteMenuItem(id) {
  return await prisma.menuItem.delete({
    where: { id },
  });
}

/**
 * Toggle menu item availability.
 */
export async function toggleMenuItemAvailability(id, isAvailable) {
  const item = await prisma.menuItem.update({
    where: { id },
    data: { isAvailable },
    include: { category: true },
  });

  return {
    id: item.id,
    name: item.name,
    category: item.category.name,
    categoryId: item.categoryId,
    price: item.price,
    description: item.description,
    isVeg: item.isVeg,
    isAvailable: item.isAvailable,
    isFeatured: item.isFeatured,
    prepTime: item.prepTime,
    imageUrl: item.imageUrl,
  };
}

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import * as menuService from "../services/menu.service.js";

/**
 * GET /api/menu
 */
export const getAllMenuItems = asyncHandler(async (req, res) => {
  const result = await menuService.getAllMenuItems(req.query);
  res.status(200).json(new ApiResponse(200, result, "Menu items fetched successfully"));
});

/**
 * GET /api/menu/categories
 */
export const getCategories = asyncHandler(async (_req, res) => {
  const categories = await menuService.getMenuCategories();
  res.status(200).json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

/**
 * POST /api/menu
 */
export const createMenuItem = asyncHandler(async (req, res) => {
  const { name, price } = req.body;
  if (!name || price === undefined) {
    throw new ApiError(400, "Dish name and price are required");
  }

  // Handle uploaded file if present
  let imageUrl = req.body.imageUrl || "";
  if (req.file) {
    imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  }

  const itemData = {
    ...req.body,
    imageUrl,
  };

  const item = await menuService.createMenuItem(itemData);
  res.status(201).json(new ApiResponse(201, item, "Menu item created successfully"));
});

/**
 * PUT /api/menu/:id
 */
export const updateMenuItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const itemData = { ...req.body };

  // Handle uploaded file replacement if present
  if (req.file) {
    itemData.imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  }

  const item = await menuService.updateMenuItem(id, itemData);
  res.status(200).json(new ApiResponse(200, item, "Menu item updated successfully"));
});

/**
 * DELETE /api/menu/:id
 */
export const deleteMenuItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await menuService.deleteMenuItem(id);
  res.status(200).json(new ApiResponse(200, null, "Menu item deleted successfully"));
});

/**
 * PATCH /api/menu/:id/availability
 */
export const toggleAvailability = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isAvailable } = req.body;

  const item = await menuService.toggleMenuItemAvailability(id, Boolean(isAvailable));
  res.status(200).json(new ApiResponse(200, item, "Availability updated"));
});

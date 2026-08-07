import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import * as settingsService from "../services/settings.service.js";

export const getSettings = asyncHandler(async (_req, res) => {
  const settings = await settingsService.getSettings();
  res.status(200).json(new ApiResponse(200, settings, "Settings fetched successfully"));
});

export const updateSettings = asyncHandler(async (req, res) => {
  const updateData = { ...req.body };

  // Process Multer file uploads for logo and heroImage if present
  if (req.files) {
    if (req.files.logo && req.files.logo[0]) {
      updateData.logoUrl = `${req.protocol}://${req.get("host")}/uploads/${req.files.logo[0].filename}`;
    }
    if (req.files.heroImage && req.files.heroImage[0]) {
      updateData.heroImageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.files.heroImage[0].filename}`;
    }
  }

  const settings = await settingsService.updateSettings(updateData);
  res.status(200).json(new ApiResponse(200, settings, "Restaurant settings updated successfully"));
});

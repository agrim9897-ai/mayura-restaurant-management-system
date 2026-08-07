import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settings.controller.js";
import { uploadSettingsImages } from "../middleware/upload.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

router.get("/", getSettings);
router.put("/", authMiddleware, uploadSettingsImages, updateSettings);

export default router;

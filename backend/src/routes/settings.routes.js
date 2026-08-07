import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settings.controller.js";
import { uploadSettingsImages } from "../middleware/upload.js";

const router = Router();

router.get("/", getSettings);
router.put("/", uploadSettingsImages, updateSettings);

export default router;

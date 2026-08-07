import { Router } from "express";
import {
  getAllMenuItems,
  getCategories,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
} from "../controllers/menu.controller.js";
import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

router.get("/", getAllMenuItems);
router.get("/categories", getCategories);
router.post("/", authMiddleware, upload.single("image"), createMenuItem);
router.put("/:id", authMiddleware, upload.single("image"), updateMenuItem);
router.delete("/:id", authMiddleware, deleteMenuItem);
router.patch("/:id/availability", authMiddleware, toggleAvailability);

export default router;

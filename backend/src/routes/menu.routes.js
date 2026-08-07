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

const router = Router();

router.get("/", getAllMenuItems);
router.get("/categories", getCategories);
router.post("/", upload.single("image"), createMenuItem);
router.put("/:id", upload.single("image"), updateMenuItem);
router.delete("/:id", deleteMenuItem);
router.patch("/:id/availability", toggleAvailability);

export default router;

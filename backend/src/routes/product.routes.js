import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

// Public customer routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Protected admin routes
router.post("/", authMiddleware, createProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

export default router;

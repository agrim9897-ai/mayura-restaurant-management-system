import { Router } from "express";
import {
  getTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
} from "../controllers/table.controller.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

router.get("/", getTables);
router.get("/:id", getTableById);
router.post("/", authMiddleware, createTable);
router.put("/:id", authMiddleware, updateTable);
router.delete("/:id", authMiddleware, deleteTable);

export default router;

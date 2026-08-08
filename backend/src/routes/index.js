import { Router } from "express";
import healthRoutes from "./health.routes.js";
import reservationRoutes from "./reservation.routes.js";
import authRoutes from "./auth.routes.js";
import adminRoutes from "./admin.routes.js";
import menuRoutes from "./menu.routes.js";
import messageRoutes from "./message.routes.js";
import settingsRoutes from "./settings.routes.js";
import tableRoutes from "./table.routes.js";
import productRoutes from "./product.routes.js";

const router = Router();

// Register all route modules here
router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/reservations", reservationRoutes);
router.use("/menu", menuRoutes);
router.use("/messages", messageRoutes);
router.use("/settings", settingsRoutes);
router.use("/tables", tableRoutes);
router.use("/products", productRoutes);

export default router;

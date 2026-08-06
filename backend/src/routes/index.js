import { Router } from "express";
import healthRoutes from "./health.routes.js";
import reservationRoutes from "./reservation.routes.js";

const router = Router();

// Register all route modules here
router.use("/health", healthRoutes);
router.use("/reservations", reservationRoutes);

export default router;

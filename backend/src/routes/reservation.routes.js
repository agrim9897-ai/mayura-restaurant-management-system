import { Router } from "express";
import {
  createReservation,
  getAllReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
} from "../controllers/reservation.controller.js";

const router = Router();

// POST   /api/reservations       → Create a reservation
router.post("/", createReservation);

// GET    /api/reservations       → Get all reservations
router.get("/", getAllReservations);

// GET    /api/reservations/:id   → Get one reservation
router.get("/:id", getReservationById);

// PUT    /api/reservations/:id   → Update reservation status
router.put("/:id", updateReservation);

// DELETE /api/reservations/:id   → Delete a reservation
router.delete("/:id", deleteReservation);

export default router;

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import {
  createReservationSchema,
  updateReservationSchema,
} from "../validators/reservation.validator.js";
import * as reservationService from "../services/reservation.service.js";
import { sendReservationConfirmation } from "../services/email.service.js";

/**
 * POST /api/reservations
 * Create a new reservation.
 */
export const createReservation = asyncHandler(async (req, res) => {
  // Validate request body
  const parsed = createReservationSchema.safeParse(req.body);

  if (!parsed.success) {
    const errors = parsed.error.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    throw new ApiError(400, "Validation failed", errors);
  }

  // 1. Save reservation to database
  const reservation = await reservationService.createReservation(parsed.data);

  // 2. Send confirmation email (non-blocking / error-safe)
  sendReservationConfirmation(reservation).catch((err) => {
    console.error("⚠️ Email dispatch error:", err.message);
  });

  // 3. Return 201 Created response
  res
    .status(201)
    .json(new ApiResponse(201, reservation, "Reservation created successfully"));
});

/**
 * GET /api/reservations
 * Get all reservations (newest first).
 */
export const getAllReservations = asyncHandler(async (req, res) => {
  const reservations = await reservationService.getAllReservations();

  res
    .status(200)
    .json(new ApiResponse(200, reservations, "Reservations fetched successfully"));
});

/**
 * GET /api/reservations/:id
 * Get a single reservation by ID.
 */
export const getReservationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const reservation = await reservationService.getReservationById(id);

  if (!reservation) {
    throw new ApiError(404, "Reservation not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, reservation, "Reservation fetched successfully"));
});

/**
 * PUT /api/reservations/:id
 * Update reservation status.
 */
export const updateReservation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate request body
  const parsed = updateReservationSchema.safeParse(req.body);

  if (!parsed.success) {
    const errors = parsed.error.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    throw new ApiError(400, "Validation failed", errors);
  }

  // Check if reservation exists
  const existing = await reservationService.getReservationById(id);
  if (!existing) {
    throw new ApiError(404, "Reservation not found");
  }

  const reservation = await reservationService.updateReservationStatus(
    id,
    parsed.data.status
  );

  res
    .status(200)
    .json(new ApiResponse(200, reservation, "Reservation updated successfully"));
});

/**
 * DELETE /api/reservations/:id
 * Delete a reservation.
 */
export const deleteReservation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if reservation exists
  const existing = await reservationService.getReservationById(id);
  if (!existing) {
    throw new ApiError(404, "Reservation not found");
  }

  await reservationService.deleteReservation(id);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Reservation deleted successfully"));
});

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import * as reservationService from "../services/reservation.service.js";
import {
  sendReservationConfirmation,
  sendReservationCancellation,
  sendReservationCompletion,
} from "../services/email.service.js";

/**
 * POST /api/reservations
 * Create a new reservation.
 */
export const createReservation = asyncHandler(async (req, res) => {
  const { name, email, phone, reservationDate, reservationTime, guests } = req.body;

  if (!name || !email || !phone || !reservationDate || !reservationTime || !guests) {
    throw new ApiError(400, "Name, email, phone, date, time, and guests are required.");
  }

  const reservation = await reservationService.createReservation(req.body);

  // Send confirmation email (non-blocking)
  sendReservationConfirmation(reservation).catch((err) => {
    console.error("⚠️ Confirmation email error:", err.message);
  });

  res
    .status(201)
    .json(new ApiResponse(201, reservation, "Reservation created successfully"));
});

/**
 * GET /api/reservations
 * Get all reservations with pagination, search, status/date filter, and sorting.
 */
export const getAllReservations = asyncHandler(async (req, res) => {
  const { page, limit, search, status, date, sort } = req.query;

  const result = await reservationService.getAllReservations({
    page,
    limit,
    search,
    status,
    date,
    sort,
  });

  res
    .status(200)
    .json(new ApiResponse(200, result, "Reservations fetched successfully"));
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
 * Update a reservation (supports status changes & field editing).
 * Automatically sends appropriate email when status changes.
 */
export const updateReservation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if reservation exists
  const existing = await reservationService.getReservationById(id);
  if (!existing) {
    throw new ApiError(404, "Reservation not found");
  }

  const updated = await reservationService.updateReservation(id, req.body);

  // Trigger Nodemailer emails on status transition
  if (req.body.status && req.body.status !== existing.status) {
    if (req.body.status === "CONFIRMED") {
      sendReservationConfirmation(updated).catch((err) => {
        console.error("⚠️ Confirmation email error:", err.message);
      });
    } else if (req.body.status === "CANCELLED") {
      sendReservationCancellation(updated).catch((err) => {
        console.error("⚠️ Cancellation email error:", err.message);
      });
    } else if (req.body.status === "COMPLETED") {
      sendReservationCompletion(updated).catch((err) => {
        console.error("⚠️ Completion email error:", err.message);
      });
    }
  }

  res
    .status(200)
    .json(new ApiResponse(200, updated, "Reservation updated successfully"));
});

/**
 * DELETE /api/reservations/:id
 * Delete a reservation.
 */
export const deleteReservation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existing = await reservationService.getReservationById(id);
  if (!existing) {
    throw new ApiError(404, "Reservation not found");
  }

  await reservationService.deleteReservation(id);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Reservation deleted successfully"));
});

/**
 * GET /api/reservations/stats
 * Get live reservation statistics for the admin dashboard.
 */
export const getReservationStats = asyncHandler(async (req, res) => {
  const stats = await reservationService.getReservationStats();

  res
    .status(200)
    .json(new ApiResponse(200, stats, "Reservation stats fetched successfully"));
});

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
 * Returns HTTP 201 immediately after saving to DB and table assignment,
 * then dispatches confirmation email asynchronously in background.
 */
export const createReservation = asyncHandler(async (req, res) => {
  const { name, email, phone, reservationDate, reservationTime, guests } = req.body;

  if (!name || !email || !phone || !reservationDate || !reservationTime || !guests) {
    throw new ApiError(400, "Name, email, phone, date, time, and guests are required.");
  }

  // 1. Validate, check table availability & save to database (blocking & safe)
  let reservation;
  try {
    reservation = await reservationService.createReservation(req.body);
  } catch (err) {
    throw new ApiError(
      400,
      err.message ||
        "Sorry, no tables are available for your selected date and time. Please choose another time slot or contact the restaurant."
    );
  }

  // 2. Immediately send success response to frontend (Instant UI response)
  res
    .status(201)
    .json(new ApiResponse(201, reservation, "Reservation confirmed successfully."));

  // 3. Asynchronously dispatch confirmation email in background (Non-blocking)
  setImmediate(async () => {
    try {
      const emailSent = await sendReservationConfirmation(reservation);
      if (!emailSent) {
        console.warn(`⚠️ Background email notice: Could not deliver email to ${reservation.email}`);
      }
    } catch (emailErr) {
      console.error("⚠️ Background email dispatch error:", emailErr.message);
    }
  });
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
 * Returns HTTP response immediately and dispatches status emails asynchronously in background.
 */
export const updateReservation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if reservation exists
  const existing = await reservationService.getReservationById(id);
  if (!existing) {
    throw new ApiError(404, "Reservation not found");
  }

  const updated = await reservationService.updateReservation(id, req.body);

  // Send response immediately
  res
    .status(200)
    .json(new ApiResponse(200, updated, "Reservation updated successfully"));

  // Trigger Nodemailer emails asynchronously on status transition
  if (req.body.status && req.body.status !== existing.status) {
    setImmediate(async () => {
      try {
        if (req.body.status === "CONFIRMED") {
          await sendReservationConfirmation(updated);
        } else if (req.body.status === "CANCELLED") {
          await sendReservationCancellation(updated);
        } else if (req.body.status === "COMPLETED") {
          await sendReservationCompletion(updated);
        }
      } catch (emailErr) {
        console.error("⚠️ Background status update email error:", emailErr.message);
      }
    });
  }
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

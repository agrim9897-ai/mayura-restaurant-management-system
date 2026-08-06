import prisma from "../config/database.js";

/**
 * Reservation Service
 *
 * Contains all database operations for reservations.
 * Controllers call these functions — they never touch Prisma directly.
 */

/**
 * Create a new reservation in the database.
 * @param {Object} data - Validated reservation data
 * @returns {Promise<Object>} The created reservation
 */
export async function createReservation(data) {
  const reservation = await prisma.reservation.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      reservationDate: new Date(data.reservationDate),
      reservationTime: data.reservationTime,
      guests: data.guests,
      occasion: data.occasion || null,
      seatingPreference: data.seatingPreference || null,
      // status defaults to PENDING (set in Prisma schema)
    },
  });

  return reservation;
}

/**
 * Get all reservations, newest first.
 * @returns {Promise<Array>} List of all reservations
 */
export async function getAllReservations() {
  const reservations = await prisma.reservation.findMany({
    orderBy: { createdAt: "desc" },
  });

  return reservations;
}

/**
 * Get a single reservation by its ID.
 * @param {string} id - Reservation UUID
 * @returns {Promise<Object|null>} The reservation, or null if not found
 */
export async function getReservationById(id) {
  const reservation = await prisma.reservation.findUnique({
    where: { id },
  });

  return reservation;
}

/**
 * Update the status of a reservation.
 * @param {string} id - Reservation UUID
 * @param {string} status - New status (PENDING, CONFIRMED, CANCELLED, COMPLETED)
 * @returns {Promise<Object>} The updated reservation
 */
export async function updateReservationStatus(id, status) {
  const reservation = await prisma.reservation.update({
    where: { id },
    data: { status },
  });

  return reservation;
}

/**
 * Delete a reservation by its ID.
 * @param {string} id - Reservation UUID
 * @returns {Promise<Object>} The deleted reservation
 */
export async function deleteReservation(id) {
  const reservation = await prisma.reservation.delete({
    where: { id },
  });

  return reservation;
}

import prisma from "../config/database.js";
import { ReservationStatus } from "@prisma/client";
import { findAvailableTableForReservation } from "./table.service.js";

/**
 * Create a new reservation with automatic table assignment, validation, & 2-hour double-booking prevention.
 */
export async function createReservation(data) {
  const guests = Number(data.guests);
  const reservationDateStr = data.reservationDate || data.date;
  const reservationTime = data.reservationTime || data.time;
  const seatingPreference = data.seatingPreference;

  // 1. Validate Guest Count
  if (isNaN(guests) || guests <= 0 || guests > 20) {
    throw new Error("Invalid guest count. Party size must be between 1 and 20 guests.");
  }

  // 2. Validate Reservation Date
  if (!reservationDateStr) {
    throw new Error("Invalid reservation date.");
  }
  const targetDate = new Date(reservationDateStr);
  if (isNaN(targetDate.getTime())) {
    throw new Error("Invalid reservation date.");
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const resStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

  if (resStart < todayStart) {
    throw new Error("Invalid reservation date. Please select a future date.");
  }

  // 3. Validate Reservation Time
  if (!reservationTime) {
    throw new Error("Invalid reservation time.");
  }

  // 4. Find best-fit available table or throw clear error
  const availableTable = await findAvailableTableForReservation({
    guests,
    reservationDate: reservationDateStr,
    reservationTime,
    seatingPreference,
  });

  if (!availableTable) {
    throw new Error(
      "Sorry, no tables are available for your selected date and time. Please choose another time slot or contact the restaurant for assistance."
    );
  }

  // 5. Create reservation and associate with table
  const reservation = await prisma.reservation.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      reservationDate: targetDate,
      reservationTime: reservationTime,
      guests: guests,
      occasion: data.occasion || null,
      seatingPreference: seatingPreference || null,
      tableId: availableTable.id,
    },
    include: {
      table: true,
    },
  });

  return reservation;
}

/**
 * Get reservations with search, filtering, sorting, pagination, and table details.
 */
export async function getAllReservations(options = {}) {
  const page = Math.max(1, parseInt(options.page || 1, 10));
  const limit = Math.max(1, parseInt(options.limit || 10, 10));
  const skip = (page - 1) * limit;

  const where = {};

  // Search by customer name, email, phone, or table number
  if (options.search && options.search.trim() !== '') {
    const term = options.search.trim();
    where.OR = [
      { name: { contains: term, mode: 'insensitive' } },
      { email: { contains: term, mode: 'insensitive' } },
      { phone: { contains: term, mode: 'insensitive' } },
      { id: { contains: term, mode: 'insensitive' } },
      { table: { tableNumber: { contains: term, mode: 'insensitive' } } },
    ];
  }

  // Filter by status
  if (options.status && options.status !== 'ALL' && ReservationStatus[options.status]) {
    where.status = ReservationStatus[options.status];
  }

  // Filter by reservation date
  if (options.date && options.date.trim() !== '') {
    const targetDate = new Date(options.date.trim());
    if (!isNaN(targetDate.getTime())) {
      const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);

      where.reservationDate = {
        gte: startOfDay,
        lt: endOfDay,
      };
    }
  }

  // Sorting logic
  let orderBy = { createdAt: 'desc' };
  switch (options.sort) {
    case 'OLDEST':
      orderBy = { createdAt: 'asc' };
      break;
    case 'DATE_ASC':
      orderBy = { reservationDate: 'asc' };
      break;
    case 'DATE_DESC':
      orderBy = { reservationDate: 'desc' };
      break;
    case 'GUESTS_DESC':
      orderBy = { guests: 'desc' };
      break;
    case 'GUESTS_ASC':
      orderBy = { guests: 'asc' };
      break;
    case 'NAME_AZ':
      orderBy = { name: 'asc' };
      break;
    case 'NAME_ZA':
      orderBy = { name: 'desc' };
      break;
    case 'NEWEST':
    default:
      orderBy = { createdAt: 'desc' };
      break;
  }

  const [total, reservations] = await Promise.all([
    prisma.reservation.count({ where }),
    prisma.reservation.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        table: true,
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  return {
    data: reservations.map((r) => ({
      ...r,
      date: r.reservationDate ? String(r.reservationDate).split('T')[0] : '',
      time: r.reservationTime,
      tableNumber: r.table ? r.table.tableNumber : 'Unassigned',
    })),
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Get a single reservation by ID.
 */
export async function getReservationById(id) {
  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: { table: true },
  });

  return reservation;
}

/**
 * Update a reservation by ID (supports status or full field editing).
 */
export async function updateReservation(id, data) {
  const updateData = {};

  if (data.name) updateData.name = data.name;
  if (data.email) updateData.email = data.email;
  if (data.phone) updateData.phone = data.phone;
  if (data.reservationDate || data.date) {
    updateData.reservationDate = new Date(data.reservationDate || data.date);
  }
  if (data.reservationTime || data.time) {
    updateData.reservationTime = data.reservationTime || data.time;
  }
  if (data.guests !== undefined) updateData.guests = Number(data.guests);
  if (data.occasion !== undefined) updateData.occasion = data.occasion;
  if (data.seatingPreference !== undefined) updateData.seatingPreference = data.seatingPreference;
  if (data.tableId !== undefined) updateData.tableId = data.tableId;
  if (data.status && ReservationStatus[data.status]) {
    updateData.status = ReservationStatus[data.status];
  }

  const reservation = await prisma.reservation.update({
    where: { id },
    data: updateData,
    include: { table: true },
  });

  return reservation;
}

/**
 * Delete a reservation by ID.
 */
export async function deleteReservation(id) {
  return await prisma.reservation.delete({
    where: { id },
  });
}

/**
 * Get live reservation statistics for the admin dashboard.
 */
export async function getReservationStats() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  const [
    totalReservations,
    pendingReservations,
    confirmedReservations,
    cancelledReservations,
    completedReservations,
    todayReservations,
  ] = await Promise.all([
    prisma.reservation.count(),
    prisma.reservation.count({ where: { status: ReservationStatus.PENDING } }),
    prisma.reservation.count({ where: { status: ReservationStatus.CONFIRMED } }),
    prisma.reservation.count({ where: { status: ReservationStatus.CANCELLED } }),
    prisma.reservation.count({ where: { status: ReservationStatus.COMPLETED } }),
    prisma.reservation.count({
      where: {
        reservationDate: {
          gte: startOfToday,
          lt: endOfToday,
        },
      },
    }),
  ]);

  return {
    totalReservations,
    pendingReservations,
    confirmedReservations,
    cancelledReservations,
    completedReservations,
    todayReservations,
  };
}

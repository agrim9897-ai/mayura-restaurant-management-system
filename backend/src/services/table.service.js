import prisma from "../config/database.js";

/**
 * Get all tables with filters and occupancy info
 */
export async function getAllTables(filters = {}) {
  const where = {};

  if (filters.location && filters.location !== "ALL") {
    where.location = filters.location;
  }
  if (filters.status && filters.status !== "ALL") {
    where.status = filters.status;
  }
  if (filters.search) {
    where.tableNumber = { contains: filters.search, mode: "insensitive" };
  }

  const tables = await prisma.table.findMany({
    where,
    include: {
      reservations: {
        where: {
          status: { in: ["PENDING", "CONFIRMED"] },
        },
        select: {
          id: true,
          name: true,
          reservationDate: true,
          reservationTime: true,
          guests: true,
          status: true,
        },
      },
    },
    orderBy: { tableNumber: "asc" },
  });

  return tables;
}

/**
 * Get a single table by ID
 */
export async function getTableById(id) {
  return await prisma.table.findUnique({
    where: { id },
    include: { reservations: true },
  });
}

/**
 * Create a new table
 */
export async function createTable(data) {
  const existing = await prisma.table.findUnique({
    where: { tableNumber: data.tableNumber },
  });
  if (existing) {
    throw new Error(`Table number '${data.tableNumber}' already exists.`);
  }

  return await prisma.table.create({
    data: {
      tableNumber: data.tableNumber.trim().toUpperCase(),
      capacity: Number(data.capacity),
      location: data.location || "INDOOR",
      status: data.status || "AVAILABLE",
    },
  });
}

/**
 * Update an existing table
 */
export async function updateTable(id, data) {
  if (data.tableNumber) {
    const existing = await prisma.table.findFirst({
      where: { tableNumber: data.tableNumber.trim().toUpperCase(), NOT: { id } },
    });
    if (existing) {
      throw new Error(`Table number '${data.tableNumber}' is already used by another table.`);
    }
  }

  const updateData = {};
  if (data.tableNumber !== undefined) updateData.tableNumber = data.tableNumber.trim().toUpperCase();
  if (data.capacity !== undefined) updateData.capacity = Number(data.capacity);
  if (data.location !== undefined) updateData.location = data.location;
  if (data.status !== undefined) updateData.status = data.status;

  return await prisma.table.update({
    where: { id },
    data: updateData,
  });
}

/**
 * Delete a table
 */
export async function deleteTable(id) {
  return await prisma.table.delete({
    where: { id },
  });
}

/**
 * Find the best available table for a reservation and prevent double-booking
 */
export async function findAvailableTableForReservation({ guests, reservationDate, reservationTime, seatingPreference }) {
  const reqGuests = Number(guests);
  const targetDate = new Date(reservationDate);
  const dateStart = new Date(targetDate.setHours(0, 0, 0, 0));
  const dateEnd = new Date(targetDate.setHours(23, 59, 59, 999));

  // Determine requested location
  let preferredLocation = null;
  if (seatingPreference) {
    const prefLower = seatingPreference.toLowerCase();
    if (prefLower.includes("outdoor") || prefLower.includes("terrace") || prefLower.includes("garden")) {
      preferredLocation = "OUTDOOR";
    } else if (prefLower.includes("indoor") || prefLower.includes("main") || prefLower.includes("private")) {
      preferredLocation = "INDOOR";
    }
  }

  // 1. Fetch tables with capacity >= guests and status != MAINTENANCE
  const tableWhere = {
    capacity: { gte: reqGuests },
    status: { not: "MAINTENANCE" },
  };

  let candidateTables = await prisma.table.findMany({
    where: tableWhere,
    include: {
      reservations: {
        where: {
          reservationDate: { gte: dateStart, lte: dateEnd },
          reservationTime: reservationTime,
          status: { in: ["PENDING", "CONFIRMED"] },
        },
      },
    },
    orderBy: { capacity: "asc" }, // Best fit (smallest sufficient capacity)
  });

  // 2. Filter out double-booked tables
  let availableTables = candidateTables.filter((t) => t.reservations.length === 0);

  // 3. Try location preference first
  if (preferredLocation) {
    const preferredMatch = availableTables.find((t) => t.location === preferredLocation);
    if (preferredMatch) return preferredMatch;
  }

  // 4. Fallback to any available table that fits
  return availableTables[0] || null;
}

/**
 * Get table occupancy statistics for the admin dashboard
 */
export async function getTableOccupancyStats() {
  const totalTables = await prisma.table.count();
  const availableCount = await prisma.table.count({ where: { status: "AVAILABLE" } });
  const reservedCount = await prisma.table.count({ where: { status: "RESERVED" } });
  const occupiedCount = await prisma.table.count({ where: { status: "OCCUPIED" } });
  const maintenanceCount = await prisma.table.count({ where: { status: "MAINTENANCE" } });

  const occupiedOrReserved = reservedCount + occupiedCount;
  const occupancyRate = totalTables > 0 ? Math.round((occupiedOrReserved / totalTables) * 100) : 0;

  return {
    totalTables,
    availableCount,
    reservedCount,
    occupiedCount,
    maintenanceCount,
    occupancyRate,
  };
}

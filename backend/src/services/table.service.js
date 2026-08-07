import prisma from "../config/database.js";

/**
 * Parse time string (e.g. "19:00", "7:00 PM", "07:30 PM") into minutes from midnight (0 to 1439).
 */
export function parseTimeToMinutes(timeStr) {
  if (!timeStr) return null;
  const str = String(timeStr).trim().toUpperCase();

  // 12-Hour format e.g. "7:30 PM", "11:00 AM"
  const match12 = str.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = parseInt(match12[2], 10);
    const ampm = match12[3];

    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    return hours * 60 + minutes;
  }

  // 24-Hour format e.g. "19:30", "07:00"
  const match24 = str.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const hours = parseInt(match24[1], 10);
    const minutes = parseInt(match24[2], 10);
    return hours * 60 + minutes;
  }

  return null;
}

/**
 * Convert minute offset back to readable 12-hour format string (e.g., 1140 -> "7:00 PM").
 */
export function formatMinutesToTime(minutes) {
  if (minutes === null || minutes === undefined) return "";
  let hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const minsFormatted = String(mins).padStart(2, "0");
  return `${hours}:${minsFormatted} ${ampm}`;
}

/**
 * Get all tables with filters, current/next reservation info, and occupancy.
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

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

  const tables = await prisma.table.findMany({
    where,
    include: {
      reservations: {
        where: {
          reservationDate: { gte: startOfToday },
          status: { in: ["PENDING", "CONFIRMED"] },
        },
        orderBy: { reservationTime: "asc" },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          reservationDate: true,
          reservationTime: true,
          guests: true,
          status: true,
        },
      },
    },
    orderBy: { tableNumber: "asc" },
  });

  // Annotate each table with active reservation, reserved time slot (2-hr block), next reservation, and dynamic status
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return tables.map((table) => {
    let currentReservation = null;
    let nextReservation = null;
    let reservedTimeSlot = null;

    // Filter today's reservations
    const todayResList = table.reservations.filter((r) => {
      const rDate = new Date(r.reservationDate);
      return rDate.toDateString() === now.toDateString();
    });

    for (const r of todayResList) {
      const startMins = parseTimeToMinutes(r.reservationTime);
      if (startMins !== null) {
        const endMins = startMins + 120; // 2 hour default block
        const formattedSlot = `${formatMinutesToTime(startMins)} - ${formatMinutesToTime(endMins)}`;

        // Check if current time falls within reservation slot
        if (currentMinutes >= startMins && currentMinutes < endMins) {
          currentReservation = { ...r, timeSlot: formattedSlot };
          reservedTimeSlot = formattedSlot;
        } else if (startMins > currentMinutes && !nextReservation) {
          nextReservation = { ...r, timeSlot: formattedSlot };
          if (!reservedTimeSlot) reservedTimeSlot = formattedSlot;
        }
      }
    }

    // Auto-update table status dynamically if not MAINTENANCE
    let computedStatus = table.status;
    if (table.status !== "MAINTENANCE") {
      if (currentReservation) {
        computedStatus = "OCCUPIED";
      } else if (todayResList.length > 0) {
        computedStatus = "RESERVED";
      } else {
        computedStatus = "AVAILABLE";
      }
    }

    return {
      ...table,
      status: computedStatus,
      currentReservation,
      nextReservation,
      reservedTimeSlot,
    };
  });
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
 * Find the best available table for a reservation and prevent 2-hour double booking overlap.
 */
export async function findAvailableTableForReservation({ guests, reservationDate, reservationTime, seatingPreference }) {
  const reqGuests = Number(guests);
  const targetDate = new Date(reservationDate);
  const dateStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0, 0);
  const dateEnd = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59, 999);

  const reqStartMins = parseTimeToMinutes(reservationTime);
  if (reqStartMins === null) {
    throw new Error("Invalid reservation time format.");
  }
  const reqEndMins = reqStartMins + 120; // 2 Hours (120 mins) block

  // Determine requested location preference
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
  const candidateTables = await prisma.table.findMany({
    where: {
      capacity: { gte: reqGuests },
      status: { not: "MAINTENANCE" },
    },
    include: {
      reservations: {
        where: {
          reservationDate: { gte: dateStart, lte: dateEnd },
          status: { in: ["PENDING", "CONFIRMED"] },
        },
      },
    },
    orderBy: { capacity: "asc" }, // Best fit (smallest suitable capacity first)
  });

  // 2. Filter out tables that overlap during the 2-hour window
  const availableTables = candidateTables.filter((table) => {
    const hasOverlap = table.reservations.some((r) => {
      const rStartMins = parseTimeToMinutes(r.reservationTime);
      if (rStartMins === null) return false;
      const rEndMins = rStartMins + 120;

      // Interval overlap check: reqStart < rEnd AND rStart < reqEnd
      return reqStartMins < rEndMins && rStartMins < reqEndMins;
    });

    return !hasOverlap;
  });

  // 3. Try matching preferred location first
  if (preferredLocation) {
    const preferredMatch = availableTables.find((t) => t.location === preferredLocation);
    if (preferredMatch) return preferredMatch;
  }

  // 4. Fallback to smallest suitable available table regardless of location
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
